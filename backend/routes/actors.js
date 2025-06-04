import express from 'express';
import { appDataSource } from '../datasource.js';
import Actor from '../entities/actor.js';


const router = express.Router();

router.get('/', function (req, res) {
  appDataSource
    .getRepository(Actor)
    .find()
    .then(function (actors) {
      res.json({ actors });
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while fetching actors' });
    });
});