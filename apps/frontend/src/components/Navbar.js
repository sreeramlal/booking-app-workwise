"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../app/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  if (loading) return null; // optional spinner

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg">
        🚆 Train Booking
      </Link>
      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <Link href="/bookings" className={`${pathname === "/bookings" ? "underline font-semibold" : ""}`}>
              My Bookings
            </Link>
            <Link href="/admin" className={`${pathname === "/admin" ? "underline font-semibold" : ""}`}>
              Admin
            </Link>
            <button
              onClick={() => { logout(); router.push("/login"); }}
              className="bg-red-500 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="bg-green-500 px-4 py-2 rounded">Login</Link>
            <Link href="/register" className="bg-yellow-500 px-4 py-2 rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
