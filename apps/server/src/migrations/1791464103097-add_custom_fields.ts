import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCustomFields1791464103097 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_translation" ADD "customFieldsMaterial" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD "customFieldsLeatherorigin" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD "customFieldsArtisanorigin" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_translation" ADD "customFieldsCareinstructions" text`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsDimensions" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsStrapdrop" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsWeight" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsIslimitededition" boolean DEFAULT false`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsCuratorbadge" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsMaxperorder" text`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsOnlyallowper" text`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant_translation" ADD "customFieldsPreorderleadtime" character varying(255)`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant" ADD "customFieldsAllowpreorder" boolean DEFAULT false`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product_variant" DROP COLUMN "customFieldsAllowpreorder"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_variant_translation" DROP COLUMN "customFieldsPreorderleadtime"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsOnlyallowper"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsMaxperorder"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsCuratorbadge"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsIslimitededition"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsWeight"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsStrapdrop"`, undefined);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsDimensions"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP COLUMN "customFieldsCareinstructions"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP COLUMN "customFieldsArtisanorigin"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP COLUMN "customFieldsLeatherorigin"`, undefined);
        await queryRunner.query(`ALTER TABLE "product_translation" DROP COLUMN "customFieldsMaterial"`, undefined);
   }

}
