import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityUser1750003935026 implements MigrationInterface {
    name = 'UpdateEntityUser1750003935026'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "firstName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "fullName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isPhoneVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isActive" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isPhoneVerified"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fullName"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_a000cca60bcf04454e727699490"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "firstName" character varying NOT NULL`);
    }

}
