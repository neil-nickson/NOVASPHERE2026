import Link from "next/link";
import dynamic from "next/dynamic";
import { Countdown } from "@/components/countdown";

const HomeEventsSpotlight = dynamic(
  () => import("@/components/home-events-spotlight").then((mod) => mod.HomeEventsSpotlight),
  {
    ssr: false,
    loading: () => (
      <section className="rounded-3xl border border-white/10 bg-black/45 p-6 text-sm text-white/60">
        Loading featured events...
      </section>
    )
  }
);

const EVENT_DATE = "2026-03-16T09:00:00+05:30";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-glow">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src="/event-hero.mp4" type="video/mp4" />
        </video>

        <div className="relative z-10 flex flex-col gap-8 bg-gradient-to-t from-black/80 via-black/40 to-black/10 px-8 py-16 md:flex-row md:items-center md:px-12 md:py-20">
          <div className="max-w-xl">
            <p className="text-center text-2xl font-black uppercase tracking-[0.34em] text-purple-400 md:text-4xl">
              NOVASPHERE 2026
            </p>
            <h1 className="mt-3 text-center text-lg font-semibold tracking-tight md:text-2xl">
              School of Computing — Department of Computer Science &amp; Engineering.
              Where tomorrow&apos;s innovators forge the future today.
            </h1>
            <p className="mt-4 text-sm text-white/70 md:text-base">
              Step into a battlefield of ideas where innovation meets intellect — pitch
              bold visions, design creative solutions, debate disruptive technologies,
              and crack real-world coding challenges across four dynamic flagship
              events.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/events"
                className="rounded-full bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 hover:bg-blue-400"
              >
                Register Now
              </Link>
              <span className="text-xs text-white/70">
                Limited seats per event • Secure your slot early
              </span>
            </div>
            <Countdown date={EVENT_DATE} />
          </div>
          <div className="ml-auto flex max-w-sm flex-col gap-4 rounded-2xl border border-white/10 bg-black/60 p-5 text-xs text-white/70">
            <div className="flex items-center justify-between">
              <span className="text-white/60">Venue</span>
              <span className="font-medium text-white">SCAS Block, SIST</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Date</span>
              <span className="font-medium text-white">16 Mar, 2026 • 9:00 AM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Time</span>
              <span className="font-medium text-white">9:00 AM - 3:30 PM</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60">Colleges</span>
              <span className="font-medium text-white">All colleges</span>
            </div>
            <div className="mt-1 rounded-xl bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-fuchsia-400/20 px-3 py-2 text-[11px] text-emerald-100">
              One platform for registrations, schedules, results, and event updates for
              every participating student team.
            </div>
          </div>
        </div>
      </section>

      <HomeEventsSpotlight />

      <section className="rounded-3xl border border-cyan-500/20 bg-black/45 p-6 md:p-10">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-purple-400 md:text-4xl">
            About NOVASPHERE
          </h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-cyan-400/80" />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-cyan-500/30 bg-black/45 p-6 text-sm leading-7 text-white/75">
            <h3 className="text-3 font-semibold text-purple-400 md:text-2xl">The Challenge</h3>
            <p className="mt-4">
              NOVASPHERE 2026 is a dynamic inter-college innovation summit designed
              to ignite bold thinking and breakthrough ideas. It brings together the
              brightest young minds to pitch visionary concepts, design compelling
              visual solutions, engage in high-impact tech debates, and conquer
              real-time debugging battles.
            </p>
            <p className="mt-4">
              Across four flagship events — Ideathon, Quantum Canvas, TechX Debate,
              Tech Escape Challenge and Debug Domain — participants will test their
              creativity, analytical thinking, technical knowledge, and presentation
              mastery in a celebration of ideas over execution.
            </p>
          </article>

          <article className="rounded-2xl border border-cyan-500/30 bg-black/45 p-6 text-sm leading-7 text-white/75">
            <h3 className="text-3 font-semibold text-purple-400 md:text-2xl">The Opportunity</h3>
            <p className="mt-4">
              With exciting prizes, prestigious recognition, and a platform to
              showcase your intellectual brilliance, NOVASPHERE 2026 empowers you to
              step into the spotlight.
            </p>
            <p className="mt-4">
              Present your ideas before expert panels, compete with the sharpest
              innovators, expand your network, and build the confidence to transform
              concepts into future realities.
            </p>
            <p className="mt-4">
              This isn’t just a competition — it’s where ideas find their voice and
              innovators find their stage.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl border border-cyan-500/20 bg-black/45 p-6 md:p-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-purple-400 md:text-4xl">
            The Learning Experience
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/75 md:text-base">
            At NovaSphere 2026, learning goes beyond listening — it&apos;s about building. Both
            workshops are fully hands-on, meaning participants won&apos;t just watch demonstrations;
            they will actively create, experiment, and develop real working outputs during the
            session. These workshops are structured to ensure every participant leaves with
            practical experience and tangible results.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-cyan-500/30 bg-black/45 p-6 text-sm leading-7 text-white/75">
            <h3 className="text-lg font-semibold text-purple-400 md:text-xl">
              🤖 AI Tools Workshop
            </h3>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-200/80">
              Hands-On Innovation with No-Code &amp; AI Platforms
            </p>
            <p className="mt-3">
              The AI Tools Workshop is a practical, build-focused session where participants will
              actively create AI-powered solutions using modern no-code and low-code platforms.
              With a special focus on tools like Antigravity and similar rapid-development
              ecosystems, this workshop empowers participants to transform ideas into working
              digital solutions — live during the session.
            </p>
            <p className="mt-3">
              Instead of theory-heavy explanations, the session follows a guided build format.
              Participants will be given a real-world problem and will step-by-step construct a
              solution using AI-assisted tools. From designing workflows to integrating automation
              and smart features, every attendee will work directly on their own system.
            </p>
            <p className="mt-3 font-semibold text-white/85">During the workshop, participants will:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Build a functional AI-powered mini application.</li>
              <li>Use drag-and-drop interfaces to create workflows.</li>
              <li>Implement automation without writing complex code.</li>
              <li>Integrate AI-generated content or logic.</li>
              <li>Test and refine their digital solution in real time.</li>
            </ul>
            <p className="mt-3">
              By the end of the session, participants will have a working prototype and a clear
              understanding of how modern AI platforms accelerate innovation. The focus is on
              execution, experimentation, and rapid creation — giving attendees a real builder&apos;s
              mindset.
            </p>
          </article>

          <article className="rounded-2xl border border-cyan-500/30 bg-black/45 p-6 text-sm leading-7 text-white/75">
            <h3 className="text-lg font-semibold text-purple-400 md:text-xl">
              🌐 Web Development Workshop
            </h3>
            <p className="mt-2 text-xs uppercase tracking-[0.12em] text-cyan-200/80">
              Hands-On Web App Development from Scratch
            </p>
            <p className="mt-3">
              The Web Development Workshop is designed as an interactive coding session where
              participants build a responsive web application step-by-step. This is not a passive
              lecture — attendees will code along in real time, gaining direct experience in
              structuring, styling, and making a website functional.
            </p>
            <p className="mt-3">
              Participants will start with a blank project and progressively develop a complete,
              responsive web page. The session focuses on clarity, structure, and modern practices
              while ensuring that every concept is immediately applied through hands-on coding.
            </p>
            <p className="mt-3 font-semibold text-white/85">During the workshop, participants will:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Write and structure HTML content.</li>
              <li>Design layouts using CSS.</li>
              <li>Add interactivity using JavaScript basics.</li>
              <li>Implement responsive design principles.</li>
              <li>Test and preview their live web application.</li>
            </ul>
            <p className="mt-3">
              By the end of the session, every participant will have built their own working web
              project and understood the workflow of front-end development. The emphasis is on
              practical skill-building, not just theoretical knowledge.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          General <span className="text-purple-400">Rules</span>
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          <article className="rounded-2xl border border-cyan-500/20 bg-black/45 p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl" aria-hidden="true">
                💻
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-amber-400">Laptop Mandatory</h3>
                <p className="mt-2 text-lg text-white/70">
                  Bring your own laptop with charger for all competitions.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-cyan-500/20 bg-black/45 p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl" aria-hidden="true">
                🪪
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-amber-400">College ID Required</h3>
                <p className="mt-2 text-lg text-white/70">
                  Valid college ID card must be presented at entry.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-cyan-500/20 bg-black/45 p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl" aria-hidden="true">
                ⏰
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-amber-400">Report 15 Min Early</h3>
                <p className="mt-2 text-lg text-white/70">
                  Arrive at least 15 minutes before your event starts.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-cyan-500/20 bg-black/45 p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl" aria-hidden="true">
                ⚖️
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-amber-400">Judge&apos;s Decision Final</h3>
                <p className="mt-2 text-lg text-white/70">
                  All decisions made by judges are final and binding.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-cyan-500/20 bg-black/45 p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl" aria-hidden="true">
                📢
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-amber-400">Rules Update Notice</h3>
                <p className="mt-2 text-lg text-white/70">
                  Organizers reserve the right to modify rules if needed.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-2xl border border-cyan-500/20 bg-black/45 p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl" aria-hidden="true">
                🧭
              </span>
              <div>
                <h3 className="text-2xl font-semibold text-amber-400">Coordinator Instructions</h3>
                <p className="mt-2 text-lg text-white/70">
                  Follow coordinator instructions at all times.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="space-y-5">
        <article className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/50 to-indigo-950/60 p-6 text-center">
          <h3 className="text-lg font-semibold uppercase tracking-wide text-cyan-100">
            Chief Patrons
          </h3>
          <div className="mt-3 space-y-1 text-sm text-white/90 md:text-base">
            <p>Dr. Mariazeena Johnson, Chancellor</p>
            <p>Dr. Maria Johnson, President</p>
            <p>Ms. Maria Catherine Johnson, Vice President</p>
          </div>
        </article>

        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-indigo-950/55 to-slate-950/70 p-6 text-center">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-cyan-100">
              Student Coordinators
            </h3>
            <div className="mt-3 space-y-1 text-sm text-white/90 md:text-base">
              <p>Ishwarya Ramesh, 2ndYear(DS)</p>
              <p>Navneeth Tripathy, 1st Year(AIML)</p>
              <p>Neil Nickson, 1st Year(AIML)</p>
              <p>Mohamed Taufiq, 1st Year(AIML)</p>
              <p>Mohanvel, 1st Year(AIML)</p>
              <p>Keith Rocha, 1st Year(AIML)</p>
              <p>Muhammed Haani,1st Year(AIML)</p>
            </div>
          </article>

          <article className="rounded-2xl border border-cyan-500/40 bg-gradient-to-r from-indigo-950/55 to-slate-950/70 p-6 text-center">
            <h3 className="text-lg font-semibold uppercase tracking-wide text-cyan-100">
              Faculty Coordinators
            </h3>
            <div className="mt-3 space-y-1 text-sm text-white/90 md:text-base">
              <p>Dr. Nikita Soren, Asst Prof., CSE</p>
              <p>Dr. J.Jeyshri, Asst Prof., CSE</p>
              <p>Dr.S.Mangaikarasi, Asst Prof., CSE</p>
              <p>Ms.V.K. Ramya Bharathi, Asst Prof., CSE</p>
              <p>Dr.D.Jerusha, Asst Prof., CSE</p>
            </div>
          </article>
        </div>
      </section>

    </div>
  );
}

