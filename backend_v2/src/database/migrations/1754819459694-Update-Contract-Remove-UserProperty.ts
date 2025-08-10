import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractRemoveUserProperty1754819459694 implements MigrationInterface {
    name = 'UpdateContractRemoveUserProperty1754819459694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_086aa4bf563e8a90e3d34171c83"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "primaryPropertyUserId"`);
        await queryRunner.query(`ALTER TABLE "contract_properties" ADD "isPrimaryPropertyUser" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_properties" DROP COLUMN "isPrimaryPropertyUser"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD "primaryPropertyUserId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_086aa4bf563e8a90e3d34171c83" FOREIGN KEY ("primaryPropertyUserId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
