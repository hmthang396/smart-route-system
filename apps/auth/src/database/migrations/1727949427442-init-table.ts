import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTable1727949427442 implements MigrationInterface {
    name = 'InitTable1727949427442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_account_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TYPE "public"."user_account_status_enum" AS ENUM('active', 'inactive', 'suspended')`);
        await queryRunner.query(`CREATE TABLE "user_account" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(100) DEFAULT '', "last_name" character varying(100) DEFAULT '', "gender" "public"."user_account_gender_enum", "date_of_birth" TIMESTAMP, "phone_number" character varying(15), "avatar" character varying(255) DEFAULT 'avatar', "status" "public"."user_account_status_enum" NOT NULL DEFAULT 'inactive', CONSTRAINT "PK_6acfec7285fdf9f463462de3e9f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_login_data_email_status_enum" AS ENUM('pending', 'confirmed', 'failed')`);
        await queryRunner.query(`CREATE TABLE "user_login_data" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_account_id" bigint NOT NULL, "password_hash" character varying(250), "email" character varying(255), "email_status" "public"."user_login_data_email_status_enum" DEFAULT 'pending', "password_recovery_token" character varying(1024), "confirmation_token" character varying(1024), "is_two_factor_enabled" boolean DEFAULT false, "is_two_factor_verified" boolean DEFAULT false, "two_factor_secret" character varying(255), CONSTRAINT "REL_8ae14fa0a8f7632db2c6c19866" UNIQUE ("user_account_id"), CONSTRAINT "PK_39b8a51e24435c604e5134659dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_login_data" ADD CONSTRAINT "FK_8ae14fa0a8f7632db2c6c198666" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_login_data" DROP CONSTRAINT "FK_8ae14fa0a8f7632db2c6c198666"`);
        await queryRunner.query(`DROP TABLE "user_login_data"`);
        await queryRunner.query(`DROP TYPE "public"."user_login_data_email_status_enum"`);
        await queryRunner.query(`DROP TABLE "user_account"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_account_gender_enum"`);
    }

}
