import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import Input from "../../components/Input";
import { validateEmail } from "../../utils/helper";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { useUserContext } from "../../context/userContext";
import { toast } from "react-hot-toast";

const Login = ({ setCurrentPage, onClose }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updateUser } = useUserContext();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      general: ""
    };

    if (!formData.email) {
      newErrors.email = "Please enter your email address.";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
        general: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({
      email: "",
      password: "",
      general: ""
    });

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Make login request
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, formData);
      
      if (response.data) {
        const userData = response.data;
        // Ensure we have the required user data
        if (!userData.token) {
          throw new Error('No authentication token received');
        }
        
        updateUser(userData);
        toast.success('Welcome back!');
        onClose();
        navigate("/dashboard");
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors(prev => ({
        ...prev,
        general: error.response?.data?.message || "Invalid email or password. Please try again."
      }));
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative bg-white rounded-2xl">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute -top-2 -right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        aria-label="Close login form"
      >
        <IoClose size={20} />
      </button>

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-gray-600 text-sm mb-6">Please enter your details to log in</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email Address"
            placeholder="john@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Min 8 characters"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          {errors.general && (
            <div className="text-red-500 text-sm mt-2">
              {errors.general}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => setCurrentPage("signup")}
            className="text-black font-medium hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
