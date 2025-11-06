import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1761473843212 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_082f93507aad6ee05e92abf211" ON "user_friends" ("usersId_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_7f9fb03bbbea6bfad789729ead" ON "user_friends" ("usersId_2") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_7f9fb03bbbea6bfad789729ead"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_082f93507aad6ee05e92abf211"`);
    }

}
