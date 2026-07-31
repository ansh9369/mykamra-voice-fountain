# MyKamra Voice Fountain

A single-layout Next.js 14 + TypeScript + Tailwind + Framer Motion site with
two live audio features:

1. **Voice Fountain** — speak into your mic and a fountain rises with your
   loudness while its color shifts with your pitch (frequency). Splash
   droplets fly up when you get loud. Live Loudness %, dB, Frequency (Hz)
   and a "pitch feel" label are shown underneath.
2. **DJ Light Mode** — a full-screen light show. Choose your mic, or share
   your laptop/tab audio so it reacts to whatever music you're playing:
   background hue follows pitch, brightness follows volume, and it strobes
   on beat/onset spikes.

## Run it

```bash
cd mykamra-voice-fountain
npm install
npm run dev
```

Open `http://localhost:3000`, click **Allow microphone & start**, and talk —
the fountain should react within a frame or two. HTTPS (or localhost) is
required by browsers for `getUserMedia`/`getDisplayMedia`.

## How the audio engine works

`lib/useAudioAnalyser.ts` is the whole engine:

- Opens a `Web Audio` `AnalyserNode` on either the microphone
  (`getUserMedia`) or, for DJ Light, optionally on **tab/system audio**
  (`getDisplayMedia({ audio: true })`) so real playing music drives the
  visuals directly instead of relying on the mic to pick up your speakers.
- **Loudness**: RMS of the time-domain waveform, scaled to 0–1, plus an
  approximate dBFS value.
- **Frequency**: the dominant bin of the FFT frequency data, converted to
  Hz. This is a fast approximation (not a full pitch-detection algorithm),
  so treat the Hz reading as "for fun," not lab-grade — the UI's "pitch
  feel" label reflects that.
- **Beat/onset**: compares current loudness to a fast running average; a
  sudden jump above it drives the DJ Light strobe.

Everything is exposed as `framer-motion` `MotionValue`s (`volume`, `db`,
`frequency`, `beat`) rather than React state, so the visuals update at a
smooth 60fps **without re-rendering the component tree** — colors, heights
and numbers are all bound directly via `useTransform`/`useSpring`.

No audio is ever uploaded anywhere — everything happens in-browser.

## Customizing

- Fountain look & droplet behavior: `components/VoiceFountain.tsx`.
- Numeric readouts & pitch labels: `components/LiveReadouts.tsx`.
- DJ Light background/strobe logic: `components/DJLightMode.tsx`.
- Colors/fonts: `tailwind.config.ts` (`theme.extend.colors.deep`,
  `fontFamily`).
- Update `SITE_URL` in `app/layout.tsx`, `app/sitemap.ts`, and
  `app/robots.ts` to your real domain before deploying.
- Replace `public/icon-*.png` / `apple-touch-icon.png` / `favicon.png` with
  final artwork when you have it (current ones are placeholders).

## Browser notes

- Tab/system audio sharing for DJ Light is best supported in Chrome/Edge on
  desktop; the user must tick "Share audio" in the picker. If it's not
  available, the mic option always works.
- Autoplaying audio isn't required — this app only *listens*, it doesn't
  play anything itself.
