"use client";

import { useState } from "react";

export default function BookingForm({ onBook }) {
  const [count, setCount] = useState(1); // Default to 1 seat
  const [flexible, setFlexible] = useState(true);
  const [loading, setLoading] = useState(false);

  // Handle booking form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Ensure count is a number before submitting
    const seatCount = parseInt(count, 10);
    if (isNaN(seatCount) || seatCount < 1 || seatCount > 7) {
      alert("You can only book between 1 and 7 seats.");
      setLoading(false);
      return;
    }
    await onBook({ count: seatCount, flexible });
    setLoading(false);
  };

  // Handle resetting the booking form
  const handleReset = async () => {
    // Reset form state
    setCount(1);
    setFlexible(true);

    try {
      setLoading(true);
      // Call backend API to reset all bookings
      const response = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }), // You can add extra confirmation if needed
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);  // Show success message
      } else {
        alert(data.error || "Failed to reset bookings.");
      }
    } catch (err) {
      console.error("Error resetting bookings:", err);
      alert("Error resetting bookings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Booking Details</h2>
      <div className="mb-4">
        <label htmlFor="seat-count" className="block font-semibold mb-2">
          Number of Seats (1-7):
        </label>
        <input
          id="seat-count"
          type="number"
          min="1"
          max="7"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={flexible}
            onChange={(e) => setFlexible(e.target.checked)}
            className="h-5 w-5"
          />
          <span>Allow seats to be split across rows</span>
        </label>
      </div>

      <div className="flex justify-between space-x-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Booking..." : "Book Seats"}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? "Resetting..." : "Reset Bookings"}
        </button>
      </div>
    </form>
  );
}
