import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

interface User {
  _id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const UserSearch: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('http://localhost:5000/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on searchTerm
  const filteredUsers = users.filter(user =>
    user.phone && user.phone.includes(searchTerm)
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold">User List</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Enter Phone Number"
      />
      {searchTerm && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredUsers.map((user) => (
            <li key={user._id} style={{ marginBottom: '1rem' , border: '1px solid #ccc', padding: '1rem', borderRadius: '0.5rem' }}>
              <div>
                <strong>ID:</strong> {user._id}
              </div>
              <div>
                <strong>First Name:</strong> {user.firstName}
              </div>
              <div>
                <strong>Last Name:</strong> {user.lastName}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Phone:</strong> {user.phone}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;



