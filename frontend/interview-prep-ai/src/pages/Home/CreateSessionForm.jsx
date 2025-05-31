import React, { useState } from "react";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    role: "",
    topicToFocus: "", // Changed to singular to match backend
    experience: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (error) setError(null);
  };

  const validateForm = () => {
    const { role, topicToFocus, experience } = formData;
    
    if (!role.trim()) {
      setError("Target role is required");
      return false;
    }
    if (!experience) {
      setError("Years of experience is required");
      return false;
    }
    if (!topicToFocus.trim()) {
      setError("Topics to focus is required");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const { role, experience, topicToFocus, description } = formData;
      
      // Step 1: Generate questions using AI
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS, 
        {
          role,
          experience,
          topicToFocus, // Singular form matching backend
          numberOfQuestions: 10
        }
      ).catch(error => {
        console.error("Full error",error);
        console.error("Response data:", error.response?.data);
        throw error;
      });
      
      // Step 2: Create session with the generated questions
      const sessionResponse = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        role: role.trim(),
        experience: experience.toString().trim(),
        topicToFocus: topicToFocus.trim(), // Singular form matching backend
        description: description.trim(),
        questions: aiResponse.data.data,
      }).catch(error => {
        throw new Error(
          error.response?.data?.message || 
          "Failed to create session. Please try again."
        );
      });
      
      // Step 3: Navigate to interview prep page if successful
      if (sessionResponse.data?.session?._id) {
        navigate(`/interview-prep/${sessionResponse.data.session._id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 text-xl"
          aria-label="Close"
        >
          ×
        </button>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Start a New Interview Journey
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Fill out a few quick details and unlock your personalized set of interview questions!
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="role" className="text-sm text-gray-600 mb-1 block">Target Role *</label>
            <input
              id="role"
              value={formData.role}
              onChange={e => handleChange("role", e.target.value)}
              placeholder="e.g. Frontend Developer, UI/UX Designer"
              type="text"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition"
              required
            />
          </div>
          
          <div>
            <label htmlFor="experience" className="text-sm text-gray-600 mb-1 block">Experience Level *</label>
            <input
              id="experience"
              value={formData.experience}
              onChange={e => handleChange("experience", e.target.value)}
              placeholder="e.g. 1 year, 3 years, 5+ years"
              type="text"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition"
              required
            />
          </div>
          
          <div>
            <label htmlFor="topics" className="text-sm text-gray-600 mb-1 block">Topics to Focus *</label>
            <input
              id="topics"
              value={formData.topicToFocus}
              onChange={e => handleChange("topicToFocus", e.target.value)}
              placeholder="Comma-separated, e.g., React, Node.js, MongoDB"
              type="text"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="text-sm text-gray-600 mb-1 block">Session Description (Optional)</label>
            <input
              id="description"
              value={formData.description}
              onChange={e => handleChange("description", e.target.value)}
              placeholder="Any specific goals or notes for this session"
              type="text"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition"
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm mt-1 mb-2">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full mt-2 bg-black text-white font-semibold rounded-lg py-3 text-base hover:bg-gray-900 transition disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <SpinnerLoader /> Creating Session...
              </>
            ) : (
              "Create Session"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionForm;