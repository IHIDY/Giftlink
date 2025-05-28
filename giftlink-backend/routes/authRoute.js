// Import required packages
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connectToDatabase = require('../models/db');
const dotenv = require('dotenv');
const pino = require('pino');

// Create an Express router
const router = express.Router();

// Create a Pino logger instance
const logger = pino();

// Load environment variables from .env file
dotenv.config();

// Access the JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Define the /register endpoint
router.post('/register', async (req, res) => {
    try {
        // Task 1: Connect to the MongoDB database
        const db = await connectToDatabase();

        // Task 2: Access the "users" collection
        const collection = db.collection("users");

        // Task 3: Check for existing email
        const existingEmail = await collection.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash the user's password
        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);

        // Task 4: Save user details in the database
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        // Task 5: Create JWT authentication token
        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };
        const authtoken = jwt.sign(payload, JWT_SECRET);

        logger.info('User registered successfully');
        res.json({ authtoken, email: req.body.email });
    } catch (e) {
        logger.error('Registration failed:', e.message);
        return res.status(500).send('Internal server error');
    }
});

// Export the router module
module.exports = router;
