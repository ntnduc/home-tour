import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWards1748772204421 implements MigrationInterface {
    name = 'CreateWards1748772204421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "wards" ("code" character varying NOT NULL, "name" character varying NOT NULL, "nameEn" character varying, "fullName" character varying, "fullNameEn" character varying, "codeName" character varying, "districtCode" character varying, "administrativeUnitId" integer, "administrative_unit_id" integer, "district_code" character varying, CONSTRAINT "PK_24f16d2207b1dcb6ce07d81d20f" PRIMARY KEY ("code"))`);
        await queryRunner.query(`ALTER TABLE "wards" ADD CONSTRAINT "FK_d0554b203856eaf330539026f49" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wards" ADD CONSTRAINT "FK_6614cfc610b3ae870f2467d9798" FOREIGN KEY ("district_code") REFERENCES "districts"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wards" DROP CONSTRAINT "FK_6614cfc610b3ae870f2467d9798"`);
        await queryRunner.query(`ALTER TABLE "wards" DROP CONSTRAINT "FK_d0554b203856eaf330539026f49"`);
        await queryRunner.query(`DROP TABLE "wards"`);
    }

}
