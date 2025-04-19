import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import GymDashboard from './pages/GymDashboard';
import TrainerDashboard from './pages/TrainerDashboard';
import MemberDashboard from './pages/MemberDashboard';
import NotFound from './pages/NotFound';
import MacroTrack from './pages/MacroTrack';
import ProgressTrack from './pages/ProgressTrack';
import Chat from './pages/Chat';
import FindGym from './pages/FindGym';
import MyGym from './pages/MyGym';
import GymProfile from './pages/GymProfile';
import GymAnnouncements from './pages/GymAnnouncements';
import DietWorkout from './pages/DietWorkout';
import BookSchedule from './pages/BookSchedule';
import GiveReview from './pages/GiveReview';
import Profile from './pages/Profile';
import Members from './pages/Members';
import Trainers from './pages/Trainers';
import ExpiredMemberships from './pages/ExpiredMemberships';
import ExpiringMemberships from './pages/ExpiringMemberships';
import ManageAnnouncements from './pages/ManageAnnouncements';
import JoinRequests from './pages/JoinRequests';
import ManageMemberships from './pages/ManageMemberships';
import ManageReviews from './pages/ManageReviews';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/gym-dashboard" element={<GymDashboard />} />
          <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />
          <Route path="/macro-track" element={<MacroTrack />} />
          <Route path="/progress-track" element={<ProgressTrack />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/find-gym" element={<FindGym />} />
          <Route path="/my-gym" element={<MyGym />} />
          <Route path="/gym-profile" element={<GymProfile />} />
          <Route path="/gym-announcements" element={<GymAnnouncements />} />
          <Route path="/diet-workout" element={<DietWorkout />} />
          <Route path="/book-schedule" element={<BookSchedule />} />
          <Route path="/give-review" element={<GiveReview />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/members" element={<Members />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/expired-memberships" element={<ExpiredMemberships />} />
          <Route path="/expiring-memberships" element={<ExpiringMemberships />} />
          <Route path="/announcements" element={<ManageAnnouncements />} />
          <Route path="/join-requests" element={<JoinRequests />} />
          <Route path="/manage-memberships" element={<ManageMemberships />} />
          <Route path="/manage-reviews" element={<ManageReviews />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;