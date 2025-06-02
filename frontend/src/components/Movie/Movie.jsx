import axios from 'axios';
import './Movie.css';

function Movie({ movie }) {
  // L'API TMDb fournit seulement le "poster_path", il faut compléter l'URL :
  // Voir https://developer.themoviedb.org/docs/image-basics
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';

  return (
    <div className="movie-card">
      <img src={imageUrl} alt={movie.title} />
      <div>
        <h3>{movie.title}</h3>
        <p>Date de sortie : {movie.release_date}</p>
      </div>
    </div>
  );
}

export default Movie;