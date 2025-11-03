import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1761474869078 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_chats" ADD CONSTRAINT "FK_96069fbdbdb77b59fbf424087c4" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_chats" ADD CONSTRAINT "FK_092d4a48311d681de32cf80fc0c" FOREIGN KEY ("members_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_chats" DROP CONSTRAINT "FK_092d4a48311d681de32cf80fc0c"`);
        await queryRunner.query(`ALTER TABLE "users_chats" DROP CONSTRAINT "FK_96069fbdbdb77b59fbf424087c4"`);
    }

}
