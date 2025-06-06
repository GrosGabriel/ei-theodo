import { DataSource } from "typeorm";
import User from "../entities/user.js";
import Note from "../entities/note.js";
import Movie from "../entities/movie.js";

export const appDataSource = new DataSource({
  type: "sqlite",
  database: "../database.sqlite3",
  entities: [User, Note, Movie],
  synchronize: false,
  logging: false,
});

async function fillUsersAndNotes() {
  await appDataSource.initialize();
  const userRepo = appDataSource.getRepository(User);
  const noteRepo = appDataSource.getRepository(Note);
  const movieRepo = appDataSource.getRepository(Movie);

  // Supprime les notes des utilisateurs test (ceux créés dans ce script)
  const testUserEmails = [];
  for (let group = 0; group < 5; group++) {
    for (let i = 1; i <= 5; i++) {
      testUserEmails.push(`user${group * 5 + i}@test.com`);
    }
  }
  // Récupère les utilisateurs test par email
  const testUsers = await userRepo
    .createQueryBuilder("user")
    .where("user.email IN (:...emails)", { emails: testUserEmails })
    .getMany();
  const testUserIds = testUsers.map(u => u.id);

  // Supprime les notes de ces utilisateurs
  if (testUserIds.length > 0) {
    await noteRepo
      .createQueryBuilder()
      .delete()
      .where("userid IN (:...ids)", { ids: testUserIds })
      .execute();
  }

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

  // 2. Ajout des notes à 5 pour le genre préféré (jusqu'à 10 films différents par utilisateur)
  for (let group = 0; group < 5; group++) {
    const genre = genres[group];
    const movies = await movieRepo
      .createQueryBuilder("movie")
      .where("movie.genre LIKE :genre", { genre: `%${genre}%` })
      .getMany();

    // Mélange les films pour la répartition
    const shuffled = movies.sort(() => 0.5 - Math.random());

    for (let i = 0; i < 5; i++) {
      const userId = userIds[group * 5 + i];
      // Sélectionne jusqu'à 10 films pour chaque utilisateur, en prenant des tranches différentes
      const userMovies = shuffled.slice(i * 10, (i + 1) * 10);
      // Si pas assez de films, certains auront moins de 10 films, c'est OK
      for (const movie of userMovies) {
        const note = noteRepo.create({
          userid: userId,
          filmid: movie.id,
          note: 5,
        });
        const existing = await noteRepo.findOneBy({ userid: userId, filmid: movie.id });
        if (!existing) {
          await noteRepo.save(note);
        }
      }
    }
  }

  // 3. Ajout des notes à 0 pour un autre genre (genre suivant dans la liste, circulaire)
  for (let group = 0; group < 5; group++) {
    const zeroGenre = genres[(group + 1) % genres.length];
    const movies = await movieRepo
      .createQueryBuilder("movie")
      .where("movie.genre LIKE :genre", { genre: `%${zeroGenre}%` })
      .getMany();

    // Mélange les films pour la répartition
    const shuffled = movies.sort(() => 0.5 - Math.random());

    for (let i = 0; i < 5; i++) {
      const userId = userIds[group * 5 + i];
      // Sélectionne jusqu'à 10 films pour chaque utilisateur, en prenant des tranches différentes
      const userMovies = shuffled.slice(i * 10, (i + 1) * 10);
      // Si pas assez de films, certains auront moins de 10 films, c'est OK
      for (const movie of userMovies) {
        const note = noteRepo.create({
          userid: userId,
          filmid: movie.id,
          note: 0, // Dislike
        });
        const existing = await noteRepo.findOneBy({ userid: userId, filmid: movie.id });
        if (!existing) {
          await noteRepo.save(note);
        }
      }
    }
  }

  console.log('Utilisateurs et notes insérés (notes 5 et 0) !');
  process.exit(0);
}

fillUsersAndNotes();