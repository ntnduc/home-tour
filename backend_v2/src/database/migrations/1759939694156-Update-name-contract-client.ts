import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateNameContractClient1759939694156
  implements MigrationInterface
{
  name = 'UpdateNameContractClient1759939694156';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "contract_client" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" uuid NOT NULL, "name" character varying NOT NULL DEFAULT '', "isPrimaryPropertyUser" boolean NOT NULL DEFAULT false, "clientId" uuid NOT NULL, "moveInDate" date, "moveOutDate" date, "isActiveInContract" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_a7ab1325ef1403f735f957b17a9" UNIQUE ("contractId", "clientId"), CONSTRAINT "PK_17598b1610ffe62285e28e8679c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_client" ADD CONSTRAINT "FK_02344a753a18524e91dbfa9608d" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_client" ADD CONSTRAINT "FK_60e87421aa31c4ae73c93db3867" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "contract_properties"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract_client" DROP CONSTRAINT "FK_60e87421aa31c4ae73c93db3867"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract_client" DROP CONSTRAINT "FK_02344a753a18524e91dbfa9608d"`,
    );
    await queryRunner.query(`DROP TABLE "contract_client"`);
  }
}
