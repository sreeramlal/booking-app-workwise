const express = require('express');
const router = express.Router();
const { authenticate, authorizeAdmin } = require('../middlewares/authMiddleware');
const { getAllBookings, resetSeats } = require('../controllers/adminController');

router.get('/bookings', authenticate, authorizeAdmin, getAllBookings);
router.post('/reset', authenticate, authorizeAdmin, resetSeats);

module.exports = router;
