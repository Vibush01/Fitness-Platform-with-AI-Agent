import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberDashboard = () => {
  const [gym, setGym] = useState(null);
  const [macroLogs, setMacroLogs] = useState([]);
  const [bodyProgress, setBodyProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userRes = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const member = userRes.data.profile;

        if (member.gym) {
          const gymRes = await axios.get(`http://localhost:5000/api/user/gyms/${member.gym}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setGym(gymRes.data);
        }

        // Fetch today's macro logs
        const macroRes = await axios.get('http://localhost:5000/api/macro/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const today = new Date().toISOString().split('T')[0];
        const todayMacros = macroRes.data.filter(log => new Date(log.loggedAt).toISOString().split('T')[0] === today);
        setMacroLogs(todayMacros);

        // Fetch today's body progress
        const progressRes = await axios.get('http://localhost:5000/api/body-progress/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const todayProgress = progressRes.data.filter(log => new Date(log.loggedAt).toISOString().split('T')[0] === today);
        setBodyProgress(todayProgress);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Member Dashboard</h2>
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Current Gym</h3>
        {gym ? (
          <p>{gym.name} - {gym.address}</p>
        ) : (
          <p>Not associated with a gym. <a href="/find-gym" className="text-blue-600 hover:underline">Find a gym</a>.</p>
        )}
      </div>
      <h3 className="text-xl font-bold mb-4">Today's Macro Logs</h3>
      <div className="border rounded p-4 mb-8">
        {macroLogs.length === 0 ? (
          <p>No macro logs for today. <a href="/macro-track" className="text-blue-600 hover:underline">Log now</a>.</p>
        ) : (
          <ul className="space-y-2">
            {macroLogs.map(log => (
              <li key={log._id} className="border-b pb-2">
                <p><strong>Food:</strong> {log.food}</p>
                <p><strong>Calories:</strong> {log.macros.calories}</p>
                <p><strong>Protein:</strong> {log.macros.protein}g</p>
                <p><strong>Carbs:</strong> {log.macros.carbs}g</p>
                <p><strong>Fats:</strong> {log.macros.fats}g</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3 className="text-xl font-bold mb-4">Today's Body Progress</h3>
      <div className="border rounded p-4">
        {bodyProgress.length === 0 ? (
          <p>No body progress logs for today. <a href="/progress-track" className="text-blue-600 hover:underline">Log now</a>.</p>
        ) : (
          <ul className="space-y-2">
            {bodyProgress.map(log => (
              <li key={log._id} className="border-b pb-2">
                <p><strong>Weight:</strong> {log.weight}kg</p>
                <p><strong>Muscle Mass:</strong> {log.muscleMass}kg</p>
                <p><strong>Fat Percentage:</strong> {log.fatPercentage}%</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;