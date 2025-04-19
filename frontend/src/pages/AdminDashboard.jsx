import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ gyms: 0, users: 0, trainers: 0, members: 0 });
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch total users
        const usersRes = await axios.get('http://localhost:5000/api/user/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const users = usersRes.data;

        // Calculate stats
        const gyms = users.filter(user => user.role === 'gym').length;
        const trainers = users.filter(user => user.role === 'trainer').length;
        const members = users.filter(user => user.role === 'member').length;

        setStats({ gyms, users: users.length, trainers, members });

        // Fetch contact submissions
        const submissionsRes = await axios.get('http://localhost:5000/api/contact/submissions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(submissionsRes.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">Total Gyms</h3>
          <p className="text-2xl">{stats.gyms}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">Total Users</h3>
          <p className="text-2xl">{stats.users}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">Total Trainers</h3>
          <p className="text-2xl">{stats.trainers}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">Total Members</h3>
          <p className="text-2xl">{stats.members}</p>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">Contact Form Submissions</h3>
      <div className="border rounded p-4">
        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <ul className="space-y-4">
            {submissions.map(submission => (
              <li key={submission._id} className="border-b pb-2">
                <p><strong>Name:</strong> {submission.name}</p>
                <p><strong>Email:</strong> {submission.email}</p>
                <p><strong>Message:</strong> {submission.message}</p>
                <p><strong>Submitted At:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;