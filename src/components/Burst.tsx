"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Mat, useLang } from "./Lang";
import { crintro, nearestFrame, onCrintro, wantFrame } from "@/lib/crintro";

/**
 * HERO — scroll-scrubbed video, Apple-style.
 * A video (start frame → exploded end frame) is cut into WebP frames:
 *   /public/burst/d2/0001.webp …  (desktop, 1920 px, Real-ESRGAN upscaled)
 *   /public/burst/m2/0001.webp …  (mobile, 960 px)
 * Loading is done by the CRiNTRO Loader (src/lib/crintro.ts), which streams them in priority order.
 * The section is tall; its stage is sticky and a canvas draws the frame matching scroll progress.
 * It is the first thing you see: an intro (headline, lead, CTAs) sits on the intact bottle, and
 * as you scroll the intro dissolves and the bottle opens while three short lines take over.
 */
const pad = (n: number) => String(n).padStart(4, "0");

/** Scroll share: intro → film → the last frame holds while the brand reveals (no scroll lock — it never takes over). */
const INTRO_END = 0.14;
const FILM_END = 0.86;
const REVEAL_AT = 0.88;

/** Gold dust that gathers into the B monogram: start offset x/y and delay. */
const DUST: [string, string, string][] = [
  ["-150px", "-110px", "0s"], ["140px", "-130px", ".05s"], ["-190px", "30px", ".1s"], ["200px", "60px", ".02s"],
  ["-80px", "150px", ".12s"], ["95px", "160px", ".08s"], ["-30px", "-180px", ".15s"], ["50px", "-170px", ".04s"],
  ["-220px", "-20px", ".09s"], ["230px", "-15px", ".13s"], ["-130px", "130px", ".06s"], ["140px", "110px", ".11s"],
];

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

    // The CRiNTRO Loader is already downloading the film (sharp 1920/960 px frames) in priority order;
    // this scene only draws the decoded frame nearest the scroll position.
    const store = crintro();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const set = store.set;
    const off = onCrintro(() => setLoaded(Math.round(store.all * 100)));

    let w = 0,
      h = 0,
      target = 0,
      current = 0,
      raf = 0,
      last = performance.now(),
      shown = false;
    let lastImg: CanvasImageSource | null = null;

    const draw = (i: number) => {
      if (!store.count) return;
      wantFrame(i);
      const img = nearestFrame(i);
      if (!img || img === lastImg) return;
      lastImg = img;
      const iw = img.width,
        ih = img.height;
      let s: number, dy: number;
      ctx.fillStyle = "#070906";
      ctx.fillRect(0, 0, w, h);
      if (set === "m") {
        // phones: bottle in the upper band (6–70 %) so intro + headlines get their own dark band below
        s = Math.max(w / iw, (h * 0.64) / ih);
        dy = h * 0.06;
      } else {
        // desktop: ~8% breathing room on top so the lifted cap clears the nav; anchored to the bottom
        s = Math.max(w / iw, (h * 0.92) / ih);
        dy = h - ih * s;
      }
      const dw = iw * s,
        dh = ih * s;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (w - dw) / 2, dy, dw, dh);
      if (!shown) {
        shown = true;
        setReady(true);
      }
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width * dpr));
      h = Math.max(1, Math.round(r.height * dpr));
      canvas.width = w;
      canvas.height = h;
      lastImg = null;
      draw(Math.round(current));
    };

    // game loop: time-based easing (same feel at 60 and 120 Hz), never draws from the scroll event
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      current += (target - current) * (reduced ? 1 : 1 - Math.pow(0.84, dt * 60));
      if (Math.abs(target - current) < 0.04) current = target;
      draw(Math.round(current));
      raf = requestAnimationFrame(tick);
    };
    let lastStep = "";
    const onScroll = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = reduced ? 0 : Math.min(1, Math.max(0, total > 0 ? -r.top / total : 0));
      section.style.setProperty("--bp", p.toFixed(3));
      // 0–14 %: intro; the three burst lines share the film; the last frame then holds for the brand
      const step = p < INTRO_END ? "intro" : String(Math.min(2, Math.floor(((p - INTRO_END) / (FILM_END - INTRO_END)) * 3.05)));
      if (step !== lastStep) section.dataset.step = lastStep = step;
      const brand = !reduced && p >= REVEAL_AT;
      if (brand !== ("brand" in section.dataset)) {
        if (brand) {
          section.dataset.brand = "";
          section.dataset.played = "";
        } else delete section.dataset.brand;
      }
      target = Math.min(1, p / FILM_END) * Math.max(0, store.count - 1);
    };

    resize();
    onScroll();
    const offCount = onCrintro(onScroll); // frame count arrives with the manifest
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      off();
      offCount();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const pct = loaded;

  return (
    <section className="burst" ref={sectionRef} data-step="intro" aria-label={t.burst.aria}>
      <div className="burst-stage">
        {/* poster: visible instantly, also for no-JS; the canvas fades in over it */}
        <picture>
          <source media="(max-width: 760px)" srcSet={`/burst/m2/${pad(1)}.webp`} />
          <img className="burst-poster" src={`/burst/d2/${pad(1)}.webp`} alt="" aria-hidden fetchPriority="high" />
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
        <div className="burst-intro" data-crintro-hold>
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
        {/* Brand reveal: on the held last frame the B monogram gathers out of gold dust, lands, and the name rises beside it */}
        <div className="burst-brand">
          <span className="bb-shade" aria-hidden />
          <div className="bb-emblem" aria-hidden>
            <span className="bb-dust">
              {DUST.map((d, i) => (
                <i key={i} style={{ "--x": d[0], "--y": d[1], "--dl": d[2] } as CSSProperties} />
              ))}
            </span>
            <span className="bb-ring" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo-b.webp" alt="" width={230} height={240} />
            <span className="bb-gloss" />
          </div>
          <div className="bb-text">
            <p className="bb-eye">
              <i />
              {t.burst.brand.eyebrow}
              <i />
            </p>
            <p className="bb-name">Botanicatural</p>
            <p className="bb-sub">{t.burst.brand.sub}</p>
            <Link href="/#kollektion" className="btn btn-gold bb-cta">
              <span>{t.burst.brand.cta}</span>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
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
