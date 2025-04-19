import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to BeFit</h1>
      <p className="text-lg mb-6">
        Your one-stop platform for gym management, fitness tracking, and more!
      </p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Login
        </Link>
        <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Home;