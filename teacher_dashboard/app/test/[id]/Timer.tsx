"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  minutes: number;
  onTimeUp: () => void;
}

export default function Timer({ minutes, onTimeUp }: TimerProps) {
  const [time, setTime] = useState(minutes * 60);

  useEffect(() => {
    if (time <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [time]);

  const mm = String(Math.floor(time / 60)).padStart(2, "0");
  const ss = String(time % 60).padStart(2, "0");

  return (
    <div className="text-right font-bold text-red-600 text-lg">
      Time Left: {mm}:{ss}
    </div>
  );
}
