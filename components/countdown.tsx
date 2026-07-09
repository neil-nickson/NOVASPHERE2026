"use client";

import { useEffect, useState } from "react";

function getTimeRemaining(target: Date) {
  const total = target.getTime() - new Date().getTime();
  const seconds = Math.max(0, Math.floor((total / 1000) % 60));
  const minutes = Math.max(0, Math.floor((total / 1000 / 60) % 60));
  const hours = Math.max(0, Math.floor((total / (1000 * 60 * 60)) % 24));
  const days = Math.max(0, Math.floor(total / (1000 * 60 * 60 * 24)));
  return { total, days, hours, minutes, seconds };
}

export function Countdown({ date }: { date: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const [time, setTime] = useState(() => ({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  }));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const target = new Date(date);
    const update = () => {
      setTime(getTimeRemaining(target));
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [date, isMounted]);

  if (!isMounted) {
    return (
      <div className="mt-6 flex w-full items-start justify-center gap-2 text-xs font-medium text-white/80 md:gap-4">
        <TimeBox label="Days" value={0} />
        <Separator />
        <TimeBox label="Hours" value={0} />
        <Separator />
        <TimeBox label="Minutes" value={0} />
        <Separator />
        <TimeBox label="Seconds" value={0} />
      </div>
    );
  }

  const expired = time.total <= 0;

  if (expired) {
    return (
      <div className="mt-6 inline-flex rounded-full border border-purple-500/40 bg-purple-500/10 px-4 py-1 text-xs font-medium text-purple-200">
        Event Concluded
      </div>
    );
  }

  return (
    <div className="mt-6 flex w-full items-start justify-center gap-2 text-xs font-medium text-white/80 md:gap-4">
      <TimeBox label="Days" value={time.days} />
      <Separator />
      <TimeBox label="Hours" value={time.hours} />
      <Separator />
      <TimeBox label="Minutes" value={time.minutes} />
      <Separator />
      <TimeBox label="Seconds" value={time.seconds} />
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-[72px] text-center md:min-w-[100px]">
      <div className="font-mono text-4xl font-bold leading-none text-cyan-300 [font-variant-numeric:tabular-nums] drop-shadow-[0_0_14px_rgba(34,211,238,0.55)] md:text-6xl">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-[0.35em] text-white/55 md:text-xs">
        {label}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="pt-1 text-3xl font-semibold leading-none text-cyan-400/50 md:pt-2 md:text-5xl">
      :
    </div>
  );
}

