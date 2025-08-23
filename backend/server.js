require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const questionRoutes = require("./routes/questionRoutes");
const { protect } = require("./middlewares/authMiddleware");
const { generateInterviewQuestions, generateConceptExplanation } = require("./controllers/aiController");

const app = express();

// Body parser middleware - must be before any routes
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173','https://interview-prep-ai-etzt.onrender.com','https://interview-prep-ai-seven.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Apply CORS globally
app.use(cors(corsOptions));

app.post('/abcd', async (req, res) => {
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY // Use environment variable
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "You are an AI trained to generate technical interview questions and answers.\n\nTask:\n- Role: content writing\n- Candidate Experience: 10 years\n- Focus Topics: comedy\n- Write 10 interview questions.\n- For each question, generate a detailed but beginner-friendly answer.\n- If the answer needs a code example, add a small code block inside.\n- Keep formatting very clean.\n- Return a pure JSON array like:\n\n\n[\n  {\n    \"question\": \"Question here?\",\n    \"answer\": \"Answer here.\"\n  },\n  ...\n]\n\n\nImportant: Do NOT add any extra text. Only return valid JSON."
                }
              ]
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to call Gemini API' });
  }
});
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/sessions", protect, sessionRoutes);
app.use("/api/questions", protect, questionRoutes);

// AI Routes
app.post("/api/ai/generate-questions",generateInterviewQuestions);
app.post("/api/ai/generate-explanation",generateConceptExplanation);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Connect to Database
connectDB();

// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        headers: req.headers,
        body: req.body
    });
    next();
});

// Start Server

const PORT = process.env.PORT || 'https://interview-prep-ai-etzt.onrender.com'
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;