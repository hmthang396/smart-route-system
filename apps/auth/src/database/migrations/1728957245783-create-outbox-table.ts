import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOutboxTable1728957245783 implements MigrationInterface {
    name = 'CreateOutboxTable1728957245783'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."outbox_status_enum" AS ENUM('pending', 'sent', 'failed')`);
        await queryRunner.query(`CREATE TABLE "outbox" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "outbox_id" BIGSERIAL NOT NULL, "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "event_type" character varying(255), "payload" jsonb NOT NULL, "status" "public"."outbox_status_enum" NOT NULL DEFAULT 'pending', "sent_at" TIMESTAMP, "retry_count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_911f98cca5fb393a4096f6549d7" PRIMARY KEY ("outbox_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "outbox"`);
        await queryRunner.query(`DROP TYPE "public"."outbox_status_enum"`);
    }

}
