import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePropertyEntity1749482153586 implements MigrationInterface {
    name = 'UpdatePropertyEntity1749482153586'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "ward"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "district"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "wardId" integer`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "districtId" integer`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "paymentDate" integer DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "latitude" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "longitude" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "longitude" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "latitude" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "paymentDate"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "districtId"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "wardId"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "country" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "city" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "district" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ADD "ward" character varying NOT NULL`);
    }

}
