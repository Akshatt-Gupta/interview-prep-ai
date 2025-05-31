const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');

// Import controllers
const { 
    createSession,
    getSessions,
    getSessionById,
    updateSession,
    deleteSession 
} = require('../controllers/sessionController');

// Routes
router.post('/create', protect, createSession);
router.get('/my-sessions', protect, getSessions);
router.get('/:id', protect, getSessionById);
router.delete('/:id', protect, deleteSession);

module.exports = router;
