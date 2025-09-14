// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Deleting existing data...");
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Seeding new data...");

  const user = await prisma.user.create({
    data: { email: "test@example.com", password: "password123" },
  });

  const seats = [];
  let seatCounter = 1;
  for (let row = 1; row <= 12; row++) {
    const seatsInRow = row === 12 ? 3 : 7;
    for (let i = 0; i < seatsInRow; i++) {
      seats.push({ number: seatCounter, row });
      seatCounter++;
    }
  }

  await prisma.seat.createMany({ data: seats });
  console.log(`🎟 Created ${seatCounter - 1} seats`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
