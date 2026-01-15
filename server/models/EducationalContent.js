const mongoose = require('mongoose');

const educationalContentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    resourceUrl: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

const EducationalContent = mongoose.model('EducationalContent', educationalContentSchema);

module.exports = EducationalContent;
