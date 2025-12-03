import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractUpdateUnique1763478747649 implements MigrationInterface {
    name = 'UpdateContractUpdateUnique1763478747649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "UQ_2a55e1c83511e04d3b9ddfefb51"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "UQ_bd4fc6fd6598e99632839ebf204" UNIQUE ("code", "propertyId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "UQ_bd4fc6fd6598e99632839ebf204"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "UQ_2a55e1c83511e04d3b9ddfefb51" UNIQUE ("code")`);
    }

}
