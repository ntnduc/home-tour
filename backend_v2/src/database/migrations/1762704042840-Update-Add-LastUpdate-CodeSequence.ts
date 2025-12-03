import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAddLastUpdateCodeSequence1762704042840 implements MigrationInterface {
    name = 'UpdateAddLastUpdateCodeSequence1762704042840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_sequences" ADD "lastResetDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_sequences" DROP COLUMN "lastResetDate"`);
    }

}
