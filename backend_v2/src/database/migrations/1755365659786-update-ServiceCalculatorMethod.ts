import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateServiceCalculatorMethod1755365092071
  implements MigrationInterface
{
  name = 'UpdateServiceCalculatorMethod1755365092071';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // contract_services
    await queryRunner.query(
      `ALTER TABLE "contract_services" ALTER COLUMN "calculationMethod" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_services" ALTER COLUMN "calculationMethod" TYPE VARCHAR USING "calculationMethod"::TEXT`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_services" ALTER COLUMN "calculationMethod" SET DEFAULT 'FREE'`,
    );

    // services
    await queryRunner.query(
      `ALTER TABLE "services" ALTER COLUMN "calculationMethod" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" ALTER COLUMN "calculationMethod" TYPE VARCHAR USING "calculationMethod"::TEXT`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" ALTER COLUMN "calculationMethod" SET DEFAULT 'FIXED_PER_ROOM'`,
    );

    // properties_services
    await queryRunner.query(
      `ALTER TABLE "properties_services" ALTER COLUMN "calculationMethod" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties_services" ALTER COLUMN "calculationMethod" TYPE VARCHAR USING "calculationMethod"::TEXT`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties_services" ALTER COLUMN "calculationMethod" SET DEFAULT 'FREE'`,
    );

    // drop old types (sau khi tất cả bảng đã đổi qua string)
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."service_calculation_method"`,
    );
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."services_calculationmethod_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // contract_services
    await queryRunner.query(
      `CREATE TYPE "public"."service_calculation_method" AS ENUM('FIXED_PER_ROOM', 'FIXED_PER_PERSON', 'PER_UNIT_SIMPLE', 'PER_UNIT_TIERED', 'FREE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_services" ALTER COLUMN "calculationMethod" TYPE "public"."service_calculation_method" USING "calculationMethod"::"public"."service_calculation_method"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_services" ALTER COLUMN "calculationMethod" SET DEFAULT 'FREE'`,
    );

    // services
    await queryRunner.query(
      `CREATE TYPE "public"."services_calculationmethod_enum" AS ENUM('FIXED_PER_ROOM', 'FIXED_PER_PERSON', 'PER_UNIT_SIMPLE', 'PER_UNIT_TIERED', 'FREE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" ALTER COLUMN "calculationMethod" TYPE "public"."services_calculationmethod_enum" USING "calculationMethod"::"public"."services_calculationmethod_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" ALTER COLUMN "calculationMethod" SET DEFAULT 'FIXED_PER_ROOM'`,
    );

    // properties_services
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "public"."service_calculation_method" AS ENUM('FIXED_PER_ROOM', 'FIXED_PER_PERSON', 'PER_UNIT_SIMPLE', 'PER_UNIT_TIERED', 'FREE')`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties_services" ALTER COLUMN "calculationMethod" TYPE "public"."service_calculation_method" USING "calculationMethod"::"public"."service_calculation_method"`,
    );
    await queryRunner.query(
      `ALTER TABLE "properties_services" ALTER COLUMN "calculationMethod" SET DEFAULT 'FREE'`,
    );
  }
}
