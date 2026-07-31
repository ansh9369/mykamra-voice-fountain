"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { MotionReadout } from "./MotionReadout";

export function DJLightMode({
  volume,
  frequency,
  beat,
  onExit,
}: {
  volume: MotionValue<number>;
  frequency: MotionValue<number>;
  beat: MotionValue<number>;
  onExit: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    el?.requestFullscreen?.().catch(() => {});
    const onChange = () => {
      const active = document.fullscreenElement === el;
      setIsFullscreen(active);
      if (!active) onExit();
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const background = useTransform([frequency, volume], ([f, v]: number[]) => {
  const hue = (f * 0.5) % 360 || 260;
  const lightness = 45 + v * 25;

  return `hsl(${hue} 100% ${lightness}%)`;
});
// const background = useTransform([frequency, volume], ([f, v]: number[]) => {
//   const hue = (f * 0.5) % 360 || 260;

//   // 70% → 95% lightness
//   const lightness = 70 + v * 25;

//   return `linear-gradient(
//     180deg,
//     hsl(${hue} 100% ${lightness}%),
//     hsl(${(hue + 20) % 360} 100% ${Math.min(lightness + 5, 95)}%)
//   )`;
// });

  const scale = useTransform(volume, [0, 1], [1, 1.08]);
  const strobeOpacity = useTransform(beat, (b) => Math.min(0.55, b * 0.7));
  const volumePct = useTransform(volume, (v) => v * 100);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-deep-bg"
      onClick={() => document.exitFullscreen?.().catch(() => {})}
    >
      <motion.div style={{ background, scale }} className="absolute inset-0" />
      <motion.div
        style={{ opacity: strobeOpacity }}
        className="pointer-events-none absolute inset-0 bg-white"
      />

      <div className="relative z-10 flex flex-col items-center gap-3 text-center text-deep-ink">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">
          DJ Light · live
        </p>
        <p className="font-display text-6xl font-bold sm:text-7xl">
          <MotionReadout value={frequency} decimals={0} suffix=" Hz" />
        </p>
        <p className="font-mono text-sm text-white/70">
          <MotionReadout value={volumePct} decimals={0} suffix="% loud" />
        </p>
        <p className="mt-6 text-xs text-white/40">Tap anywhere to exit</p>
      </div>
    </div>
  );
}
