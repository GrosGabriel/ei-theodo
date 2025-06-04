import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios'; // Assurez-vous d'importer axios

export function useFetchMovies(optionFiltrage) {
  const [movieName, setMovieName] = useState('');
  const [movies, setMovies] = useState([]);

  // useEffect pour charger les films populaires au montage du composant
  useEffect(() => {
    console.log('Le composant Home a été monté !');

    
    
    let url = " "; 
    if (optionFiltrage === "Vote Average") 
      url = 'http://localhost:8000/movies/vote-average';
    else if (optionFiltrage === "Release Date") 
      url = 'http://localhost:8000/movies/release-date';
    else 
      url = 'http://localhost:8000/movies/popularity'; 
    
    
    
    
    axios
      .get(url)
      .then((response) => {
        
        setMovies(response.data.movies);
      })
      .catch((error) => {
        console.log('Erreur API:', error);
      });
  }, [optionFiltrage]); // [] = exécuter une seule fois au montage
  return { movieName,setMovieName, filteredMovies: movies.filter(movie=>movie.title.toLowerCase().includes(movieName.toLowerCase())), setMovies };
}


