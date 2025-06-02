import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './Home.css';
import axios from 'axios'; 
import { useFetchMovies } from './useFetchMovie';
import Movie from '../../components/Movie/Movie';

function Home() {
  const {movieName,setMovieName,movies,setMovies} = useFetchMovies();
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
        Les 10 films tendance du moment: 
        <ul className="movies-list">
          {movies.map((movie) => (
            <li key={movie.id}>
              <Movie movie={movie} />
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default Home;


