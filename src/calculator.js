// Import the 'dotenv' package to load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Load the secret from environment variables
const SECRET_KEY = process.env.SECRET_KEY;

// Example function that uses the secret
function calculateSomething(input) {
    // Use SECRET_KEY in calculations or API calls
    if (!SECRET_KEY) {
        throw new Error('Secret key is not defined');
    }
    // Perform calculations using SECRET_KEY
    return input * SECRET_KEY.length; // Example usage
}

module.exports = { calculateSomething };