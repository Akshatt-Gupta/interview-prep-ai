// Use environment variable for base URL with fallback
export const BASE_URL = import.meta.env.VITE_API_URL || "https://interview-prep-ai-etzt.onrender.com";

export const API_PATHS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/register',
    REGISTER: '/api/auth/register',
    ME: '/api/auth/profile',
    LOGOUT: '/api/auth/logout'
  },
  
  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image"
  },
  
  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-questions",
    GENERATE_EXPLANATION: "/api/ai/generate-explanation"
  },
  
  SESSION: {
    CREATE: '/api/sessions/create',
    GET_ALL: '/api/sessions/my-sessions',
    GET_BY_ID: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
    UPDATE: (id) => `/api/sessions/${id}`
  },
  
  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add",
    PIN: (id) => `/api/questions/${id}/pin`,
    UPDATE_NOTE: (id) => `/api/questions/${id}/note`
  }
};