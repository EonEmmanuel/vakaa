import {MigrationInterface, QueryRunner} from "typeorm";

export class DropPaymentTransactionIdIndex1791467000000 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_payment_transaction_id"`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_payment_transaction_id" ON "payment" ("transactionId")`, undefined);
   }

}
