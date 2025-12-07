import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContract1765084326292 implements MigrationInterface {
    name = 'UpdateContract1765084326292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" ADD "isPrepaidRoom" boolean DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD "isPrepaidRoom" boolean DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "isPrepaidRoom"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "isPrepaidRoom"`);
    }

}
