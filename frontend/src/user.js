import React, { useState, useEffect } from 'react';
import './App.css'; // Import the separate CSS

const ProfilePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
              const token = localStorage.getItem("token")

        const response = await fetch('https://user-tracking-1.onrender.com/api/auth/users',
          {
          headers: {
            "Authorization": `bearer${token}`,
          },
        }
        );
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : data.users || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching all users:", error);
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  if (loading) return <p className="loading-text">Loading registered users...</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Registered Database Users</h2>
      {users.length === 0 ? (
        <p className="no-users">No users found in database.</p>
      ) : (
        <div className="users-grid">
          {users.map((u, index) => (
            <div key={u._id || index} className="user-card">
              <p><strong>ID:</strong> {index + 1}</p>
              <p><strong>Username:</strong> {u.username}</p>
              <p><strong>Email:</strong> {u.email}</p>
              {u.createdAt && (
                <p><strong>Joined:</strong> {new Date(u.createdAt).toLocaleDateString()}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;