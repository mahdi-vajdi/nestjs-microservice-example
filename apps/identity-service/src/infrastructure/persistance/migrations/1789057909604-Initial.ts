import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1789057909604 implements MigrationInterface {
    name = 'Initial1789057909604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "identity"`);
        await queryRunner.query(`CREATE TABLE "identity"."outbox" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "aggregateId" uuid NOT NULL, "type" character varying NOT NULL, "payload" jsonb NOT NULL, "published" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_340ab539f309f03bdaa14aa7649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON TABLE "identity"."outbox" IS 'Saved the events that are published to the event bus.'`);
        await queryRunner.query(`CREATE TYPE "identity"."users_role_enum" AS ENUM('CUSTOMER', 'ADMIN', 'SUPPORT')`);
        await queryRunner.query(`CREATE TABLE "identity"."users" ("id" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password_hash" character varying NOT NULL, "role" "identity"."users_role_enum" NOT NULL DEFAULT 'CUSTOMER', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "users_email_uniq" ON "identity"."users"  ("email") `);
        await queryRunner.query(`COMMENT ON TABLE "identity"."users" IS 'The users table.'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON TABLE "identity"."users" IS NULL`);
        await queryRunner.query(`DROP INDEX "identity"."users_email_uniq"`);
        await queryRunner.query(`DROP TABLE "identity"."users"`);
        await queryRunner.query(`DROP TYPE "identity"."users_role_enum"`);
        await queryRunner.query(`COMMENT ON TABLE "identity"."outbox" IS NULL`);
        await queryRunner.query(`DROP TABLE "identity"."outbox"`);
    }

}
