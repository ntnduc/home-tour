import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractChangeTenantUser1754817998525 implements MigrationInterface {
    name = 'UpdateContractChangeTenantUser1754817998525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_3465a1ec7c58caddc78b8769cd8"`);
        await queryRunner.query(`ALTER TABLE "contracts" RENAME COLUMN "primaryTenantUserId" TO "primaryPropertyUserId"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_086aa4bf563e8a90e3d34171c83" FOREIGN KEY ("primaryPropertyUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_086aa4bf563e8a90e3d34171c83"`);
        await queryRunner.query(`ALTER TABLE "contracts" RENAME COLUMN "primaryPropertyUserId" TO "primaryTenantUserId"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_3465a1ec7c58caddc78b8769cd8" FOREIGN KEY ("primaryTenantUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
