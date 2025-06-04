import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    title: {
      type: String,
      nullable: false,
    },
    director: { type: String, nullable: true },
    genre: { type: String,nullable: true },
    synopsis: { type: String, nullable: true },
    popularity: { type: Number, nullable: true },
    release_date: { type: String, nullable: true },
    vote_average: { type: Number, nullable: true },
    poster_path: { type: String, nullable: true },
  },
  //les genre, le title (en la bonne langue en-US) , popularity, release_date, vote_average,poster_path
});

export default Movie;
