import express from 'express';
import { appDataSource } from '../datasource.js';
import Note from '../entities/note.js';

const router = express.Router();

// GET toutes les notes
router.get('/', function (req, res) {
  appDataSource
    .getRepository(Note)
    .find()
    .then(function (notes) {
      res.json({ notes });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching notes' });
    });
});

// GET notes par userId ou movieId (optionnel)
router.get('/search', function (req, res) {
  const where = {};
  if (req.query.userId) where.userId = req.query.userId;
  if (req.query.movieId) where.movieId = req.query.movieId;

  appDataSource
    .getRepository(Note)
    .find({ where })
    .then(function (notes) {
      res.json({ notes });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while searching for notes' });
    });
});

// GET une note précise (par id)
router.get('/:noteId', function (req, res) {
  appDataSource
    .getRepository(Note)
    .findOneBy({ id: Number(req.params.noteId) })
    .then(function (note) {
      if (note) {
        res.json(note);
      } else {
        res.status(404).json({ message: 'Note not found' });
      }
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching the note' });
    });
});

// POST nouvelle note
router.post('/new', function (req, res) {
  const noteRepository = appDataSource.getRepository(Note);
  const newNote = noteRepository.create({
    userId: req.body.userId,
    movieId: req.body.movieId,
    note: req.body.note,
  });
  noteRepository.insert(newNote)
    .then(function(savedNote) {
      res.status(201).json({
        message: 'Note successfully created',
        id: savedNote.identifiers[0].id,
      });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while creating the note' });
    });
});

// DELETE une note
router.delete('/:noteId', function (req, res) {
  appDataSource
    .getRepository(Note)
    .delete({ id: req.params.noteId })
    .then(function () {
      res.status(200).json({ message: 'Note successfully deleted' });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the note' });
    });
});

export default router;
