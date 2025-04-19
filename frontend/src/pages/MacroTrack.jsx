import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MacroTrack = () => {
  const [formData, setFormData] = useState({
    food: '',
    macros: { calories: '', protein: '', carbs: '', fats: '' },
  });
  const [editId, setEditId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/macro/logs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(response.data);
      } catch (err) {
        setError('Failed to fetch macro logs');
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
          'http://localhost:5000/api/macro/edit',
          { logId: editId, food: formData.food, macros: formData.macros },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Macro log updated successfully');
        setEditId(null);
      } else {
        // Add new log
        await axios.post(
          'http://localhost:5000/api/macro/log',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSuccess('Macro log added successfully');
      }

      // Refresh logs
      const response = await axios.get('http://localhost:5000/api/macro/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(response.data);
      setFormData({ food: '', macros: { calories: '', protein: '', carbs: '', fats: '' } });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save macro log');
      setSuccess('');
    }
  };

  const handleEdit = (log) => {
    setEditId(log._id);
    setFormData({
      food: log.food,
      macros: { ...log.macros },
    });
  };

  const handleDelete = async (logId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:5000/api/macro/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { logId },
      });
      setLogs(logs.filter(log => log._id !== logId));
      setSuccess('Macro log deleted successfully');
      setError('');
    } catch (err) {
      setError('Failed to delete macro log');
      setSuccess('');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Macro Calculator</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Form to Log Macros */}
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block text-gray-700">Food</label>
          <input
            type="text"
            value={formData.food}
            onChange={(e) => setFormData({ ...formData, food: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700">Calories</label>
            <input
              type="number"
              value={formData.macros.calories}
              onChange={(e) => setFormData({ ...formData, macros: { ...formData.macros, calories: e.target.value } })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Protein (g)</label>
            <input
              type="number"
              value={formData.macros.protein}
              onChange={(e) => setFormData({ ...formData, macros: { ...formData.macros, protein: e.target.value } })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Carbs (g)</label>
            <input
              type="number"
              value={formData.macros.carbs}
              onChange={(e) => setFormData({ ...formData, macros: { ...formData.macros, carbs: e.target.value } })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Fats (g)</label>
            <input
              type="number"
              value={formData.macros.fats}
              onChange={(e) => setFormData({ ...formData, macros: { ...formData.macros, fats: e.target.value } })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {editId ? 'Update Log' : 'Add Log'}
        </button>
        {editId && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setFormData({ food: '', macros: { calories: '', protein: '', carbs: '', fats: '' } });
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List of Macro Logs */}
      <h3 className="text-xl font-bold mb-4">Your Macro Logs</h3>
      <div className="border rounded p-4">
        {logs.length === 0 ? (
          <p>No macro logs yet.</p>
        ) : (
          <ul className="space-y-4">
            {logs.map(log => (
              <li key={log._id} className="border-b pb-2 flex justify-between items-center">
                <div>
                  <p><strong>Food:</strong> {log.food}</p>
                  <p><strong>Calories:</strong> {log.macros.calories}</p>
                  <p><strong>Protein:</strong> {log.macros.protein}g</p>
                  <p><strong>Carbs:</strong> {log.macros.carbs}g</p>
                  <p><strong>Fats:</strong> {log.macros.fats}g</p>
                  <p><strong>Logged At:</strong> {new Date(log.loggedAt).toLocaleString()}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(log)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(log._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MacroTrack;