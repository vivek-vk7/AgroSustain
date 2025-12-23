const mongoose = require('mongoose');

// Define schema for Educational Content
const educationalContentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Author (Proposer)
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String, // Can be text content
        required: true,
    },
    resourceUrl: {
        type: String, // Optional URL to video or article
    },
    category: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false, // Admin needs to approve
    }
}, {
    timestamps: true,
});

const EducationalContent = mongoose.model('EducationalContent', educationalContentSchema);

module.exports = EducationalContent;
