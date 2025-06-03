import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchMovieRating(User) {
  const [user, setUser] = useState([]);
  const [usersLoadingError, setUsersLoadingError] = useState(null);

  const fetchUsers = () => {
    setUsersLoadingError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/users`)
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        setUsersLoadingError('An error occured while fetching users.');
        console.error(error);
      });
  };

  // fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, usersLoadingError, fetchUsers };
}
