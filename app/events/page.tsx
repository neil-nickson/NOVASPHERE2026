import { connectDB } from "@/lib/db";
import { Event } from "@/models/Event";
import { Registration } from "@/models/Registration";
import { EventsClient } from "@/components/events-client";
import { WorkshopsClient } from "@/components/workshops-client";

export const dynamic = "force-dynamic";

const COMPETITIVE_EVENT_PRICE = 145;
const WORKSHOP_PRICE = 149;
const WORKSHOP_CAPACITY = 180;

const eventContent = [
  {
    title: "1️⃣ NeuralForge Ideathon",
    time: "🕒 10:00 AM – 12:00 PM & 1:00 PM – 2:00 PM",
    teamSize: "👥 Team Size: 3–4",
    fee: "💰 Fee: ₹145 per person",
    brief:
      "Teams innovate solutions for real-world problems using technology. They design ideas, system flow, and possible implementation strategy, then pitch to judges.",
    rounds: [
      {
        name: "🔹 Round 1 — Briefing & Problem Release",
        time: "10:00 – 10:15",
        points: [
          "Welcome & rules explanation.",
          "Problem statements revealed.",
          "Judging criteria explained."
        ]
      },
      {
        name: "🔹 Round 2 — Ideation & Development",
        time: "10:15 – 11:30",
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
          "Judges provide feedback.",
          "Refinement suggestions shared."
        ]
      },
      {
        name: "🔹 Round 4 — Final Pitch",
        time: "1:00 – 1:45",
        points: [
          "Finalists present full idea.",
          "Live explanation of workflow.",
          "Q&A session with judges."
        ]
      },
      {
        name: "🔹 Round 5 — Deliberation & Result Finalization",
        time: "1:45 – 2:00",
        points: [
          "Judges finalize scores.",
          "Winners decided."
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
    time: "🕒 10:00 AM – 12:00 PM & 1:00 PM – 2:00 PM",
    teamSize: "👥 Team Size: 3",
    fee: "💰 Fee: ₹145 per person",
    brief:
      "A tech-focused debate inspired by MUN format. Teams discuss future technology policies, AI ethics, and tech-related global issues.",
    rounds: [
      {
        name: "🔹 Round 1 — Topic Allocation & Research",
        time: "10:00 – 10:20",
        points: ["Topics distributed.", "Teams prepare structured arguments."]
      },
      {
        name: "🔹 Round 2 — Opening Debate",
        time: "10:20 – 11:20",
        points: ["Structured arguments presented.", "Equal speaking time enforced."]
      },
      {
        name: "🔹 Round 3 — Rebuttal Round",
        time: "11:20 – 12:00",
        points: ["Counter-arguments presented.", "Cross-questioning allowed."]
      },
      {
        name: "🔹 Round 4 — Final Statements",
        time: "1:00 – 1:40",
        points: ["Closing arguments delivered.", "Final defense of position."]
      },
      {
        name: "🔹 Round 5 — Judge Discussion & Results",
        time: "1:40 – 2:00",
        points: ["Judges evaluate performance.", "Final scores declared."]
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
    title: "3️⃣ Quantum Canvas (Tech Poster)",
    time: "🕒 10:00 AM – 11:00 AM",
    teamSize: "👥 Team Size: 2–3",
    fee: "💰 Fee: ₹145 per person",
    brief:
      "Teams creatively visualize technology ideas through posters that communicate innovation clearly and attractively.",
    rounds: [
      {
        name: "🔹 Round 1 — Theme Announcement",
        time: "10:00 – 10:10",
        points: ["Theme revealed.", "Guidelines explained."]
      },
      {
        name: "🔹 Round 2 — Poster Creation",
        time: "10:10 – 10:50",
        points: [
          "Concept development.",
          "Design & creative execution."
        ]
      },
      {
        name: "🔹 Round 3 — Submission & Evaluation",
        time: "10:50 – 11:00",
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
    time: "🕒 11:00 AM – 12:00 PM",
    teamSize: "👥 Team Size: 3",
    fee: "💰 Fee: ₹145 per person",
    brief:
      "A fast-paced multi-level challenge where teams solve tech puzzles, logic tasks, and mini challenges to unlock final solutions.",
    rounds: [
      {
        name: "🔹 Round 1 — Instructions & Warm-Up",
        time: "11:00 – 11:10",
        points: ["Rules explained.", "Sample puzzle demonstrated."]
      },
      {
        name: "🔹 Round 2 — Technical Puzzle Round",
        time: "11:10 – 11:50",
        points: ["Logic-based challenges solved.", "Algorithm & reasoning tasks completed."]
      },
      {
        name: "🔹 Round 3 — Final Unlock Challenge",
        time: "11:50 – 12:00",
        points: ["High-difficulty final task.", "Scores finalized."]
      }
    ],
    judging: [
      "Accuracy of solutions",
      "Speed",
      "Logical thinking",
      "Team collaboration"
    ]
  },
  {
    title: "5️⃣ Debug Dominion",
    time: "🕒 1:00 PM – 2:00 PM",
    teamSize: "👥 Team Size: 2",
    fee: "💰 Fee: ₹145 per person",
    brief:
      "Teams identify and fix errors in provided code. Focus is on debugging skills, accuracy, and speed.",
    rounds: [
      {
        name: "🔹 Round 1 — Code Distribution & Briefing",
        time: "1:00 – 1:10",
        points: ["Buggy code files shared.", "Rules clarified."]
      },
      {
        name: "🔹 Round 2 — Debugging Phase",
        time: "1:10 – 1:50",
        points: ["Identify syntax errors.", "Fix logical mistakes.", "Ensure correct output."]
      },
      {
        name: "🔹 Round 3 — Submission & Evaluation",
        time: "1:50 – 2:00",
        points: ["Final code submission.", "Judges evaluate correctness."]
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
    fee: "💰 Fee: ₹149 per person",
    price: WORKSHOP_PRICE,
    brochureImage: "/workshop.png"
  },
  {
    dbTitle: "AI TOOLS (WORKSHOP)",
    title: "2️⃣ AI TOOLS (WORKSHOP)",
    time: "🕒 1:00 PM – 3:00 PM",
    fee: "💰 Fee: ₹149 per person",
    price: WORKSHOP_PRICE,
    brochureImage: "/workshop.png"
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
      time: event.time,
      teamSize: event.teamSize,
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

