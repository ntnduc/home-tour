import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePropertyServiceChangeserviceId1754814654152 implements MigrationInterface {
    name = 'UpdatePropertyServiceChangeserviceId1754814654152'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "FK_5213e785e7eaab51c19a52c07e0"`);
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "UQ_9ea3854f17553ba71409ddd010a"`);
        await queryRunner.query(`ALTER TABLE "contract_services" RENAME COLUMN "serviceId" TO "propertyServiceId"`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "UQ_a0dfe64e72a39e75917dbbb02ce" UNIQUE ("contractId", "propertyServiceId")`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "FK_60277abe975370ff69838758b5a" FOREIGN KEY ("propertyServiceId") REFERENCES "properties_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "FK_60277abe975370ff69838758b5a"`);
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "UQ_a0dfe64e72a39e75917dbbb02ce"`);
        await queryRunner.query(`ALTER TABLE "contract_services" RENAME COLUMN "propertyServiceId" TO "serviceId"`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "UQ_9ea3854f17553ba71409ddd010a" UNIQUE ("contractId", "serviceId")`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "FK_5213e785e7eaab51c19a52c07e0" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
