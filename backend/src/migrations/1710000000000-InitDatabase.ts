import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng user
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL PRIMARY KEY,
        "phoneNumber" VARCHAR NOT NULL UNIQUE,
        "name" VARCHAR,
        "email" VARCHAR,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Tạo bảng opt
    await queryRunner.query(`
      CREATE TABLE "opt" (
        "id" SERIAL PRIMARY KEY,
        "phoneNumber" VARCHAR NOT NULL,
        "code" VARCHAR NOT NULL,
        "isUsed" BOOLEAN NOT NULL DEFAULT false,
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Tạo bảng token
    await queryRunner.query(`
      CREATE TABLE "token" (
        "id" SERIAL PRIMARY KEY,
        "userId" INTEGER NOT NULL,
        "accessToken" VARCHAR NOT NULL,
        "refreshToken" VARCHAR NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "isRevoked" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_token_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
      )
    `);

    // Tạo index cho bảng opt
    await queryRunner.query(`
      CREATE INDEX "idx_opt_phone_number" ON "opt" ("phoneNumber")
    `);

    // Tạo index cho bảng token
    await queryRunner.query(`
      CREATE INDEX "idx_token_user_id" ON "token" ("userId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa index
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_token_user_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_opt_phone_number"`);

    // Xóa bảng token
    await queryRunner.query(`DROP TABLE IF EXISTS "token"`);

    // Xóa bảng opt
    await queryRunner.query(`DROP TABLE IF EXISTS "opt"`);

    // Xóa bảng user
    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }
}
