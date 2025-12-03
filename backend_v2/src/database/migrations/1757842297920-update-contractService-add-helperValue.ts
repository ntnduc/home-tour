import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractServiceAddHelperValue1757842297920 implements MigrationInterface {
    name = 'UpdateContractServiceAddHelperValue1757842297920'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" ADD "helperValue" integer DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" DROP COLUMN "helperValue"`);
    }

}
