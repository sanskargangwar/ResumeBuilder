import React, { useState } from "react";
import { User2, Lock, Mail } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import api from "../configs/api.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  // ✅ Correct query handling
  const query = new URLSearchParams(window.location.search); //reads the query parameters from the URL
  const urlState = query.get("state");  //Read value from URL
  const navigate = useNavigate();
  const [state, setState] = useState(urlState || "login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ✅ Handle Submit
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const {data} = await api.post(`/api/users/${state}` , formData)
      dispatch(login(data))
      localStorage.setItem('token', data.token);
      toast.success(data.message)
      navigate('/app');
    } catch (error) {
      toast(error?.response?.data?.message || error.message)
    }
    // console.log(formData);
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Toggle Login/Register
  const toggleState = () => {
    const newState = state === "login" ? "register" : "login";
    setState(newState);

    // Update URL (optional but good UX)
    window.history.replaceState(null, "", `?state=${newState}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">

      <form
        onSubmit={handleSubmit}
        className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white shadow-md"
      >
        {/* Heading */}
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">
          {state === "login" ? "Login" : "Sign Up"}
        </h1>

        <p className="text-gray-500 text-sm mt-2">
          Please {state} to continue
        </p>

        {/* Name Field */}
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
            <User2 size={16} color="#6B7280" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full outline-none text-sm bg-transparent focus:ring-2 focus:ring-green-400 rounded-full"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={16} color="#6B7280" />
          <input
            type="email"
            name="email"
            placeholder="Email id"
            className="w-full outline-none text-sm bg-transparent focus:ring-2 focus:ring-green-400 rounded-full"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center mt-4 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={16} color="#6B7280" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full outline-none text-sm bg-transparent focus:ring-2 focus:ring-green-400 rounded-full"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Forgot Password */}
        <div className="mt-4 text-left">
          <span className="text-sm text-green-500 cursor-pointer hover:underline">
            Forgot password?
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full text-white bg-green-500 hover:bg-green-600 transition-all duration-300"
        >
          {state === "login" ? "Login" : "Sign Up"}
        </button>

        {/* Toggle */}
        <p className="text-gray-500 text-sm mt-4 mb-10">
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            onClick={toggleState}
            className="text-green-500 hover:underline cursor-pointer"
          >
            Click here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;