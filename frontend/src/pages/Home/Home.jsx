import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios';
import { useFetchMovies } from './useFetchMovie';
import Movie from '../../components/Movie/Movie';
import { useNavigate } from 'react-router-dom';
import centraleLogo from '../../../public/Ecole_Centrale_Supelec.svg' ; 


function Home() {
  
  const [optionFiltrage, setOptionFiltrage] = useState("vote-average");
  const navigate = useNavigate();
  const [email, setEmail] = useState(''); //variable temporaire pour l'email 
  const [savedEmail, setSavedEmail] = useState(''); //variable qui stocke l'email quand valider est clique 
  const [messageco, setmessageco] = useState(''); //message qui s'affiche quand on clique sur valider

useEffect(() => {     
    const emailFromStorage = localStorage.getItem('savedEmail');
    if (emailFromStorage) {
      setSavedEmail(emailFromStorage);
      setmessageco("Vous êtes connecté.e en tant que ");
    }
  }, []);

  const { movieName, setMovieName, filteredMovies, setMovies } = useFetchMovies(optionFiltrage,setOptionFiltrage,savedEmail) ;
  const columns = 5;

  const placeholders =
    filteredMovies.length > 0
      ? (columns - (filteredMovies.length % columns)) % columns
      : 0;



//Optionn de filtrage en fonction de celle qu'on choisit sur me menu 

  function getFiltreLabel(optionFiltrage) {
    if (optionFiltrage === "vote-average") return "Vote Average";
    if (optionFiltrage === "release-date") return "Release Date";
    if (optionFiltrage === "popularity") return "Popularity";
    if (optionFiltrage === "recommandation") return "Recommandation";
    if (optionFiltrage === "revoir") return "Revoir";
    if (optionFiltrage === "Basé sur vos gouts") return "Basé sur vos gouts";
    return "Filtres";
  }

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
                {getFiltreLabel(optionFiltrage)}
                <span className="dropdown-arrow" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="#888" style={{display: 'block'}}>
                  <path d="M5 8l5 5 5-5" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
              </span>
              </button>
            <div className="dropdown-content">
              <a href="#vote-average" onClick={()=>setOptionFiltrage("vote-average")}>Vote Average</a>
              <a href="#release-date" onClick={()=>setOptionFiltrage("release-date")}>Release Date</a>
              <a href="#popularity" onClick={()=>setOptionFiltrage("popularity")}>Popularity</a>
              <a href="#recommandation" onClick={()=>setOptionFiltrage("recommandation")}>Recommandation</a>
              <a href="#Basé sur vos gouts" onClick={()=>setOptionFiltrage("Basé sur vos gouts")}>Basé sur vos gouts</a>
              <a href="#revoir" onClick={()=>setOptionFiltrage("revoir")}>Revoir</a>
            </div>
            </div>
          </div>
      <div className="remarque-col">
        <span className="remarque">
          Recommandations classées par {optionFiltrage}
        </span>
        {optionFiltrage !== "vote-average" && (
          <button
            className="close-btn"
            onClick={() => setOptionFiltrage("vote-average")}
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
    onClick={async () => {
     
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/search?email=${email}`);
        if (res.data && res.data.users && res.data.users.length > 0) {
          setSavedEmail(email);
          localStorage.setItem('savedEmail', email);
          setEmail('');
          setmessageco("Vous êtes connecté.e en tant que ");
        } else {
          setSavedEmail('');
          localStorage.removeItem('savedEmail');
          setmessageco("Cet email n'existe pas. Veuillez créer un compte.");
        }
      } catch (err) {
        setmessageco("Erreur lors de la vérification de l'email.");
      }
    }}
  >
    Valider
  </button>
  {savedEmail && (
    <button
      className="logout-btn"
      onClick={() => {
        setSavedEmail('');
        localStorage.removeItem('savedEmail');
        setmessageco('');
      }}
      style={{ marginLeft: 8 }}
    >
      Se déconnecter
    </button>
  )}
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
