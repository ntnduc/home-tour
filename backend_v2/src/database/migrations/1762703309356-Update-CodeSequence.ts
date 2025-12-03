import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCodeSequence1762703309356 implements MigrationInterface {
    name = 'UpdateCodeSequence1762703309356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_sequences" ADD "counter" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "code_sequences" DROP COLUMN "counter"`);
    }

}
