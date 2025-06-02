import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { useFetchMovies } from './useFetchMovie';
import Movie from '../../components/Movie/Movie';
import { useNavigate } from 'react-router-dom';
import centraleLogo from '../../../public/Ecole_Centrale_Supelec.svg' ; // Assurez-vous que le chemin d'importation est correct

function Home() {
  const [optionFiltrage, setOptionFiltrage] = useState("test");
  const { movieName, setMovieName, filteredMovies, setMovies } = useFetchMovies(optionFiltrage);
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
        <h1 className = 'page-title'> Filmographie</h1>
        <h2 className = 'page-subtitle'> Bienvenue sur la page d'accueil de l'application de gestion de filmographie</h2>
        <p>
          <input
            type="text"
            placeholder="Rechercher un film..."
            value={movieName}
            onChange={e => setMovieName(e.target.value)}
          />
          {/*{movieName}*/}
          <div className="dropdown-menu">
            <img src={centraleLogo} alt="CentraleSupélec" className="centrale-logo-spin" />
            <button className="dropdown-btn">Filtres</button>
            <div className="dropdown-content">
              <a href="#option2" onClick={()=>setOptionFiltrage("Option1")}>Option 1</a>
              <a href="#option2" onClick={()=>setOptionFiltrage("Option2")}>Option 2</a>
              <a href="#option3" onClick={()=>setOptionFiltrage("Option3")}>Option 3</a>
            </div>
          </div>
        </p>
        <div className="remarque-col">
        <span className="remarque">
          Recommandations classées par {optionFiltrage}
        </span>
        {optionFiltrage !== "Option1" && (
          <button
            className="close-btn"
            onClick={() => setOptionFiltrage("Option1")}
            title="Réinitialiser le filtre"
          >
            &times;
          </button>
          )}
        </div>

        <ul className={`movie-list${filteredMovies.length === 0 ? ' empty' : ''}`}>
          {filteredMovies.length === 0 ? (
            <li className="no-movie-message">
              Aucun film ne correspond à la recherche.
            </li>
          ) : (
            <>
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
            </>
          )}
        </ul>
      </header>
      
    </div>
  );
}

export default Home;
