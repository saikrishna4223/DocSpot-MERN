// routes/authRoutes.js
const express = require('express');
const router = express.Router();
// REMOVED: const asyncHandler = require('express-async-handler'); // THIS LINE IS GONE

const { registerUser, authUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', authUser);

module.exports = router;