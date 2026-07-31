// "use client";

// import { useCallback, useRef, useState } from "react";
// import { useMotionValue, type MotionValue } from "framer-motion";

// export type MicState = "idle" | "requesting" | "active" | "denied" | "error";
// export type AudioSource = "mic" | "system";

// export interface AudioAnalyser {
//   state: MicState;
//   source: AudioSource | null;
//   /** 0–1 normalized loudness (RMS of the waveform, scaled for sensitivity) */
//   volume: MotionValue<number>;
//   /** approximate dBFS, roughly -60 (silence) to 0 (very loud) */
//   db: MotionValue<number>;
//   /** dominant frequency in Hz of the current frame, 0 when silent */
//   frequency: MotionValue<number>;
//   /** 0–1 "how sudden was this loudness spike" — drives beat flashes */
//   beat: MotionValue<number>;
//   start: (source: AudioSource) => Promise<void>;
//   stop: () => void;
// }

// export function useAudioAnalyser(): AudioAnalyser {
//   const [state, setState] = useState<MicState>("idle");
//   const [source, setSource] = useState<AudioSource | null>(null);

//   const volume = useMotionValue(0);
//   const db = useMotionValue(-60);
//   const frequency = useMotionValue(0);
//   const beat = useMotionValue(0);

//   const ctxRef = useRef<AudioContext | null>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const analyserRef = useRef<AnalyserNode | null>(null);
//   const rafRef = useRef<number | null>(null);
//   const runningAvgRef = useRef(0);

//   const stop = useCallback(() => {
//     if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     rafRef.current = null;
//     streamRef.current?.getTracks().forEach((t) => t.stop());
//     streamRef.current = null;
//     ctxRef.current?.close().catch(() => {});
//     ctxRef.current = null;
//     analyserRef.current = null;
//     runningAvgRef.current = 0;
//     volume.set(0);
//     db.set(-60);
//     frequency.set(0);
//     beat.set(0);
//     setState("idle");
//     setSource(null);
//   }, [volume, db, frequency, beat]);

//   const start = useCallback(
//     async (requestedSource: AudioSource) => {
//       setState("requesting");
//       try {
//         let stream: MediaStream;
//         if (requestedSource === "system") {
//           // Captures tab/system audio so music playing on the laptop drives
//           // the visuals directly, instead of relying on the mic to pick up
//           // speaker output. Requires the user to tick "share audio" in the
//           // browser's picker; falls back is up to the caller.
//           const display = await navigator.mediaDevices.getDisplayMedia({
//             video: true,
//             audio: true,
//           });
//           display.getVideoTracks().forEach((t) => t.stop());
//           const audioTracks = display.getAudioTracks();
//           if (audioTracks.length === 0) {
//             display.getTracks().forEach((t) => t.stop());
//             throw new Error("NoAudioTrack");
//           }
//           stream = new MediaStream(audioTracks);
//         } else {
//           stream = await navigator.mediaDevices.getUserMedia({
//             audio: {
//               echoCancellation: false,
//               noiseSuppression: false,
//               autoGainControl: false,
//             },
//           });
//         }
//         streamRef.current = stream;

//         const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
//         const ctx: AudioContext = new AudioCtx();
//         ctxRef.current = ctx;
//         const src = ctx.createMediaStreamSource(stream);
//         const analyser = ctx.createAnalyser();
//         analyser.fftSize = 2048;
//         analyser.smoothingTimeConstant = 0.55;
//         src.connect(analyser);
//         analyserRef.current = analyser;

//         const timeData = new Uint8Array(analyser.fftSize);
//         const freqData = new Uint8Array(analyser.frequencyBinCount);

//         const tick = () => {
//           analyser.getByteTimeDomainData(timeData);
//           analyser.getByteFrequencyData(freqData);

//           let sumSquares = 0;
//           for (let i = 0; i < timeData.length; i++) {
//             const v = (timeData[i] - 128) / 128;
//             sumSquares += v * v;
//           }
//           const rms = Math.sqrt(sumSquares / timeData.length);
//           const normalized = Math.min(1, rms * 4.2);
//           volume.set(normalized);
//           db.set(20 * Math.log10(Math.max(rms, 0.00001)));

//           let maxVal = 0;
//           let maxIdx = 0;
//           for (let i = 0; i < freqData.length; i++) {
//             if (freqData[i] > maxVal) {
//               maxVal = freqData[i];
//               maxIdx = i;
//             }
//           }
//           const nyquist = ctx.sampleRate / 2;
//           frequency.set(maxVal > 12 ? (maxIdx / freqData.length) * nyquist : 0);

//           // simple onset/beat detector: how far above its own running
//           // average did loudness just jump?
//           const avg = runningAvgRef.current;
//           runningAvgRef.current = avg * 0.85 + normalized * 0.15;
//           const spike = normalized - runningAvgRef.current;
//           beat.set(Math.max(0, Math.min(1, spike * 3.2)));

//           rafRef.current = requestAnimationFrame(tick);
//         };
//         tick();

//         setSource(requestedSource);
//         setState("active");

//         stream.getTracks().forEach((t) => {
//           t.addEventListener("ended", stop);
//         });
//       } catch (err) {
//         const name = (err as Error)?.name;
//         setState(name === "NotAllowedError" ? "denied" : "error");
//       }
//     },
//     [volume, db, frequency, beat, stop]
//   );

//   return { state, source, volume, db, frequency, beat, start, stop };
// }
"use client";

import { useCallback, useRef, useState } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

export type MicState = "idle" | "requesting" | "active" | "denied" | "error";
export type AudioSource = "mic" | "system";

export interface AudioAnalyser {
  state: MicState;
  source: AudioSource | null;
  /** 0–1 normalized loudness (RMS of the waveform, scaled for sensitivity) */
  volume: MotionValue<number>;
  /** approximate dBFS, roughly -60 (silence) to 0 (very loud) */
  db: MotionValue<number>;
  /** dominant frequency in Hz of the current frame, 0 when silent */
  frequency: MotionValue<number>;
  /** 0–1 "how sudden was this loudness spike" — drives beat flashes */
  beat: MotionValue<number>;
  start: (source: AudioSource) => Promise<void>;
  stop: () => void;
}

export function useAudioAnalyser(): AudioAnalyser {
  const [state, setState] = useState<MicState>("idle");
  const [source, setSource] = useState<AudioSource | null>(null);

  const volume = useMotionValue(0);
  const db = useMotionValue(-60);
  const frequency = useMotionValue(0);
  const beat = useMotionValue(0);

  const ctxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningAvgRef = useRef(0);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
    analyserRef.current = null;
    runningAvgRef.current = 0;
    volume.set(0);
    db.set(-60);
    frequency.set(0);
    beat.set(0);
    setState("idle");
    setSource(null);
  }, [volume, db, frequency, beat]);

  const start = useCallback(
    async (requestedSource: AudioSource) => {
      setState("requesting");
      try {
        let stream: MediaStream;
        if (requestedSource === "system") {
          // Captures tab/system audio so music playing on the laptop drives
          // the visuals directly, instead of relying on the mic to pick up
          // speaker output. Requires the user to tick "share audio" in the
          // browser's picker; falls back is up to the caller.
          const display = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          display.getVideoTracks().forEach((t) => t.stop());
          const audioTracks = display.getAudioTracks();
          if (audioTracks.length === 0) {
            display.getTracks().forEach((t) => t.stop());
            throw new Error("NoAudioTrack");
          }
          stream = new MediaStream(audioTracks);
        } else {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: false,
              noiseSuppression: false,
              autoGainControl: false,
            },
          });
        }
        streamRef.current = stream;

        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const ctx: AudioContext = new AudioCtx();
        ctxRef.current = ctx;
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.55;
        src.connect(analyser);
        analyserRef.current = analyser;

        const timeData = new Uint8Array(analyser.fftSize);
        const freqData = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteTimeDomainData(timeData);
          analyser.getByteFrequencyData(freqData);

          let sumSquares = 0;
          for (let i = 0; i < timeData.length; i++) {
            const v = (timeData[i] - 128) / 128;
            sumSquares += v * v;
          }
          const rms = Math.sqrt(sumSquares / timeData.length);
          const normalized = Math.min(1, rms * 4.2);
          volume.set(normalized);
          db.set(20 * Math.log10(Math.max(rms, 0.00001)));

          let maxVal = 0;
          let maxIdx = 0;
          for (let i = 0; i < freqData.length; i++) {
            if (freqData[i] > maxVal) {
              maxVal = freqData[i];
              maxIdx = i;
            }
          }
          const nyquist = ctx.sampleRate / 2;
          frequency.set(maxVal > 12 ? (maxIdx / freqData.length) * nyquist : 0);

          // simple onset/beat detector: how far above its own running
          // average did loudness just jump?
          const avg = runningAvgRef.current;
          runningAvgRef.current = avg * 0.85 + normalized * 0.15;
          const spike = normalized - runningAvgRef.current;
          beat.set(Math.max(0, Math.min(1, spike * 3.2)));

          rafRef.current = requestAnimationFrame(tick);
        };
        tick();

        setSource(requestedSource);
        setState("active");

        stream.getTracks().forEach((t) => {
          t.addEventListener("ended", stop);
        });
      } catch (err) {
        const name = (err as Error)?.name;
        setState(name === "NotAllowedError" ? "denied" : "error");
      }
    },
    [volume, db, frequency, beat, stop]
  );

  return { state, source, volume, db, frequency, beat, start, stop };
}