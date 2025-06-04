/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AddActorTable1749026272086 {
    name = 'AddActorTable1749026272086'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "actor" (
                "actorid" integer NOT NULL,
                "movieid" integer NOT NULL,
                "actor" varchar NOT NULL,
                PRIMARY KEY ("actorid", "movieid")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "actor"
        `);
    }
}
