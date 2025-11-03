import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1761474851664 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" ADD CONSTRAINT "FK_66ade84e03c8865d3ce0c677e66" FOREIGN KEY ("ownerIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_66ade84e03c8865d3ce0c677e66"`);
    }

}
