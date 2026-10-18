"use client";
import { useEffect, useRef, useState } from "react";
import { crintro, nearestFrame } from "@/lib/crintro";
import { useLang } from "./Lang";
import styles from "./CrintroLoader.module.css";

/*
 * CRiNTRO Loader: the leaf emblem draws itself and "Botanicatural" materializes letter by letter
 * while the H3 film loads behind it. The gold thread is the real loading bar, but it never runs
 * ahead of its own animation, so with a warm cache it looks like a plain 1.9 s intro. On a slow line
 * it waits (at most MAX) for the opening of the film, then the curtain lifts. The hero's own
 * entrance animations are held until then (html.crintro-wait).
 */
const RULE_START = 0.5; // s
const RULE_END = 1.5; // s, full with everything cached
const MIN = 1.9; // s, earliest curtain
const MAX = 3.6; // s, latest curtain; whatever is left keeps loading behind the page

const WORD = ["Botani", "catural"];
let played = false; // once per page load, not on every client-side visit to /
const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);

export default function CrintroLoader() {
  const { t } = useLang();
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(played);
  const fill = useRef<HTMLDivElement>(null);
  const tip = useRef<HTMLSpanElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (played) return;
    played = true;
    const store = crintro();
    const html = document.documentElement;
    const release = () => html.classList.remove("crintro-wait");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      release();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGone(true);
      return;
    }
    const t0 = performance.now();
    let shown = 0,
      raf = 0,
      last = t0,
      done = false;
    const ready = () => store.crit >= 1 && (store.mode !== "frames" || !!nearestFrame(0));
    const tick = (now: number) => {
      const s = (now - t0) / 1000;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const natural = ease((s - RULE_START) / (RULE_END - RULE_START));
      const forced = s >= MAX;
      const loaded = ready() ? 1 : Math.min(0.97, store.crit);
      // never ahead of the animation, never ahead of the real loading, never backwards
      const target = forced ? 1 : Math.min(natural, loaded);
      const k = 1 - Math.pow(forced ? 1e-9 : 1e-5, dt);
      shown = Math.max(shown, shown + (target - shown) * k);
      if (fill.current) fill.current.style.transform = `scaleX(${shown.toFixed(4)})`;
      if (tip.current) {
        tip.current.style.transform = `translateX(${(shown * 100).toFixed(2)}cqw)`;
        tip.current.style.opacity = shown > 0.01 && shown < 0.995 ? "1" : "0";
      }
      root.current?.classList.toggle(styles.wait, s > MIN && !ready() && !forced);
      if (!done && s >= MIN && shown > 0.995) {
        done = true;
        release();
        setOut(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;
  let n = 0;
  return (
    <div
      ref={root}
      className={`${styles.loader} crintro-loader${out ? ` ${styles.out}` : ""}`}
      aria-hidden="true"
      onTransitionEnd={(e) => out && e.target === root.current && setGone(true)}
    >
      <div className={styles.inner}>
        <svg className={styles.leaf} viewBox="0 0 40 40">
          <path pathLength={1} d="M8 32 C 8 14, 20 6, 34 6 C 34 22, 24 32, 8 32 Z" />
          <path pathLength={1} className={styles.vein} d="M8 32 L 26 14 M15 25 l 0 -6 M20 20 l 0 -5 M15 25 l 6 0 M20 20 l 5 0" />
        </svg>
        <div className={styles.word}>
          {WORD.map((w, wi) => (
            <span key={w} className={wi === 1 ? styles.accent : undefined}>
              {w.split("").map((c) => (
                <i key={n} style={{ animationDelay: `${0.25 + n++ * 0.055}s` }}>
                  {c}
                </i>
              ))}
            </span>
          ))}
        </div>
        <div className={styles.track}>
          <div className={styles.fill} ref={fill} />
          <span className={styles.tip} ref={tip} />
        </div>
        <p className={styles.sub} suppressHydrationWarning>
          {t.nav.sub}
        </p>
      </div>
    </div>
  );
}
