import React, { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios'; 

export function useFetchMovies(optionFiltrage,setOptionFiltrage,savedEmail) {
  const [movieName, setMovieName] = useState('');
  const [movies, setMovies] = useState([]);


  useEffect(() => {     
    async function fetchMovies() {
      console.log({})
      let url = "";
      if (optionFiltrage === "vote-average") {
        url = 'http://localhost:8000/movies/vote-average';
      } else if (optionFiltrage === "release-date") {
        url = 'http://localhost:8000/movies/release-date';
      } else if (optionFiltrage === "popularity") {
        url = 'http://localhost:8000/movies/popularity';
      } else if (optionFiltrage === "revoir") {
        async function getUserIdByEmail(email) {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/search?email=${email}`);
          if (res.data && res.data.users && res.data.users.length > 0) {
            return res.data.users[0].id;
          }
          return null;
        }
        const userId = await getUserIdByEmail(savedEmail);
        if (!userId) {
          console.error("Utilisateur non trouvé.");
          setOptionFiltrage("popularity");
          url = 'http://localhost:8000/movies/popularity';
        } else {
          url = `http://localhost:8000/movies/revoir/${userId}`;
        }
      } else {

        async function getUserIdByEmail(email) {
          const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/search?email=${email}`);
          if (res.data && res.data.users && res.data.users.length > 0) {
            return res.data.users[0].id;
          }
          return null;
        }
        const userId = await getUserIdByEmail(savedEmail);
        if (!userId) {
          console.error("Utilisateur non trouvé.");
          setOptionFiltrage("popularity");
          url = 'http://localhost:8000/movies/popularity';
        } else {
          url = `http://localhost:8000/movies/recommandation/${userId}`;
        }
      }

      try {
        const response = await axios.get(url);
        setMovies(response.data.movies);
      } catch (error) {
        console.log('Erreur API:', error);
      }
    }

    fetchMovies();
  }, [optionFiltrage, savedEmail]);

  return { movieName,setMovieName, filteredMovies: movies.filter(movie=>movie.title.toLowerCase().includes(movieName.toLowerCase())), setMovies };
}


