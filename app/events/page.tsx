import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { Registration } from "@/models/Registration";
import { EventsClient } from "@/components/events-client";
import { WorkshopsClient } from "@/components/workshops-client";

export const dynamic = "force-dynamic";

const COMPETITIVE_EVENT_PRICE = 99;
const WORKSHOP_PRICE = 149;
const WORKSHOP_CAPACITY = 180;

const eventContent = [
  {
    title: "1️⃣ NeuralForge Ideathon",
    teamSize: "👥 Team Size: 3–4",
    capacity: "📊 Capacity: 12–15 Teams (~45–55 participants)",
    fee: "💰 Fee: ₹99 per head",
    brief:
      "Teams design impactful solutions for real-world problems and present them through structured ideation, reviews, and final pitching.",
    rounds: [
      {
        name: "🔹 Round 1 — Briefing & Problem Release",
        time: "9:45 – 10:00",
        points: [
          "Welcome & rules explanation.",
          "Problem statements revealed.",
          "Judging criteria explained."
        ]
      },
      {
        name: "🔹 Round 2 — Ideation & Development",
        time: "10:00 – 11:30",
        points: [
          "Teams brainstorm solutions.",
          "Create system flow & architecture.",
          "Prepare PPT / prototype."
        ]
      },
      {
        name: "🔹 Round 3 — Mid Review",
        time: "11:30 – 12:00",
        points: [
          "Teams present progress updates.",
          "Mentor/judge feedback provided."
        ]
      },
      {
        name: "🍽 Lunch Break",
        time: "12:00 – 1:00",
        points: ["Break before final pitching rounds."]
      },
      {
        name: "🔹 Round 4 — Final Pitch",
        time: "1:00 – 1:45",
        points: [
          "Finalists present complete idea.",
          "Demonstration of solution approach.",
          "Q&A session with judges."
        ]
      },
      {
        name: "🔹 Round 5 — Deliberation & Results",
        time: "1:45 – 2:15",
        points: [
          "Judges finalize scores.",
          "Winner announcement."
        ]
      }
    ],
    judging: [
      "Innovation & originality",
      "Technical feasibility",
      "Real-world impact",
      "Problem solving approach",
      "Presentation clarity"
    ]
  },
  {
    title: "2️⃣ Logic Arena: Tech X Debate",
    teamSize: "👥 Team Size: 3",
    capacity: "📊 Capacity: 10–12 Teams (~30–36 participants)",
    fee: "💰 Fee: ₹99 per head",
    brief:
      "A high-structure technical debate where teams prepare, rebut, and defend positions across moderated rounds.",
    rounds: [
      {
        name: "🔹 Round 1 — Topic Allocation & Preparation",
        time: "9:45 – 10:15",
        points: ["Debate topics distributed.", "Teams prepare arguments."]
      },
      {
        name: "🔹 Round 2 — Opening Debate",
        time: "10:15 – 11:15",
        points: ["Teams present structured arguments.", "Moderated speaking rounds."]
      },
      {
        name: "🔹 Round 3 — Rebuttal Round",
        time: "11:20 – 12:00",
        points: ["Counter arguments presented.", "Cross questioning allowed."]
      },
      {
        name: "🍽 Lunch Break",
        time: "12:00 – 1:00",
        points: ["Break before final statements and judging."]
      },
      {
        name: "🔹 Round 4 — Final Statements",
        time: "1:00 – 1:40",
        points: ["Closing arguments delivered.", "Final defense of positions."]
      },
      {
        name: "🔹 Round 5 — Judge Discussion & Results",
        time: "1:45 – 2:15",
        points: ["Judges evaluate performances.", "Final rankings announced."]
      }
    ],
    judging: [
      "Argument strength",
      "Technical awareness",
      "Clarity & confidence",
      "Logical reasoning",
      "Team coordination"
    ]
  },
  {
    title: "3️⃣ Tech Escape Challenge",
    teamSize: "👥 Team Size: 3",
    capacity: "📊 Capacity: 12–15 Teams (~36–45 participants)",
    fee: "💰 Fee: ₹99 per head",
    brief:
      "A multi-stage puzzle and logic event where teams solve increasingly difficult technical challenges under time pressure.",
    rounds: [
      {
        name: "🔹 Round 1 — Instructions & Orientation",
        time: "9:45 – 10:00",
        points: [
          "Event rules explained.",
          "Overview of challenge structure.",
          "Sample puzzle demonstration."
        ]
      },
      {
        name: "🔹 Round 2 — Puzzle & Logic Rounds",
        time: "10:00 – 11:30",
        points: [
          "Teams solve multiple technical puzzles.",
          "Challenges include logic, algorithms, and problem solving."
        ]
      },
      {
        name: "🔹 Round 3 — Advanced Challenge",
        time: "11:30 – 12:00",
        points: ["Higher difficulty puzzles released.", "Teams race to solve final tasks."]
      },
      {
        name: "🍽 Lunch Break",
        time: "12:00 – 1:00",
        points: ["Break before final escape round."]
      },
      {
        name: "🔹 Round 4 — Final Escape Round",
        time: "1:00 – 1:45",
        points: [
          "Complex multi-stage challenge.",
          "Teams combine logic, coding ideas, and reasoning."
        ]
      },
      {
        name: "🔹 Round 5 — Score Finalization & Results",
        time: "1:45 – 2:15",
        points: ["Scores evaluated.", "Top teams announced."]
      }
    ],
    judging: [
      "Accuracy of solutions",
      "Speed and completion",
      "Logical thinking",
      "Problem solving approach",
      "Team coordination"
    ]
  },
  {
    title: "4️⃣ Debug Dominion",
    teamSize: "👥 Team Size: 2–3",
    capacity: "📊 Capacity: TBA",
    fee: "💰 Fee: ₹99 per head",
    brief:
      "A competitive debugging challenge where teams race to identify and fix bugs across multiple rounds of increasing difficulty.",
    rounds: [],
    judging: [
      "Debugging speed",
      "Code accuracy",
      "Problem solving approach",
      "Logical thinking"
    ]
  },
  {
    title: "5️⃣ Tech Poster",
    teamSize: "👥 Team Size: 1–2",
    capacity: "📊 Capacity: TBA",
    fee: "💰 Fee: ₹99 per head",
    brief:
      "Showcase your technical knowledge and creativity through well-designed poster presentations evaluated on content depth, design, and clarity.",
    rounds: [],
    judging: [
      "Content depth",
      "Visual design",
      "Presentation clarity",
      "Technical accuracy"
    ]
  }
];

const workshops = [
  {
    dbTitle: "WEB DEVELOPMENT (WORKSHOP)",
    title: "1️⃣ WEB DEVELOPMENT (WORKSHOP)",
    time: "🕒 9:30 AM – 12:30 PM",
    fee: "💰 Fee: ₹149 per person",
    price: WORKSHOP_PRICE,
    brochureImage: "/worshop.jpeg"
  },
  {
    dbTitle: "AI TOOLS (WORKSHOP)",
    title: "2️⃣ AI TOOLS (WORKSHOP)",
    time: "🕒 1:00 PM – 3:00 PM",
    fee: "💰 Fee: ₹149 per person",
    price: WORKSHOP_PRICE,
    brochureImage: "/worshop.jpeg"
  }
];

export default async function EventsPage() {
  await connectDB();
  const competitiveTitles = eventContent.map((event) => event.title);
  await Event.bulkWrite(
    eventContent.map((event) => ({
      updateOne: {
        filter: { title: event.title },
        update: {
          $set: {
            description: event.brief,
            price: COMPETITIVE_EVENT_PRICE
          },
          $setOnInsert: {
            title: event.title
          }
        },
        upsert: true
      }
    }))
  );

  const workshopTitles = workshops.map((workshop) => workshop.dbTitle);
  await Event.bulkWrite(
    workshops.map((workshop) => ({
      updateOne: {
        filter: { title: workshop.dbTitle },
        update: {
          $set: {
            description: `${workshop.dbTitle} registration`,
            price: WORKSHOP_PRICE
          },
          $setOnInsert: {
            title: workshop.dbTitle
          }
        },
        upsert: true
      }
    }))
  );

  const [competitiveEventDocs, workshopEventDocs] = await Promise.all([
    Event.find({ title: { $in: competitiveTitles } }).lean().exec(),
    Event.find({ title: { $in: workshopTitles } }).lean().exec()
  ]);

  const competitiveEventMap = new Map(competitiveEventDocs.map((event) => [event.title, event]));
  const workshopEventMap = new Map(
    workshopEventDocs.map((event) => [event.title, event])
  );

  const workshopEventIds = workshopEventDocs.map((event) => event._id);
  const workshopRegistrations: Array<{ _id: unknown; total: number }> =
    workshopEventIds.length > 0
      ? await Registration.aggregate<{ _id: unknown; total: number }>([
          {
            $match: {
              eventId: { $in: workshopEventIds },
              status: "paid"
            }
          },
          {
            $group: {
              _id: "$eventId",
              total: { $sum: { $ifNull: ["$participantCount", 1] } }
            }
          }
        ])
      : [];

  const workshopRegisteredCountById = new Map(
    workshopRegistrations.map((entry) => [String(entry._id), entry.total])
  );

  const eventCards = eventContent.map((event, index) => {
    const dbEvent = competitiveEventMap.get(event.title);
    return {
      id: dbEvent ? String(dbEvent._id) : `event-${index + 1}`,
      title: event.title,
      description: event.brief,
      price: Number(dbEvent?.price ?? COMPETITIVE_EVENT_PRICE),
      teamSize: event.teamSize,
      brief: event.brief,
      capacity: event.capacity,
      rounds: event.rounds,
      judging: event.judging
    };
  });

  const workshopCards = workshops
    .map((workshop) => {
      const dbEvent = workshopEventMap.get(workshop.dbTitle);
      if (!dbEvent) return null;

      return {
        id: String(dbEvent._id),
        title: workshop.title,
        time: workshop.time,
        fee: workshop.fee,
        price: Number(dbEvent.price),
        brochureImage: workshop.brochureImage,
        seatsLeft: Math.max(
          0,
          WORKSHOP_CAPACITY - (workshopRegisteredCountById.get(String(dbEvent._id)) ?? 0)
        )
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
        <p className="mt-2 max-w-2xl text-sm text-white/70">
          Explore all event categories and detailed round-wise structure for
          NOVASPHERE 2026.
        </p>
        <p className="mt-3 inline-flex rounded-full border border-emerald-300/35 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
          Highlights: Trophy's and Physical Certificates  will be awarded for Winners and Runners.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-purple-400">Workshops</h2>
        <WorkshopsClient workshops={workshopCards} />
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-purple-400">Competitive Events</h2>
        <EventsClient events={eventCards} />
      </section>

    </div>
  );
}

