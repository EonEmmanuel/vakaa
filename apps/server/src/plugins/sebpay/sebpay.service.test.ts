import { describe, test, expect, mock } from 'bun:test';
import { SebpayService } from './sebpay.service';

/**
 * Builds a SebpayService with mocked persistence/services. `payment` is a live
 * object whose `state` can be mutated to simulate concurrent settlements.
 */
function makeService(payment: any | null) {
    const paymentRepo: any = {
        findOne: mock(() => Promise.resolve(payment)),
        createQueryBuilder: mock(() => {
            const builder = {
                leftJoinAndSelect: () => builder,
                where: () => builder,
                getOne: () => Promise.resolve(null),
            };
            return builder;
        }),
    };
    const connection: any = {
        getRepository: mock((_ctx: any, _entity: any) => paymentRepo),
    };
    const orderService: any = {
        settlePayment: mock(() => Promise.resolve({})),
        transitionPaymentToState: mock(() => Promise.resolve()),
    };

    const service: any = new SebpayService(
        { publicKey: 'pk_test_x', secretKey: 'sk_test_x', isSandbox: true, enabled: false } as any,
        connection,
        {} as any,
        orderService,
        {} as any,
        {} as any
    );

    (service.client as any).getCollectionStatus = mock(() =>
        Promise.resolve({
            success: true,
            data: {
                transaction_id: 'tx1',
                status: 'approved',
                external_reference: 'VAKAA-ORDER1',
                amount: 1000,
                currency: 'XOF',
            },
        })
    );

    return { service, orderService };
}

const APPROVED_OK = {
    success: true,
    data: {
        transaction_id: 'tx1',
        status: 'approved',
        external_reference: 'VAKAA-ORDER1',
        amount: 1000, // major units -> 100000 minor units
        currency: 'XOF',
    },
};

describe('SebpayService.reconcilePayment', () => {
    test('returns the current state immediately for an already Settled payment', async () => {
        const payment = { id: 1, state: 'Settled', amount: 100_000, order: { code: 'ORDER1' } };
        const { service, orderService } = makeService(payment);

        const result = await service.reconcilePayment({} as any, 'tx1');

        expect(result).toEqual({ settled: true, status: 'approved', orderCode: 'ORDER1' });
        expect(orderService.settlePayment).not.toHaveBeenCalled();
    });

    test('returns the current state immediately for an already Declined payment', async () => {
        const payment = { id: 1, state: 'Declined', amount: 100_000, order: { code: 'ORDER1' } };
        const { service, orderService } = makeService(payment);

        const result = await service.reconcilePayment({} as any, 'tx1');

        expect(result).toEqual({ settled: false, status: 'rejected', orderCode: 'ORDER1' });
        expect(orderService.transitionPaymentToState).not.toHaveBeenCalled();
    });

    test('settles an Approved provider status when amounts match', async () => {
        const payment = { id: 1, state: 'Authorized', amount: 100_000, order: { code: 'ORDER1' } };
        const { service, orderService } = makeService(payment);

        const result = await service.reconcilePayment({} as any, 'tx1');

        expect(result.settled).toBe(true);
        expect(orderService.settlePayment).toHaveBeenCalledTimes(1);
    });

    test('does not settle when the provider amount mismatches', async () => {
        const payment = { id: 1, state: 'Authorized', amount: 100_000, order: { code: 'ORDER1' } };
        const { service, orderService } = makeService(payment);
        (service.client as any).getCollectionStatus = mock(() =>
            Promise.resolve({
                ...APPROVED_OK,
                data: { ...APPROVED_OK.data, amount: 999 }, // 99900 minor != 100000 minor
            })
        );

        const result = await service.reconcilePayment({} as any, 'tx1');

        expect(result).toEqual({ settled: false, status: 'amount_mismatch' });
        expect(orderService.settlePayment).not.toHaveBeenCalled();
    });

    test('declines the payment on a Rejected provider status', async () => {
        const payment = { id: 1, state: 'Authorized', amount: 100_000, order: { code: 'ORDER1' } };
        const { service, orderService } = makeService(payment);
        (service.client as any).getCollectionStatus = mock(() =>
            Promise.resolve({
                ...APPROVED_OK,
                data: { ...APPROVED_OK.data, status: 'rejected' },
            })
        );

        const result = await service.reconcilePayment({} as any, 'tx1');

        expect(result).toEqual({ settled: false, status: 'rejected', orderCode: 'ORDER1' });
        expect(orderService.transitionPaymentToState).toHaveBeenCalledTimes(1);
    });

    test('reports not_found when the payment cannot be located', async () => {
        const { service } = makeService(null);

        const result = await service.reconcilePayment({} as any, 'unknown-ref');

        expect(result.status).toBe('not_found');
    });

    test('serializes concurrent reconciliation so the payment settles only once', async () => {
        const payment = { id: 1, state: 'Authorized', amount: 100_000, order: { code: 'ORDER1' } };
        const { service, orderService } = makeService(payment);
        // Provider answer arrives only after an async tick, forcing both callers
        // to be in flight at the same time.
        (service.client as any).getCollectionStatus = mock(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve(APPROVED_OK), 30)
                )
        );
        orderService.settlePayment = mock(() => {
            payment.state = 'Settled';
            return Promise.resolve({});
        });

        const [a, b] = await Promise.all([
            service.reconcilePayment({} as any, 'tx1'),
            service.reconcilePayment({} as any, 'tx1'),
        ]);

        expect(a.settled).toBe(true);
        expect(b.settled).toBe(true);
        expect(orderService.settlePayment).toHaveBeenCalledTimes(1);
    });
});
