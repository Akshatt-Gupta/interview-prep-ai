import React, { useState, useRef } from "react";
import { IoClose, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { MdOutlineFileUpload } from "react-icons/md";
import { validateEmail } from "../../utils/helper";
import DefaultAvatar from "../../components/DefaultAvatar";
import { useUserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import { toast } from "react-hot-toast";

const SignUp = ({ onClose, setCurrentPage }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    general: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { updateUser } = useUserContext();
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { fullName: "", email: "", password: "", general: "" };

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Please enter your full name";
      isValid = false;
    }

    if (!formData.email) {
      newErrors.email = "Please enter your email address";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Please enter your password";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
      setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let imageUrl = "";
      // Upload image first if exists (using direct axios since we don't have token yet)
      if (profilePicFile) {
        const formData = new FormData();
        formData.append("image", profilePicFile);
        
        const uploadRes = await axios.post(
          `${BASE_URL}${API_PATHS.IMAGE.UPLOAD_IMAGE}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadRes.data.imageUrl;
      }

      // Register user with axiosInstance
      const { data } = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        profileImageUrl: imageUrl || undefined,
      });

      // Save token and update context
      localStorage.setItem("token", data.token);
      updateUser(data);
      toast.success("Account created successfully!");
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ general: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Client-side validation
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      setProfilePicFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePicFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getPreviewUrl = () => {
    return profilePicFile ? URL.createObjectURL(profilePicFile) : null;
  };

  return (
    <div className="bg-white rounded-xl p-8 w-full max-w-md">
      {/* Header */}
      <div className="relative mb-6">
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 hover:opacity-75"
        >
          <IoClose className="text-gray-400 w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-1">Create an Account</h2>
        <p className="text-gray-600">Join us today!</p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            ref={fileInputRef}
            id="profile-photo"
          />
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            {getPreviewUrl() ? (
              <img
                src={getPreviewUrl()}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <DefaultAvatar className="w-full h-full" />
            )}
          </div>
          {getPreviewUrl() ? (
            <button
              onClick={handleRemovePhoto}
              className="absolute -bottom-1 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 border border-gray-200"
              type="button"
            >
              <FaTrash className="w-3.5 h-3.5 text-red-500" />
            </button>
          ) : (
            <label
              htmlFor="profile-photo"
              className="absolute -bottom-1 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 border border-gray-200 cursor-pointer"
            >
              <MdOutlineFileUpload className="w-3.5 h-3.5 text-gray-600" />
            </label>
          )}
        </div>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full p-3 rounded-lg border ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-400`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={`w-full p-3 rounded-lg border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-gray-400`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full p-3 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-gray-400 pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <IoEyeOffOutline className="w-5 h-5" />
              ) : (
                <IoEyeOutline className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="text-red-500 text-sm py-2">{errors.general}</div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm mt-6 text-gray-600">
        Already have an account?{" "}
        <button
          onClick={() => setCurrentPage("login")}
          className="text-blue-600 font-medium hover:underline focus:outline-none"
        >
          Log in
        </button>
      </p>
    </div>
  );
};

export default SignUp;