const { PrismaClient } = require('@prisma/client');
const { prisma } = require("../../prismaClient.js");

// This file should NOT define routes. Only the functions.

async function createBooking(req, res) {
  const { seatCount, flexible = true } = req.body;
  const userId = req.body.userId; // userId from payload

  // Ensure userId is provided
  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    // Check if the user exists in the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(404).json({ error: `User with ID ${userId} not found.` });
    }

    console.log("User exists:", user); // Debugging log for user

    // Validate seat count
    if (!seatCount || seatCount < 1 || seatCount > 7) {
      return res.status(400).json({ error: "You can book between 1 and 7 seats." });
    }

    // Begin transaction
    const bookedSeatNumbers = await prisma.$transaction(async (tx) => {
      // Find all available seats
      const availableSeats = await tx.seat.findMany({
        where: { bookings: { none: {} } },  // Ensure seats are not already booked
        orderBy: { number: "asc" },         // Order seats by their number
      });

      // If not enough seats are available, throw an error
      if (availableSeats.length < seatCount) {
        throw new Error("Not enough seats available to fulfill the request.");
      }

      // Seat allocation logic
      let allocatedSeats = [];
      for (let i = 0; i <= availableSeats.length - seatCount; i++) {
        const potentialBlock = availableSeats.slice(i, i + seatCount);
        // Check if all seats are in the same row
        if (potentialBlock.every(seat => seat.row === potentialBlock[0].row)) {
          allocatedSeats = potentialBlock;
          break;
        }
      }

      // If no suitable block found and flexible option is enabled, allocate seats anywhere
      if (allocatedSeats.length === 0 && flexible) {
        allocatedSeats = availableSeats.slice(0, seatCount);
      }

      // If no seats could be allocated, throw an error
      if (allocatedSeats.length === 0) {
        throw new Error("Could not find a suitable block of seats.");
      }

      // Create the booking and associate it with the user
      const booking = await tx.booking.create({
        data: {
          user: {
            connect: { id: userId }, // Ensure userId is valid and exists
          },
        },
      });

      // Create the BookingSeat records
      const bookingSeatData = allocatedSeats.map(seat => ({
        bookingId: booking.id,
        seatId: seat.id,
      }));

      // Create the associated seats for the booking
      await tx.bookingSeat.createMany({
        data: bookingSeatData,
      });

      // Return the booked seat numbers
      return allocatedSeats.map(seat => seat.number);
    });

    // Send the response with booked seat numbers
    res.status(201).json({ seats: bookedSeatNumbers });
  } catch (err) {
    console.error("Booking failed:", err.message); // Log error for debugging
    res.status(409).json({
      message: err.message || "Booking failed due to a conflict or lack of availability."
    });
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
