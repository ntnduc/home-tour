import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserExtendsBaseEntity1754820791878 implements MigrationInterface {
    name = 'UpdateUserExtendsBaseEntity1754820791878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "createdBy" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedBy" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdBy"`);
    }

}
