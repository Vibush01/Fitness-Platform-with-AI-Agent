import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GymDashboard = () => {
  const [stats, setStats] = useState({ members: 0, trainers: 0 });
  const [expiredMemberships, setExpiredMemberships] = useState([]);
  const [expiringMemberships, setExpiringMemberships] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const gymId = userRes.data.profile._id;

        const membersRes = await axios.get(`http://localhost:5000/api/gym/members/${gymId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const trainersRes = await axios.get(`http://localhost:5000/api/gym/trainers/${gymId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({
          members: membersRes.data.length,
          trainers: trainersRes.data.length,
        });

        // Fetch membership data
        const membershipsRes = await axios.get(`http://localhost:5000/api/gym/memberships/${gymId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const memberships = membershipsRes.data;

        const today = new Date();
        const fiveDaysFromNow = new Date(today);
        fiveDaysFromNow.setDate(today.getDate() + 5);

        const expired = memberships.filter(m => new Date(m.expiryDate) < today);
        const expiring = memberships.filter(
          m => new Date(m.expiryDate) >= today && new Date(m.expiryDate) <= fiveDaysFromNow
        );

        setExpiredMemberships(expired);
        setExpiringMemberships(expiring);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Gym Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">Number of Members</h3>
          <p className="text-2xl">{stats.members}</p>
        </div>
        <div className="p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">Number of Trainers</h3>
          <p className="text-2xl">{stats.trainers}</p>
        </div>
      </div>
      <h3 className="text-xl font-bold mb-4">Expired Memberships</h3>
      <div className="border rounded p-4 mb-8">
        {expiredMemberships.length === 0 ? (
          <p>No expired memberships.</p>
        ) : (
          <ul className="space-y-2">
            {expiredMemberships.map((membership) => (
              <li key={membership._id}>
                {membership.member.name} - Expired on {new Date(membership.expiryDate).toISOString().split('T')[0]}
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3 className="text-xl font-bold mb-4">Expiring Memberships (within 5 days)</h3>
      <div className="border rounded p-4">
        {expiringMemberships.length === 0 ? (
          <p>No memberships expiring soon.</p>
        ) : (
          <ul className="space-y-2">
            {expiringMemberships.map((membership) => (
              <li key={membership._id}>
                {membership.member.name} - Expires on {new Date(membership.expiryDate).toISOString().split('T')[0]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GymDashboard;