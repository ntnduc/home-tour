import { MigrationInterface, QueryRunner } from "typeorm";

export class PropertyDefaultRoomRent1749480639328 implements MigrationInterface {
    name = 'PropertyDefaultRoomRent1749480639328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "defaultRoomRent" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "defaultRoomRent" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "defaultRoomRent" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "properties" ALTER COLUMN "defaultRoomRent" SET NOT NULL`);
    }

}
