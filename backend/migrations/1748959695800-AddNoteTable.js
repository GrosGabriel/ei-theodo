/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AddNoteTable1748959695800 {
    name = 'AddNoteTable1748959695800'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "note" (
                "userid" integer NOT NULL,
                "filmid" varchar NOT NULL,
                "note" integer NOT NULL,
                PRIMARY KEY ("userid", "filmid")
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "note"
        `);
    }
}
