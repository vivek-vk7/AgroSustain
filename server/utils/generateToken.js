const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    // Payload contains the user ID
    // Secret comes from .env
    // Expires in 30 days
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
