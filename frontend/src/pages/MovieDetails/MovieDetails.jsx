import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [movieRating, setMovieRating] = useState(0);

  async function getUserIdByEmail(email) {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/search?email=${email}`);
    if (res.data && res.data.users && res.data.users.length > 0) {
      return res.data.users[0].id;
    }
    return null;
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
  }

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
          accept: 'application/json',
        },
      })
      .then((res) => setMovie(res.data));
  }, [id]);

  if (!movie) return <div className="movie-details-container">Chargement...</div>;

  return (
    <div className="movie-details-container">
      <h2 className="movie-details-title">{movie.title}</h2>
      <img
        className="movie-details-poster"
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
        alt={movie.title}
      />
      <p className="movie-details-info">
        <span className="movie-details-label">Date de sortie :</span> {movie.release_date}
      </p>
      <p className="movie-details-info">
        <span className="movie-details-label">Résumé :</span> {movie.overview}
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