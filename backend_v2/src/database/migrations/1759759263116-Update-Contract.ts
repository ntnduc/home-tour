import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateContract1759759263116 implements MigrationInterface {
    name = 'UpdateContract1759759263116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_0d7d32f0278366e49453516b04f"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_bcde30d3637d1a09da50c5a8bb9"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "contractId" uuid`);
        await queryRunner.query(`ALTER TABLE "clients" ADD CONSTRAINT "FK_22616dcdb54897fea4494354a66" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_0d7d32f0278366e49453516b04f" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_bcde30d3637d1a09da50c5a8bb9" FOREIGN KEY ("landlordClientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_bcde30d3637d1a09da50c5a8bb9"`);
        await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_0d7d32f0278366e49453516b04f"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP CONSTRAINT "FK_22616dcdb54897fea4494354a66"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "contractId"`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_bcde30d3637d1a09da50c5a8bb9" FOREIGN KEY ("landlordClientId") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contracts" ADD CONSTRAINT "FK_0d7d32f0278366e49453516b04f" FOREIGN KEY ("roomId") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
