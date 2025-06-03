import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';

const router = express.Router();

router.get('/', function (req, res) {
  console.log('GET /movies called');
  res.json([]);
});
// router.get('/', function (req, res) {
//   appDataSource
//     .getRepository(Movie)
//     .find({})
//     .then(function (movies) {
//       res.json({ movies: movies });
//     });
// });

router.post('/new', function (req, res) {
  console.log(req.body);
  // res.json(req.body);
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    year: req.body.year,
    synopsis: req.body.synopsis,
    director: req.body.director,
    genre: req.body.genre,

  });
  movieRepository.insert(newMovie)
    .then(function(savedMovie) {
      res.status(201).json({
        message: 'Movie successfully created',
        // id: savedMovie.identifiers[0].id, // Assuming the ID is returned in the identifiers array
      });
    })
  // movieRepository
  //   .save(newMovie)
  //   .then(function (savedMovie) {
  //     res.status(201).json({
  //       message: 'Movie successfully created',
  //       id: savedMovie.id,
  //     });
  //   })
  //   .catch(function (error) {
  //     console.error(error);
  //     if (error.code === '23505') {
  //       res.status(400).json({
  //         message: `Movie with title "${newMovie.title}" already exists`,
  //       });
  //     } else {
  //       res.status(500).json({ message: 'Error while creating the movie' });
  //     }
  //   });
});

router.delete('/:movieId', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.movieId })
    .then(function () {
      res.status(204).json({ message: 'Movie successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the movie' });
    });
});

export default router;
