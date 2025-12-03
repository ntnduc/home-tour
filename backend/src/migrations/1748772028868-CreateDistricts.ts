import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDistricts1748772028868 implements MigrationInterface {
    name = 'CreateDistricts1748772028868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "districts" ("code" character varying NOT NULL, "name" character varying NOT NULL, "nameEn" character varying, "fullName" character varying, "fullNameEn" character varying, "codeName" character varying, "provinceCode" character varying, "administrativeUnitId" integer, "administrative_unit_id" integer, "province_code" character varying, CONSTRAINT "PK_8e9d73424149b43b38244f75528" PRIMARY KEY ("code"))`);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_602ba4e7409009b9082f9de6a9e" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_7f4b31875273010908d39850284" FOREIGN KEY ("province_code") REFERENCES "provinces"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_7f4b31875273010908d39850284"`);
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_602ba4e7409009b9082f9de6a9e"`);
        await queryRunner.query(`DROP TABLE "districts"`);
    }

}
