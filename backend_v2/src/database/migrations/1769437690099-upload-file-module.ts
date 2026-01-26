import { MigrationInterface, QueryRunner } from "typeorm";

export class UploadFileModule1769437690099 implements MigrationInterface {
    name = 'UploadFileModule1769437690099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "file_collections" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255), "category" character varying(50), "description" text, "relatedEntityType" character varying, "relatedEntityId" character varying, "isPublic" boolean NOT NULL DEFAULT true, "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, "metadata" jsonb, CONSTRAINT "PK_191d4f7abd4a5471ef4fd2b376b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "file_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "originalName" character varying(255) NOT NULL, "fileName" character varying(255) NOT NULL, "mimeType" character varying(100) NOT NULL, "fileSize" bigint NOT NULL, "extension" character varying(10) NOT NULL, "filePath" text NOT NULL, "order" integer, "metadata" jsonb, "collectionId" uuid NOT NULL, "isDeleted" boolean NOT NULL DEFAULT false, "deletedAt" TIMESTAMP, CONSTRAINT "PK_ae7eaecbf684928201ab44bac31" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "file_entries" ADD CONSTRAINT "FK_70e12645e62a6c7af9612e55b73" FOREIGN KEY ("collectionId") REFERENCES "file_collections"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file_entries" DROP CONSTRAINT "FK_70e12645e62a6c7af9612e55b73"`);
        await queryRunner.query(`DROP TABLE "file_entries"`);
        await queryRunner.query(`DROP TABLE "file_collections"`);
    }

}
