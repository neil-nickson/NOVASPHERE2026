const faqItems = [
  {
    question: "1️⃣ What is NOVASPHERE 2026?",
    answer:
      "NOVASPHERE 2026 is an inter-college innovation summit featuring Ideathon, Tech X Debate, Tech Escape Challenge, and two hands-on technical workshops."
  },
  {
    question: "2️⃣ Who can participate?",
    answer:
      "Students from any recognized college/university can participate. Individual and team participation depends on the specific event rules."
  },
  {
    question: "3️⃣ Is it necessary to bring a working project for the Ideathon?",
    answer:
      "No. The Ideathon focuses on idea pitching. Participants must present their concept using a PPT — no prototype or coding is required and PPT should be made in the venue after the topic is given."
  },
  {
    question: "4️⃣ Can I participate in more than one event?",
    answer:
      "Yes! Participants are allowed to register for multiple events, provided there are no schedule clashes."
  },
  {
    question: "5️⃣ What is the refund policy?",
    answer:
      "Registrations are non-refundable 7 days before the event. Before that, 80% refund is issued within 5–7 business days."
  },
  {
    question: "6️⃣ What is the dress code?",
    answer:
      "Participants are expected to maintain a smart casual or formal dress code throughout the event."
  },
  {
    question: "7️⃣ What do I need to bring for the event?",
    answer: "Participants should bring: Valid College ID and Laptop (for events and workshops)."
  },
  {
    question: "8️⃣ Will certificates be provided?",
    answer:
      "Yes. Participation certificates will be provided to all participants, and winners will receive special recognition."
  },
  {
    question: "9️⃣ How will participants be judged?",
    answer:
      "Participants will be evaluated by a panel of judges based on Innovation & Creativity, Technical Knowledge, Presentation Skills, and Problem-Solving Ability."
  },
  {
    question: "🔟 How do I contact organizers?",
    answer: "Email: novasphere.sist@gmail.com | Phone: +91 8610219015 (event day only)"
  },
  {
    question: "1️⃣1️⃣ What is the team size?",
    answer:
      "Team size depends on the event and is mentioned in each event description."
  },
  {
    question: "1️⃣2️⃣ What is the registration fee?",
    answer:
      "Competitive events are ₹145 per team. Workshops are ₹149 per person."
  },
  {
    question: "1️⃣3️⃣ What happens if a participant arrives late?",
    answer: "Late entry may not be allowed once briefing or rounds have started."
  },
  
];

export default function FaqPage() {
  return (
    <section className="rounded-3xl border border-purple-500/30 bg-black/45 px-8 py-12 md:px-12 md:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300 md:text-sm">
          // common questions
        </p>
        <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-slate-100 md:text-7xl">
          FAQ
        </h1>
        <p className="mt-4 text-base text-white/65 md:text-xl">
          Everything you need to know before the big day.
        </p>

        <div className="mt-8 space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-purple-500/25 bg-black/35 px-5 py-4 text-white/85"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-white marker:content-none md:text-base">
                <span>{item.question}</span>
                <span className="text-purple-300 transition-transform duration-200 group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-white/70 md:text-base">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
