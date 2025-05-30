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
        console.log("req.body:", req.body);

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

//Login Endpoint
router.post('/login', async (req, res) => {
    console.log("\n\n Inside login")
    try {
        // const collection = await connectToDatabase();
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: req.body.email });
        if (theUser) {
            let result = await bcryptjs.compare(req.body.password, theUser.password)
            if (!result) {
                logger.error('Passwords do not match');
                return res.status(404).json({ error: 'Wrong pasword' });
            }
            let payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };
            const userName = theUser.firstName;
            const userEmail = theUser.email;
            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('User logged in successfully');
            return res.status(200).json({ authtoken, userName, userEmail });
        } else {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

// Put this near the top with the other imports
const { body, validationResult } = require('express-validator');

// Endpoint: PUT /api/auth/update
router.put('/update',
    // Task 1: Validate input fields (you can customize as needed)
    [
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
    ],
    async (req, res) => {
        // Task 2: Validate the input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in update request', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Task 3: Get email from headers
            const email = req.headers.email;
            if (!email) {
                logger.error('Email not found in the request headers');
                return res.status(400).json({ error: "Email not found in the request headers" });
            }

            // Task 4: Connect to DB
            const db = await connectToDatabase();
            const collection = db.collection("users");

            // Task 5: Find existing user
            const existingUser = await collection.findOne({ email });
            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Update user fields
            existingUser.firstName = req.body.firstName;
            existingUser.lastName = req.body.lastName;
            existingUser.updatedAt = new Date();

            // Task 6: Update in DB
            const updatedUser = await collection.findOneAndUpdate(
                { email },
                { $set: existingUser },
                { returnDocument: 'after' }
            );

            // Task 7: Generate new JWT
            const payload = {
                user: {
                    id: updatedUser.value._id.toString(),
                },
            };
            const authtoken = jwt.sign(payload, JWT_SECRET);

            res.json({ authtoken });
        } catch (e) {
            logger.error('Error updating user:', e.message);
            return res.status(500).send('Internal server error');
        }
    }
);

// Export the router module
module.exports = router;
