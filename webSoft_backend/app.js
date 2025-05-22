const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Simple route for testing
app.get('/', (req, res) => {
    res.send('Chat Server is running');
});

// API routes would go here
// app.use('/api/users', require('./routes/userRoutes'));

module.exports = app;