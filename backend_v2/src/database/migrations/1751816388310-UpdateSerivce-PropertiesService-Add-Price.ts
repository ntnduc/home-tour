import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSerivcePropertiesServiceAddPrice1751816388310 implements MigrationInterface {
    name = 'UpdateSerivcePropertiesServiceAddPrice1751816388310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services" ADD "price" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "properties_services" ADD "price" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "properties_services" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "services" DROP COLUMN "price"`);
    }

}
