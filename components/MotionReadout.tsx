"use client";

import { useEffect, useRef } from "react";
import { useSpring, useTransform, type MotionValue } from "framer-motion";

export function MotionReadout({
  value,
  decimals = 0,
  suffix = "",
  className = "",
  stiffness = 120,
  damping = 22,
}: {
  value: MotionValue<number>;
  decimals?: number;
  suffix?: string;
  className?: string;
  stiffness?: number;
  damping?: number;
}) {
  const spring = useSpring(value, { stiffness, damping });
  const text = useTransform(spring, (v) => `${v.toFixed(decimals)}${suffix}`);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return text.on("change", (latest) => {
      if (ref.current) ref.current.textContent = latest;
    });
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {value.get().toFixed(decimals)}
      {suffix}
    </span>
  );
}
