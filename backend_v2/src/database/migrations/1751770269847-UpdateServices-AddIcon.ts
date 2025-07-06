import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServicesAddIcon1751770269847 implements MigrationInterface {
    name = 'UpdateServicesAddIcon1751770269847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" ADD "icon" character varying DEFAULT 'apps-outline'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "icon"`);
    }

}
