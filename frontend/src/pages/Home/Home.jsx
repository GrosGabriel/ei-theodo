import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { useFetchMovies } from './useFetchMovie';
import Movie from '../../components/Movie/Movie';
import { useNavigate } from 'react-router-dom';
import centraleLogo from '../../../public/Ecole_Centrale_Supelec.svg' ; // Assurez-vous que le chemin d'importation est correct

function Home() {
  const [optionFiltrage, setOptionFiltrage] = useState("Option 1");
  const { movieName, setMovieName, filteredMovies, setMovies } = useFetchMovies(optionFiltrage);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [savedEmail, setSavedEmail] = useState('');
  const [messageco, setmessageco] = useState('');
  

  // Nombre de colonnes dans la grille
  const columns = 5;
  // Calcul du nombre de placeholders à ajouter pour compléter la dernière ligne
  const placeholders =
    filteredMovies.length > 0
      ? (columns - (filteredMovies.length % columns)) % columns
      : 0;
    // 1. Charger l'email sauvegardé au montage du composant
  useEffect(() => {
    const emailFromStorage = localStorage.getItem('savedEmail');
    if (emailFromStorage) {
      setSavedEmail(emailFromStorage);
      setmessageco("Vous êtes connecté.e en tant que ");
    }
  }, []);

  return (
    <div className="App">
      
   
      <header className="App-header">
        <h1 className = 'page-title'> A la recherche de votre prochain coup de coeur ?</h1>
        
              <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher un film..."
            className="search-input"
            value={movieName}
            onChange={e => setMovieName(e.target.value)}
          />
          <div className="dropdown-menu">
            <button className="dropdown-btn">
              Filtres
              <span className="dropdown-arrow" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="#888" style={{display: 'block'}}>
                  <path d="M5 8l5 5 5-5" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round"/>
                </svg>
              </span>
            </button>
            <div className="dropdown-content">
              <a href="#option2" onClick={()=>setOptionFiltrage("Option1")}>Option 1</a>
              <a href="#option2" onClick={()=>setOptionFiltrage("Option2")}>Option 2</a>
              <a href="#option3" onClick={()=>setOptionFiltrage("Option3")}>Option 3</a>
            </div>
          </div>
       
       
        </div>

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
        <div className="connection">
  <input
    type="text"
    placeholder="Entrer votre email"
    className="email-input"
    value={email}
    onChange={e => setEmail(e.target.value)}
  />
  <button
    className="validate-btn"
    onClick={() => {
      setSavedEmail(email); // stocke l'email dans le state
              localStorage.setItem('savedEmail', email); // stocke dans le localStorage
              setEmail('');
              setmessageco("Vous êtes connecté.e en tant que ");     // vide l'input
    }}
  >
  
    Valider
  </button>
  
</div>
       <div className='message-co'>
    {messageco}   {savedEmail} </div> 

       
      </header>
<div className="body-container">
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
        </div>
        <div className='bas-page'>
      <footer>
        <div className='logo-noms'>
          <div className='logo'>
        <img src={centraleLogo} alt="Ecole_Centrale_Supelec.svp" className="centrale-logo" />
      </div>
        <div className='noms'>
        CentraleSupélec, ST4 EI no.3 : <br></br>
        <a href="https://www.linkedin.com/in/gabrielgroslink" target="_blank">Gabriel Gros</a><br></br>
       <a href="https://www.linkedin.com/in/ga%C3%ABtan-lechoux-7a4748333/" target="_blank">Gaetan Lechoux</a> <br></br>
       <a href="https://www.linkedin.com/in/romain-foucaud" target="_blank">Romain Foucaud</a> <br></br>
        </div>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default Home;
