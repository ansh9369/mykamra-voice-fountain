"use client";

import { useEffect, useRef } from "react";
import { useTransform, type MotionValue } from "framer-motion";
import { MotionReadout } from "./MotionReadout";

const PITCH_BANDS: [number, string][] = [
  [0, "Silence"],
  [100, "Deep bass"],
  [250, "Bass"],
  [500, "Warm"],
  [1000, "Mid"],
  [2000, "Bright"],
  [4000, "Sharp"],
  [Infinity, "Hiss"],
];

function labelFor(freq: number) {
  for (let i = PITCH_BANDS.length - 1; i >= 0; i--) {
    if (freq >= PITCH_BANDS[i][0]) return PITCH_BANDS[i][1];
  }
  return "Silence";
}

function PitchLabel({ frequency }: { frequency: MotionValue<number> }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    return frequency.on("change", (f) => {
      if (ref.current) ref.current.textContent = labelFor(f);
    });
  }, [frequency]);
  return (
    <span ref={ref} className="font-display text-sm">
      {labelFor(frequency.get())}
    </span>
  );
}

export function LiveReadouts({
  volume,
  frequency,
  db,
}: {
  volume: MotionValue<number>;
  frequency: MotionValue<number>;
  db: MotionValue<number>;
}) {
  const loudnessPct = useTransform(volume, (v) => v * 100);
  return (
    <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-deep-mute">Loudness</p>
        <p className="mt-1 font-mono text-2xl text-deep-ink">
          <MotionReadout value={loudnessPct} decimals={0} suffix="%" />
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-deep-mute">Volume</p>
        <p className="mt-1 font-mono text-2xl text-deep-ink">
          <MotionReadout value={db} decimals={0} suffix=" dB" />
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-deep-mute">Frequency</p>
        <p className="mt-1 font-mono text-2xl text-deep-ink">
          <MotionReadout value={frequency} decimals={0} suffix=" Hz" />
        </p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-deep-mute">Pitch feel</p>
        <p className="mt-1 text-deep-ink">
          <PitchLabel frequency={frequency} />
        </p>
      </div>
    </div>
  );
}
