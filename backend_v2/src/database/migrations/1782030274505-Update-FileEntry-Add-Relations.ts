import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFileEntryAddRelations1782030274505 implements MigrationInterface {
    name = 'UpdateFileEntryAddRelations1782030274505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_entries" ADD "category" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "file_entries" ADD "relatedEntityType" character varying`);
        await queryRunner.query(`ALTER TABLE "file_entries" ADD "relatedEntityId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_entries" DROP COLUMN "relatedEntityId"`);
        await queryRunner.query(`ALTER TABLE "file_entries" DROP COLUMN "relatedEntityType"`);
        await queryRunner.query(`ALTER TABLE "file_entries" DROP COLUMN "category"`);
    }

}
