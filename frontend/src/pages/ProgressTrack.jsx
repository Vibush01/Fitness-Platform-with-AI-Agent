import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProgressTrack = () => {
  const [formData, setFormData] = useState({
    weight: '',
    muscleMass: '',
    fatPercentage: '',
    images: [],
  });
  const [editId, setEditId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/body-progress/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(response.data);
      } catch (err) {
        setError('Failed to fetch body progress logs');
      }
    };
    fetchLogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editId) {
        // Edit existing log
        await axios.put(
          'http://localhost:5000/api/body-progress/edit',
          { logId: editId, ...formData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Body progress updated successfully');
        setEditId(null);
      } else {
        // Add new log
        await axios.post(
          'http://localhost:5000/api/body-progress/log',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Body progress logged successfully');
      }

      // Refresh logs
      const response = await axios.get('http://localhost:5000/api/body-progress/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(response.data);
      setFormData({ weight: '', muscleMass: '', fatPercentage: '', images: [] });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log body progress');
      setSuccess('');
    }
  };

  const handleEdit = (log) => {
    setEditId(log._id);
    setFormData({
      weight: log.weight,
      muscleMass: log.muscleMass,
      fatPercentage: log.fatPercentage,
      images: log.images,
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Body Progress Tracker</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Form to Log Body Progress */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">Weight (kg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Muscle Mass (kg)</label>
            <input
              type="number"
              value={formData.muscleMass}
              onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Fat Percentage (%)</label>
            <input
              type="number"
              value={formData.fatPercentage}
              onChange={(e) => setFormData({ ...formData, fatPercentage: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-gray-700">Images (URLs, comma-separated)</label>
          <input
            type="text"
            value={formData.images.join(',')}
            onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',') })}
            className="w-full p-2 border rounded"
            placeholder="http://example.com/image.jpg,http://example.com/image2.jpg"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editId ? 'Update Progress' : 'Log Progress'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ weight: '', muscleMass: '', fatPercentage: '', images: [] });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List of Body Progress Logs */}
      <h3 className="text-xl font-bold mb-4">Your Body Progress Logs</h3>
      <div className="border rounded p-4">
        {logs.length === 0 ? (
          <p>No body progress logs yet.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map(log => (
              <li key={log._id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p><strong>Weight:</strong> {log.weight}kg</p>
                  <p><strong>Muscle Mass:</strong> {log.muscleMass}kg</p>
                  <p><strong>Fat Percentage:</strong> {log.fatPercentage}%</p>
                  {log.images.length > 0 && (
                    <p><strong>Images:</strong> {log.images.join(', ')}</p>
                  )}
                  <p><strong>Logged At:</strong> {new Date(log.loggedAt).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleEdit(log)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProgressTrack;