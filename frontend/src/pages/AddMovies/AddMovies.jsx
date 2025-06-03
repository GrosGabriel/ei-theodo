import './AddMovies.css';
import AddMovieForm from '../../components/AddMovieForm/AddUserForm/AddMovieForm.jsx';
import MoviesTable from '../../components/MoviesTable/MoviesTable.jsx';
import { useFetchMovies } from './useFetchMovies';

function Movies() {
  const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();

  return (
    <div className="Movies-container">
      <h1>This page displays the movies</h1>
      <AddMovieForm onSuccessfulMovieCreation={fetchMovies} />
      <MoviesTable movies={movies} onSuccessfulMovieDeletion={fetchMovies} />
      {moviesLoadingError !== null && (
        <div className="movies-loading-error">{moviesLoadingError}</div>
      )}
    </div>
  );
}

export default Movies;
