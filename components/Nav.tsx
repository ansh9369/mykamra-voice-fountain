"use client";

import { motion } from "framer-motion";
import { PoweredByMykamra } from "./Logo";

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full border-b border-white/5"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-2">
          {/* <span className="h-2.5 w-2.5 rounded-full bg-pulse-lime shadow-[0_0_12px_2px_rgba(198,255,61,0.7)]" /> */}

          <span className="font-space-grotesk text-xl font-bold tracking-tight text-pulse-ink">
            voice<span className="text-pulse-violet">.fountain</span>
          </span>
        </div>

        <PoweredByMykamra className="text-sm text-pulse-ink" />
      </div>
    </motion.header>
  );
}

   {/* <header className="relative flex w-full max-w-3xl items-center justify-between px-5 pb-2 pt-14 sm:px-10 sm:pt-16">
        <span className="font-display text-lg font-bold tracking-tight">
          voice<span className="text-fuchsia-400">.fountain</span>
        </span>
        <span className="text-[11px] uppercase tracking-[0.18em] opacity-70">
          Powered by <span className="font-semibold">MyKamra</span>
        </span>
      </header> */}