import { DataSource } from "typeorm";
import User from "../entities/user.js";
import Note from "../entities/note.js";
import Movie from "../entities/movie.js";

export const appDataSource = new DataSource({
  type: "sqlite",
  database: "../database.sqlite3", // <-- doit être une string
  entities: [User, Note, Movie],
  synchronize: false,
  logging: false,
});

async function fillUsersAndNotes() {
  await appDataSource.initialize();
  const userRepo = appDataSource.getRepository(User);
  const noteRepo = appDataSource.getRepository(Note);
  const movieRepo = appDataSource.getRepository(Movie);

  // 1. Création des utilisateurs (5 groupes de 5)
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Science Fiction'];
  let userIds = [];
  for (let group = 0; group < 5; group++) {
    for (let i = 1; i <= 5; i++) {
      const email = `user${group * 5 + i}@test.com`;
      const firstname = `User${group * 5 + i}`;
      const lastname = `Group${group + 1}`;
      // Vérifie si l'utilisateur existe déjà
      let user = await userRepo.findOneBy({ email });
      if (!user) {
        user = userRepo.create({ email, firstname, lastname });
        user = await userRepo.save(user); // <-- récupère l'id généré
      }
      userIds.push(user.id);
    }
  }

  // 2. Ajout des notes pour chaque groupe sur les films du même genre
  for (let group = 0; group < 5; group++) {
    const genre = genres[group];
    // On cherche les films dont le genre contient le mot clé (pour gérer les genres multiples)
    const movies = await movieRepo
      .createQueryBuilder("movie")
      .where("movie.genre LIKE :genre", { genre: `%${genre}%` })
      .getMany();
    for (let i = 0; i < 5; i++) {
      const userId = userIds[group * 5 + i];
      for (const movie of movies) {
        const note = noteRepo.create({
          userid: userId,
          filmid: movie.id,
          note: 5, // Like
        });
        await noteRepo.save(note);
      }
    }
  }

  console.log('Utilisateurs et notes insérés !');
  process.exit(0);
}

fillUsersAndNotes();