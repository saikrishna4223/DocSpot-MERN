// controllers/authController.js
// Removed: const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user (customer or doctor)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => { // Added 'next'
  const { name, email, password, role, specialty, location } = req.body;

  try { // Start try block
    // Check if user already exists with the given email
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400); // Bad Request
      return next(new Error('User with this email already exists'));
    }

    // Set isApproved based on role: doctors need approval, others are approved immediately
    const isApproved = role === 'doctor' ? false : true;

    // Create new user in the database
    const user = await User.create({
      name,
      email,
      password, // Password will be hashed by the pre-save hook in User model
      role: role || 'customer', // Default to 'customer' if role is not specified
      isApproved,
      // Only set specialty and location if the role is doctor
      specialty: role === 'doctor' ? specialty : undefined,
      location: role === 'doctor' ? location : undefined,
    });

    if (user) {
      res.status(201).json({ // Created
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        specialty: user.specialty,
        location: user.location,
        token: generateToken(user._id, user.role), // Generate and send JWT
        message: user.role === 'doctor' ? 'Doctor registration submitted for approval. Please wait for an admin to approve your account.' : 'Registration successful.',
      });
    } else {
      res.status(400); // Bad Request
      return next(new Error('Invalid user data provided'));
    }
  } catch (error) { // Catch block
    console.error('Error in registerUser:', error);
    next(error);
  }
};

// @desc    Authenticate user & get token (login)
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => { // Added 'next'
  const { email, password } = req.body;

  console.log('--- Login Attempt ---');
  console.log('Received email:', email);
  console.log('Received password (raw):', password);

  try { // Start try block
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found for email:', email);
      res.status(401); // Unauthorized
      return next(new Error('Invalid email or password'));
    }

    console.log('User found:', user.email);
    console.log('User role:', user.role);
    console.log('User isApproved:', user.isApproved);
    console.log('Stored hashed password in DB:', user.password);

    // Check if user exists and password matches
    const passwordMatch = await user.matchPassword(password);
    console.log('Password match result:', passwordMatch);

    if (user && passwordMatch) {
      // If user is a doctor, check for approval status
      if (user.role === 'doctor' && !user.isApproved) {
        console.log('Doctor account pending approval for:', user.email);
        res.status(401); // Unauthorized
        return next(new Error('Your doctor account is pending approval. Please wait for an admin to approve.'));
      }

      // Success: Generate and send token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
      console.log('Login successful for:', user.email);
    } else {
      console.log('Password did NOT match or user not found (after initial check).');
      res.status(401); // Unauthorized
      return next(new Error('Invalid email or password'));
    }
  } catch (error) { // Catch block
    console.error('Error in authUser:', error);
    next(error);
  }
};

module.exports = { registerUser, authUser };