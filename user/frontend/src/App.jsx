import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AssetDirectory from './pages/AssetDirectory';
import TransferRequest from './pages/TransferRequest';
import BookingCalendar from './pages/BookingCalendar';
import MaintenanceForm from './pages/MaintenanceForm';
import Notifications from './pages/Notifications';

export default function App() {
  // Global auth state
  // TODO: Member 1 - Replace with Context API or Redux, check JWT token cookies
  const [currentUser, setCurrentUser] = useState(() => {
    const cachedUser = localStorage.getItem('ams_user');
    return cachedUser ? JSON.parse(cachedUser) : null;
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('ams_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ams_user');
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={
            currentUser ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />

        {/* Private Views (Wrapped in Navbar/Sidebar Layout) */}
        <Route 
          element={
            <Layout user={currentUser} onLogout={handleLogout} />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assets" element={<AssetDirectory />} />
          <Route path="/transfer" element={<TransferRequest />} />
          <Route path="/bookings" element={<BookingCalendar />} />
          <Route path="/maintenance" element={<MaintenanceForm />} />
          <Route path="/notifications" element={<Notifications />} />
        </Route>

        {/* Fallback Catch-all Route */}
        <Route 
          path="*" 
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}
