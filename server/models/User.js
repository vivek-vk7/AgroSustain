const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the User Schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'proposer', 'farmer', 'expert'], // Available roles
        default: 'user',
    },
    // Specific to Proposers (Farmers/Experts)
    proposerStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending', // Proposers need approval
    },
    location: {
        type: String, // Useful for filtering sellers by location
    },
    phone: {
        type: String,
    }
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if the password has been modified (or is new)
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
