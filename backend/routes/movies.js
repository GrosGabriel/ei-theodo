import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movie.js';

const router = express.Router();

// router.get('/', function (req, res) {
//   console.log('GET /movies called');
//   res.json([]);
// });

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({})
    .then(function (movies) {
      res.json({ movies: movies });
    });
});


router.get('/search', function (req, res) {
  const where = {};
  if (req.query.id) where.id = req.query.id;
  if (req.query.title) where.title = req.query.title;
  if (req.query.director) where.director = req.query.director;
  if (req.query.year) where.year = req.query.year;
  if (req.query.genre) where.genre = req.query.genre;

  // Nettoyage : supprimer les clés undefined
  Object.keys(where).forEach(key => {
    if (where[key] === undefined) {
      delete where[key];
    }
  });
  console.log('where =', where);
  appDataSource
    .getRepository(Movie)
    .find({ where })
    .then(function (movies) {
      res.json({ movies });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while searching for movies' });
    });
});

//Route to get all movies sorted by popularity
router.get('/popularity', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({
      order: {
        popularity: 'DESC',
      },
    })
    .then(function (movies) {
      res.json({ movies });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching popular movies' });
    });
});
//Route to get all movies sorted by release date
router.get('/release-date', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({
      order: {
        release_date: 'DESC',
      },
    })
    .then(function (movies) {
      res.json({ movies });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching popular movies' });
    });
});
//Route to get all movies sorted by vote average
router.get('/vote-average', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .find({
      order: {
        vote_average: 'DESC',
      },
    })
    .then(function (movies) {
      res.json({ movies });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching popular movies' });
    });
});
//ATTENTION A GARDER /SEARCH AVANT /:MOVIEID


router.get('/:movieId', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .findOneBy({ id: Number(req.params.movieId) })
    .then(function (movie) {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ message: 'Movie not found' });
      }
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching the movie' });
    });
});





router.post('/new', function (req, res) {
  console.log(req.body);
  // res.json(req.body);
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    year: req.body.year === '' ? null : req.body.year, // Handle empty string as null
    synopsis: req.body.synopsis === '' ? null : req.body.synopsis, // Handle empty string as null
    director: req.body.director === '' ? null : req.body.director, // Handle empty string as null
    genre: req.body.genre === '' ? null : req.body.genre, // Handle empty string as null

  });
  movieRepository.insert(newMovie)
    .then(function(savedMovie) {
      res.status(201).json({
        message: 'Movie successfully created',
        // id: savedMovie.identifiers[0].id, // Assuming the ID is returned in the identifiers array
      });
    })

});

router.delete('/:movieId', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.movieId })
    .then(function () {
      res.status(200).json({ message: 'Movie successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the movie' });
    });
});

export default router;
