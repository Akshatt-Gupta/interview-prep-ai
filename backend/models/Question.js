const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String
    },
    note: {
        type: String
    },
    isPinned: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);
