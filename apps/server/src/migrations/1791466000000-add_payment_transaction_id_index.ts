import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPaymentTransactionIdIndex1791466000000 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_payment_transaction_id" ON "payment" ("transactionId")`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_payment_transaction_id"`, undefined);
   }

}
