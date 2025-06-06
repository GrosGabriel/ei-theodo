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
  const [movieRating, setMovieRating] = useState("NN");
  useEffect(() => {
    fetchUserNote();},[]);
  
  async function fetchUserNote() {
    const email = localStorage.getItem('savedEmail');
    if (!email) return;
    const userId = await getUserIdByEmail(email);
    if (!userId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/notes/search?userid=${userId}&filmid=${id}`);
      if (res.data && res.data.notes[0].note !== undefined) {
        setMovieRating(res.data.notes[0].note);
      }
    } catch (e) {
      setMovieRating("NN"); // ou null si tu préfères
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

  
  async function deleteNote() {
    const email = localStorage.getItem('savedEmail');
    if (!email) return;
    const userId = await getUserIdByEmail(email);
    if (!userId) return;
    await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/notes/search?userid=${userId}&filmid=${id}`);
    setMovieRating("NN");
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

  const [showSimilar, setShowSimilar] = useState(false);
const [similarMovies, setSimilarMovies] = useState([]);
const [loadingSimilar, setLoadingSimilar] = useState(false);
const [errorSimilar, setErrorSimilar] = useState(null);

useEffect(() => {
  if (!showSimilar) return;
  setLoadingSimilar(true);
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/movies/${id}/similar`)
    .then((res) => {
      setSimilarMovies(res.data);
      setErrorSimilar(null);
    })
    .catch((err) => {
      setErrorSimilar("Erreur lors du chargement des films similaires.");
      setSimilarMovies([]);
    })
    .finally(() => setLoadingSimilar(false));
}, [showSimilar, id]);

  async function fetchSimilarMovies() {
    setLoadingSimilar(true);
    setErrorSimilar(null);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/movies/recommandation_content/${id}`);
      setSimilarMovies(res.data);
    } catch (e) {
      setErrorSimilar("Erreur lors du chargement des films similaires.");
    }
    setLoadingSimilar(false);
  }

  if (!movie) return <div className="movie-details-container">Chargement...</div>;

return (
  <div className="movie-details-container">
    <h2 className="movie-details-title">{movie.title}</h2>
    {/* Si tu as un champ "poster" ou "affiche", adapte ici */}
    <img
      className="movie-details-poster"
      src={
        movie.poster_path
          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
          : 'https://via.placeholder.com/300x450?text=No+Image'
      }
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
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            className={`like_button${Number(movieRating) >= n ? " selected" : ""}`}
            onClick={() => {
              if (Number(movieRating) === n) {
                // Si on clique sur l'étoile déjà sélectionnée, on supprime la note
                deleteNote();
              } else {
                setMovieRating(n);
                saveNote(n);
              }
            }}
            title={`${n} étoile${n > 1 ? "s" : ""}`}
            type="button"
          >
            <span style={{filter: Number(movieRating) >= n ? "none" : "grayscale(1) brightness(0.7)"}}>
              ⭐
            </span>
          </button>
        ))}
      </div>
      Note attribuée {movieRating}/5
      <button
  className="similar-movies-btn"
  onClick={() => {
    if (!showSimilar) fetchSimilarMovies();
    setShowSimilar((v) => !v);
  }}
  style={{ marginTop: 16, marginBottom: 8 }}
>
  {showSimilar ? "Masquer les films similaires" : "Films similaires"}
</button>

{showSimilar && (
  <div className="similar-movies-list">
    {loadingSimilar && <div>Chargement...</div>}
    {errorSimilar && <div style={{ color: "red" }}>{errorSimilar}</div>}
    {!loadingSimilar && !errorSimilar && similarMovies.length === 0 && (
      <div>Aucun film similaire trouvé.</div>
    )}
    {!loadingSimilar && !errorSimilar && similarMovies.length > 0 && (
      <ul>
        {similarMovies.map((sim) => (
          <li key={sim.id}>
            <strong>{sim.title}</strong> {sim.release_date ? `(${sim.release_date})` : ""}
          </li>
        ))}
      </ul>
    )}
  </div>
)}
    </div>
  );
}

export default MovieDetails;