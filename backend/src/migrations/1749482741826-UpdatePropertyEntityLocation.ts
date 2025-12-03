import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePropertyEntityLocation1749482741826 implements MigrationInterface {
    name = 'UpdatePropertyEntityLocation1749482741826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "wardId"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "districtId"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "provinceCode" integer`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "districtCode" integer`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "wardCode" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "wardCode"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "districtCode"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "provinceCode"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "districtId" integer`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "wardId" integer`);
    }

}
