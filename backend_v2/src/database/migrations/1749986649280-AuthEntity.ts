import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthEntity1749986649280 implements MigrationInterface {
  name = 'AuthEntity1749986649280';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "code" character varying NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "PK_82fae97f905930df5d62a702fc9"`,
    );
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "token" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "PK_82fae97f905930df5d62a702fc9"`,
    );
    await queryRunner.query(`ALTER TABLE "token" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "token" ADD "id" SERIAL NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(`DROP TABLE "otp"`);
  }
}
