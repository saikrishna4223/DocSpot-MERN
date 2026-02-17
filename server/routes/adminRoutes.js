// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
// REMOVED: const asyncHandler = require('express-async-handler'); // THIS LINE IS GONE

const {
  getPendingDoctorApprovals,
  approveDoctor,
  rejectDoctor,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// Admin routes - all protected for admin role
router.get('/doctors/pending', protect(['admin']), getPendingDoctorApprovals);
router.put('/doctors/:id/approve', protect(['admin']), approveDoctor);
router.delete('/doctors/:id', protect(['admin']), rejectDoctor); // Using DELETE for rejection

module.exports = router;