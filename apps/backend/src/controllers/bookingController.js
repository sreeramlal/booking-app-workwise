const { PrismaClient } = require('@prisma/client');
const { prisma } = require("../../prismaClient.js");

// This file should NOT define routes. Only the functions.

async function createBooking(req, res) {
  const { seatCount, flexible = true } = req.body;
  const userId = req.user.id;

  if (!seatCount || seatCount < 1 || seatCount > 7) {
    return res.status(400).json({ error: "You can book between 1 and 7 seats." });
  }

  try {
    const bookedSeatNumbers = await prisma.$transaction(async (tx) => {
      // Find all available seats using the correct relation name
      const availableSeats = await tx.seat.findMany({
        where: { bookings: { none: {} } },  
        orderBy: { number: "asc" },
      });

      if (availableSeats.length < seatCount) {
        throw new Error("Not enough seats available to fulfill the request.");
      }

      // Allocation logic...
      let allocatedSeats = [];
      for (let i = 0; i <= availableSeats.length - seatCount; i++) {
        const potentialBlock = availableSeats.slice(i, i + seatCount);
        if (potentialBlock.every(seat => seat.row === potentialBlock[0].row)) {
          allocatedSeats = potentialBlock;
          break;
        }
      }

      if (allocatedSeats.length === 0 && flexible) {
        allocatedSeats = availableSeats.slice(0, seatCount);
      }

      if (allocatedSeats.length === 0) {
        throw new Error("Could not find a suitable block of seats.");
      }
      const userId = req.user?.id || req.body.userId;

    if (!userId) {
      throw new Error("User not authenticated or missing userId");
    }

    const booking = await tx.booking.create({
      data: {
        user: {
          connect: { id: userId }
        }
      },
    });

      const bookingSeatData = allocatedSeats.map(seat => ({
        bookingId: booking.id,
        seatId: seat.id,
      }));

      await tx.bookingSeat.createMany({
        data: bookingSeatData,
      });

      return allocatedSeats.map(seat => seat.number);
    });

    res.status(201).json({ seats: bookedSeatNumbers });
  } catch (err) {
    console.error("Booking failed:", err.message);
    res.status(409).json({ message: err.message || "Booking failed due to a conflict or lack of availability." });
  }
}

async function getUserBookings(req, res) {
  const userId = req.user.id;
  try {
    const userBookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        seats: {
          include: {
            seat: true,
          },
        },
      },
    });
    res.json(userBookings);
  } catch (err) {
    console.error("Failed to get user bookings:", err.message);
    res.status(500).json({ error: "Failed to retrieve bookings." });
  }
}

module.exports = { createBooking, getUserBookings };
