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
    year: { type: String, nullable: true },
    genre: { type: String,nullable: true },
    synopsis: { type: String, nullable: true },
  },
});

export default Movie;
