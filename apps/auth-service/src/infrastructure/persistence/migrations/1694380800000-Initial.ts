import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1694380800000 implements MigrationInterface {
  name = 'Initial1694380800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "auth"`);
    
    await queryRunner.query(`
      CREATE TABLE "auth"."user_credentials" (
        "user_id" uuid NOT NULL,
        "email" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "role" character varying NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_auth_user_credentials_email" UNIQUE ("email"),
        CONSTRAINT "PK_auth_user_credentials" PRIMARY KEY ("user_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "auth"."outbox" (
        "id" uuid NOT NULL,
        "type" character varying NOT NULL,
        "aggregateId" uuid NOT NULL,
        "payload" jsonb NOT NULL,
        "published" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_auth_outbox" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auth"."outbox"`);
    await queryRunner.query(`DROP TABLE "auth"."user_credentials"`);
    await queryRunner.query(`DROP SCHEMA "auth"`);
  }
}
