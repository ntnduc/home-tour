import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageCollectionIdRoom1775973436672 implements MigrationInterface {
    name = 'AddImageCollectionIdRoom1775973436672'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD "imageCollectionId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "imageCollectionId"`);
    }

}
