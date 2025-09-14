"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminTable() {
  const [bookings, setBookings] = useState([]);
useEffect(() => {
  api.get("/admin/bookings")
    .then((res) => setBookings(res.data))
    .catch((err) => console.error("Error fetching bookings:", err));
}, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Booking ID</th>
            <th className="border px-4 py-2">Seats</th>
            <th className="border px-4 py-2">User</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td className="border px-4 py-2">{b.id}</td>
              <td className="border px-4 py-2">{b.seats.join(", ")}</td>
              <td className="border px-4 py-2">{b.userId}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
