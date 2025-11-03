import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1761473850671 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_96069fbdbdb77b59fbf424087c" ON "users_chats" ("chat_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_092d4a48311d681de32cf80fc0" ON "users_chats" ("members_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_092d4a48311d681de32cf80fc0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_96069fbdbdb77b59fbf424087c"`);
    }

}
