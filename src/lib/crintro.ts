/**
 * CRiNTRO Loader: the intro is the loading screen.
 *
 * Starts downloading the H3 film the moment the page runs, in the order the visitor will need it,
 * and reports progress so the intro's rule can show real loading instead of a fixed animation.
 *
 * Botanicatural plays the film as a still sequence on every screen (desktop 1920 px, phones 960 px,
 * both upscaled with Real-ESRGAN). Frames download as small compressed blobs in priority order
 * (the first ~2 seconds, then every 12th frame across the film, then the gaps), and whatever is right
 * ahead of the visitor's scroll jumps the queue. Only frames near the scroll position are decoded into
 * bitmaps ("texture streaming"); every 12th frame stays decoded as an anchor, so even a fast flick
 * always has something nearby to draw. Memory stays low.
 */

/** What to load: manifest.json = { "count": 120, "pattern": "/burst/d2/%04d.webp" } */
export const CRINTRO_CONFIG = {
  desktop: "/burst/d2/manifest.json",
  phone: "/burst/m2/manifest.json",
};

type Listener = () => void;
type Frame = ImageBitmap | HTMLImageElement;

/** Same breakpoint as the hero's layout (globals.css @media (max-width: 760px)) */
export const PHONE_QUERY = "(max-width: 760px)";
const CONCURRENCY = 6; // parallel downloads
const DECODES = 2; // parallel decodes
const ANCHOR = 12; // every Nth frame is in the first coarse pass and stays decoded
const BEHIND = 8; // decoded window around the scroll position
const AHEAD = 14;

const S = {
  started: false,
  mode: "none" as "none" | "frames" | "failed",
  set: "d" as "d" | "m",
  /** 0..1 for what the intro waits for: the opening + coarse pass */
  crit: 0,
  /** 0..1 for everything */
  all: 0,
  count: 0,
  blobs: [] as (Blob | null)[],
  frames: [] as (Frame | null)[],
  decoding: new Set<number>(),
  center: 0,
  listeners: new Set<Listener>(),
};
export type CrintroState = typeof S;

const emit = () => S.listeners.forEach((f) => f());

export function crintro() {
  if (typeof window !== "undefined" && !S.started) {
    S.started = true;
    start();
  }
  return S;
}

export function onCrintro(fn: Listener) {
  S.listeners.add(fn);
  return () => {
    S.listeners.delete(fn);
  };
}

/** Download order: the first ~2 s in sequence, then every 12th, 6th, 3rd frame, then the rest. */
function order(n: number) {
  const seen = new Set<number>();
  const out: number[] = [];
  const push = (i: number) => {
    if (i >= 0 && i < n && !seen.has(i)) {
      seen.add(i);
      out.push(i);
    }
  };
  const head = Math.min(12, Math.ceil(n * 0.06));
  for (let i = 0; i < head; i++) push(i);
  for (let i = 0; i < n; i += ANCHOR) push(i);
  push(n - 1);
  const crit = out.length;
  for (const step of [6, 3, 1]) for (let i = 0; i < n; i += step) push(i);
  return { out, crit };
}

function start() {
  if (location.search.includes("crintro")) (window as unknown as { __crintro: CrintroState }).__crintro = S; // ?crintro to inspect in DevTools
  S.set = matchMedia(PHONE_QUERY).matches ? "m" : "d";
  loadFrames(S.set === "m" ? CRINTRO_CONFIG.phone : CRINTRO_CONFIG.desktop);
}

function fail() {
  S.mode = "failed";
  S.crit = S.all = 1;
  emit();
}

async function loadFrames(manifest: string) {
  S.mode = "frames";
  emit();
  let count = 0,
    pattern = "";
  try {
    const mf = await (await fetch(manifest)).json();
    count = mf.count;
    pattern = mf.pattern;
    if (!count || !pattern) throw new Error("manifest");
  } catch {
    return fail();
  }
  S.count = count;
  S.blobs = new Array(count).fill(null);
  S.frames = new Array(count).fill(null);
  emit();
  const { out, crit } = order(count);
  const critSet = new Set(out.slice(0, crit));
  let got = 0,
    gotCrit = 0,
    failed = 0,
    next = 0;
  const asked = new Set<number>();
  // Next frame to fetch: what is right ahead of the scroll first, otherwise the planned order.
  const pick = (): number => {
    for (let d = 0; d <= AHEAD; d++) {
      const i = S.center + d;
      if (i < count && !asked.has(i) && S.center > 0) return i;
    }
    while (next < out.length && asked.has(out[next])) next++;
    return next < out.length ? out[next++] : -1;
  };

  const url = (i: number) => pattern.replace(/%0(\d)d/, (_, w) => String(i + 1).padStart(Number(w), "0"));
  const worker = async (): Promise<void> => {
    for (;;) {
      const i = pick();
      if (i < 0) return;
      asked.add(i);
      try {
        const r = await fetch(url(i));
        if (!r.ok) throw new Error(String(r.status));
        S.blobs[i] = await r.blob();
        got++;
        if (critSet.has(i)) gotCrit++;
      } catch {
        failed++;
        if (critSet.has(i)) gotCrit++; // a missing frame must not hold the intro forever
      }
      S.crit = Math.min(1, gotCrit / crit);
      S.all = (got + failed) / count;
      if (got === 0 && failed >= Math.min(count, CONCURRENCY * 2)) return fail();
      pump();
      emit();
    }
  };
  for (let k = 0; k < CONCURRENCY; k++) worker();
}

const keep = (i: number) => i % ANCHOR === 0 || i === S.count - 1 || (i >= S.center - BEHIND && i <= S.center + AHEAD);

async function decode(i: number) {
  const blob = S.blobs[i]!;
  S.decoding.add(i);
  try {
    if ("createImageBitmap" in window) {
      S.frames[i] = await createImageBitmap(blob); // decoded off the main thread
    } else {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      await img.decode();
      S.frames[i] = img;
    }
  } catch {
    /* skip a broken frame, a neighbour is drawn instead */
  }
  S.decoding.delete(i);
  if (!keep(i)) evict(i);
  emit();
  pump();
}

function evict(i: number) {
  const f = S.frames[i];
  if (f && "close" in f) f.close();
  S.frames[i] = null;
}

/** Decode what is near the scroll position (nearest first), free what drifted out of the window. */
function pump() {
  if (S.mode !== "frames") return;
  for (let i = 0; i < S.count; i++) if (S.frames[i] && !keep(i)) evict(i);
  const want: number[] = [];
  for (let d = 0; d <= AHEAD; d++) {
    want.push(S.center + d);
    if (d && d <= BEHIND) want.push(S.center - d);
  }
  for (let i = 0; i < S.count; i += ANCHOR) want.push(i);
  for (const i of want) {
    if (S.decoding.size >= DECODES) return;
    if (i < 0 || i >= S.count || S.frames[i] || S.decoding.has(i) || !S.blobs[i]) continue;
    decode(i);
  }
}

/** Called by the scene every frame with the frame it wants to show. */
export function wantFrame(i: number) {
  if (i !== S.center) {
    S.center = i;
    pump();
  }
}

/** The decoded frame closest to i (or null while nothing near is ready). */
export function nearestFrame(i: number): Frame | null {
  for (let d = 0; d < S.count; d++) {
    const a = S.frames[i - d],
      b = S.frames[i + d];
    if (a) return a;
    if (b) return b;
  }
  return null;
}
