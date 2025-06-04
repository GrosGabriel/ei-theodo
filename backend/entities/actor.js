import typeorm from 'typeorm';

const Actor = new typeorm.EntitySchema({
  name: 'Actor',
  columns: {
    actorid: {
      primary: true,
      type: Number,
      nullable: false,
    },
    movieid: {
      primary: true,
      type: Number,
      nullable: false,
    },
    actor: {
      type: String,
      nullable: false,
    },
  },
});

export default Actor;
