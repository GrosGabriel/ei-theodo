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

async function fillPearsonTest() {
  await appDataSource.initialize();
  const userRepo = appDataSource.getRepository(User);
  const noteRepo = appDataSource.getRepository(Note);
  const movieRepo = appDataSource.getRepository(Movie);

  // 1. Vide les notes et utilisateurs de test
  await noteRepo.clear();
  await userRepo
    .createQueryBuilder()
    .delete()
    .where("email LIKE :pattern", { pattern: "pearson_test_user%" })
    .execute();

  // 2. Sélectionne 15 films aléatoires
  const allMovies = await movieRepo.find();
  const sharedMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, 15);

  // 3. Crée 5 utilisateurs qui likent les mêmes 15 films
  let groupUserIds = [];
  for (let i = 1; i <= 5; i++) {
    const email = `pearson_test_user${i}@ex.com`;
    let user = await userRepo.findOneBy({ email });
    if (!user) {
      user = userRepo.create({ email, firstname: `Pearson${i}`, lastname: "Test" });
      user = await userRepo.save(user);
    }
    groupUserIds.push(user.id);

    for (const movie of sharedMovies) {
      await noteRepo.save(noteRepo.create({
        userid: user.id,
        filmid: movie.id,
        note: 5,
      }));
    }
  }

  // 4. Crée un utilisateur test qui like 10 de ces 15 films
  const testEmail = "pearson_test_user_main@ex.com";
  let testUser = await userRepo.findOneBy({ email: testEmail });
  if (!testUser) {
    testUser = userRepo.create({ email: testEmail, firstname: "PearsonMain", lastname: "Test" });
    testUser = await userRepo.save(testUser);
  }
  const testMovies = sharedMovies.slice(0, 10);
  for (const movie of testMovies) {
    await noteRepo.save(noteRepo.create({
      userid: testUser.id,
      filmid: movie.id,
      note: 5,
    }));
  }

  console.log('Pearson test data inserted!');
  process.exit(0);
}

fillPearsonTest();