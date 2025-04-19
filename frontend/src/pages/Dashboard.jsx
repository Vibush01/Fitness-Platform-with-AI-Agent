import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        const { role } = response.data.user;
        if (role === 'admin') navigate('/admin-dashboard');
        else if (role === 'gym') navigate('/gym-dashboard');
        else if (role === 'trainer') navigate('/trainer-dashboard');
        else if (role === 'member') navigate('/member-dashboard');
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p>Welcome, {user.profile.name}!</p>
    </div>
  );
};

export default Dashboard;