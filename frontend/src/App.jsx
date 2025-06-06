import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Users from './pages/Users/Users';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import AddMovies from './pages/AddMovies/AddMovies';


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="users" element={<Users />} />
        <Route path="about" element={<About />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/add-movies" element={<AddMovies />} />
        
      </Routes>
    </Layout>
  );
}

export default App;
