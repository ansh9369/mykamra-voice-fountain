"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useTransform, type MotionValue } from "framer-motion";

interface Droplet {
  id: number;
  x: number;
  size: number;
  rise: number;
  duration: number;
  hue: number;
}

let dropletSeq = 0;

export function VoiceFountain({
  volume,
  frequency,
  active,
}: {
  volume: MotionValue<number>;
  frequency: MotionValue<number>;
  active: boolean;
}) {
  const [droplets, setDroplets] = useState<Droplet[]>([]);

  // spawn splash droplets when the voice gets loud — the literal
  // "fountain goes up when you speak louder" moment
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const v = volume.get();
      if (v < 0.32) return;
      const f = frequency.get();
      const hue = (f * 0.6) % 360 || 250;
      const count = v > 0.7 ? 3 : v > 0.5 ? 2 : 1;
      setDroplets((prev) => [
        ...prev,
        ...Array.from({ length: count }, () => ({
          id: dropletSeq++,
          x: (Math.random() - 0.5) * (60 + v * 140),
          size: 6 + Math.random() * 8,
          rise: 90 + v * 260 + Math.random() * 40,
          duration: 0.7 + Math.random() * 0.5,
          hue,
        })),
      ]);
    }, 130);
    return () => clearInterval(interval);
  }, [active, volume, frequency]);

  // water column height + hue, derived directly — no re-renders
  const columnHeight = useTransform(volume, [0, 1], [26, 300]);
  const ring1Scale = useTransform(volume, [0, 1], [1, 2.6]);
  const ring1Opacity = useTransform(volume, [0, 1], [0, 0.5]);
  const ring2Scale = useTransform(volume, [0, 1], [1, 1.8]);
  const ring2Opacity = useTransform(volume, [0, 1], [0, 0.6]);
  const spoutScale = useTransform(volume, [0, 1], [1, 1.35]);
  const columnColor = useTransform(frequency, (f) => `hsl(${(f * 0.6) % 360 || 250} 90% 62%)`);
  const columnGlow = useTransform(
    frequency,
    (f) => `0 0 60px 8px hsl(${(f * 0.6) % 360 || 250} 90% 55% / 0.55)`
  );

  return (
    <div className="relative flex h-[380px] w-full max-w-md items-end justify-center sm:h-[420px]">
      {/* ambient rings that breathe with loudness */}
      <motion.span
        aria-hidden
        style={{ scale: ring1Scale, opacity: ring1Opacity }}
        className="absolute bottom-8 h-24 w-24 rounded-full border border-fuchsia-400/40"
      />
      <motion.span
        aria-hidden
        style={{ scale: ring2Scale, opacity: ring2Opacity }}
        className="absolute bottom-8 h-16 w-16 rounded-full border border-cyan-300/50"
      />

      {/* basin */}
      <div className="absolute bottom-0 h-8 w-44 rounded-full bg-deep-basin sm:w-52" />

      {/* water column */}
      <motion.div
        aria-hidden
        style={{ height: columnHeight, background: columnColor, boxShadow: columnGlow }}
        className="absolute bottom-8 w-3 rounded-full sm:w-4"
      />

      {/* spout */}
      <motion.div
        aria-hidden
        style={{ scale: spoutScale }}
        className="absolute bottom-6 h-4 w-4 rounded-full bg-white/90 shadow-[0_0_20px_4px_rgba(255,255,255,0.6)]"
      />

      {/* splash droplets */}
      <div className="pointer-events-none absolute bottom-10 h-full w-full">
        <AnimatePresence>
          {droplets.map((d) => (
            <motion.span
              key={d.id}
              initial={{ x: d.x * 0.2, y: 0, opacity: 1, scale: 0.6 }}
              animate={{ x: d.x, y: -d.rise, opacity: 0, scale: 1 }}
              transition={{ duration: d.duration, ease: "easeOut" }}
              onAnimationComplete={() =>
                setDroplets((prev) => prev.filter((p) => p.id !== d.id))
              }
              style={{
                width: d.size,
                height: d.size,
                background: `hsl(${d.hue} 90% 65%)`,
                boxShadow: `0 0 10px 2px hsl(${d.hue} 90% 60% / 0.6)`,
              }}
              className="absolute bottom-0 left-1/2 rounded-full"
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
