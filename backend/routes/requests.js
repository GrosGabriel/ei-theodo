import express from 'express';
import sqlite3 from 'sqlite3'; 

const app = express();
const db = new sqlite3.Database(':memory:'); // In-memory database for simplicity

app.get('/movies/popularity', (req, res) => {
  db.all('SELECT * FROM users ORDER BY popularity', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});
app.get('/movies/year', (req, res) => {
  db.all('SELECT * FROM users ORDER BY year', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});



