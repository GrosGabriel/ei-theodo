import typeorm from 'typeorm';

const Note = new typeorm.EntitySchema({
  name: 'Note',
  columns: {
    userid: {
      primary: true,
      type: Number,
      nullable: false,
    },
    filmid: {
      primary: true,
      type: String,
      nullable: false,
    },
    note: {
      type: Number,
      nullable: false,
    },
  },
});

export default Note;
