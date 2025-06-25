import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMappingContentMapping1750864610596 implements MigrationInterface {
    name = 'TestMappingContentMapping1750864610596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test-content" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_93a21d1452ab90da63335152c94" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "test-mapping" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "test_id" uuid NOT NULL, "test_content_id" uuid NOT NULL, CONSTRAINT "PK_56b98c27b5fcffeb75696e80363" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "test-mapping" ADD CONSTRAINT "FK_03f6d3823153707d6cbfaf3aec0" FOREIGN KEY ("test_id") REFERENCES "test"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test-mapping" ADD CONSTRAINT "FK_a782119be92289a33e60056896d" FOREIGN KEY ("test_content_id") REFERENCES "test-content"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test-mapping" DROP CONSTRAINT "FK_a782119be92289a33e60056896d"`);
        await queryRunner.query(`ALTER TABLE "test-mapping" DROP CONSTRAINT "FK_03f6d3823153707d6cbfaf3aec0"`);
        await queryRunner.query(`DROP TABLE "test-mapping"`);
        await queryRunner.query(`DROP TABLE "test-content"`);
    }

}
