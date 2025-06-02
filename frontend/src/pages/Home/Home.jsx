import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { useFetchMovies } from './useFetchMovie';
import Movie from '../../components/Movie/Movie';
import { useNavigate } from 'react-router-dom'; // <-- Ajout

function Home() {
  const {movieName,setMovieName, movies,setMovies } = useFetchMovies();
  const navigate = useNavigate(); // <-- Ajout

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
          {movies.map((movie) => (
            <li
              key={movie.id}
              onClick={() => navigate(`/movie/${movie.id}`)} // <-- Navigue vers la page de détails
              style={{ cursor: "pointer" }}
            >
              <Movie movie={movie} />
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default Home;
