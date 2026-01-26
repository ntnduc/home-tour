import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateInvoiceInvoiceItem1769313715006 implements MigrationInterface {
    name = 'UpdateInvoiceInvoiceItem1769313715006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD "oldHelperValue" integer`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "preInvoiceId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "preInvoiceId"`);
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP COLUMN "oldHelperValue"`);
    }

}
