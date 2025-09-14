import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "../app/context/AuthContext"; // import AuthContext

export const metadata = {
  title: "Train Ticket Booking",
  description: "Book your train seats with strict & flexible allocation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <AuthProvider> {/* Wrap the app in AuthProvider */}
          <Navbar />
          <main className="container mx-auto p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
