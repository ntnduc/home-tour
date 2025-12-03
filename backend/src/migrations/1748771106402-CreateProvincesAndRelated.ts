import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProvincesAndRelated1748771106402 implements MigrationInterface {
    name = 'CreateProvincesAndRelated1748771106402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "fk_token_user"`);
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`DROP INDEX "public"."idx_opt_phone_number"`);
        await queryRunner.query(`DROP INDEX "public"."idx_token_user_id"`);
        await queryRunner.query(`CREATE TABLE "administrative_regions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "nameEn" character varying NOT NULL, "codeName" character varying NOT NULL, "codeNameEn" character varying NOT NULL, CONSTRAINT "PK_2330489d3f8ed65f29d0739ead9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "administrative_units" ("id" SERIAL NOT NULL, "fullName" character varying NOT NULL, "fullNameEn" character varying NOT NULL, "shortName" character varying NOT NULL, "shortNameEn" character varying NOT NULL, "codeName" character varying NOT NULL, "codeNameEn" character varying NOT NULL, CONSTRAINT "PK_97f662b9b848ae0982347d7d1d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provinces" ("code" character varying NOT NULL, "name" character varying NOT NULL, "nameEn" character varying NOT NULL, "fullName" character varying NOT NULL, "fullNameEn" character varying NOT NULL, "codeName" character varying NOT NULL, "administrativeUnitId" integer, "administrativeRegionId" integer, "administrative_unit_id" integer, "administrative_region_id" integer, CONSTRAINT "PK_f4b684af62d5cb3aa174f6b9b8a" PRIMARY KEY ("code"))`);
        await queryRunner.query(`ALTER TABLE "provinces" ADD CONSTRAINT "FK_f084cd63fc4e1c065093899a3d6" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provinces" ADD CONSTRAINT "FK_d1c497fbc928c872810463e17e9" FOREIGN KEY ("administrative_region_id") REFERENCES "administrative_regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP CONSTRAINT "FK_d1c497fbc928c872810463e17e9"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP CONSTRAINT "FK_f084cd63fc4e1c065093899a3d6"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
        await queryRunner.query(`DROP TABLE "administrative_units"`);
        await queryRunner.query(`DROP TABLE "administrative_regions"`);
        await queryRunner.query(`CREATE INDEX "idx_token_user_id" ON "token" ("userId") `);
        await queryRunner.query(`CREATE INDEX "idx_opt_phone_number" ON "opt" ("phoneNumber") `);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "fk_token_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
