import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractServiceAddCalculatorMethod1754758119933 implements MigrationInterface {
    name = 'UpdateContractServiceAddCalculatorMethod1754758119933'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" ADD "calculationMethod" "public"."service_calculation_method" NOT NULL DEFAULT 'FREE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" DROP COLUMN "calculationMethod"`);
    }

}
