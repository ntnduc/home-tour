import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePropertyServiceNullableUnit1749745701352 implements MigrationInterface {
    name = 'UpdatePropertyServiceNullableUnit1749745701352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_service" ALTER COLUMN "unit" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "property_service" ALTER COLUMN "unit" SET NOT NULL`);
    }

}
