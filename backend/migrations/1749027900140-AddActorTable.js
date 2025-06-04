/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AddActorTable1749027900140 {
    name = 'AddActorTable1749027900140'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "actor" (
                "actorid" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "movieid" integer NOT NULL,
                "actor" varchar NOT NULL
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "actor"
        `);
    }
}
