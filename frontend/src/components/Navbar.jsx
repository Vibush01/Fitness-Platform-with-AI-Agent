import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return (
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          BeFit
        </Link>
        <div>
          <Link to="/login" className="text-blue-600 hover:underline mr-4">
            Login
          </Link>
          <Link to="/signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </div>
      </nav>
    );
  }

  const { role, profile } = user;
  const isInGym = role === 'gym' || (role === 'trainer' && profile.gym) || (role === 'member' && profile.gym);

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        BeFit
      </Link>
      <div className="flex items-center space-x-4">
        {/* Common Links for All Roles */}
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
          Dashboard
        </Link>

        {/* Admin Links */}
        {role === 'admin' && (
          <>
            <Link to="/announcements" className="text-gray-700 hover:text-blue-600">
              Make Announcement
            </Link>
            <Link to="/join-requests" className="text-gray-700 hover:text-blue-600">
              Join Requests
            </Link>
            <Link to="/manage-memberships" className="text-gray-700 hover:text-blue-600">
              Manage Memberships
            </Link>
            <Link to="/manage-reviews" className="text-gray-700 hover:text-blue-600">
              Manage Reviews
            </Link>
          </>
        )}

        {/* Gym Links */}
        {role === 'gym' && (
          <>
            <Link to="/members" className="text-gray-700 hover:text-blue-600">
              No. of Members
            </Link>
            <Link to="/trainers" className="text-gray-700 hover:text-blue-600">
              No. of Trainers
            </Link>
            <Link to="/expired-memberships" className="text-gray-700 hover:text-blue-600">
              Expired Membership
            </Link>
            <Link to="/expiring-memberships" className="text-gray-700 hover:text-blue-600">
              Expiring Membership
            </Link>
          </>
        )}

        {/* Member Links */}
        {role === 'member' && (
          <>
            <div className="relative group">
              <span className="text-gray-700 hover:text-blue-600 cursor-pointer">
                Your Progress
              </span>
              <div className="absolute hidden group-hover:block bg-white shadow-md rounded mt-2">
                <Link to="/macro-track" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Macro Track
                </Link>
                <Link to="/progress-track" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Progress Track
                </Link>
              </div>
            </div>
            <Link to="/chat" className="text-gray-700 hover:text-blue-600">
              Chat
            </Link>
            {isInGym ? (
              <>
                <Link to="/my-gym" className="text-gray-700 hover:text-blue-600">
                  My Gym
                </Link>
                <Link to="/gym-profile" className="text-gray-700 hover:text-blue-600">
                  Gym Profile
                </Link>
                <Link to="/gym-announcements" className="text-gray-700 hover:text-blue-600">
                  Gym Announcement
                </Link>
                <Link to="/diet-workout" className="text-gray-700 hover:text-blue-600">
                  Diet & Workout
                </Link>
                <Link to="/book-schedule" className="text-gray-700 hover:text-blue-600">
                  Book a Schedule
                </Link>
                <Link to="/give-review" className="text-gray-700 hover:text-blue-600">
                  Give Review
                </Link>
              </>
            ) : (
              <Link to="/find-gym" className="text-gray-700 hover:text-blue-600">
                Find Gym
              </Link>
            )}
          </>
        )}

        {/* Trainer Links */}
        {role === 'trainer' && (
          <>
            {isInGym ? (
              <>
                <Link to="/my-gym" className="text-gray-700 hover:text-blue-600">
                  My Gym
                </Link>
                <Link to="/gym-profile" className="text-gray-700 hover:text-blue-600">
                  Gym Profile
                </Link>
                <Link to="/gym-announcements" className="text-gray-700 hover:text-blue-600">
                  Gym Announcement
                </Link>
                <Link to="/diet-workout" className="text-gray-700 hover:text-blue-600">
                  Diet & Workout
                </Link>
                <Link to="/book-schedule" className="text-gray-700 hover:text-blue-600">
                  Book a Schedule
                </Link>
                <Link to="/give-review" className="text-gray-700 hover:text-blue-600">
                  Give Review
                </Link>
              </>
            ) : (
              <Link to="/find-gym" className="text-gray-700 hover:text-blue-600">
                Find Gym
              </Link>
            )}
          </>
        )}

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-700 hover:text-blue-600 flex items-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                {role === 'gym' ? 'Update Gym Details' : 'Update Profile'}
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;