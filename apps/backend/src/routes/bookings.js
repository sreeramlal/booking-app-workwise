const express = require("express");
const { prisma } = require("../../prismaClient.js");
const { authenticate } = require("../middlewares/authMiddleware.js");
const { createBooking, getUserBookings } = require("../controllers/bookingController.js");

const router = express.Router();

// POST /api/bookings - Create a new booking
router.post("/", authenticate, createBooking);

// GET /api/bookings - Get bookings for the current user
router.get("/", authenticate, getUserBookings);

// GET /api/bookings/seats - Get the entire seat map
router.get("/seats", authenticate, async (req, res) => {
  try {
    const seats = await prisma.seat.findMany({
      orderBy: { seatNumber: "asc" },
      include: { bookings: true }, // Correct relation name is 'bookings'
    });
    res.json(seats);
  } catch (err) {
    console.error("Error fetching seats:", err.message);
    res.status(500).json({ error: "Failed to fetch seats." });
  }
});

module.exports = router;
