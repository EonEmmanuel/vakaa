import {MigrationInterface, QueryRunner} from "typeorm";

export class AddProductReviews1791465575529 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "product_review" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "authorName" character varying NOT NULL, "authorLocation" character varying, "rating" integer NOT NULL DEFAULT '5', "title" character varying NOT NULL, "comment" text NOT NULL, "isVerifiedBuyer" boolean NOT NULL DEFAULT true, "state" character varying NOT NULL DEFAULT 'APPROVED', "productId" integer NOT NULL, "id" SERIAL NOT NULL, CONSTRAINT "PK_6c00bd3bbee662e1f7a97dbce9a" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "product_review" ADD CONSTRAINT "FK_06e7335708b5e7870f1eaa608d2" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_review" DROP CONSTRAINT "FK_06e7335708b5e7870f1eaa608d2"`, undefined);
        await queryRunner.query(`DROP TABLE "product_review"`, undefined);
   }

}
