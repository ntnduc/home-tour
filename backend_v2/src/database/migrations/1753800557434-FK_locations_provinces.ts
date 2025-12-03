import { MigrationInterface, QueryRunner } from "typeorm";

export class FKLocationsProvinces1753800557434 implements MigrationInterface {
    name = 'FKLocationsProvinces1753800557434'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."rooms_status_enum" RENAME TO "rooms_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."rooms_status_enum" AS ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'PENDING_DEPOSIT', 'UNAVAILABLE')`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "status" TYPE "public"."rooms_status_enum" USING "status"::"text"::"public"."rooms_status_enum"`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE'`);
        await queryRunner.query(`DROP TYPE "public"."rooms_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_0c6d880a1b315eedb1e3d20ff66" FOREIGN KEY ("provinceCode") REFERENCES "provinces"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_15ce2f8d04ceba3419729da5ea4" FOREIGN KEY ("districtCode") REFERENCES "districts"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_356d1e29e4d79166f1e31e788da" FOREIGN KEY ("wardCode") REFERENCES "wards"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_356d1e29e4d79166f1e31e788da"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_15ce2f8d04ceba3419729da5ea4"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_0c6d880a1b315eedb1e3d20ff66"`);
        await queryRunner.query(`CREATE TYPE "public"."rooms_status_enum_old" AS ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "status" TYPE "public"."rooms_status_enum_old" USING "status"::"text"::"public"."rooms_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "rooms" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE'`);
        await queryRunner.query(`DROP TYPE "public"."rooms_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."rooms_status_enum_old" RENAME TO "rooms_status_enum"`);
    }

}
