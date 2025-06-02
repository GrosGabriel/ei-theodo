import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios'; // Assurez-vous d'importer axios

export function useFetchMovies(optionFiltrage) {
  const [movieName, setMovieName] = useState('');
  const [movies, setMovies] = useState([]);

  // useEffect pour charger les films populaires au montage du composant
  useEffect(() => {
    console.log('Le composant Home a été monté !');

    let url = '';
    if (optionFiltrage === "Option1") {
      url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    } else if (optionFiltrage === "Option2") {
      url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
    } else if (optionFiltrage === "Option3") {
      url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
    } else {
      url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
    }

    axios
      .get(url, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
          accept: 'application/json',
        },
      })
      .then((response) => {
        console.log('Réponse API:', response.data);
        setMovies(response.data.results.slice(0,10));
      })
      .catch((error) => {
        console.log('Erreur API:', error);
      });
  }, [optionFiltrage]); // [] = exécuter une seule fois au montage
  return { movieName,setMovieName, filteredMovies: movies.filter(movie=>movie.title.toLowerCase().includes(movieName.toLowerCase())) ,setMovies };
}