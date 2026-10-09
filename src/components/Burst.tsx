"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Mat, useLang } from "./Lang";

/**
 * HERO — scroll-scrubbed video, Apple-style.
 * A video (start frame → exploded end frame) is cut into WebP frames:
 *   /public/burst/d/0001.webp …  (desktop, 16:9)
 *   /public/burst/m/0001.webp …  (mobile, smaller)
 * The section is tall; its stage is sticky and a canvas draws the frame matching scroll progress.
 * It is the first thing you see: an intro (headline, lead, CTAs) sits on the intact bottle, and
 * as you scroll the intro dissolves and the bottle opens while three short lines take over.
 * Frame 1 is the LCP poster; the rest stream in coarse-to-fine right after first paint.
 */
export const BURST_FRAMES = 120;
const pad = (n: number) => String(n).padStart(4, "0");

/** Cut-off 14:00 Mon–Fri, computed in Europe/Stockholm. */
function ShipClock() {
  const { t } = useLang();
  const [msg, setMsg] = useState<{ open: boolean; h: number; m: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Stockholm",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(new Date());
      const get = (k: string) => parts.find((p) => p.type === k)?.value ?? "";
      const wd = get("weekday");
      const mins = Number(get("hour")) * 60 + Number(get("minute"));
      const cutoff = 14 * 60;
      const weekday = !["Sat", "Sun"].includes(wd);
      if (weekday && mins < cutoff) {
        const left = cutoff - mins;
        setMsg({ open: true, h: Math.floor(left / 60), m: left % 60 });
      } else setMsg({ open: false, h: 0, m: 0 });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className={`ship${msg?.open ? " live" : ""}`} aria-live="polite">
      <span className="ship-dot" />
      {msg ? (msg.open ? t.ship.open(msg.h, msg.m) : t.ship.closed) : " "}
    </p>
  );
}

export default function Burst() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = window.matchMedia("(max-width: 760px)").matches ? "m" : "d";
    const frames: (HTMLImageElement | null)[] = new Array(BURST_FRAMES).fill(null);
    let count = 0;
    let alive = true;

    const load = (i: number) =>
      new Promise<void>((res) => {
        if (frames[i]) return res();
        const img = new Image();
        img.decoding = "async";
        img.src = `/burst/${set}/${pad(i + 1)}.webp`;
        img.onload = () => {
          frames[i] = img;
          count++;
          if (alive && (count % 4 === 0 || count === BURST_FRAMES)) setLoaded(count);
          res();
        };
        img.onerror = () => res();
      });

    let w = 0,
      h = 0,
      lastDrawn = -1,
      target = 0,
      current = 0,
      raf = 0;

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < BURST_FRAMES; d++) {
        if (frames[i - d]) return i - d;
        if (frames[i + d]) return i + d;
      }
      return -1;
    };
    const draw = (i: number, force = false) => {
      const k = nearestLoaded(i);
      if (k < 0 || (!force && k === lastDrawn)) return;
      const img = frames[k]!;
      // cover-fit, biased slightly upward so the bottle sits above the headline
      let s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      let dy: number;
      if (set === "m") {
        // phones: bottle in the upper band (6–70 %) so intro + headlines get their own dark band below
        s = Math.max(w / img.naturalWidth, (h * 0.64) / img.naturalHeight);
        dy = h * 0.06;
        ctx.fillStyle = "#070906";
        ctx.fillRect(0, 0, w, h);
      } else {
        // desktop: ~8% breathing room on top so the lifted cap clears the nav; anchored to the bottom
        s = Math.max(w / img.naturalWidth, (h * 0.92) / img.naturalHeight);
        dy = h - img.naturalHeight * s;
        ctx.fillStyle = "#070906";
        ctx.fillRect(0, 0, w, h);
      }
      const dw = img.naturalWidth * s,
        dh = img.naturalHeight * s;
      ctx.drawImage(img, (w - dw) / 2, dy, dw, dh);
      lastDrawn = k;
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      canvas.width = w;
      canvas.height = h;
      draw(Math.round(current), true);
    };

    const tick = () => {
      // ease toward the target frame so scrubbing feels like film, not a flip-book
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.04) current = target;
      draw(Math.round(current));
      raf = current !== target ? requestAnimationFrame(tick) : 0;
    };
    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = reduced ? 0 : Math.min(1, Math.max(0, total > 0 ? -r.top / total : 0));
      section.style.setProperty("--bp", p.toFixed(3));
      // 0–14 %: intro; then the three burst lines share the rest
      section.dataset.step = p < 0.14 ? "intro" : String(Math.min(2, Math.floor(((p - 0.14) / 0.86) * 3.15)));
      target = p * (BURST_FRAMES - 1);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const start = async () => {
      await load(0);
      resize();
      setReady(true);
      if (reduced) return;
      const order: number[] = [];
      const seen = new Set<number>();
      for (const step of [12, 6, 3, 1])
        for (let i = 0; i < BURST_FRAMES; i += step)
          if (!seen.has(i)) {
            seen.add(i);
            order.push(i);
          }
      if (!seen.has(BURST_FRAMES - 1)) order.splice(1, 0, BURST_FRAMES - 1);
      for (let k = 0; k < order.length && alive; k += 6) {
        await Promise.all(order.slice(k, k + 6).map(load));
        draw(Math.round(current), true);
      }
    };

    start();

    onScroll();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const pct = Math.round((loaded / BURST_FRAMES) * 100);

  return (
    <section className="burst" ref={sectionRef} data-step="intro" aria-label={t.burst.aria}>
      <div className="burst-stage">
        {/* poster: visible instantly, also for no-JS; the canvas fades in over it */}
        <picture>
          <source media="(max-width: 760px)" srcSet={`/burst/m/${pad(1)}.webp`} />
          <img className="burst-poster" src={`/burst/d/${pad(1)}.webp`} alt="" aria-hidden fetchPriority="high" />
        </picture>
        <canvas ref={canvasRef} className={`burst-canvas${ready ? " ready" : ""}`} aria-hidden />
        <span className="burst-vignette" aria-hidden />
        <p className="burst-tag">
          <span className="burst-dot" />
          {t.burst.tag}
        </p>
        <div className={`burst-loader${pct >= 100 ? " done" : ""}`} aria-hidden style={{ "--lp": pct / 100 } as CSSProperties}>
          <svg viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" />
            <circle cx="18" cy="18" r="16" className="lp" />
          </svg>
        </div>
        <div className="burst-intro">
          <p className="eyebrow hero-in" style={{ "--wd": ".2s" } as CSSProperties}>
            <span className="eyebrow-line" />
            {t.hero.eyebrow}
          </p>
          <h1 className="hero-title">
            <span className="ht ht1">{t.hero.title[0]}</span>
            <em className="ht ht2">{t.hero.title[1]}</em>
            <span className="ht ht3">{t.hero.title[2]}</span>
          </h1>
          <p className="hero-lead" key={t.hero.lead}>
            <Mat text={t.hero.lead} delay={1.1} step={0.035} />
          </p>
          <div className="hero-btns hero-in" style={{ "--wd": "1.6s" } as CSSProperties}>
            <Link href="/#kollektion" className="btn btn-gold">
              <span>{t.nav.cta}</span>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/discover" className="btn-text">
              {t.hero.primary}
            </Link>
          </div>
          <div className="hero-in" style={{ "--wd": "1.9s" } as CSSProperties}>
            <ShipClock />
          </div>
        </div>

        <div className="burst-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            {t.burst.eyebrow}
          </p>
          <div className="burst-lines">
            {t.burst.lines.map((l, i) => (
              <p key={l} className={`burst-line bl${i}`}>
                {l}
              </p>
            ))}
          </div>
        </div>
        <ol className="burst-steps" aria-hidden>
          {t.burst.steps.map((s, i) => (
            <li key={s}>
              <span>0{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <p className="burst-hint" aria-hidden>
          {t.burst.hint}
        </p>
        <div className="burst-bar" aria-hidden>
          <i />
        </div>
      </div>
    </section>
  );
}
