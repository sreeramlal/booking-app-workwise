"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link"; // Import the Link component
import api from "../lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/verify")
        .then(() => setUser(true))
        .catch(() => setUser(null));
    }
  }, [pathname]);

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        🚆 Train Booking
      </Link>
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <Link
              href="/bookings"
              className={`${
                pathname === "/bookings" ? "underline font-semibold" : ""
              }`}
            >
              My Bookings
            </Link>
            <Link
              href="/admin"
              className={`${
                pathname === "/admin" ? "underline font-semibold" : ""
              }`}
            >
              Admin
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
                router.push("/login");
              }}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="bg-green-500 px-4 py-2 rounded">
              Login
            </Link>
            <Link href="/register" className="bg-yellow-500 px-4 py-2 rounded">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
