import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePRopertiesChangeCodeLocationType1749658167534 implements MigrationInterface {
    name = 'UpdatePRopertiesChangeCodeLocationType1749658167534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "provinceCode"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "provinceCode" character varying`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "districtCode"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "districtCode" character varying`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "wardCode"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "wardCode" character varying`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "paymentDate" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "paymentDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "wardCode"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "wardCode" integer`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "districtCode"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "districtCode" integer`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "provinceCode"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "provinceCode" integer`);
    }

}
