"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { Mat, useLang } from "./Lang";
import { Leaf } from "./Nav";

/* ---------- Ticker ---------- */
export function Ticker() {
  const { t } = useLang();
  const items = [...t.ticker, ...t.ticker];
  return (
    <div className="ticker" data-anim>
      <div className="ticker-track">
        {items.map((it, i) => (
          <span key={i}>
            {it}
            <Leaf className="ticker-leaf" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Six source plants — each sprig rises and turns at its own speed as you scroll ---------- */
const LATIN = ["Rosa canina", "Psoralea corylifolia", "Sclerocarya birrea", "Betula pendula", "Camellia sinensis", "Hippophaë rhamnoides"];

export function Plants() {
  const { t } = useLang();
  return (
    <section className="plants" id="vaxter" data-anim>
      <div className="plants-head reveal">
        <p className="eyebrow">
          <span className="eyebrow-line" />
          {t.dna.eyebrow}
        </p>
        <h2 className="mat">{t.dna.title}</h2>
        <p className="plants-text">{t.dna.text}</p>
      </div>
      <ol className="herbarium">
        {t.dna.labels.map((name, i) => (
          <li key={name} className="specimen reveal" style={{ "--k": i } as CSSProperties}>
            <span className="specimen-no">{String(i + 1).padStart(2, "0")}</span>
            <span className="specimen-name">{name}</span>
            <span className="specimen-latin">{LATIN[i]}</span>
            <span className="specimen-rule" aria-hidden />
            <span className="specimen-note">{t.dna.notes[i]}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- Products: gilded frames, hanging tags ---------- */
function Corner({ className }: { className: string }) {
  return (
    <svg className={`corner ${className}`} viewBox="0 0 60 60" aria-hidden>
      <path d="M4 56 V 18 Q 4 4 18 4 H 56" />
      <path d="M12 56 V 24 Q 12 12 24 12 H 56" className="thin" />
      <path d="M4 18 C 14 18 18 14 18 4" className="thin" />
      <circle cx="18" cy="18" r="3" />
      <path d="M24 24 c 6 -10 16 -10 20 -4 c -6 0 -12 2 -20 4 z" className="leafy" />
    </svg>
  );
}

function ProductCard({ p, i, addLabel, addedLabel }: { p: { tag: string; name: string; desc: string; price: string; img: string }; i: number; addLabel: string; addedLabel: string }) {
  const [added, setAdded] = useState(false);
  const add = () => {
    window.dispatchEvent(new Event("bag:add"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };
  return (
    <article className="card reveal" style={{ "--k": i } as CSSProperties}>
      <div className="card-frame">
        <Corner className="c-tl" />
        <Corner className="c-tr" />
        <Corner className="c-bl" />
        <Corner className="c-br" />
        <div className="card-photo">
          <img src={p.img} alt={p.name} loading="lazy" />
          <span className="sheen" />
        </div>
        <div className="price-tag" style={{ "--sw": `${4.2 + i * 0.7}s`, "--sd": `${-i * 1.3}s` } as CSSProperties}>
          <span className="twine" />
          <span className="tag-body">{p.price}</span>
        </div>
      </div>
      <p className="card-tag">{p.tag}</p>
      <h3 className="card-name">{p.name}</h3>
      <p className="card-desc">{p.desc}</p>
      <button className={`add${added ? " done" : ""}`} onClick={add}>
        <span className="add-plus" aria-hidden>
          {added ? "✓" : "+"}
        </span>
        {added ? addedLabel : addLabel}
      </button>
    </article>
  );
}

export function Products() {
  const { t } = useLang();
  return (
    <section className="products paper" id="kollektion" data-anim>
      <div className="section-head reveal">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-line" />
            {t.products.eyebrow}
          </p>
          <h2 className="mat">{t.products.title}</h2>
        </div>
        <Link href="/#kollektion" className="link-u">
          {t.products.all}
        </Link>
      </div>
      <div className="cards">
        {t.products.items.map((p, i) => (
          <ProductCard key={p.name} p={p} i={i} addLabel={t.products.add} addedLabel={t.products.added} />
        ))}
      </div>
    </section>
  );
}

/* ---------- Ritual: exploded layers driven by scroll ---------- */
export function LayerStack({ steps, active }: { steps: { num: string; title: string }[]; active?: boolean }) {
  return (
    <div className={`stack${active ? " auto" : ""}`} aria-hidden>
      <div className="stack-scene">
        <div className="slab base">
          <span className="slab-grid" />
          <span className="slab-label">Skin · 0</span>
        </div>
        {steps.map((s, i) => (
          <div key={s.num} className={`slab s${i + 1}`} style={{ "--k": i + 1 } as CSSProperties}>
            <span className="slab-grid" />
            <span className="slab-drop" aria-hidden />
            <span className="slab-label">
              {s.num} · {s.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Ritual() {
  const { t } = useLang();
  return (
    <section className="ritual" id="ritual" data-progress data-steps="3" data-active="0" data-anim>
      <div className="ritual-sticky">
        <div className="ritual-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" />
            {t.ritual.eyebrow}
          </p>
          <h2 className="ritual-title">
            {t.ritual.title[0]}
            <br />
            <em>{t.ritual.title[1]}</em>
          </h2>
          <p className="ritual-text">{t.ritual.text}</p>
          <ol className="ritual-steps">
            {t.ritual.steps.map((s, i) => (
              <li key={s.num} className={`rs rs${i}`}>
                <span className="rs-num">{s.num}</span>
                <div>
                  <p className="rs-title">{s.title}</p>
                  <p className="rs-text">{s.text}</p>
                  <p className="rs-ing">
                    {s.ing.map((x) => (
                      <span key={x}>{x}</span>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="ritual-bar">
            <i />
          </div>
        </div>
        <LayerStack steps={t.ritual.steps} />
      </div>
    </section>
  );
}

/* ---------- Pure ingredients + wax seal ---------- */
export function Pure() {
  const { t } = useLang();
  return (
    <section className="pure paper" data-anim>
      <div className="pure-visual reveal">
        <div className="arch">
          <img src="/img/oil.webp" alt="" />
        </div>
        <div className="seal" aria-hidden>
          <span className="seal-ring" />
          <Leaf className="seal-leaf" />
          <span className="seal-text">
            {t.pure.seal[0]}
            <br />
            {t.pure.seal[1]}
          </span>
        </div>
      </div>
      <div className="pure-copy reveal">
        <h2 className="pure-title mat">
          {t.pure.title[0]}
          <br />
          {t.pure.title[1]}
          <br />
          <em>{t.pure.title[2]}</em>
        </h2>
        <p className="pure-text">{t.pure.text}</p>
        <div className="chips">
          {t.dna.labels.map((l, i) => (
            <span key={l} style={{ "--k": i } as CSSProperties}>
              {l}
            </span>
          ))}
        </div>
        <Link href="/discover" className="btn btn-moss">
          <span>{t.pure.btn}</span>
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

/* ---------- Journal with self-drawing botanical icons ---------- */
const ICONS = [
  // flask
  "M24 8 h12 M27 8 v14 L16 46 a4 4 0 0 0 4 6 h20 a4 4 0 0 0 4 -6 L33 22 V8 M20 40 h20",
  // three drops
  "M18 20 c-5 7 -5 12 0 12 s5 -5 0 -12 z M30 12 c-6 9 -6 15 0 15 s6 -6 0 -15 z M42 22 c-5 7 -5 12 0 12 s5 -5 0 -12 z M14 46 h32",
  // birch tree
  "M30 54 V10 M30 22 l-10 -8 M30 30 l12 -10 M30 40 l-12 -6 M26 16 h4 M30 34 h4 M26 46 h4",
];

export function Journal() {
  const { t } = useLang();
  return (
    <section className="journal" id="journal" data-anim>
      <div className="section-head reveal">
        <div>
          <p className="eyebrow">
            <span className="eyebrow-line" />
            {t.journal.eyebrow}
          </p>
          <h2 className="mat">{t.journal.title}</h2>
        </div>
        <Link href="/#journal" className="link-u">
          {t.journal.all}
        </Link>
      </div>
      <div className="posts">
        {t.journal.posts.map((p, i) => (
          <article key={p.title} className={`post reveal j${i + 1}`} style={{ "--k": i } as CSSProperties}>
            <div className="post-img">
              <svg viewBox="0 0 60 60" className="draw">
                <path d={ICONS[i]} />
              </svg>
              <span className="roman">{["I", "II", "III"][i]}</span>
            </div>
            <p className="post-cat">{p.cat}</p>
            <h3 className="post-title">{p.title}</h3>
            <p className="post-date">{p.date}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- Footer with newsletter ---------- */
export function Footer() {
  const { t } = useLang();
  const [ok, setOk] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setOk(true);
  };
  return (
    <footer className="footer" data-anim>
      <div className="news reveal">
        <h3 className="mat">{t.footer.news}</h3>
        {ok ? (
          <p className="news-ok">{t.footer.newsOk}</p>
        ) : (
          <form onSubmit={submit}>
            <input type="email" required placeholder={t.footer.newsPh} aria-label={t.footer.newsPh} />
            <button className="btn btn-gold" type="submit">
              <span>{t.footer.newsBtn}</span>
            </button>
          </form>
        )}
      </div>
      <div className="foot-top">
        <div className="foot-brand">
          <div className="foot-name">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="foot-mark" src="/img/logo-b-sm.webp" alt="" width={44} height={46} />
            Botanicatural
          </div>
          <p>{t.footer.tagline}</p>
          <div className="social">
            {["Ig", "Tt", "Pi"].map((s) => (
              <a key={s} href="#" aria-label={s}>
                {s}
              </a>
            ))}
          </div>
        </div>
        {Object.entries(t.footer.cols).map(([col, links]) => (
          <div key={col} className="foot-col">
            <h5>{col}</h5>
            {links.map((l) => (
              <a key={l} href="#">
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="foot-bottom">
        <p>{t.footer.copy}</p>
        <p>{t.footer.made}</p>
        <a className="credit" href="https://swegbg.com" target="_blank" rel="noopener">
          {t.footer.credit} <strong>SweGBG</strong>
        </a>
      </div>
    </footer>
  );
}

export { Mat };
