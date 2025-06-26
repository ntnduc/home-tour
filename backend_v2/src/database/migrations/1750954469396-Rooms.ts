import { MigrationInterface, QueryRunner } from "typeorm";

export class Rooms1750954469396 implements MigrationInterface {
    name = 'Rooms1750954469396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid NOT NULL, "name" character varying NOT NULL, "area" integer, "rentAmount" integer NOT NULL, "maxOccupancy" integer, "status" "public"."rooms_status_enum" NOT NULL DEFAULT 'AVAILABLE', "floor" character varying, "defaultDepositAmount" integer NOT NULL, "defaultPaymentDueDay" integer NOT NULL, "description" character varying, CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD CONSTRAINT "FK_ce3e5c454b2ff702244f7318828" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP CONSTRAINT "FK_ce3e5c454b2ff702244f7318828"`);
        await queryRunner.query(`DROP TABLE "rooms"`);
    }

}
