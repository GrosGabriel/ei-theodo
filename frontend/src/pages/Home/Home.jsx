import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { useFetchMovies } from './useFetchMovie';
import Movie from '../../components/Movie/Movie';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { movieName, setMovieName, filteredMovies, setMovies } = useFetchMovies();
  const navigate = useNavigate();

  // Nombre de colonnes dans la grille
  const columns = 5;
  // Calcul du nombre de placeholders à ajouter pour compléter la dernière ligne
  const placeholders =
    filteredMovies.length > 0
      ? (columns - (filteredMovies.length % columns)) % columns
      : 0;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Filmographie</h1>
        <h2>Bienvenue sur la page d'accueil de l'application de gestion de filmographie</h2>
        <p>
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={movieName}
            onChange={e => setMovieName(e.target.value)}
          />
          {movieName}
        </p>
        <ul className="movie-list">
          {filteredMovies.map((movie) => (
            <li
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Movie movie={movie} />
            </li>
          ))}
          {/* Ajoute des placeholders pour compléter la ligne */}
          {Array.from({ length: placeholders }).map((_, idx) => (
            <li key={`placeholder-${idx}`} className="movie-placeholder" />
          ))}
        </ul>
      </header>
    </div>
  );
}

export default Home;
