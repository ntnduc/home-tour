import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropContractModuleTables1759000001000
  implements MigrationInterface
{
  name = 'DropContractModuleTables1759000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs referencing contracts/contract_properties/contract_services first to avoid dependency issues
    await queryRunner.query(
      'ALTER TABLE "contract_services" DROP CONSTRAINT IF EXISTS "FK_contract_services_contractId"',
    );
    await queryRunner.query(
      'ALTER TABLE "contract_services" DROP CONSTRAINT IF EXISTS "FK_contract_services_propertyServiceId"',
    );
    await queryRunner.query(
      'ALTER TABLE "contract_properties" DROP CONSTRAINT IF EXISTS "FK_contract_properties_contractId"',
    );
    await queryRunner.query(
      'ALTER TABLE "contract_properties" DROP CONSTRAINT IF EXISTS "FK_contract_properties_clientId"',
    );

    // Drop child tables first, then parent
    await queryRunner.query('DROP TABLE IF EXISTS "contract_services"');
    await queryRunner.query('DROP TABLE IF EXISTS "contract_properties"');
    await queryRunner.query('DROP TABLE IF EXISTS "contracts"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate contracts table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "contracts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdBy" character varying,
        "updatedBy" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "propertyId" uuid NOT NULL,
        "roomId" uuid NOT NULL,
        "landlordClientId" uuid NOT NULL,
        "startDate" date NOT NULL,
        "endDate" date,
        "rentAmountAgreed" numeric(15,2) NOT NULL,
        "depositAmountPaid" numeric(15,2) NOT NULL DEFAULT 0,
        "paymentDueDay" integer NOT NULL,
        "contractScanURL" character varying,
        "status" varchar NOT NULL,
        "notes" text,
        CONSTRAINT "PK_contracts_id" PRIMARY KEY ("id")
      );
    `);

    // Recreate contract_properties table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "contract_properties" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdBy" character varying,
        "updatedBy" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "contractId" uuid NOT NULL,
        "clientId" uuid NOT NULL,
        "name" character varying NOT NULL DEFAULT '',
        "isPrimaryPropertyUser" boolean NOT NULL DEFAULT false,
        "moveInDate" date,
        "moveOutDate" date,
        "isActiveInContract" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_contract_properties_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_contract_properties_contract_client" UNIQUE ("contractId","clientId")
      );
    `);

    // Recreate contract_services table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "contract_services" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdBy" character varying,
        "updatedBy" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "contractId" uuid NOT NULL,
        "propertyServiceId" uuid NOT NULL,
        "price" numeric NOT NULL DEFAULT 0,
        "calculationMethod" text NOT NULL DEFAULT 'FREE',
        "isEnabled" boolean NOT NULL DEFAULT true,
        "helperValue" integer DEFAULT 0,
        "notes" text,
        CONSTRAINT "PK_contract_services_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_contract_services_contract_propertyService" UNIQUE ("contractId","propertyServiceId")
      );
    `);

    // Recreate FKs
    await queryRunner.query(
      'ALTER TABLE "contracts" ADD CONSTRAINT "FK_contracts_propertyId" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE "contracts" ADD CONSTRAINT "FK_contracts_roomId" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE "contracts" ADD CONSTRAINT "FK_contracts_landlordClientId" FOREIGN KEY ("landlordClientId") REFERENCES "clients"("id") ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE "contract_properties" ADD CONSTRAINT "FK_contract_properties_contractId" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE "contract_properties" ADD CONSTRAINT "FK_contract_properties_clientId" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE "contract_services" ADD CONSTRAINT "FK_contract_services_contractId" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE',
    );
    await queryRunner.query(
      'ALTER TABLE "contract_services" ADD CONSTRAINT "FK_contract_services_propertyServiceId" FOREIGN KEY ("propertyServiceId") REFERENCES "properties_services"("id") ON DELETE CASCADE',
    );
  }
}
