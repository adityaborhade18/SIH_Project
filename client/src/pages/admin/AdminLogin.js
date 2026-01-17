import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ShieldCheck, Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

import SanitationDashboard from './sanitation';
import Publichealth from './publichealth';
import RoaddepartmentDashboard from './roads';
import Waterdepartment from './water';
import Electricitydepartment from './electricity';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { section } = useParams();
  const [admin, setAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInDepartment, setLoggedInDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const { data } = await axios.post('/api/admin/login', { email, password });
      if (data.success) {
        setAdmin(true);
        if (data.department) {
          setLoggedInDepartment(data.department);
        }
        toast.success('Login successful');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/admin/logout');
      setAdmin(false);
      setLoggedInDepartment(null);
      navigate(`/admin/${section || 'login'}`);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error(error);
      toast.error('Logout failed');
    }
  };

  if (admin) {
    const targetSection = loggedInDepartment || section;
    const props = { onLogout: handleLogout };

    if (targetSection === 'sanitation') return <SanitationDashboard {...props} />;
    if (targetSection === 'publichealth') return <Publichealth {...props} />;
    if (targetSection === 'roads') return <RoaddepartmentDashboard {...props} />;
    if (targetSection === 'water') return <Waterdepartment {...props} />;
    if (targetSection === 'electricity') return <Electricitydepartment {...props} />;
    return <SanitationDashboard {...props} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">
            Secure access for department officials
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm bg-opacity-90">
          <div className="mb-6 flex justify-center">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold tracking-wide uppercase">
              Official Use Only
            </span>
          </div>
          <form onSubmit={onSubmitHandler} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 pl-1">
                Department Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="department@gov.in"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 pl-1">
                Secure Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <ShieldCheck className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6 max-w-xs mx-auto">
          Unauthorized access is prohibited and monitored. Please keep your credentials secure.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
