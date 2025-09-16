"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api"; // <-- Import the api instance here
import SeatMap from "../../components/SeatMap";
import BookingForm from "../../components/BookingForm";

export default function BookingsPage() {
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState("");
  const [bookedSeats, setBookedSeats] = useState(null);

  const fetchSeats = () => {
    api.get("/seats")
      .then((res) => setSeats(res.data))
      .catch((err) => {
        console.error("Error fetching seat layout:", err);
        setError("Failed to load seats. Please try again later.");
      });
  };

  useEffect(() => {
    fetchSeats();
  }, []);
  const { user } = useAuth();

  const handleBook = async ({ count, flexible }) => {
  try {
    const res = await api.post("/bookings", {
      seatCount: count,
      flexible,
      userId: user?.id, // ✅ real userId here
    });
    setBookedSeats(res.data.seats);
    fetchSeats();
  } catch (err) {
    console.error("Booking failed:", err);
    setError(err.response?.data?.message || "Booking failed.");
  }
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Book Your Seats</h1>
      {error && <p className="text-red-500 bg-red-100 p-2 rounded mb-4">{error}</p>}
      {bookedSeats && (
        <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
          <h2 className="font-bold">Booking Successful!</h2>
          <p>You have booked seats: {bookedSeats.join(", ")}</p>
        </div>
      )}
      <div className="lg:flex lg:space-x-8">
        <div className="lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Available Seats</h2>
          <SeatMap seats={seats} />
        </div>
        <div className="lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">Booking Form</h2>
          <BookingForm onBook={handleBook} />
        </div>
      </div>
    </div>
  );
}
