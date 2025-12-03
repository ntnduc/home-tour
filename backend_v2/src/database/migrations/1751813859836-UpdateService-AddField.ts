import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServiceAddField1751813859836 implements MigrationInterface {
    name = 'UpdateServiceAddField1751813859836'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" ADD "isDefaultSelected" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "services" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "isDefaultSelected"`);
    }

}
