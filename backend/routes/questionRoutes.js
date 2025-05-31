const express=require('express');
const router=express.Router();

const {togglePinQuestion,updateQuestionNote,addQuestionToSession}=require('../controllers/questionController');
const {protect}=require('../middlewares/authMiddleware');

router.post('/add',protect,addQuestionToSession);
router.post('/:id/pin',protect,togglePinQuestion);
router.post('/:id/note',protect,updateQuestionNote);

module.exports=router;


