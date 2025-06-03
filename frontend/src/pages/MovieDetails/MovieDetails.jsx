import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [movieRating, setMovieRating] = useState(0);
  
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
     <button  className="like_button" onClick={()=>setMovieRating(0)}>
        0
            
      </button>
      <button className="like_button" onClick={()=>setMovieRating(1)}>
        1
            
      </button>
      <button className="like_button" onClick={()=>setMovieRating(2)}>
        2
            
      </button>
      <button className="like_button" onClick={()=>setMovieRating(3)}>
        3
            
      </button>
      <button className="like_button" onClick={()=>setMovieRating(4)}>
        4
            
      </button>
      <button className="like_button" onClick={()=>setMovieRating(5)}>
        5
            
      </button>
     
      </div>
       Note attribuée {movieRating}/5
      </div>
  );
}

export default MovieDetails;