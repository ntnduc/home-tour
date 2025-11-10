import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddFormatDatePatternCodeConfig1762704552624 implements MigrationInterface {
    name = 'UpdateAddFormatDatePatternCodeConfig1762704552624'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_configs" ADD "formatDatePattern" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_configs" DROP COLUMN "formatDatePattern"`);
    }

}
