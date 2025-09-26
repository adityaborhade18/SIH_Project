import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Loginn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Optional: redirect back to previous page after login
  const from = location.state?.from?.pathname || "/";

  const submithandler = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(`/api/user/${state}`, { name, email, password }, { withCredentials: true });
      if (data.success) {
        const token=console.log(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message || "Success!");
        navigate(from, { replace: true }); // redirect to previous page or home
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={submithandler}
        className="flex flex-col gap-4 p-8 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-blue-500">User</span> {state === "login" ? "Login" : "Sign Up"}
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
            <span onClick={() => setState("login")} className="text-blue-500 cursor-pointer">Click here</span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span onClick={() => setState("register")} className="text-blue-500 cursor-pointer">Click here</span>
          </p>
        )}

        <button className="bg-blue-500 hover:bg-blue-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Loginn;
