import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractServiceAddName1764496498570 implements MigrationInterface {
    name = 'UpdateContractServiceAddName1764496498570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" DROP COLUMN "name"`);
    }

}
