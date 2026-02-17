// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures email addresses are unique
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['customer', 'doctor', 'admin'], // Enforces specific roles
      default: 'customer',
    },
    // Doctor-specific fields
    specialty: {
      type: String,
      // Required only if the role is 'doctor'
      required: function() { return this.role === 'doctor'; },
    },
    location: {
      type: String,
      // Required only if the role is 'doctor'
      required: function() { return this.role === 'doctor'; },
    },
    isApproved: {
      type: Boolean,
      default: false, // Doctors need admin approval, customers/admins are true by default (set in controller)
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Mongoose pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  }
  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
