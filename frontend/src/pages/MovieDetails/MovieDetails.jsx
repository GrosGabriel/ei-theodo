import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/movie/${id}?language=fr-FR`, {
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
          accept: 'application/json',
        },
      })
      .then((res) => setMovie(res.data));
  }, [id]);

  if (!movie) return <div>Chargement...</div>;

  return (
    <div style={{background: "#222", color: "#ffd700", padding: "24px", borderRadius: "12px", margin: "32px auto", maxWidth: "600px"}}>
      <h2>{movie.title}</h2>
      <img
        src={movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
        alt={movie.title}
        style={{width: "200px", borderRadius: "8px", marginBottom: "16px"}}
      />
      <p><strong>Date de sortie :</strong> {movie.release_date}</p>
      <p><strong>Résumé :</strong> {movie.overview}</p>
    </div>
  );
}

export default MovieDetails;