import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IssueProvider } from './context/IssueContext';
import { Toaster } from 'react-hot-toast';

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

// A simple protected route component
const ProtectedRoute = ({ children, isAdmin = false }) => {
  // TODO: Replace with actual authentication logic
  const isAuthenticated = true; // For demo purposes
  const userIsAdmin = true; // For demo purposes

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && !userIsAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 500,
    },
  },
});

   

function App() {
  return (
     
    <ThemeProvider theme={theme}>
      <IssueProvider>
        <CssBaseline />
        <Toaster />
        <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/user" element={<UserPage />} />
              <Route path="/report-issue" element={<ReportIssue />} />
              <Route path="/track-issue" element={<IssueTracker />} />
              <Route path="/issue/:id" element={<IssueDetails />} />
              <Route path="/loginn" element={<Loginn />} />
             
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute isAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route - Keep this at the bottom */}
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
