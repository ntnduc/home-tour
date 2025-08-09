import { MigrationInterface, QueryRunner } from "typeorm";

export class ContractModules1754732465844 implements MigrationInterface {
    name = 'ContractModules1754732465844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."contracts_status_enum" AS ENUM('PENDING_START', 'ACTIVE', 'ENDED', 'TERMINATED_EARLY', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid NOT NULL, "roomId" uuid NOT NULL, "primaryTenantUserId" uuid NOT NULL, "landlordUserId" uuid NOT NULL, "startDate" date NOT NULL, "endDate" date, "rentAmountAgreed" numeric(15,2) NOT NULL, "depositAmountPaid" numeric(15,2) NOT NULL DEFAULT '0', "paymentDueDay" integer NOT NULL, "contractScanURL" character varying, "status" "public"."contracts_status_enum" NOT NULL DEFAULT 'PENDING_START', "notes" text, CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" uuid NOT NULL, "serviceId" uuid NOT NULL, "customPrice" numeric(15,2), "isEnabled" boolean NOT NULL DEFAULT true, "notes" text, CONSTRAINT "UQ_9ea3854f17553ba71409ddd010a" UNIQUE ("contractId", "serviceId"), CONSTRAINT "PK_45f045ee7b47452e187cafbd37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" uuid NOT NULL, "propertyUserId" uuid NOT NULL, "moveInDate" date, "moveOutDate" date, "isActiveInContract" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_6c420a3a89ba04079f7f379942a" UNIQUE ("contractId", "propertyUserId"), CONSTRAINT "PK_6dfecbb775a7a0b67a2ef52cc98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_3d01d6444fe0d4a9e47ac9b3625" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_0d7d32f0278366e49453516b04f" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_3465a1ec7c58caddc78b8769cd8" FOREIGN KEY ("primaryTenantUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_ec674fb514011cda63ef3d0d07a" FOREIGN KEY ("landlordUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "FK_6b71bac736a531038c6884e5f5e" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "FK_5213e785e7eaab51c19a52c07e0" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_properties" ADD CONSTRAINT "FK_a899b231a0e61868a3aad821a0e" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_properties" ADD CONSTRAINT "FK_5f520389af35a9a22e814ef1085" FOREIGN KEY ("propertyUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_properties" DROP CONSTRAINT "FK_5f520389af35a9a22e814ef1085"`);
        await queryRunner.query(`ALTER TABLE "contract_properties" DROP CONSTRAINT "FK_a899b231a0e61868a3aad821a0e"`);
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "FK_5213e785e7eaab51c19a52c07e0"`);
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "FK_6b71bac736a531038c6884e5f5e"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_ec674fb514011cda63ef3d0d07a"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_3465a1ec7c58caddc78b8769cd8"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_0d7d32f0278366e49453516b04f"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_3d01d6444fe0d4a9e47ac9b3625"`);
        await queryRunner.query(`DROP TABLE "contract_properties"`);
        await queryRunner.query(`DROP TABLE "contract_services"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
        await queryRunner.query(`DROP TYPE "public"."contracts_status_enum"`);
    }

}
