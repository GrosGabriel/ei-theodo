import './Users.css';
import AddUserForm from '../../components/AddUserForm/AddUserForm';
import UsersTable from '../../components/UsersTable/UsersTable';
import { useFetchUsers } from './useFetchUsers';

function Users() {
  const { users, usersLoadingError, fetchUsers } = useFetchUsers();

  return (
    <div className="Users-container">
      <h1>This page manages the users</h1>
      <AddUserForm onSuccessfulUserCreation={fetchUsers} />
      <UsersTable users={users} onSuccessfulUserDeletion={fetchUsers} />
      {usersLoadingError !== null && (
        <div className="users-loading-error">{usersLoadingError}</div>
      )}
    </div>
  );
}

export default Users;
