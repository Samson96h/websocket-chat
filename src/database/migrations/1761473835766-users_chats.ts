import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1761473835766 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users_chats" ("chat_id" integer NOT NULL, "members_id" integer NOT NULL, CONSTRAINT "PK_458a976a5337ea1ed94f6d066f4" PRIMARY KEY ("chat_id", "members_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users_chats"`);
    }

}
