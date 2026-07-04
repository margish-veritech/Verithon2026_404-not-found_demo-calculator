const express = require('express');
const app = express();

// Load secret from environment variable
const secret = process.env.SECRET_KEY;

if (!secret) {
    throw new Error('SECRET_KEY environment variable is not set');
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});