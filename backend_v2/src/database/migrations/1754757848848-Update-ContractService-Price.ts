import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractServicePrice1754757848848 implements MigrationInterface {
    name = 'UpdateContractServicePrice1754757848848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" RENAME COLUMN "customPrice" TO "price"`);
        await queryRunner.query(`ALTER TABLE "contract_services" ALTER COLUMN "price" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_services" ALTER COLUMN "price" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_services" ALTER COLUMN "price" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "contract_services" ALTER COLUMN "price" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract_services" RENAME COLUMN "price" TO "customPrice"`);
    }

}
