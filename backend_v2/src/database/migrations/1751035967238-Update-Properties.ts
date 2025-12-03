import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProperties1751035967238 implements MigrationInterface {
    name = 'UpdateProperties1751035967238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" ADD "numberFloor" integer`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "totalRoom" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "totalRoom"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "numberFloor"`);
    }

}
