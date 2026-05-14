import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialCreate1778722429128 implements MigrationInterface {
    name = 'InitialCreate1778722429128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isActive\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isActive\``);
    }

}
