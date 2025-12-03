import { MigrationInterface, QueryRunner } from "typeorm";

export class Service1749479137198 implements MigrationInterface {
    name = 'Service1749479137198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."service_calculationmethod_enum" AS ENUM('FIXED_PER_ROOM', 'FIXED_PER_PERSON', 'PER_UNIT_SIMPLE', 'PER_UNIT_TIERED', 'FREE')`);
        await queryRunner.query(`CREATE TABLE "service" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "calculationMethod" "public"."service_calculationmethod_enum" NOT NULL DEFAULT 'FIXED_PER_ROOM', "defaultUnitName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7806a14d42c3244064b4a1706ca" UNIQUE ("name"), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "service"`);
        await queryRunner.query(`DROP TYPE "public"."service_calculationmethod_enum"`);
    }

}
