"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { LangToggle, useLang } from "./Lang";
import { BagButton } from "./Cart";

export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden>
      <path d="M8 32 C 8 14, 20 6, 34 6 C 34 22, 24 32, 8 32 Z" />
      <path d="M8 32 L 26 14 M15 25 l 0 -6 M20 20 l 0 -5 M15 25 l 6 0 M20 20 l 5 0" />
    </svg>
  );
}

export default function Nav() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
  }, [open]);

  return (
    <header className={`nav${scrolled ? " scrolled" : ""}`} data-crintro-hold>
      <Link href="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-orb">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-mark" src="/img/logo-b-sm.webp" alt="" width={30} height={31} />
        </span>
        <span className="brand-text">
          <span className="brand-name">Botanicatural</span>
          <span className="brand-sub">{t.nav.sub}</span>
        </span>
      </Link>

      <nav className="nav-links" aria-label="Huvudmeny">
        {t.nav.links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="nav-right">
        <LangToggle />
        <Link href="/#kollektion" className="nav-cta">
          {t.nav.cta}
        </Link>
        <BagButton />
        <button className={`burger${open ? " x" : ""}`} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? t.nav.close : t.nav.menu}>
          <i />
          <i />
        </button>
      </div>

      <div className={`mobile-menu${open ? " open" : ""}`} aria-hidden={!open}>
        {t.nav.links.map(([label, href], i) => (
          <Link key={href} href={href} style={{ "--k": i } as CSSProperties} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
            <small>0{i + 1}</small>
            {label}
          </Link>
        ))}
        <div className="mobile-lang" style={{ "--k": 4 } as CSSProperties}>
          <LangToggle />
        </div>
      </div>
    </header>
  );
}
