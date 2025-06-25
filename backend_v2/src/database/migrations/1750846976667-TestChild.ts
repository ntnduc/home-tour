import { MigrationInterface, QueryRunner } from "typeorm";

export class TestChild1750846976667 implements MigrationInterface {
    name = 'TestChild1750846976667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "test_child" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "testId" uuid NOT NULL, CONSTRAINT "PK_ffaa98e647e021ad426dbabf17b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "test_child" ADD CONSTRAINT "FK_f8194a6861d6663f2f54dc8747e" FOREIGN KEY ("testId") REFERENCES "test"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_child" DROP CONSTRAINT "FK_f8194a6861d6663f2f54dc8747e"`);
        await queryRunner.query(`DROP TABLE "test_child"`);
    }

}
