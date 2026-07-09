import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.eventSettings.upsert({
    where: { id: 1 },
    create: { id: 1, eventName: "Monomoy Shootout", biddingOpen: true },
    update: {},
  });

  await prisma.item.upsert({
    where: { slug: "half-day-charter" },
    create: {
      slug: "half-day-charter",
      name: "Half-Day Fishing Charter",
      description: "A half-day charter for up to 4 anglers, donated by a local captain.",
      donatedBy: "Cape Cod Charters",
      minBidCents: 20000,
      incrementCents: 2500,
      status: "OPEN",
      sortOrder: 1,
    },
    update: {},
  });

  await prisma.item.upsert({
    where: { slug: "cooler-full-of-swag" },
    create: {
      slug: "cooler-full-of-swag",
      name: "Cooler Full of Fishing Gear",
      description: "A 45-quart cooler stocked with rods, lures, and tournament swag.",
      minBidCents: 5000,
      incrementCents: 1000,
      status: "OPEN",
      sortOrder: 2,
    },
    update: {},
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
