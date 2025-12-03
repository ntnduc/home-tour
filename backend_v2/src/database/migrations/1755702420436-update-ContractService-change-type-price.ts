import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractServiceChangeTypePrice1755702420436 implements MigrationInterface {
    name = 'UpdateContractServiceChangeTypePrice1755702420436'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" ALTER COLUMN "price" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "contract_services" DROP COLUMN "calculationMethod"`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD "calculationMethod" text NOT NULL DEFAULT 'FREE'`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "calculationMethod"`);
        await queryRunner.query(`ALTER TABLE "services" ADD "calculationMethod" text NOT NULL DEFAULT 'FIXED_PER_ROOM'`);
        await queryRunner.query(`ALTER TABLE "properties_services" DROP COLUMN "calculationMethod"`);
        await queryRunner.query(`ALTER TABLE "properties_services" ADD "calculationMethod" text NOT NULL DEFAULT 'FREE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties_services" DROP COLUMN "calculationMethod"`);
        await queryRunner.query(`ALTER TABLE "properties_services" ADD "calculationMethod" character varying NOT NULL DEFAULT 'FREE'`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "calculationMethod"`);
        await queryRunner.query(`ALTER TABLE "services" ADD "calculationMethod" character varying NOT NULL DEFAULT 'FIXED_PER_ROOM'`);
        await queryRunner.query(`ALTER TABLE "contract_services" DROP COLUMN "calculationMethod"`);
        await queryRunner.query(`ALTER TABLE "contract_services" ADD "calculationMethod" character varying NOT NULL DEFAULT 'FREE'`);
        await queryRunner.query(`ALTER TABLE "contract_services" ALTER COLUMN "price" TYPE numeric(15,2)`);
    }

}
