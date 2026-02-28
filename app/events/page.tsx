import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { EventsClient } from "@/components/events-client";
import { WorkshopsClient } from "@/components/workshops-client";

export const dynamic = "force-dynamic";

const eventContent = [
  {
    title: "1️⃣ NeuralForge Ideathon",
    time: "🕒 10:00 AM – 12:30 PM",
    finals: "🏁 Finals: 2:30 PM – 3:00 PM",
    teamSize: "👥 Team Size: 3–4",
    fee: "💰 Fee: ₹150 per person",
    brief:
      "Teams innovate solutions for real-world problems using technology. They design ideas, system flow, and possible implementation strategy, then pitch to judges.",
    rounds: [
      {
        name: "🔹 Round 1 — Problem Briefing & Ideation",
        time: "10:00 – 10:15",
        points: [
          "Problem statements announced.",
          "Rules explained.",
          "Teams understand challenge scope."
        ]
      },
      {
        name: "🔹 Round 2 — Solution Development",
        time: "10:15 – 11:45",
        points: [
          "Teams brainstorm ideas.",
          "Build concept, architecture, workflow.",
          "Prepare presentation (PPT / diagrams)."
        ]
      },
      {
        name: "🔹 Round 3 — Preliminary Pitch",
        time: "11:45 – 12:30",
        points: [
          "Teams give short pitches.",
          "Judges evaluate and shortlist finalists."
        ]
      },
      {
        name: "🔹 Final Round — Grand Pitch",
        time: "2:30 – 3:00",
        points: [
          "Finalists present complete idea.",
          "Q&A by judges.",
          "Winners selected."
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
    title: "2️⃣ Logic Arena:Tech X Debate",
    time: "🕒 10:00 AM – 12:30 PM",
    finals: "🏁 Finals: 2:30 PM – 3:00 PM",
    teamSize: "👥 Team Size: 3",
    fee: "💰 Fee: ₹130 per person",
    brief:
      "A tech-focused debate inspired by MUN format. Teams discuss future technology policies, AI ethics, and tech-related global issues.",
    rounds: [
      {
        name: "🔹 Round 1 — Topic Allocation",
        time: "10:30 – 10:45",
        points: ["Teams receive debate topic.", "Preparation time given."]
      },
      {
        name: "🔹 Round 2 — Opening Debate",
        time: "10:45 – 11:30",
        points: ["Each team presents main arguments.", "Structured speaking turns."]
      },
      {
        name: "🔹 Round 3 — Rebuttal Round",
        time: "11:30 – 12:00",
        points: ["Teams counter opposing ideas.", "Critical thinking tested."]
      },
      {
        name: "🔹 Round 4 — Final Statements",
        time: "12:00 – 12:30",
        points: ["Closing arguments.", "Judges finalize scores."]
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
    time: "🕒 10:00 AM – 12:30 PM",
    teamSize: "👥 Team Size: 2–3",
    fee: "💰 Fee: ₹100 per person",
    brief:
      "Teams creatively visualize technology ideas through posters that communicate innovation clearly and attractively.",
    rounds: [
      {
        name: "🔹 Round 1 — Theme Announcement",
        time: "10:30 – 10:40",
        points: ["Tech theme revealed.", "Instructions provided."]
      },
      {
        name: "🔹 Round 2 — Design Creation",
        time: "10:40 – 12:00",
        points: [
          "Teams create poster using manual or digital tools.",
          "Concept development + design execution."
        ]
      },
      {
        name: "🔹 Round 3 — Display & Evaluation",
        time: "12:00 – 12:30",
        points: ["Posters submitted.", "Judges evaluate displays."]
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
    time: "🕒 1:30 PM – 2:30 PM",
    teamSize: "👥 Team Size: 3",
    fee: "💰 Fee: ₹140 per person",
    brief:
      "A fast-paced multi-level challenge where teams solve tech puzzles, logic tasks, and mini challenges to unlock final solutions.",
    rounds: [
      {
        name: "🔹 Round 1 — Warm-Up Puzzle",
        time: "1:30 – 1:45",
        points: ["Basic logic problems.", "Tests teamwork and speed."]
      },
      {
        name: "🔹 Round 2 — Technical Challenge",
        time: "1:45 – 2:10",
        points: ["Algorithm-based puzzles.", "Pattern recognition & reasoning."]
      },
      {
        name: "🔹 Round 3 — Final Unlock Round",
        time: "2:10 – 2:30",
        points: ["Complex challenge.", "Teams race to final answer."]
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
    time: "🕒 1:30 PM – 2:30 PM",
    teamSize: "👥 Team Size: 2",
    fee: "💰 Fee: ₹100 per person",
    brief:
      "Teams identify and fix errors in provided code. Focus is on debugging skills, accuracy, and speed.",
    rounds: [
      {
        name: "🔹 Round 1 — Beginner Bugs",
        time: "1:30 – 1:45",
        points: ["Simple syntax errors.", "Warm-up phase."]
      },
      {
        name: "🔹 Round 2 — Logic Errors",
        time: "1:45 – 2:10",
        points: ["Algorithm or logic mistakes.", "Deeper understanding required."]
      },
      {
        name: "🔹 Round 3 — Advanced Debug",
        time: "2:10 – 2:30",
        points: ["Complex debugging challenge.", "Final scoring based on output."]
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
    dbTitle: "ANTIGRAVITY TOOL (WORKSHOP)",
    title: "1️⃣ ANTIGRAVITY TOOL (WORKSHOP)",
    time: "🕒 10:00 AM – 12:30 PM",
    fee: "💰 Fee: ₹150 per person",
    price: 150,
    brochureImage: "/antigravity.jpeg"
  },
  {
    dbTitle: "WEB DEVELOPMENT (WORKSHOP)",
    title: "2️⃣ WEB DEVELOPMENT (WORKSHOP)",
    time: "🕒 1:00 PM – 3:15 PM",
    fee: "💰 Fee: ₹150 per person",
    price: 150,
    brochureImage: "/web development.jpeg"
  }
];

export default async function EventsPage() {
  await connectDB();
  const dbEvents = await Event.find().sort({ createdAt: 1 }).lean().exec();

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
    const dbEvent = dbEvents[index];
    return {
      id: dbEvent ? String(dbEvent._id) : `event-${index + 1}`,
      title: event.title,
      description: event.brief,
      price: Number(event.fee.match(/₹(\d+)/)?.[1] ?? 0),
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

