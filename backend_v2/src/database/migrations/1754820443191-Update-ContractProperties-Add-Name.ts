import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractPropertiesAddName1754820443191 implements MigrationInterface {
    name = 'UpdateContractPropertiesAddName1754820443191'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_properties" ADD "name" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_properties" DROP COLUMN "name"`);
    }

}
