"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import SeatMap from "../../components/SeatMap";
import BookingForm from "../../components/BookingForm";
import { useAuth } from "../context/AuthContext"; // ✅ only import useAuth

export default function BookingsPage() {
  const [seats, setSeats] = useState([]);
  const [error, setError] = useState("");
  const [bookedSeats, setBookedSeats] = useState(null);
  const [resetting, setResetting] = useState(false); // Track the reset loading state
  const { user } = useAuth(); // ✅ call inside component

  // Fetch available seats
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

  // Handle booking request
  const handleBook = async ({ count, flexible }) => {
    try {
      console.log(user?.id, user)
      const res = await api.post("/bookings", {
        userId: user?.id,
        seatCount: count,
        flexible
      });
      setBookedSeats(res.data.seats);
      fetchSeats();  // Refresh seats after booking
    } catch (err) {
      console.error("Booking failed:", err);
      setError(err.response?.data?.message || "Booking failed.");
    }
  };

  // Handle reset request to clear bookings
  const handleReset = async () => {
    try {
      setResetting(true); // Set the resetting state to true while the reset is in progress
      await api.post("https://booking-app-workwise-backend.onrender.com/api/admin/reset"); // Reset endpoint
      setBookedSeats(null);  // Clear the booked seats from state
      fetchSeats();  // Refresh seats
      setResetting(false); // Set the resetting state to false after completion
      alert("Bookings have been reset successfully!");
    } catch (err) {
      setResetting(false);
      console.error("Reset failed:", err);
      setError("Failed to reset bookings. Please try again later.");
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

      {/* Reset Button */}
      <div className="mt-8">
        <button
          onClick={handleReset}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
          disabled={resetting}
        >
          {resetting ? "Resetting..." : "Reset Bookings"}
        </button>
      </div>
    </div>
  );
}
