import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios'; // Assurez-vous d'importer axios

export function useFetchMovies() {
  const [movieName, setMovieName] = useState('');
  const [movies, setMovies] = useState([]);

  // useEffect pour charger les films populaires au montage du composant
  useEffect(() => {
    console.log('Le composant Home a été monté !');
    axios
      .get('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
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
  }, []); // [] = exécuter une seule fois au montage
  return { movieName,setMovieName, movies,setMovies, useEffect };
}