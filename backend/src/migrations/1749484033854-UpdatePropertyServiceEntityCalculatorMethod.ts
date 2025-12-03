import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePropertyServiceEntityCalculatorMethod1749484033854 implements MigrationInterface {
    name = 'UpdatePropertyServiceEntityCalculatorMethod1749484033854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."property_service_calculationmethod_enum" AS ENUM('FIXED_PER_ROOM', 'FIXED_PER_PERSON', 'PER_UNIT_SIMPLE', 'PER_UNIT_TIERED', 'FREE')`);
        await queryRunner.query(`ALTER TABLE "property_service" ADD "calculationMethod" "public"."property_service_calculationmethod_enum" NOT NULL DEFAULT 'FIXED_PER_ROOM'`);
        await queryRunner.query(`ALTER TABLE "property_service" ALTER COLUMN "price" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_service" ALTER COLUMN "price" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "property_service" DROP COLUMN "calculationMethod"`);
        await queryRunner.query(`DROP TYPE "public"."property_service_calculationmethod_enum"`);
    }

}
