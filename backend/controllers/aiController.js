const { GoogleGenerativeAI } = require('@google/generative-ai');
const { conceptExplainPrompt, questionAnswerPrompt } = require('../utils/prompts');

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * @desc    Generate interview questions
 * @route   POST /api/ai/generate-questions
 * @access  Private
 */
const generateInterviewQuestions = async (req, res) => {
    try {
        // Validate request body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body is required"
            });
        }

        // Destructure with default values
        const { 
            role = null, 
            experience = null, 
            topicToFocus = null, 
            numberOfQuestions = null 
        } = req.body;

        // Validate required fields
        const missingFields = [];
        if (!role) missingFields.push('role');
        if (!experience) missingFields.push('experience');
        if (!topicToFocus) missingFields.push('topicToFocus');
        if (!numberOfQuestions) missingFields.push('numberOfQuestions');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                missingFields
            });
        }

        // Generate prompt
        const prompt = questionAnswerPrompt(role, experience, topicToFocus, numberOfQuestions);
        
        // Get model instance
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        if (!response) {
            throw new Error('No response from AI model');
        }

        // Process response
        const rawText = response.text();
        const cleanedText = rawText
            .replace(/^\s*```json\s*/, "")
            .replace(/\s*```$/, "")
            .trim();
            
        // Parse and validate response
        try {
            const questions = JSON.parse(cleanedText);
            return res.status(200).json({
                success: true,
                data: questions
            });
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            throw new Error('Invalid response format from AI');
        }

    } catch (error) {
        console.error('Error in generateInterviewQuestions:', {
            error: error.message,
            stack: error.stack,
            requestBody: req.body
        });

        return res.status(500).json({
            success: false,
            message: "Failed to generate questions",
            error: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
}

/**
 * @desc    Generate concept explanation
 * @route   POST /api/ai/generate-explanation
 * @access  Private
 */
const generateConceptExplanation = async (req, res) => {
    try {
        // Validate request body exists
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Request body is required"
            });
        }

        const { question = null } = req.body;

        if (!question) {
            return res.status(400).json({
                success: false,
                message: "Question field is required"
            });
        }

        // Generate prompt
        const prompt = conceptExplainPrompt(question);
        
        // Get model instance
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
        
        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        if (!response) {
            throw new Error('No response from AI model');
        }

        // Process response
        const rawText = response.text();
        const cleanedText = rawText
            .replace(/^\s*```json\s*/, "")
            .replace(/\s*```$/, "")
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
            .trim();
            
        // Parse and validate response
        try {
            const data = JSON.parse(cleanedText);
            return res.status(200).json({
                success: true,
                data: data
            });
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            throw new Error('Invalid response format from AI');
        }

    } catch (error) {
        console.error('Error in generateConceptExplanation:', {
            error: error.message,
            stack: error.stack,
            requestBody: req.body
        });

        return res.status(500).json({
            success: false,
            message: "Failed to generate explanation",
            error: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
}

module.exports = {
    generateConceptExplanation,
    generateInterviewQuestions
};