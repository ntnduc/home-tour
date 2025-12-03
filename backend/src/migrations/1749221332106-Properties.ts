import { MigrationInterface, QueryRunner } from "typeorm";

export class Properties1749221332106 implements MigrationInterface {
    name = 'Properties1749221332106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_properties" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "property_id" integer, CONSTRAINT "PK_458d276ea6fafdd3194fd61e280" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "ward" character varying NOT NULL, "district" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "description" character varying NOT NULL, "defaultRoomRent" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_properties" ADD CONSTRAINT "FK_d301d1f967e58c51ade9ebfd1f1" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_properties" ADD CONSTRAINT "FK_d5f0eb96f1dde30ac73a1d73f4b" FOREIGN KEY ("property_id") REFERENCES "properties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_properties" DROP CONSTRAINT "FK_d5f0eb96f1dde30ac73a1d73f4b"`);
        await queryRunner.query(`ALTER TABLE "user_properties" DROP CONSTRAINT "FK_d301d1f967e58c51ade9ebfd1f1"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TABLE "user_properties"`);
    }

}
