import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1761473828266 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_friends" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_283fae77b32d5f391bf4ae740bc" PRIMARY KEY ("usersId_1", "usersId_2"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_friends"`);
    }

}
