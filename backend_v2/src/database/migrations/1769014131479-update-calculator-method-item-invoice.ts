import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCalculatorMethodItemInvoice1769014131479 implements MigrationInterface {
    name = 'UpdateCalculatorMethodItemInvoice1769014131479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD "calculationMethod" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP COLUMN "calculationMethod"`);
    }

}
