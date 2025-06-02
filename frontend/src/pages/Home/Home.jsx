import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './Home.css';
import axios from 'axios'; 
import { useFetchMovies } from './useFetchMovie';
import Movie from '../../components/Movie/Movie';
import  { useNavigate } from 'react-router-dom';

function Home() {
  const {movieName, setMovieName, filteredMovies, setMovies} = useFetchMovies();
  const navigate = useNavigate();
  
  
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
        <ul className={`movies-list${filteredMovies.length === 0 ? ' empty' : ''}`}>
          {filteredMovies.length === 0 ? (
            <li className="no-movie-message">
              Aucun film ne correspond à la recherche.
            </li>
          ) : (
            filteredMovies.map((movie) => (
              <li
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <Movie movie={movie} />
              </li>
            ))
          )}
        </ul>
        <div className="arrows-container">
          <button className="arrow arrow-left" aria-label="Précédent">
            &#8592;
          </button>
          <button className="arrow arrow-right" aria-label="Suivant">
            &#8594;
          </button>
        </div>
      </header>
    </div>
  );
}

export default Home;


