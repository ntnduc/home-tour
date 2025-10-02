import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContractAndClient1759422111042 implements MigrationInterface {
    name = 'AddContractAndClient1759422111042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fullName" character varying(255) NOT NULL, "phoneNumber" character varying(20) NOT NULL, "email" character varying(255), "idCardNumber" character varying(50), "permanentAddress" text, "dateOfBirth" date, "profilePictureURL" character varying(255), "isActive" boolean NOT NULL DEFAULT true, "notes" text, CONSTRAINT "UQ_c7997e228eb23f5f3931ac6701c" UNIQUE ("phoneNumber"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" uuid NOT NULL, "name" character varying NOT NULL DEFAULT '', "isPrimaryPropertyUser" boolean NOT NULL DEFAULT false, "clientId" uuid NOT NULL, "moveInDate" date, "moveOutDate" date, "isActiveInContract" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e69427dd51bc40dc09538c0a077" UNIQUE ("contractId", "clientId"), CONSTRAINT "PK_6dfecbb775a7a0b67a2ef52cc98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contracts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid NOT NULL, "roomId" uuid NOT NULL, "landlordClientId" uuid NOT NULL, "startDate" date NOT NULL, "endDate" date, "rentAmountAgreed" numeric(15,2) NOT NULL, "depositAmountPaid" numeric(15,2) NOT NULL DEFAULT '0', "paymentDueDay" integer NOT NULL, "contractScanURL" character varying, "status" "public"."contracts_status_enum" NOT NULL DEFAULT 'PENDING_START', "notes" text, CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" uuid NOT NULL, "propertyServiceId" uuid NOT NULL, "price" numeric NOT NULL DEFAULT '0', "calculationMethod" text NOT NULL DEFAULT 'FREE', "isEnabled" boolean NOT NULL DEFAULT true, "helperValue" integer DEFAULT '0', "notes" text, CONSTRAINT "UQ_a0dfe64e72a39e75917dbbb02ce" UNIQUE ("contractId", "propertyServiceId"), CONSTRAINT "PK_45f045ee7b47452e187cafbd37e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contract_properties" ADD CONSTRAINT "FK_a899b231a0e61868a3aad821a0e" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_properties" ADD CONSTRAINT "FK_c2611ca3a22be34ea161a2a47a9" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_3d01d6444fe0d4a9e47ac9b3625" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_0d7d32f0278366e49453516b04f" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_bcde30d3637d1a09da50c5a8bb9" FOREIGN KEY ("landlordClientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "FK_6b71bac736a531038c6884e5f5e" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "FK_60277abe975370ff69838758b5a" FOREIGN KEY ("propertyServiceId") REFERENCES "properties_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "FK_60277abe975370ff69838758b5a"`);
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "FK_6b71bac736a531038c6884e5f5e"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_bcde30d3637d1a09da50c5a8bb9"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_0d7d32f0278366e49453516b04f"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_3d01d6444fe0d4a9e47ac9b3625"`);
        await queryRunner.query(`ALTER TABLE "contract_properties" DROP CONSTRAINT "FK_c2611ca3a22be34ea161a2a47a9"`);
        await queryRunner.query(`ALTER TABLE "contract_properties" DROP CONSTRAINT "FK_a899b231a0e61868a3aad821a0e"`);
        await queryRunner.query(`DROP TABLE "contract_services"`);
        await queryRunner.query(`DROP TABLE "contracts"`);
        await queryRunner.query(`DROP TABLE "contract_properties"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
