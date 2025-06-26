import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServiceMappingAddName1750953148620 implements MigrationInterface {
    name = 'UpdateServiceMappingAddName1750953148620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties_services" ADD "name" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties_services" DROP COLUMN "name"`);
    }

}
