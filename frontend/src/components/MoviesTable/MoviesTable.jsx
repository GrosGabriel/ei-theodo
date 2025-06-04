import axios from 'axios';
import './MoviesTable.css';

function MoviesTable({ movies, filters, onSuccessfulMovieDeletion }) {
  const deleteMovie = (movieId) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/movies/${movieId}`)
      .then(() => onSuccessfulMovieDeletion());
  };

  // Filtrage des films selon les filtres reçus
  const filteredMovies = movies.filter((movie) => {
    return (
      (!filters.title || !movie.title || movie.title.toLowerCase().includes(filters.title.toLowerCase())) &&
      (!filters.year || !movie.year || String(movie.year).includes(filters.year)) &&
      (!filters.director || !movie.director || movie.director.toLowerCase().includes(filters.director.toLowerCase())) &&
      (!filters.genre || !movie.genre || movie.genre.toLowerCase().includes(filters.genre.toLowerCase())) &&
      (!filters.synopsis || !movie.synopsis || movie.synopsis.toLowerCase().includes(filters.synopsis.toLowerCase()))
    );
  });

  return (
    <div>
      <table className="movies-table">
        <thead>
          <tr>
            <th>Title</th>
            <th className="release-date">Release Date</th>
            <th>Director</th>
            <th>Genre</th>
            <th>Synopsis</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMovies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.title}</td>
              <td className="release-date">{movie.release_date}</td>
              <td>{movie.director}</td>
              <td>{movie.genre}</td>
              <td>{movie.synopsis}</td>
              <td>
                <button onClick={() => deleteMovie(movie.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MoviesTable;
