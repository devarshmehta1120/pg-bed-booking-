import  { useEffect, useState } from "react";
import { getAllUsers } from "../../services/admin/userService";

const Users = () => {

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {

      const res = await getAllUsers();
      setUsers(res.data || []);

    } catch (error) {

      console.error(error);
      alert(error.message);

    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-page">

      <h1>Users</h1>

      <table>

        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
};

export default Users;