import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropertyIdFileEntriFileCollection1775971414851 implements MigrationInterface {
    name = 'AddPropertyIdFileEntriFileCollection1775971414851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_entries" ADD "propertyId" character varying`);
        await queryRunner.query(`ALTER TABLE "file_collections" ADD "propertyId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_collections" DROP COLUMN "propertyId"`);
        await queryRunner.query(`ALTER TABLE "file_entries" DROP COLUMN "propertyId"`);
    }

}
