import React from 'react';
import './Movie.css';

function Movie({ movie }) {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  // Genre (affiche les ids ou les noms si disponibles)
  const genres = movie.genres
    ? movie.genres.map(g => g.name).join(', ')
    : (movie.genre_ids ? movie.genre_ids.join(', ') : 'Genre inconnu');

  // Début du synopsis
  const synopsis = movie.synopsis
    ? movie.synopsis
    : 'Pas de synopsis.';

  return (
    <div className="movie-card-flip">
      <div className="movie-card-inner">
        <div className="movie-card movie-card-front">
          <img src={imageUrl} alt={movie.title} className="movie-poster" />
          <div className="movie-info">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-date">Date de sortie : {movie.release_date}</p>
          </div>
        </div>
        <div className="movie-card movie-card-back">
          <div className="movie-info-back">
            <h4 className="movie-title">{movie.title}</h4>
            <p className="movie-synopsis">{synopsis}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Movie;
