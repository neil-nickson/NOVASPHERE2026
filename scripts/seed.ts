import "dotenv/config";
import { connectDB } from "../lib/db";
import { Event } from "../models/Event";

async function main() {
  await connectDB();

  const existing = await Event.countDocuments();
  if (existing > 0) {
    console.log("Events already seeded");
    process.exit(0);
  }

  await Event.insertMany([
    {
      title: "XX1",
      description: "Flagship coding hackathon between colleges.",
      price: 100
    },
    {
      title: "XX2",
      description: "Design sprint for UI/UX enthusiasts.",
      price: 150
    },
    {
      title: "XX3",
      description: "Robotics challenge and hardware showdown.",
      price: 200
    },
    {
      title: "XX4",
      description: "Inter-college e-sports tournament.",
      price: 250
    },
    {
      title: "XX5",
      description: "Entrepreneurship and pitch competition.",
      price: 300
    }
  ]);

  console.log("Seeded 5 events");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

