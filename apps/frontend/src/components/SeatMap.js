"use client";

export default function SeatMap({ seats }) {
  if (!seats || seats.length === 0) {
    return <div className="text-center p-4 text-gray-500">Loading seat map...</div>;
  }

  // Group seats by row for rendering
  const rows = seats.reduce((acc, seat) => {
    acc[seat.row] = acc[seat.row] || [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="mb-4 p-2 bg-gray-800 text-white rounded shadow-md text-center font-bold tracking-widest">
        SCREEN
      </div>
      <div className="space-y-2">
        {Object.values(rows).map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center space-x-1 sm:space-x-2"
          >
            {row.map((seat) => (
    
              <div
                key={seat.id}
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded font-mono text-xs sm:text-sm
                  ${seat.booked
                    ? "bg-yellow-400 text-black cursor-not-allowed" // booked = yellow
                    : "bg-green-200 text-green-800 cursor-pointer" // available = green
                  }`}
                title={`Seat ${seat.seatNumber}`}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
