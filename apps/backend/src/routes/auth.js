const express = require('express');
const router = express.Router();

// Import both functions from the controller
const { register, login } = require('../controllers/authController');

// The path to the controller is '../controllers/authController.js'
// from 'src/routes/auth.js'

// Use the 'register' function for the /register route
router.post('/register', register);

// Use the 'login' function for the /login route
router.post('/login', login);

module.exports = router;
