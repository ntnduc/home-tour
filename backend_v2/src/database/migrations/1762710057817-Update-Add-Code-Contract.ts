import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateAddCodeContract1762710057817 implements MigrationInterface {
  name = 'UpdateAddCodeContract1762710057817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD "code" character varying(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "UQ_2a55e1c83511e04d3b9ddfefb51" UNIQUE ("code")`,
    );
    await queryRunner.query(`DROP FUNCTION IF EXISTS gen_code_contract()`);
    await queryRunner.query(`
CREATE OR REPLACE FUNCTION gen_code_contract()
RETURNS trigger AS $$
BEGIN
  NEW.code := gen_code('CONTRACT', NEW."propertyId"::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gen_code_contract
BEFORE INSERT ON contracts
FOR EACH ROW
EXECUTE FUNCTION gen_code_contract();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "UQ_2a55e1c83511e04d3b9ddfefb51"`,
    );
    await queryRunner.query(`ALTER TABLE "contracts" DROP COLUMN "code"`);
  }
}
