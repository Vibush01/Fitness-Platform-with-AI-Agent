import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [role, setRole] = useState('member');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [photos, setPhotos] = useState([]);
  const [ownerName, setOwnerName] = useState('');
  const [experience, setExperience] = useState({ years: 0, months: 0 });
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { email, password, role, name };
      if (role === 'gym') {
        payload.address = address;
        payload.photos = photos;
        payload.ownerName = ownerName;
      } else if (role === 'trainer') {
        payload.experience = experience;
      } else if (role === 'member') {
        payload.contact = contact;
      }

      const response = await axios.post('http://localhost:5000/api/auth/signup', payload);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="gym">Gym</option>
            <option value="trainer">Trainer</option>
            <option value="member">Member</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {role === 'gym' && (
          <>
            <div>
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Photos (URLs)</label>
              <input
                type="text"
                value={photos}
                onChange={(e) => setPhotos(e.target.value.split(','))}
                className="w-full p-2 border rounded"
                placeholder="Comma-separated URLs"
              />
            </div>
            <div>
              <label className="block text-gray-700">Owner Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}
        {role === 'trainer' && (
          <>
            <div>
              <label className="block text-gray-700">Experience (Years)</label>
              <input
                type="number"
                value={experience.years}
                onChange={(e) => setExperience({ ...experience, years: Number(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Experience (Months)</label>
              <input
                type="number"
                value={experience.months}
                onChange={(e) => setExperience({ ...experience, months: Number(e.target.value) })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        )}
        {role === 'member' && (
          <div>
            <label className="block text-gray-700">Contact</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;