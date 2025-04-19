import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/contact/submit', formData);
      setFormSuccess('Your message has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      setFormError('');
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to send message');
      setFormSuccess('');
    }
  };

  return (
    <div className="p-8">
      {/* Company Details */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to BeFit</h1>
        <p className="text-lg mb-6">
          BeFit is your one-stop platform for gym management, fitness tracking, and personalized workout and diet plans.
        </p>
      </section>

      {/* Benefits */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-6">Benefits of Joining BeFit</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">For Gym Owners</h3>
            <p>Manage your gym, trainers, and members efficiently with our comprehensive tools.</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">For Trainers</h3>
            <p>Connect with members, provide workout and diet plans, and grow your client base.</p>
          </div>
          <div className="p-4 border rounded shadow">
            <h3 className="text-xl font-semibold mb-2">For Members</h3>
            <p>Track your progress, get personalized plans, and join gyms easily.</p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-6">Key Features</h2>
        <ul className="list-disc list-inside max-w-2xl mx-auto">
          <li>Macro Calculator to track your daily nutrition.</li>
          <li>Body Progress tracking with metrics and images.</li>
          <li>Chat system to communicate with trainers and Vibush, our AI assistant.</li>
          <li>Announcements from gym owners to keep members informed.</li>
          <li>Workout and Diet Plans tailored to your needs.</li>
          <li>Easy gym joining system for members and trainers.</li>
        </ul>
      </section>

      {/* Contact Form */}
      <section className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Contact Us</h2>
        {formError && <p className="text-red-500 mb-4">{formError}</p>}
        {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full p-2 border rounded"
              rows="4"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Send Message
          </button>
        </form>
      </section>

      {/* CTA */}
      <section className="text-center mt-12">
        <div className="space-x-4">
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Login
          </Link>
          <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Signup
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;