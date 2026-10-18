"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Mat, useLang } from "./Lang";
import { LayerStack } from "./Sections";

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || to === 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setV(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / 1600);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref} className="stat-num">
      {v}
      {suffix}
    </span>
  );
}

export default function Discover() {
  const { t } = useLang();
  const d = t.discover;
  return (
    <main className="discover">
      <section className="d-open" data-anim data-parallax>
        <div className="hero-bg" aria-hidden>
          <span className="glow g1" />
          <span className="glow g2" />
          <span className="grain" />
        </div>
        <img className="d-open-photo" src="/burst/d2/0120.webp" alt="" aria-hidden />
        <div className="d-open-left">
          <p className="eyebrow hero-in" style={{ "--wd": ".2s" } as CSSProperties}>
            <span className="eyebrow-line" />
            {d.tag}
          </p>
          <h1 className="hero-title">
            <span className="ht ht1">{d.title[0]}</span>
            <span className="ht ht2">{d.title[1]}</span>
            <em className="ht ht3">{d.title[2]}</em>
          </h1>
        </div>
        <div className="d-open-right">
          <p className="hero-lead" key={d.lead}>
            <Mat text={d.lead} delay={1} step={0.03} />
          </p>
          <p className="d-body hero-in" style={{ "--wd": "2s" } as CSSProperties}>
            {d.body}
          </p>
        </div>
      </section>

      <section className="statement" data-anim>
        <div className="statement-inner reveal">
          <span className="eyebrow">
            <span className="eyebrow-line" />
            {d.believe}
          </span>
          <p className="statement-text">
            {d.statement[0]}
            <br />
            {d.statement[1]}
            <br />
            <em>{d.statement[2]}</em>
          </p>
        </div>
      </section>

      <section className="d-steps paper" data-anim>
        <div className="d-steps-head reveal">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            {d.stepsTag}
          </p>
          <h2 className="mat">
            {d.stepsTitle[0]}
            <br />
            {d.stepsTitle[1]}
            <br />
            <em>{d.stepsTitle[2]}</em>
          </h2>
          <LayerStack steps={d.steps.map((s) => ({ num: s.num, title: s.name }))} active />
        </div>
        <ol className="d-step-list">
          {d.steps.map((s, i) => (
            <li key={s.num} className="d-step reveal" style={{ "--k": i } as CSSProperties}>
              <span className="d-step-num">{s.num}</span>
              <div>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
                <p className="rs-ing">
                  {s.ing.map((x) => (
                    <span key={x}>{x}</span>
                  ))}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="stats" data-anim>
        {d.stats.map((s, i) => (
          <div key={s.label} className="stat reveal" style={{ "--k": i } as CSSProperties}>
            <Count to={s.num} suffix={s.suffix} />
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <section className="why" data-anim>
        <div className="reveal">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            {d.whyTag}
          </p>
          <h2 className="mat">
            {d.whyTitle[0]}
            <br />
            <em>{d.whyTitle[1]}</em>
          </h2>
        </div>
        <div className="why-cards">
          {d.cards.map((c, i) => (
            <div key={c.name} className="why-card reveal" style={{ "--k": i } as CSSProperties}>
              <span className="why-num">0{i + 1}</span>
              <h3>{c.name}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="quote paper" data-anim>
        <blockquote className="reveal">
          <p className="mat">
            “{d.quote[0]}
            <br />
            {d.quote[1]}
            <br />
            <em>{d.quote[2]}”</em>
          </p>
          <footer className="signature">{d.signature}</footer>
        </blockquote>
      </section>

      <section className="voices" data-anim>
        <p className="eyebrow reveal">
          <span className="eyebrow-line" />
          {d.voicesTag}
        </p>
        <div className="voice-grid">
          {d.voices.map((v, i) => (
            <figure key={v.name} className="voice reveal" style={{ "--k": i } as CSSProperties}>
              <span className="voice-mark" aria-hidden>
                “
              </span>
              <blockquote>{v.q}</blockquote>
              <figcaption>
                <strong>{v.name}</strong>
                <span>{v.meta}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="closing" data-anim>
        <div className="closing-rings" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <div className="closing-inner reveal">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            {d.closingTag}
          </p>
          <h2 className="mat">
            {d.closingTitle[0]}
            <br />
            {d.closingTitle[1]}
            <br />
            <em>{d.closingTitle[2]}</em>
          </h2>
          <p>{d.closingText}</p>
          <Link href="/#kollektion" className="btn btn-gold">
            <span>{d.closingBtn}</span>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
