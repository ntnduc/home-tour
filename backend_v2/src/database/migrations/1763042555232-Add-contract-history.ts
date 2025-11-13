import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContractHistory1763042555232 implements MigrationInterface {
    name = 'AddContractHistory1763042555232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contract_change_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" uuid NOT NULL, "changeType" character varying NOT NULL, "changeReason" character varying NOT NULL, "metadata" jsonb NOT NULL, "actorRole" character varying NOT NULL, CONSTRAINT "PK_e10fe7f824b875e9724f41d0430" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contract_change_detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "contractId" uuid NOT NULL, "changeLogId" uuid NOT NULL, "field" character varying NOT NULL, "oldValue" jsonb NOT NULL, "newValue" jsonb NOT NULL, CONSTRAINT "UQ_04f15ff0c06f9835c23ac5d7be4" UNIQUE ("contractId", "changeLogId"), CONSTRAINT "PK_ad0632a95fbe8aac9f0642240eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contract_change_log" ADD CONSTRAINT "FK_f0b29ef5179ac096fc1c96c8168" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_change_detail" ADD CONSTRAINT "FK_317e081bd3bec9d65ee9755ef90" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "contract_change_detail" ADD CONSTRAINT "FK_ca5ec1030f723778252928ef105" FOREIGN KEY ("changeLogId") REFERENCES "contract_change_log"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract_change_detail" DROP CONSTRAINT "FK_ca5ec1030f723778252928ef105"`);
        await queryRunner.query(`ALTER TABLE "contract_change_detail" DROP CONSTRAINT "FK_317e081bd3bec9d65ee9755ef90"`);
        await queryRunner.query(`ALTER TABLE "contract_change_log" DROP CONSTRAINT "FK_f0b29ef5179ac096fc1c96c8168"`);
        await queryRunner.query(`DROP TABLE "contract_change_detail"`);
        await queryRunner.query(`DROP TABLE "contract_change_log"`);
    }

}
