import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFileEntryAdd1770393329419 implements MigrationInterface {
    name = 'UpdateFileEntryAdd1770393329419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_entries" ADD "isPublic" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "file_entries" DROP CONSTRAINT "FK_70e12645e62a6c7af9612e55b73"`);
        await queryRunner.query(`ALTER TABLE "file_entries" ALTER COLUMN "collectionId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file_entries" ADD CONSTRAINT "FK_70e12645e62a6c7af9612e55b73" FOREIGN KEY ("collectionId") REFERENCES "file_collections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_entries" DROP CONSTRAINT "FK_70e12645e62a6c7af9612e55b73"`);
        await queryRunner.query(`ALTER TABLE "file_entries" ALTER COLUMN "collectionId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "file_entries" ADD CONSTRAINT "FK_70e12645e62a6c7af9612e55b73" FOREIGN KEY ("collectionId") REFERENCES "file_collections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "file_entries" DROP COLUMN "isPublic"`);
    }

}
