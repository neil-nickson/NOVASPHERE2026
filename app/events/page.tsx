import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { EventsClient } from "@/components/events-client";
import { WorkshopsClient } from "@/components/workshops-client";

export const dynamic = "force-dynamic";

const EVENT_PRICE = 150;

const eventContent = [
  {
    title: "1️⃣ NeuralForge Ideathon",
    time: "🕒 9:45 AM – 12:15 PM",
    teamSize: "👥 Team Size: 3–4",
    fee: "💰 Fee: ₹150 per person",
    brief:
      "Teams innovate solutions for real-world problems using technology. They design ideas, system flow, and possible implementation strategy, then pitch to judges.",
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
        time: "10:00 – 11:15",
        points: [
          "Teams brainstorm solutions.",
          "Create system flow & architecture.",
          "Prepare PPT / prototype."
        ]
      },
      {
        name: "🔹 Round 3 — Preliminary Screening",
        time: "11:15 – 11:45",
        points: [
          "Short 2–3 minute pitches.",
          "Judges shortlist finalists."
        ]
      },
      {
        name: "🔹 Round 4 — Final Pitch",
        time: "11:45 AM – 12:15 PM",
        points: [
          "Finalists present full idea.",
          "Q&A session with judges.",
          "Scores finalized."
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
    title: "2️⃣ Logic Arena: MUN X Tech",
    time: "🕒 10:00 AM – 12:00 PM",
    teamSize: "👥 Team Size: 3",
    fee: "💰 Fee: ₹150 per person",
    brief:
      "A tech-focused debate inspired by MUN format. Teams discuss future technology policies, AI ethics, and tech-related global issues.",
    rounds: [
      {
        name: "🔹 Round 1 — Topic Allocation",
        time: "10:00 – 10:20",
        points: ["Topic distribution.", "Preparation time."]
      },
      {
        name: "🔹 Round 2 — Opening Statements",
        time: "10:20 – 11:00",
        points: ["Structured team arguments.", "Equal speaking time."]
      },
      {
        name: "🔹 Round 3 — Rebuttal Round",
        time: "11:00 – 11:30",
        points: ["Counter-arguments.", "Critical discussion."]
      },
      {
        name: "🔹 Round 4 — Closing Statements",
        time: "11:30 AM – 12:00 PM",
        points: ["Final remarks.", "Judges evaluate & finalize scores."]
      }
    ],
    judging: [
      "Argument strength",
      "Technical awareness",
      "Communication skills",
      "Confidence & clarity",
      "Team coordination"
    ]
  },
  {
    title: "3️⃣ Quantum Canvas (Tech Poster)",
    time: "🕒 9:45 AM – 12:15 PM",
    teamSize: "👥 Team Size: 2–3",
    fee: "💰 Fee: ₹150 per person",
    brief:
      "Teams creatively visualize technology ideas through posters that communicate innovation clearly and attractively.",
    rounds: [
      {
        name: "🔹 Round 1 — Theme Announcement",
        time: "9:45 – 10:00",
        points: ["Theme revealed.", "Instructions given."]
      },
      {
        name: "🔹 Round 2 — Poster Creation",
        time: "10:00 – 11:45",
        points: [
          "Teams design poster.",
          "Concept building & execution."
        ]
      },
      {
        name: "🔹 Round 3 — Submission & Evaluation",
        time: "11:45 AM – 12:15 PM",
        points: ["Poster display.", "Judges walk-through & scoring."]
      }
    ],
    judging: [
      "Creativity & originality",
      "Visual design quality",
      "Tech relevance",
      "Message clarity",
      "Innovation communication"
    ]
  },
  {
    title: "4️⃣ Tech Escape Challenge",
    time: "🕒 10:30 AM – 12:00 PM",
    teamSize: "👥 Team Size: 3",
    fee: "💰 Fee: ₹150 per person",
    brief:
      "A fast-paced multi-level challenge where teams solve tech puzzles, logic tasks, and mini challenges to unlock final solutions.",
    rounds: [
      {
        name: "🔹 Round 1 — Warm-Up Puzzle",
        time: "10:30 – 10:45",
        points: ["Basic logic challenges."]
      },
      {
        name: "🔹 Round 2 — Technical Puzzle Round",
        time: "10:45 – 11:30",
        points: ["Algorithm & reasoning problems."]
      },
      {
        name: "🔹 Round 3 — Final Unlock Challenge",
        time: "11:30 – 12:00",
        points: ["Complex final puzzle.", "Final scoring & winner selection."]
      }
    ],
    judging: [
      "Accuracy of solutions",
      "Speed of completion",
      "Problem-solving ability",
      "Team collaboration"
    ]
  },
  {
    title: "5️⃣ Debug Dominion",
    time: "🕒 10:30 AM – 12:00 PM",
    teamSize: "👥 Team Size: 2",
    fee: "💰 Fee: ₹150 per person",
    brief:
      "Teams identify and fix errors in provided code. Focus is on debugging skills, accuracy, and speed.",
    rounds: [
      {
        name: "🔹 Round 1 — Beginner Debug",
        time: "10:30 – 10:45",
        points: ["Basic syntax issues."]
      },
      {
        name: "🔹 Round 2 — Logic Debug",
        time: "10:45 – 11:30",
        points: ["Intermediate logic errors."]
      },
      {
        name: "🔹 Round 3 — Advanced Debug",
        time: "11:30 – 12:00",
        points: ["Complex bug fixing.", "Final submission & scoring."]
      }
    ],
    judging: [
      "Number of bugs fixed",
      "Correct output",
      "Code efficiency",
      "Completion speed"
    ]
  }
];

const workshops = [
  {
    dbTitle: "WEB DEVELOPMENT (WORKSHOP)",
    title: "1️⃣ WEB DEVELOPMENT (WORKSHOP)",
    time: "🕒 9:30 AM – 12:30 PM",
    fee: "💰 Fee: ₹150 per person",
    price: EVENT_PRICE,
    brochureImage: "/antigravity.jpeg"
  },
  {
    dbTitle: "AI TOOLS (WORKSHOP)",
    title: "2️⃣ AI TOOLS (WORKSHOP)",
    time: "🕒 1:00 PM – 3:00 PM",
    fee: "💰 Fee: ₹150 per person",
    price: EVENT_PRICE,
    brochureImage: "/web development.jpeg"
  }
];

export default async function EventsPage() {
  await connectDB();
  await Event.updateMany({}, { $set: { price: EVENT_PRICE } }).exec();

  const competitiveTitles = eventContent.map((event) => event.title);
  const existingCompetitiveEvents = await Event.find({ title: { $in: competitiveTitles } })
    .lean()
    .exec();
  const existingCompetitiveTitleSet = new Set(existingCompetitiveEvents.map((event) => event.title));
  const missingCompetitiveEvents = eventContent.filter(
    (event) => !existingCompetitiveTitleSet.has(event.title)
  );

  if (missingCompetitiveEvents.length > 0) {
    await Event.insertMany(
      missingCompetitiveEvents.map((event) => ({
        title: event.title,
        description: event.brief,
        price: EVENT_PRICE
      }))
    );
  }

  const competitiveEventDocs = await Event.find({ title: { $in: competitiveTitles } })
    .lean()
    .exec();
  const competitiveEventMap = new Map(competitiveEventDocs.map((event) => [event.title, event]));

  const workshopTitles = workshops.map((workshop) => workshop.dbTitle);
  const existingWorkshopEvents = await Event.find({ title: { $in: workshopTitles } })
    .lean()
    .exec();

  const existingWorkshopTitleSet = new Set(existingWorkshopEvents.map((event) => event.title));
  const missingWorkshops = workshops.filter(
    (workshop) => !existingWorkshopTitleSet.has(workshop.dbTitle)
  );

  if (missingWorkshops.length > 0) {
    await Event.insertMany(
      missingWorkshops.map((workshop) => ({
        title: workshop.dbTitle,
        description: `${workshop.dbTitle} registration`,
        price: workshop.price
      }))
    );
  }

  const workshopEventDocs = await Event.find({ title: { $in: workshopTitles } }).lean().exec();
  const workshopEventMap = new Map(
    workshopEventDocs.map((event) => [event.title, event])
  );

  const eventCards = eventContent.map((event, index) => {
    const dbEvent = competitiveEventMap.get(event.title);
    return {
      id: dbEvent ? String(dbEvent._id) : `event-${index + 1}`,
      title: event.title,
      description: event.brief,
      price: Number(dbEvent?.price ?? EVENT_PRICE),
      time: event.time,
      teamSize: event.teamSize,
      finals: event.finals,
      brief: event.brief,
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
        brochureImage: workshop.brochureImage
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
      </div>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-purple-400">Competitive Events</h2>
        <EventsClient events={eventCards} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-purple-400">Workshops</h2>
        <WorkshopsClient workshops={workshopCards} />
      </section>

    </div>
  );
}

