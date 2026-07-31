"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioAnalyser } from "@/lib/useAudioAnalyser";
import { VoiceFountain } from "@/components/VoiceFountain";
import { LiveReadouts } from "@/components/LiveReadouts";
import { DJLightMode } from "@/components/DJLightMode";
import { Nav } from "@/components/Nav";
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";

export function VoiceFountainClient() {
  const { state, source, volume, db, frequency, beat, start, stop } = useAudioAnalyser();
  const [djOpen, setDjOpen] = useState(false);
  const [djPicker, setDjPicker] = useState(false);
  const active = state === "active";

  const openDJ = async (src: "mic" | "system") => {
    setDjPicker(false);
    if (!active) await start(src);
    setDjOpen(true);
  };

      


  return (
    <main className=" relative flex min-h-screen flex-col items-center overflow-hidden bg-deep-bg text-deep-ink">
  {/* <InteractiveGridPattern
className="absolute left-0 top-0 h-[150vh] w-[150vw] opacity-15"/> */}
<InteractiveGridPattern
  className="absolute left-0 top-0 h-[150vh] w-[150vw] opacity-20 [mask-image:linear-gradient(to_bottom,black_0%,black_45%,rgba(0,0,0,0.6)_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_45%,rgba(0,0,0,0.6)_70%,transparent_100%)]"
/>

      <div
       aria-hidden
  className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(124,60,255,0.22),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(255,60,150,0.16),transparent_40%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-noise" />



      < Nav />

      <section className="relative z-30 flex w-full max-w-3xl flex-col items-center px-5 pb-14 text-center sm:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-fuchsia-400"
        >
          Speak. Watch it rise.
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.6 }}
          className="mt-3 max-w-lg font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl"
        >
          Your voice, turned into a fountain.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.6 }}
          className="mt-4 max-w-md text-sm text-deep-mute sm:text-base"
        >
          Loud gets you height. Pitch gets you color. Nothing is recorded —
          it all happens live in your browser.
        </motion.p>

        {state !== "active" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <button
              onClick={() => start("mic")}
              disabled={state === "requesting"}
              className="rounded-full bg-fuchsia-500 px-8 py-3 font-display text-sm font-bold text-white shadow-[0_10px_30px_-10px_rgba(217,70,239,0.6)] disabled:opacity-60"
            >
              {state === "requesting" ? "Listening for mic…" : "Allow microphone & start"}
            </button>
            {state === "denied" && (
              <p className="mt-3 max-w-xs text-xs text-rose-300">
                Mic access was blocked. Allow it in your browser's site
                settings, then try again.
              </p>
            )}
            {state === "error" && (
              <p className="mt-3 max-w-xs text-xs text-rose-300">
                Couldn't reach your microphone. Check another app isn't using
                it and try again.
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-6"
        >
          <VoiceFountain volume={volume} frequency={frequency} active={active} />
        </motion.div>

        <div className="mt-4 w-full">
          <LiveReadouts volume={volume} frequency={frequency} db={db} />
        </div>

        {active && (
          <button
            onClick={stop}
            className="mt-6 text-xs uppercase tracking-[0.2em] text-deep-mute underline underline-offset-4"
          >
            Stop listening
          </button>
        )}

        {/* DJ light launcher */}
        <div className="relative mt-14 w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <p className="font-display text-lg font-bold">DJ Light Mode</p>
          <p className="mt-1 text-sm text-deep-mute">
            Go full screen and let the room react to a song — color shifts
            with pitch, flashes hit on every beat.
          </p>
          <button
            onClick={() => setDjPicker((v) => !v)}
            className="mt-4 rounded-full bg-white px-6 py-2.5 font-display text-sm font-bold text-deep-bg"
          >
            Launch DJ Light
          </button>

          <AnimatePresence>
            {djPicker && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="mt-4 flex flex-col gap-2 sm:flex-row"
              >
                <button
                  onClick={() => openDJ("mic")}
                  className="flex-1 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold"
                >
                  Use microphone
                </button>
                <button
                  onClick={() => openDJ("system")}
                  className="flex-1 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold"
                >
                  Use laptop/tab audio (for music)
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer className="relative mt-auto w-full border-t border-white/10 px-5 py-6 text-center text-[11px] text-deep-mute sm:px-10">
        © {new Date().getFullYear()} MyKamra. Audio is processed locally in
        your browser and never leaves your device.
      </footer>

      <AnimatePresence>
        {djOpen && (
          <DJLightMode
            volume={volume}
            frequency={frequency}
            beat={beat}
            onExit={() => setDjOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
