import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainerDashboard = () => {
  const [gym, setGym] = useState(null);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const trainer = userRes.data.profile;

        if (trainer.gym) {
          const gymRes = await axios.get(`http://localhost:5000/api/user/gyms/${trainer.gym}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setGym(gymRes.data);
        }

        // Fetch training schedules (simulated for now)
        const simulatedSchedules = [
          { member: 'John Doe', date: '2025-04-20', plan: 'Strength Training' },
          { member: 'Jane Smith', date: '2025-04-21', plan: 'Cardio Session' },
        ];
        setSchedules(simulatedSchedules);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Trainer Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Current Gym</h3>
        {gym ? (
          <p>{gym.name} - {gym.address}</p>
        ) : (
          <p>Not associated with a gym. <a href="/find-gym" className="text-blue-600 hover:underline">Find a gym</a>.</p>
        )}
      </div>
      <h3 className="text-xl font-bold mb-4">Member Training Schedules</h3>
      <div className="border rounded p-4">
        {schedules.length === 0 ? (
          <p>No schedules available.</p>
        ) : (
          <ul className="space-y-2">
            {schedules.map((schedule, index) => (
              <li key={index} className="border-b pb-2">
                <p><strong>Member:</strong> {schedule.member}</p>
                <p><strong>Date:</strong> {schedule.date}</p>
                <p><strong>Plan:</strong> {schedule.plan}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TrainerDashboard;