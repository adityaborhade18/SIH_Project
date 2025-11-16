import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


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

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post('/api/admin/login', { email, password });
      if (data.success) {
        setAdmin(true);
        toast.success('Login successful');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  
  if (admin) {
    if (section === 'sanitation') return <SanitationDashboard />;
    if (section === 'publichealth') return <Publichealth />;
    if (section === 'roads') return <RoaddepartmentDashboard />;
    if (section === 'water') return <Waterdepartment />;
    if (section === 'electricity') return <Electricitydepartment />;
    return <SanitationDashboard />;
  }

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        className="min-h-screen flex items-center text-sm text-gray-700"
      >
        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary"> Admin</span> Login
          </p>

          <div className="w-full">
            <p>Email</p>
            <input
              type="email"
              placeholder="Enter Your Email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
              type="password"
              placeholder="Enter Your Password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="bg-primary text-white w-full py-2 rounded-md cursor-pointer">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminLogin;
