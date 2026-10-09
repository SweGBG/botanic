"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Mat, useLang } from "./Lang";
import { seeded } from "@/lib/seeded";

const rnd = seeded(20240914);
const DUST = Array.from({ length: 34 }, () => {
  const a = rnd() * Math.PI * 2;
  const r = 180 + rnd() * 260;
  return {
    x: `${Math.round(Math.cos(a) * r)}px`,
    y: `${Math.round(Math.sin(a) * r)}px`,
    d: `${(0.3 + rnd() * 1.4).toFixed(2)}s`,
    s: `${(2 + rnd() * 4).toFixed(1)}px`,
    g: rnd() > 0.55,
  };
});
const DEW = Array.from({ length: 14 }, () => ({
  l: `${Math.round(rnd() * 100)}%`,
  d: `${(rnd() * 8).toFixed(2)}s`,
  t: `${(7 + rnd() * 7).toFixed(1)}s`,
  s: `${(3 + rnd() * 5).toFixed(1)}px`,
}));

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

const L = (d: number, extra?: CSSProperties) => ({ "--d": d, ...extra }) as CSSProperties;

export default function Hero() {
  const { t } = useLang();
  return (
    <section className="hero" data-anim data-parallax>
      <div className="hero-bg" aria-hidden>
        <span className="glow g1" />
        <span className="glow g2" />
        <span className="glow g3" />
        <span className="grain" />
      </div>

      <div className="hero-copy">
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
          <Link href="/discover" className="btn btn-gold">
            <span>{t.hero.primary}</span>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link href="/#vaxter" className="btn-text">
            {t.hero.secondary}
          </Link>
        </div>
        <div className="hero-in" style={{ "--wd": "1.9s" } as CSSProperties}>
          <ShipClock />
        </div>
      </div>

      {/* Layered stage — each layer moves at its own depth (--d) with pointer and scroll */}
      <div className="stage" aria-hidden>
        <div className="layer" style={L(-0.4)}>
          <svg className="rings" viewBox="0 0 600 600">
            <circle className="ring r1" cx="300" cy="300" r="286" />
            <circle className="ring r2" cx="300" cy="300" r="250" />
            <circle className="ring r3" cx="300" cy="300" r="214" />
          </svg>
        </div>

        <div className="layer" style={L(-0.25)}>
          <span className="sprig back-sprig" aria-hidden>
            <img src="/img/plants/birch.webp" alt="" />
          </span>
        </div>

        <div className="layer" style={L(0.15)}>
          <div className="frame">
            <div className="frame-photo">
              <img src="/img/hero.webp" alt="" />
              <span className="frame-sheen" />
            </div>
            <span className="gilt-ring" />
          </div>
          <div className="dust">
            {DUST.map((p, i) => (
              <i key={i} className={p.g ? "gold" : ""} style={{ "--x": p.x, "--y": p.y, "--dd": p.d, "--s": p.s } as CSSProperties} />
            ))}
          </div>
        </div>

        {/* Front: a crescent wreath hugging the arch + a tied bouquet leaning on it.
            Both pivot around their gathered stems as you scroll. */}
        <div className="layer" style={L(0.45)}>
          <span className="sprig crescent">
            <img src="/img/crescent.webp" alt="" />
          </span>
          <span className="sprig bouquet">
            <img src="/img/bouquet.webp" alt="" />
          </span>
        </div>

        <div className="layer" style={L(0.9)}>
          <div className="badge">
            <span className="badge-num">{t.hero.badgeNum}</span>
            <span className="badge-label">{t.hero.badgeLabel}</span>
          </div>
          <div className="dew">
            {DEW.map((p, i) => (
              <i key={i} style={{ "--l": p.l, "--dd": p.d, "--t": p.t, "--s": p.s } as CSSProperties} />
            ))}
          </div>
        </div>

      </div>

      <a href="#vaxter" className="scroll-hint" aria-label={t.hero.scroll}>
        <span>{t.hero.scroll}</span>
        <i />
      </a>
    </section>
  );
}
