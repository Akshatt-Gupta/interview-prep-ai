const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    role: {
        type: String,
        required: true,
    },
    experience: {
        type: String,
        required: true,
    },
    topicToFocus: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: ""
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
    }]
}, { timestamps: true });

module.exports = mongoose.model("Session", SessionSchema);
