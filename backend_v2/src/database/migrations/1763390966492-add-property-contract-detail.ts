import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropertyContractDetail1763390966492 implements MigrationInterface {
    name = 'AddPropertyContractDetail1763390966492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_change_detail" ADD "propertyId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_change_log" ADD "propertyId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_change_detail" ADD CONSTRAINT "FK_05c1a13f3d0567aa4ec7a4a6155" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_change_log" ADD CONSTRAINT "FK_bebaebeea4debd19ca9a0ca1097" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_change_log" DROP CONSTRAINT "FK_bebaebeea4debd19ca9a0ca1097"`);
        await queryRunner.query(`ALTER TABLE "contract_change_detail" DROP CONSTRAINT "FK_05c1a13f3d0567aa4ec7a4a6155"`);
        await queryRunner.query(`ALTER TABLE "contract_change_log" DROP COLUMN "propertyId"`);
        await queryRunner.query(`ALTER TABLE "contract_change_detail" DROP COLUMN "propertyId"`);
    }

}
