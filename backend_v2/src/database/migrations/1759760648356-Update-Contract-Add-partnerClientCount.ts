import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractAddPartnerClientCount1759760648356 implements MigrationInterface {
    name = 'UpdateContractAddPartnerClientCount1759760648356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" ADD "partnerClientCount" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "partnerClientCount"`);
    }

}
