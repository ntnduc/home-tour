import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertitiesService1750774732424 implements MigrationInterface {
    name = 'PropertitiesService1750774732424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "calculationMethod" "public"."services_calculationmethod_enum" NOT NULL DEFAULT 'FIXED_PER_ROOM', "defaultUnitName" character varying, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "properties_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid NOT NULL, "serviceId" uuid NOT NULL, "calculationMethod" "public"."properties_services_calculationmethod_enum" NOT NULL DEFAULT 'FREE', CONSTRAINT "PK_da93b575cac01608eb60cb20f9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "properties_services" ADD CONSTRAINT "FK_669c90afa4f2991eabc410a0215" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties_services" ADD CONSTRAINT "FK_1505fe0c81a9e9ee516facb0634" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties_services" DROP CONSTRAINT "FK_1505fe0c81a9e9ee516facb0634"`);
        await queryRunner.query(`ALTER TABLE "properties_services" DROP CONSTRAINT "FK_669c90afa4f2991eabc410a0215"`);
        await queryRunner.query(`DROP TABLE "properties_services"`);
        await queryRunner.query(`DROP TABLE "services"`);
    }

}
