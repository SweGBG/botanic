"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * One engine for the whole site:
 *  - .reveal          → gets .in when it scrolls into view (once)
 *  - [data-anim]      → gets .off while offscreen (pauses all CSS animation inside)
 *  - [data-parallax]  → receives --mx / --my (-1..1) from the pointer
 *  - [data-progress]  → receives --p (0..1): sticky scroll-through, or ="view" for enter→leave viewport,
 *                       plus data-active = current step (data-steps="n")
 *  - :root            → --sy = scrollY in px
 */
export default function Motion() {
  const path = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    // pages without the CRiNTRO Loader (e.g. /discover opened directly) must not stay held
    if (!document.querySelector(".crintro-loader")) root.classList.remove("crintro-wait");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealIO.unobserve(e.target);
          }
        }),
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));

    const animIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("off", !e.isIntersecting)),
      { rootMargin: "120px 0px" }
    );
    document.querySelectorAll("[data-anim]").forEach((el) => animIO.observe(el));

    const progressEls = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    const parallaxEls = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        root.style.setProperty("--sy", String(Math.round(window.scrollY)));
        const vh = window.innerHeight;
        for (const el of progressEls) {
          const r = el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) continue;
          let p: number;
          if (el.dataset.progress === "view") {
            // 0 when the section's top enters at the bottom, 1 when its bottom leaves at the top
            p = (vh - r.top) / (vh + r.height);
          } else {
            const total = r.height - vh;
            p = total > 0 ? -r.top / total : r.top < vh / 2 ? 1 : 0;
          }
          p = Math.min(1, Math.max(0, p));
          el.style.setProperty("--p", p.toFixed(3));
          const n = Number(el.dataset.steps || 0);
          if (n) el.dataset.active = String(Math.min(n - 1, Math.floor(p * n * 0.999 + 0.0001)));
        }
      });
    };

    const onPointer = (e: PointerEvent) => {
      if (reduced || e.pointerType !== "mouse") return;
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      for (const el of parallaxEls) {
        el.style.setProperty("--mx", x.toFixed(3));
        el.style.setProperty("--my", y.toFixed(3));
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      revealIO.disconnect();
      animIO.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, [path]);

  return null;
}

