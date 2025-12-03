import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateServiceAddNameSlug1751807447734 implements MigrationInterface {
    name = 'UpdateServiceAddNameSlug1751807447734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" ADD "name_slug" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "name_slug"`);
    }

}
