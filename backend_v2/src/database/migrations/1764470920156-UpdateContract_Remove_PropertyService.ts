import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractRemovePropertyService1764470920156 implements MigrationInterface {
    name = 'UpdateContractRemovePropertyService1764470920156'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "FK_60277abe975370ff69838758b5a"`);
        await queryRunner.query(`ALTER TABLE "contract_services" DROP CONSTRAINT "UQ_a0dfe64e72a39e75917dbbb02ce"`);
        await queryRunner.query(`ALTER TABLE "contract_services" DROP COLUMN "propertyServiceId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" ADD "propertyServiceId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "UQ_a0dfe64e72a39e75917dbbb02ce" UNIQUE ("contractId", "propertyServiceId")`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD CONSTRAINT "FK_60277abe975370ff69838758b5a" FOREIGN KEY ("propertyServiceId") REFERENCES "properties_services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
