import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import DonorDashboard from './pages/DonorDashboard';
import RecipientDashboard from './pages/RecipientDashboard';
import DonateFood from './pages/DonateFood';
import ExploreFood from './pages/ExploreFood';
import FoodDetails from './pages/FoodDetails';
import MyDonations from './pages/MyDonations';
import ClaimsReceived from './pages/ClaimsReceived';
import MyClaims from './pages/MyClaims';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-[#FAFAF7] text-[#24352B]">
          <Navbar />
          <div className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/explore" element={<ExploreFood />} />
              <Route path="/food/:id" element={<FoodDetails />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Donor-Only Protected Routes */}
              <Route
                path="/donor/dashboard"
                element={
                  <RoleRoute role="Donor">
                    <DonorDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/donate"
                element={
                  <RoleRoute role="Donor">
                    <DonateFood />
                  </RoleRoute>
                }
              />
              <Route
                path="/my-donations"
                element={
                  <RoleRoute role="Donor">
                    <MyDonations />
                  </RoleRoute>
                }
              />
              <Route
                path="/donor/claims"
                element={
                  <RoleRoute role="Donor">
                    <ClaimsReceived />
                  </RoleRoute>
                }
              />

              {/* Recipient-Only Protected Routes */}
              <Route
                path="/recipient/dashboard"
                element={
                  <RoleRoute role="Recipient">
                    <RecipientDashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/my-claims"
                element={
                  <RoleRoute role="Recipient">
                    <MyClaims />
                  </RoleRoute>
                }
              />

              {/* Authenticated Common Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
