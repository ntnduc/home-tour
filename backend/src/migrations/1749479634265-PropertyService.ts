import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyService1749479634265 implements MigrationInterface {
    name = 'PropertyService1749479634265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "property_service" ("id" SERIAL NOT NULL, "propertyId" integer NOT NULL, "serviceId" integer NOT NULL, "price" integer NOT NULL, "unit" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_10bfb8b99260bb4db975e9c8f6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "property_service" ADD CONSTRAINT "FK_6917bd5be7163150508bca5b97c" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "property_service" ADD CONSTRAINT "FK_27f3225ee8ecbb0ba5a808560b5" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_service" DROP CONSTRAINT "FK_27f3225ee8ecbb0ba5a808560b5"`);
        await queryRunner.query(`ALTER TABLE "property_service" DROP CONSTRAINT "FK_6917bd5be7163150508bca5b97c"`);
        await queryRunner.query(`DROP TABLE "property_service"`);
    }

}
