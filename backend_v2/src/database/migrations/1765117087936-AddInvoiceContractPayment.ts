import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInvoiceContractPayment1765117087936 implements MigrationInterface {
    name = 'AddInvoiceContractPayment1765117087936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invoice_items_type_enum" AS ENUM('ROOM_RENT', 'SERVICE_FEE', 'OTHER')`);
        await queryRunner.query(`CREATE TABLE "invoice_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "invoiceId" uuid NOT NULL, "amount" numeric(15,2) NOT NULL, "type" "public"."invoice_items_type_enum" NOT NULL, "helperValue" integer DEFAULT '0', "contractServiceId" uuid, "propertyId" uuid NOT NULL, "metadata" jsonb, CONSTRAINT "PK_53b99f9e0e2945e69de1a12b75a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."invoices_status_enum" AS ENUM('PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED', 'DRAFT')`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" uuid NOT NULL, "roomId" uuid NOT NULL, "propertyId" uuid NOT NULL, "billingPeriodStart" date NOT NULL, "billingPeriodEnd" date NOT NULL, "dueDate" date NOT NULL, "totalAmount" numeric(15,2) NOT NULL, "paidAmount" numeric(15,2) NOT NULL, "remainingAmount" numeric(15,2) NOT NULL, "status" "public"."invoices_status_enum" NOT NULL DEFAULT 'DRAFT', "notes" text, CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_type_enum" AS ENUM('IN', 'OUT')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('PENDING', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED', 'DRAFT')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "invoiceId" uuid NOT NULL, "paymentDate" TIMESTAMP NOT NULL, "amount" numeric(15,2) NOT NULL, "propertyId" uuid NOT NULL, "type" "public"."payments_type_enum" NOT NULL, "paymentMethod" character varying, "status" "public"."payments_status_enum" NOT NULL, "notes" character varying, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_7fb6895fc8fad9f5200e91abb59" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_6cf2143b7309f7670a7fa0ff156" FOREIGN KEY ("contractServiceId") REFERENCES "contract_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_items" ADD CONSTRAINT "FK_b824d88aa6a96fe7c1abf7ac566" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_42d017ec6c4a79ea33cbe9dbfba" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_02cf80a6542d9670b9cb2edfbc1" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_7d55de85575f6e5b205fd6ae4b0" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_43d19956aeab008b49e0804c145" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_8ffcbb107170ed65322ac59fd6e" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_8ffcbb107170ed65322ac59fd6e"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_43d19956aeab008b49e0804c145"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_7d55de85575f6e5b205fd6ae4b0"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_02cf80a6542d9670b9cb2edfbc1"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_42d017ec6c4a79ea33cbe9dbfba"`);
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_b824d88aa6a96fe7c1abf7ac566"`);
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_6cf2143b7309f7670a7fa0ff156"`);
        await queryRunner.query(`ALTER TABLE "invoice_items" DROP CONSTRAINT "FK_7fb6895fc8fad9f5200e91abb59"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_type_enum"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);
        await queryRunner.query(`DROP TABLE "invoice_items"`);
        await queryRunner.query(`DROP TYPE "public"."invoice_items_type_enum"`);
    }

}
