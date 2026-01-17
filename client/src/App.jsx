import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { IssueProvider } from './context/IssueContext';
import AuthProvider from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

// Pages
import HomePage from './pages/HomePage';
import ReportIssue from './pages/ReportIssue';
import IssueTracker from './pages/IssueTracker';
import IssueDetails from './pages/IssueDetails';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/Dashboard';
import UserPage from './pages/UserPage';
import Loginn from './pages/loginn';
import About from './pages/About';
import Contact from './pages/Contact';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SanitationDashboard from './pages/admin/sanitation';
import Publichealth from './pages/admin/publichealth';
import RoaddepartmentDashboard from './pages/admin/roads';
import Waterdepartment from './pages/admin/water';
import Electricitydepartment from './pages/admin/electricity';
import AdminLogin from './pages/admin/AdminLogin';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isAdminPath = useLocation().pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <IssueProvider>
        <Toaster position="top-center" toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#22c55e',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }} />
        <div className="app flex flex-col min-h-screen">
          {!isAdminPath && <Navbar />}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/track-issue" element={<IssueTracker />} />
              <Route path="/issue/:id" element={<IssueDetails />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/loginn" element={<Loginn />} />

              {/* Protected Routes */}
              <Route
                path="/report-issue"
                element={
                  <ProtectedRoute>
                    <ReportIssue />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user"
                element={
                  <ProtectedRoute>
                    <UserPage />
                  </ProtectedRoute>
                }
              />

              <Route path="/admin/:section" element={<AdminLogin />} />
            </Routes>
          </main>
          {!isAdminPath && <Footer />}
        </div>
      </IssueProvider>
    </AuthProvider>
  );
}

export default App;