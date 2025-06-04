import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  

  async function getUserIdByEmail(email) {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/search?email=${email}`);
    if (res.data && res.data.users && res.data.users.length > 0) {
      return res.data.users[0].id;
    }
    return null;
  }
  const [movieRating, setMovieRating] = useState(0);
  
  async function fetchUserNote() {
    const email = localStorage.getItem('savedEmail');
    if (!email) return;
    const userId = await getUserIdByEmail(email);
    if (!userId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/${userId}/note?movie=${id}`);
      if (res.data && res.data.note !== undefined) {
        setMovieRating(res.data.note);
      }
    } catch (e) {
      setMovieRating(0); // ou null si tu préfères
    }
  }

  async function saveNote(rating) {
    const email = localStorage.getItem('savedEmail');
    if (!email) {
      alert("Vous devez être connecté pour noter un film.");
      return;
    }
    const userId = await getUserIdByEmail(email);
    if (!userId) {
      alert("Utilisateur non trouvé.");
      return;
    }
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/notes/new`, {
      userid: userId,
      filmid: id,
      note: rating
    });
    fetchUserNote();
  }

useEffect(() => {
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/movies/${id}`)
    .then((res) => setMovie(res.data))
    .catch(() => setMovie(null));
}, [id]);
  useEffect(() => {
    fetchUserNote();
    // eslint-disable-next-line
  }, [id]);

  

  if (!movie) return <div className="movie-details-container">Chargement...</div>;

return (
  <div className="movie-details-container">
    <h2 className="movie-details-title">{movie.title}</h2>
    {/* Si tu as un champ "poster" ou "affiche", adapte ici */}
    <img
      className="movie-details-poster"
      src={movie.poster_path || 'https://via.placeholder.com/300x450?text=No+Image'}
      alt={movie.title}
    />
    <p className="movie-details-info">
      <span className="movie-details-label">Année :</span> {movie.release_date}
    </p>
    <p className="movie-details-info">
      <span className="movie-details-label">Résumé :</span> {movie.synopsis}
    </p>
    <p className="movie-details-info">
      <span className="movie-details-label">Genre :</span> {movie.genre}
    </p>
      <div className='like-dislike'>
        {[0,1,2,3,4,5].map((n) => (
          <button
            key={n}
            className="like_button"
            onClick={() => { setMovieRating(n); saveNote(n); }}
          >
            {n}
          </button>
        ))}
      </div>
      Note attribuée {movieRating}/5
    </div>
  );
}

export default MovieDetails;