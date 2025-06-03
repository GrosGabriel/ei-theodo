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
router.post('/new', async function (req, res) {
  const noteRepository = appDataSource.getRepository(Note);
  const { userid, filmid, note } = req.body;

  try {
    // Vérifie si une note existe déjà pour cet utilisateur et ce film
    let existing = await noteRepository.findOneBy({ userid, filmid });
    if (existing) {
      // Met à jour la note existante
      existing.note = note;
      await noteRepository.save(existing);
      return res.status(200).json({ message: 'Note updated', note: existing });
    } else {
      // Crée une nouvelle note
      const newNote = noteRepository.create({ userid, filmid, note });
      await noteRepository.save(newNote);
      return res.status(201).json({ message: 'Note created', note: newNote });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error while saving note', error: err });
  }
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
