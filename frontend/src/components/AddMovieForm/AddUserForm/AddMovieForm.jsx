import { useState } from 'react';
import axios from 'axios';
import './AddMovieForm.css';

function AddMovieForm({ onSuccessfulMovieCreation, filters, setFilters }) {
  const [movieCreationError, setMovieCreationError] = useState(null);
  const [movieCreationSuccess, setMovieCreationSuccess] = useState(null);

  const displayCreationSuccessMessage = () => {
    setMovieCreationSuccess('New movie created successfully');
    setTimeout(() => {
      setMovieCreationSuccess(null);
    }, 3000);
  };

  const saveMovie = (event) => {
    // This avoid default page reload behavior on form submit
    event.preventDefault();
    setMovieCreationError(null);

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/movies/new`, filters)
      .then(() => {
        displayCreationSuccessMessage();
        setFilters({
          title: '',
          year: '',
          synopsis: '',
          director: '',
          genre: '',
        });
        onSuccessfulMovieCreation();
      })
      .catch((error) => {
        setMovieCreationError('An error occured while creating new movie.');
        console.error(error);
      });
  };

  return (
    <div>
      <form className="add-movie-form" onSubmit={saveMovie}>
        <input
          className="add-movie-input"
          required
          placeholder="Title"
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <input
          className="add-movie-input"
          placeholder="Year"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        />
        <input
          className="add-movie-input"
          placeholder="Director"
          value={filters.director}
          onChange={(e) => setFilters({ ...filters, director: e.target.value })}
        />
        <input
          className="add-movie-input"
          placeholder="Genre"
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
        />
        <input
          className="add-movie-input"
          placeholder="Synopsis"
          value={filters.synopsis}
          onChange={(e) => setFilters({ ...filters, synopsis: e.target.value })}
        />
        <button className="add-movie-button" type="submit">
          Add movie
        </button>
      </form>
      {movieCreationSuccess !== null && (
        <div className="movie-creation-success">{movieCreationSuccess}</div>
      )}
      {movieCreationError !== null && (
        <div className="movie-creation-error">{movieCreationError}</div>
      )}
    </div>
  );
}

export default AddMovieForm;
