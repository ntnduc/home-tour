import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCodeConfig1762701803460 implements MigrationInterface {
    name = 'UpdateCodeConfig1762701803460'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_configs" DROP COLUMN "configObject"`);
        await queryRunner.query(`ALTER TABLE "code_configs" ADD "prefix" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "code_configs" ADD "suffix" character varying(255)`);
        await queryRunner.query(`CREATE TYPE "public"."code_configs_resettype_enum" AS ENUM('NONE', 'MONTHLY', 'YEARLY', 'WEEKLY')`);
        await queryRunner.query(`ALTER TABLE "code_configs" ADD "resetType" "public"."code_configs_resettype_enum" NOT NULL DEFAULT 'NONE'`);
        await queryRunner.query(`ALTER TABLE "code_configs" ADD "format" text`);
        await queryRunner.query(`ALTER TABLE "code_configs" ADD "length" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_configs" DROP COLUMN "length"`);
        await queryRunner.query(`ALTER TABLE "code_configs" DROP COLUMN "format"`);
        await queryRunner.query(`ALTER TABLE "code_configs" DROP COLUMN "resetType"`);
        await queryRunner.query(`DROP TYPE "public"."code_configs_resettype_enum"`);
        await queryRunner.query(`ALTER TABLE "code_configs" DROP COLUMN "suffix"`);
        await queryRunner.query(`ALTER TABLE "code_configs" DROP COLUMN "prefix"`);
        await queryRunner.query(`ALTER TABLE "code_configs" ADD "configObject" jsonb`);
    }

}
