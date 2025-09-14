const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllBookings(req, res) {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        seats: { include: { seat: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(
      bookings.map(b => ({
        bookingId: b.id,
        user: b.user.email,
        seats: b.seats.map(s => s.seat.seatNumber),
        createdAt: b.createdAt
      }))
    );
  } catch (err) {
    res.status(500).json({ error: "Error fetching all bookings." });
  }
}

async function resetSeats(req, res) {
  try {
    if (!req.body.confirm) {
      return res.status(400).json({ error: "Confirmation required to reset bookings." });
    }
    await prisma.bookingSeat.deleteMany({});
    await prisma.booking.deleteMany({});
    res.json({ message: "All bookings reset. All seats are now available." });
  } catch (err) {
    res.status(500).json({ error: "Error resetting bookings." });
  }
}

module.exports = { getAllBookings, resetSeats };
