import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Loginn = () => {   
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from || "/";

  // Check auth status on mount and redirect if already logged in
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        const { data } = await axios.get('http://localhost:5000/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        
        if (isMounted && data?.success) {
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (isMounted) {
          localStorage.removeItem('token');
        }
      }
    };
    
    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, [navigate, from]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/user/${state}`,
        { name, email, password },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (data.success) {
        localStorage.setItem('token', data.token);
        toast.success(data.message || 'Success!');
        
        // Navigate to the intended page
        navigate(from, { replace: true });
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-8 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-blue-500">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 focus:outline-blue-500"
              type="text"
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 focus:outline-blue-500"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 focus:outline-blue-500"
            type="password"
            required
          />
        </div>

        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-blue-500 cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-blue-500 cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}

        <button 
          type="submit"
          disabled={isLoading}
          className={`bg-blue-500 hover:bg-blue-600 transition-all text-white w-full py-2 rounded-md ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {state === "register" ? "Creating Account..." : "Logging in..."}
            </span>
          ) : state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Loginn;
