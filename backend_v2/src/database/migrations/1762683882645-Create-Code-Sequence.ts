import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCodeSequence1762683882645 implements MigrationInterface {
  name = 'CreateCodeSequence1762683882645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "code_sequences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying(255) NOT NULL, "currentValue" character varying(255) NOT NULL, "propertyId" character varying(255) NOT NULL, CONSTRAINT "PK_2e0c3d8a6632449b7fa6c32ce54" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "code_configs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying(255) NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "configObject" jsonb, "propertyId" character varying(255), CONSTRAINT "PK_0af6911d8a9fe3b4e7bb3faf433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "code_configs"`);
    await queryRunner.query(`DROP TABLE "code_sequences"`);
  }
}
