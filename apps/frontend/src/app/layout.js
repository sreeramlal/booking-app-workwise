  import "./globals.css";
  import Navbar from "@/components/Navbar";

  export const metadata = {
    title: "Train Ticket Booking",
    description: "Book your train seats with strict & flexible allocation",
  };

  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="container mx-auto p-6">{children}</main>
        </body>
      </html>
    );
  }
