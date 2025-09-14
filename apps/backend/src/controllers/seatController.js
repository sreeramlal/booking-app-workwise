const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getSeats(req, res) {
    const seats = await prisma.seat.findMany({
        orderBy: { number: 'asc' }, // ✅ matches schema
        include: { bookings: true },
    });

    const seatMap = seats.map(seat => ({
        id: seat.id,
        seatNumber: seat.number, // ✅ map correctly
        row: seat.row,
        booked: seat.bookings.length > 0,
    }));
  res.json(seatMap);
}

module.exports = { getSeats };
