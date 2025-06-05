import { useState } from 'react';
import './AddMovies.css';
import AddMovieForm from '../../components/AddMovieForm/AddUserForm/AddMovieForm.jsx';
import MoviesTable from '../../components/MoviesTable/MoviesTable.jsx';
import { useFetchMovies } from './useFetchMovies';

function Movies() {
  const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();

  // Ajoute un état pour les filtres
  const [filters, setFilters] = useState({
    title: '',
    release_date: '',
    director: '',
    genre: '',
    synopsis: '',
  });

  return (
    <div className="Movies-container">
      <h1>This page manages the movies</h1>
      <AddMovieForm
        onSuccessfulMovieCreation={fetchMovies}
        filters={filters}
        setFilters={setFilters}
      />
      <MoviesTable
        movies={movies}
        filters={filters}
        onSuccessfulMovieDeletion={fetchMovies}
      />
      {moviesLoadingError !== null && (
        <div className="movies-loading-error">{moviesLoadingError}</div>
      )}
    </div>
  );
}

export default Movies;
