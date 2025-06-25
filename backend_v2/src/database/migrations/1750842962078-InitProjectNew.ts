import { MigrationInterface, QueryRunner } from "typeorm";

export class InitProjectNew1750842962078 implements MigrationInterface {
    name = 'InitProjectNew1750842962078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."services_calculationmethod_enum" AS ENUM('FIXED_PER_ROOM', 'FIXED_PER_PERSON', 'PER_UNIT_SIMPLE', 'PER_UNIT_TIERED', 'FREE')`);
        await queryRunner.query(`CREATE TABLE "services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "calculationMethod" "public"."services_calculationmethod_enum" NOT NULL DEFAULT 'FIXED_PER_ROOM', "defaultUnitName" character varying, CONSTRAINT "PK_ba2d347a3168a296416c6c5ccb2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."service_calculation_method" AS ENUM('FIXED_PER_ROOM', 'FIXED_PER_PERSON', 'PER_UNIT_SIMPLE', 'PER_UNIT_TIERED', 'FREE')`);
        await queryRunner.query(`CREATE TABLE "properties_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "propertyId" uuid NOT NULL, "serviceId" uuid NOT NULL, "calculationMethod" "public"."service_calculation_method" NOT NULL DEFAULT 'FREE', CONSTRAINT "PK_da93b575cac01608eb60cb20f9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "properties" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "ownerId" uuid NOT NULL, "name" character varying NOT NULL, "address" character varying NOT NULL, "provinceCode" character varying, "districtCode" character varying, "wardCode" character varying, "latitude" integer, "longitude" integer, "defaultRoomRent" integer DEFAULT '0', "paymentDate" integer NOT NULL DEFAULT '5', CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phone" character varying NOT NULL, "email" character varying, "fullName" character varying NOT NULL, "isPhoneVerified" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "test" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdBy" character varying, "updatedBy" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_5417af0062cf987495b611b59c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "administrative_units" ("id" SERIAL NOT NULL, "full_name" character varying NOT NULL, "full_name_en" character varying NOT NULL, "short_name" character varying NOT NULL, "code_name" character varying NOT NULL, "short_name_en" character varying NOT NULL, "code_name_en" character varying NOT NULL, CONSTRAINT "PK_97f662b9b848ae0982347d7d1d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "administrative_regions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "name_en" character varying NOT NULL, "code_name" character varying NOT NULL, "code_name_en" character varying NOT NULL, CONSTRAINT "PK_2330489d3f8ed65f29d0739ead9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "provinces" ("code" character varying(20) NOT NULL, "name" character varying(255) NOT NULL, "name_en" character varying(255) NOT NULL, "full_name" character varying(255) NOT NULL, "full_name_en" character varying(255) NOT NULL, "code_name" character varying(255) NOT NULL, "administrative_unit_id" integer, "administrative_region_id" integer, CONSTRAINT "PK_f4b684af62d5cb3aa174f6b9b8a" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "districts" ("code" character varying NOT NULL, "name" character varying NOT NULL, "name_en" character varying, "full_name" character varying, "full_name_en" character varying, "code_name" character varying, "province_code" character varying, "administrative_unit_id" integer, CONSTRAINT "PK_8e9d73424149b43b38244f75528" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "wards" ("code" character varying NOT NULL, "name" character varying NOT NULL, "name_en" character varying, "full_name" character varying, "full_name_en" character varying, "code_name" character varying, "district_code" character varying, "administrative_unit_id" integer, CONSTRAINT "PK_24f16d2207b1dcb6ce07d81d20f" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TABLE "token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "isRevoked" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "phoneNumber" character varying NOT NULL, "code" character varying NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "properties_services" ADD CONSTRAINT "FK_669c90afa4f2991eabc410a0215" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties_services" ADD CONSTRAINT "FK_1505fe0c81a9e9ee516facb0634" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "properties" ADD CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provinces" ADD CONSTRAINT "FK_f084cd63fc4e1c065093899a3d6" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "provinces" ADD CONSTRAINT "FK_d1c497fbc928c872810463e17e9" FOREIGN KEY ("administrative_region_id") REFERENCES "administrative_regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_602ba4e7409009b9082f9de6a9e" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "districts" ADD CONSTRAINT "FK_7f4b31875273010908d39850284" FOREIGN KEY ("province_code") REFERENCES "provinces"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wards" ADD CONSTRAINT "FK_d0554b203856eaf330539026f49" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wards" ADD CONSTRAINT "FK_6614cfc610b3ae870f2467d9798" FOREIGN KEY ("district_code") REFERENCES "districts"("code") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "wards" DROP CONSTRAINT "FK_6614cfc610b3ae870f2467d9798"`);
        await queryRunner.query(`ALTER TABLE "wards" DROP CONSTRAINT "FK_d0554b203856eaf330539026f49"`);
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_7f4b31875273010908d39850284"`);
        await queryRunner.query(`ALTER TABLE "districts" DROP CONSTRAINT "FK_602ba4e7409009b9082f9de6a9e"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP CONSTRAINT "FK_d1c497fbc928c872810463e17e9"`);
        await queryRunner.query(`ALTER TABLE "provinces" DROP CONSTRAINT "FK_f084cd63fc4e1c065093899a3d6"`);
        await queryRunner.query(`ALTER TABLE "properties" DROP CONSTRAINT "FK_47b8bfd9c3165b8a53cd0c58df0"`);
        await queryRunner.query(`ALTER TABLE "properties_services" DROP CONSTRAINT "FK_1505fe0c81a9e9ee516facb0634"`);
        await queryRunner.query(`ALTER TABLE "properties_services" DROP CONSTRAINT "FK_669c90afa4f2991eabc410a0215"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TABLE "token"`);
        await queryRunner.query(`DROP TABLE "wards"`);
        await queryRunner.query(`DROP TABLE "districts"`);
        await queryRunner.query(`DROP TABLE "provinces"`);
        await queryRunner.query(`DROP TABLE "administrative_regions"`);
        await queryRunner.query(`DROP TABLE "administrative_units"`);
        await queryRunner.query(`DROP TABLE "test"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "properties"`);
        await queryRunner.query(`DROP TABLE "properties_services"`);
        await queryRunner.query(`DROP TYPE "public"."service_calculation_method"`);
        await queryRunner.query(`DROP TABLE "services"`);
        await queryRunner.query(`DROP TYPE "public"."services_calculationmethod_enum"`);
    }

}
