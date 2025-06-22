import { MigrationInterface, QueryRunner } from "typeorm";

export class LocationEntity1750606989260 implements MigrationInterface {
    name = 'LocationEntity1750606989260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "administrative_units" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "full_name_en" character varying NOT NULL, "short_name" character varying NOT NULL, "code_name" character varying NOT NULL, "short_name_en" character varying NOT NULL, "code_name_en" character varying NOT NULL, CONSTRAINT "PK_97f662b9b848ae0982347d7d1d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "administrative_regions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "name_en" character varying NOT NULL, "code_name" character varying NOT NULL, "code_name_en" character varying NOT NULL, CONSTRAINT "PK_2330489d3f8ed65f29d0739ead9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provinces" ("code" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "full_name" character varying(255) NOT NULL, "full_name_en" character varying(255) NOT NULL, "code_name" character varying(255) NOT NULL, "administrative_unit_id" integer, "administrative_region_id" integer, CONSTRAINT "PK_f4b684af62d5cb3aa174f6b9b8a" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "districts" ("code" character varying NOT NULL, "name" character varying NOT NULL, "name_en" character varying, "full_name" character varying, "full_name_en" character varying, "code_name" character varying, "province_code" character varying, "administrative_unit_id" integer, CONSTRAINT "PK_8e9d73424149b43b38244f75528" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "wards" ("code" character varying NOT NULL, "name" character varying NOT NULL, "name_en" character varying, "full_name" character varying, "full_name_en" character varying, "code_name" character varying, "district_code" character varying, "administrative_unit_id" integer, CONSTRAINT "PK_24f16d2207b1dcb6ce07d81d20f" PRIMARY KEY ("code"))`);
        await queryRunner.query(`ALTER TABLE "provinces" ADD CONSTRAINT "FK_f084cd63fc4e1c065093899a3d6" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provinces" ADD CONSTRAINT "FK_d1c497fbc928c872810463e17e9" FOREIGN KEY ("administrative_region_id") REFERENCES "administrative_regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_602ba4e7409009b9082f9de6a9e" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_7f4b31875273010908d39850284" FOREIGN KEY ("province_code") REFERENCES "provinces"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wards" ADD CONSTRAINT "FK_d0554b203856eaf330539026f49" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wards" ADD CONSTRAINT "FK_6614cfc610b3ae870f2467d9798" FOREIGN KEY ("district_code") REFERENCES "districts"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wards" DROP CONSTRAINT "FK_6614cfc610b3ae870f2467d9798"`);
        await queryRunner.query(`ALTER TABLE "wards" DROP CONSTRAINT "FK_d0554b203856eaf330539026f49"`);
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_7f4b31875273010908d39850284"`);
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_602ba4e7409009b9082f9de6a9e"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP CONSTRAINT "FK_d1c497fbc928c872810463e17e9"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP CONSTRAINT "FK_f084cd63fc4e1c065093899a3d6"`);
        await queryRunner.query(`DROP TABLE "wards"`);
        await queryRunner.query(`DROP TABLE "districts"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
        await queryRunner.query(`DROP TABLE "administrative_regions"`);
        await queryRunner.query(`DROP TABLE "administrative_units"`);
    }

}
