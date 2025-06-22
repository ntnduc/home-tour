import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertiesEntity1750607120259 implements MigrationInterface {
    name = 'PropertiesEntity1750607120259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "provinceCode" character varying, "districtCode" character varying, "wardCode" character varying, "latitude" integer, "longitude" integer, "defaultRoomRent" integer DEFAULT '0', "paymentDate" integer NOT NULL DEFAULT '5', CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0"`);
        await queryRunner.query(`DROP TABLE "properties"`);
    }

}
