import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1761474861651 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friends" ADD CONSTRAINT "FK_082f93507aad6ee05e92abf2116" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_friends" ADD CONSTRAINT "FK_7f9fb03bbbea6bfad789729ead3" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_friends" DROP CONSTRAINT "FK_7f9fb03bbbea6bfad789729ead3"`);
        await queryRunner.query(`ALTER TABLE "user_friends" DROP CONSTRAINT "FK_082f93507aad6ee05e92abf2116"`);
    }

}
