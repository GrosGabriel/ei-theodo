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
      if (optionFiltrage === "Les mieux notés") {
        url = 'http://localhost:8000/movies/vote-average';
      } else if (optionFiltrage === "Date de sortie") {
        url = 'http://localhost:8000/movies/release-date';
      } else if (optionFiltrage === "Les plus populaires") {
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
          setOptionFiltrage("Les mieux notés");
          return; // <-- On arrête ici, donc le filtre repasse à "Les mieux notés"
        } else {
          url = `http://localhost:8000/movies/revoir/${userId}`;
        }
      } else if (optionFiltrage === "Basé sur vos gouts") {
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
          setOptionFiltrage("Les mieux notés");
          return; // <-- On arrête ici aussi
        } else {
          url = `http://localhost:8000/movies/recommandation_content_user/${userId}`;
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
          setOptionFiltrage("Les mieux notés");
          return; // <-- Empêche le fetch avec l'ancien filtre
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


