import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContractAndContractClient1760197646519 implements MigrationInterface {
    name = 'UpdateContractAndContractClient1760197646519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_22616dcdb54897fea4494354a66"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_bcde30d3637d1a09da50c5a8bb9"`);
        await queryRunner.query(`ALTER TABLE "contract_client" RENAME COLUMN "isPrimaryPropertyUser" TO "isLandlordClient"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "contractId"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "landlordClientId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" ADD "landlordClientId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "contractId" uuid`);
        await queryRunner.query(`ALTER TABLE "contract_client" RENAME COLUMN "isLandlordClient" TO "isPrimaryPropertyUser"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_bcde30d3637d1a09da50c5a8bb9" FOREIGN KEY ("landlordClientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_22616dcdb54897fea4494354a66" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
