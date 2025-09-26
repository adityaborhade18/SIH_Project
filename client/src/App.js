import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IssueProvider } from './context/IssueContext';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Pages
import HomePage from './pages/HomePage';
import ReportIssue from './pages/ReportIssue';
import IssueTracker from './pages/IssueTracker';
import IssueDetails from './pages/IssueDetails';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/Dashboard';
import UserPage from './pages/UserPage';
import Loginn from './pages/loginn';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/me", {
          withCredentials: true,
        });

        if (res.data?.user) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []); // ✅ only run once

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/loginn" replace state={{ from: location }} />;
  }

  return children;
};


// ✅ Public Route Component (redirects to home if already authenticated)
const PublicRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:5000/api/user/me', {
          withCredentials: true,
        });
        setAuthenticated(true);
      } catch (err) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If user is already authenticated and trying to access login page, redirect to home
  if (authenticated && location.pathname === '/loginn') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 500 },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <IssueProvider>
        <CssBaseline />
        <Toaster />
        <div
          className="app"
          style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
        >
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/track-issue" element={<IssueTracker />} />
              <Route path="/issue/:id" element={<IssueDetails />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Public routes that shouldn't be accessible when logged in */}
              <Route 
                path="/loginn" 
                element={
                  <PublicRoute>
                    <Loginn />
                  </PublicRoute>
                } 
              />

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

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute isAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </IssueProvider>
    </ThemeProvider>
  );
}

export default App;