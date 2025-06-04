/**
 * @typedef {import('typeorm').MigrationInterface} MigrationInterface
 */

/**
 * @class
 * @implements {MigrationInterface}
 */
export default class AddMovieTable1749022320640 {
    name = 'AddMovieTable1749022320640'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "movie" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "title" varchar NOT NULL,
                "director" varchar,
                "genre" varchar,
                "synopsis" varchar,
                "popularity" integer,
                "release_date" varchar,
                "vote_average" integer,
                "poster_path" varchar
            )
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE "movie"
        `);
    }
}
