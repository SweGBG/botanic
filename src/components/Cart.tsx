"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { useLang } from "./Lang";

/* ==========================================================================
   DEMO CART & CHECKOUT — bag drawer, checkout with test payment and an order
   confirmation. Nothing is charged; card details are never asked for.
   ========================================================================== */

const FREE_SHIP = 600;
const CODE = "NATUR10";

const T = {
  sv: {
    bag: "Korgen",
    open: "Öppna korgen",
    close: "Stäng",
    empty: "Korgen är tom. Börja med Dew Serum No. 3, vår mest älskade formel.",
    shop: "Till kollektionen",
    freeLeft: (kr: string) => `${kr} kvar till fri frakt`,
    freeOk: "Du har fri frakt",
    sample: "Ett prov på Forest Toning Mist följer med varje order",
    sub: "Delsumma",
    toCheckout: "Till kassan",
    remove: "Ta bort",
    demo: "Demobutik · inga riktiga betalningar",
    co: "Kassa",
    test: "Testläge",
    contact: "Kontaktuppgifter",
    name: "Namn",
    email: "E-post",
    address: "Adress",
    zip: "Postnr",
    city: "Ort",
    delivery: "Leverans",
    ship: [
      { id: "ombud", label: "PostNord ombud", note: "2–3 vardagar", price: 49 },
      { id: "hem", label: "Hemleverans kväll", note: "1–2 vardagar, 17–22", price: 79 },
      { id: "express", label: "Express i Göteborg", note: "Samma dag vid order före 14:00", price: 129 },
    ],
    pay: "Betalning",
    pays: { card: "Kort", klarna: "Klarna", swish: "Swish" } as Record<string, string>,
    payNote: "Testläge: inga kortuppgifter efterfrågas och inget dras.",
    code: "Rabattkod",
    codeHint: `Testa ${CODE}`,
    apply: "Använd",
    codeOk: "10 % rabatt",
    codeBad: "Koden gäller inte",
    summary: "Din order",
    shipping: "Frakt",
    free: "Fri",
    discount: "Rabatt",
    total: "Att betala",
    vat: (kr: string) => `varav moms ${kr}`,
    payBtn: (kr: string) => `Testbetala ${kr}`,
    paying: "Behandlar …",
    errForm: "Fyll i namn, en giltig e-post och adress.",
    thanks: "Tack för din beställning",
    thanksSub: (n: string) => `Ett bekräftelsemejl skulle nu gå till ${n}.`,
    orderNo: "Ordernummer",
    steps: ["Betalning godkänd", "Packas för hand i Göteborg", "Skickas med", "Levereras"],
    eta: "Beräknad leverans",
    keep: "Fortsätt handla",
    qty: "Antal",
  },
  en: {
    bag: "Bag",
    open: "Open bag",
    close: "Close",
    empty: "Your bag is empty. Start with Dew Serum No. 3, our most loved formula.",
    shop: "To the collection",
    freeLeft: (kr: string) => `${kr} left to free shipping`,
    freeOk: "You have free shipping",
    sample: "A sample of Forest Toning Mist comes with every order",
    sub: "Subtotal",
    toCheckout: "Checkout",
    remove: "Remove",
    demo: "Demo store · no real payments",
    co: "Checkout",
    test: "Test mode",
    contact: "Contact details",
    name: "Name",
    email: "Email",
    address: "Address",
    zip: "Postcode",
    city: "City",
    delivery: "Delivery",
    ship: [
      { id: "ombud", label: "PostNord pick-up point", note: "2–3 working days", price: 49 },
      { id: "hem", label: "Evening home delivery", note: "1–2 working days, 5–10 pm", price: 79 },
      { id: "express", label: "Express in Gothenburg", note: "Same day for orders before 2 pm", price: 129 },
    ],
    pay: "Payment",
    pays: { card: "Card", klarna: "Klarna", swish: "Swish" },
    payNote: "Test mode: no card details are asked for and nothing is charged.",
    code: "Discount code",
    codeHint: `Try ${CODE}`,
    apply: "Apply",
    codeOk: "10% off",
    codeBad: "Code not valid",
    summary: "Your order",
    shipping: "Shipping",
    free: "Free",
    discount: "Discount",
    total: "To pay",
    vat: (kr: string) => `incl. VAT ${kr}`,
    payBtn: (kr: string) => `Test pay ${kr}`,
    paying: "Processing …",
    errForm: "Please enter your name, a valid email and an address.",
    thanks: "Thank you for your order",
    thanksSub: (n: string) => `A confirmation email would now go to ${n}.`,
    orderNo: "Order number",
    steps: ["Payment approved", "Packed by hand in Gothenburg", "Shipped by", "Delivered"],
    eta: "Estimated delivery",
    keep: "Keep shopping",
    qty: "Quantity",
  },
};

export const kr = (n: number) => n.toLocaleString("sv-SE").replace(/ /g, " ") + " kr";
const parsePrice = (s: string) => Number(s.replace(/[^\d]/g, "")) || 0;

type Items = Record<number, number>;
type Ctx = {
  items: Items;
  count: number;
  add: (i: number) => void;
  setQty: (i: number, q: number) => void;
  clear: () => void;
  bagOpen: boolean;
  setBagOpen: (o: boolean) => void;
  coOpen: boolean;
  setCoOpen: (o: boolean) => void;
};
const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Items>({});
  const [bagOpen, setBagOpen] = useState(false);
  const [coOpen, setCoOpen] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("botanic-bag");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (v) setItems(JSON.parse(v));
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem("botanic-bag", JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = useCallback((i: number) => setItems((s) => ({ ...s, [i]: Math.min(9, (s[i] ?? 0) + 1) })), []);
  const setQty = useCallback(
    (i: number, q: number) =>
      setItems((s) => {
        const n = { ...s };
        if (q <= 0) delete n[i];
        else n[i] = Math.min(9, q);
        return n;
      }),
    [],
  );
  const clear = useCallback(() => setItems({}), []);
  const count = Object.values(items).reduce((a, b) => a + b, 0);

  return (
    <CartCtx.Provider value={{ items, count, add, setQty, clear, bagOpen, setBagOpen, coOpen, setCoOpen }}>
      {children}
      <BagDrawer />
      <Checkout />
    </CartCtx.Provider>
  );
}

function useLines() {
  const { t } = useLang();
  const { items } = useCart();
  const lines = Object.entries(items)
    .map(([i, qty]) => {
      const p = t.products.items[Number(i)];
      return p ? { i: Number(i), qty, p, price: parsePrice(p.price) } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);
  const sub = lines.reduce((s, l) => s + l.price * l.qty, 0);
  return { lines, sub };
}

/** Bag icon for the nav. */
export function BagButton() {
  const { lang } = useLang();
  const { count, setBagOpen } = useCart();
  return (
    <button type="button" className="bag-btn" onClick={() => setBagOpen(true)} aria-label={`${T[lang].open} (${count})`}>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
        <path d="M9 10V6.5a3 3 0 0 1 6 0V10" />
      </svg>
      <span className={`bag-count${count ? " has" : ""}`} key={count}>
        {count}
      </span>
    </button>
  );
}

function useEsc(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const on = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", on);
    document.documentElement.classList.add("dlg-open");
    return () => {
      window.removeEventListener("keydown", on);
      document.documentElement.classList.remove("dlg-open");
    };
  }, [open, close]);
}

function BagDrawer() {
  const { lang } = useLang();
  const c = T[lang];
  const { bagOpen, setBagOpen, setQty, setCoOpen } = useCart();
  const { lines, sub } = useLines();
  const close = useCallback(() => setBagOpen(false), [setBagOpen]);
  useEsc(bagOpen, close);
  const pct = Math.min(100, (sub / FREE_SHIP) * 100);
  const tab = bagOpen ? 0 : -1;

  return (
    <div className={`bag${bagOpen ? " open" : ""}`} aria-hidden={!bagOpen}>
      <div className="bag-scrim" onClick={close} />
      <aside className="bag-panel" role="dialog" aria-modal="true" aria-label={c.bag}>
        <header className="bag-head">
          <h3>
            {c.bag} <span>{lines.reduce((s, l) => s + l.qty, 0)}</span>
          </h3>
          <button type="button" className="bag-x" onClick={close} aria-label={c.close} tabIndex={tab}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="bag-ship">
          <p>{sub >= FREE_SHIP ? c.freeOk : c.freeLeft(kr(FREE_SHIP - sub))}</p>
          <div className="bag-ship-bar">
            <i style={{ width: `${pct}%` }} />
          </div>
        </div>

        {lines.length === 0 ? (
          <div className="bag-empty">
            <p>{c.empty}</p>
            <a href="/#kollektion" className="btn btn-gold" onClick={close} tabIndex={tab}>
              <span>{c.shop}</span>
            </a>
          </div>
        ) : (
          <ul className="bag-list">
            {lines.map(({ i, qty, p, price }) => (
              <li key={i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt="" />
                <div className="bag-item">
                  <small>{p.tag}</small>
                  <strong>{p.name}</strong>
                  <span>{kr(price * qty)}</span>
                  <button type="button" className="bag-rm" onClick={() => setQty(i, 0)} tabIndex={tab}>
                    {c.remove}
                  </button>
                </div>
                <div className="qty" aria-label={c.qty}>
                  <button type="button" onClick={() => setQty(i, qty - 1)} aria-label="−" tabIndex={tab}>
                    −
                  </button>
                  <output>{qty}</output>
                  <button type="button" onClick={() => setQty(i, qty + 1)} aria-label="+" disabled={qty >= 9} tabIndex={tab}>
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <footer className="bag-foot">
          <p className="bag-sample">
            <Sprig /> {c.sample}
          </p>
          <div className="bag-row">
            <span>{c.sub}</span>
            <strong>{kr(sub)}</strong>
          </div>
          <button
            type="button"
            className="btn btn-gold bag-go"
            disabled={!lines.length}
            tabIndex={tab}
            onClick={() => {
              setBagOpen(false);
              setCoOpen(true);
            }}
          >
            <span>{c.toCheckout}</span>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </button>
          <p className="bag-demo">{c.demo}</p>
        </footer>
      </aside>
    </div>
  );
}

function Sprig() {
  return (
    <svg className="sprig-ico" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 22V9" />
      <path d="M12 14c-4 0-6-3-6-6 3 0 6 2 6 6Z" />
      <path d="M12 11c3.5 0 5.5-2.6 5.5-5.5-3 0-5.5 2-5.5 5.5Z" />
    </svg>
  );
}

type Done = { no: string; email: string; total: number; ship: string; eta: [number, number]; lines: { name: string; qty: number; img: string }[] };

function Checkout() {
  const { lang } = useLang();
  const c = T[lang];
  const { coOpen, setCoOpen, clear } = useCart();
  const { lines, sub } = useLines();
  const [form, setForm] = useState({ name: "Elin Berg", email: "elin@example.se", address: "Linnégatan 21", zip: "413 04", city: "Göteborg" });
  const [ship, setShip] = useState("ombud");
  const [pay, setPay] = useState("card");
  const [code, setCode] = useState("");
  const [codeState, setCodeState] = useState<"" | "ok" | "bad">("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const [step, setStep] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setCoOpen(false);
    window.setTimeout(() => {
      setDone(null);
      setErr("");
    }, 450);
  }, [setCoOpen]);
  useEsc(coOpen, close);

  useEffect(() => {
    if (!done) return;
    box.current?.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStep(0);
    const ids = [1, 2].map((n) => window.setTimeout(() => setStep(n), 700 + n * 750));
    return () => ids.forEach(clearTimeout);
  }, [done]);

  const opt = c.ship.find((s) => s.id === ship) ?? c.ship[0];
  const shipCost = opt.id === "ombud" && sub >= FREE_SHIP ? 0 : opt.price;
  const discount = codeState === "ok" ? Math.round(sub * 0.1) : 0;
  const total = sub - discount + shipCost;
  const vat = Math.round(total * 0.2);

  const applyCode = () => setCodeState(code.trim().toUpperCase() === CODE ? "ok" : code.trim() ? "bad" : "");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.address.trim()) return setErr(c.errForm);
    setBusy(true);
    window.setTimeout(() => {
      const now = Date.now();
      const day = 86_400_000;
      const late = new Date().getHours() >= 14;
      const span: [number, number] = opt.id === "express" ? (late ? [1, 1] : [0, 0]) : opt.id === "hem" ? [1, 2] : [2, 3];
      setDone({
        no: "BN-" + now.toString(36).toUpperCase().slice(-6),
        email: form.email,
        total,
        ship: opt.label,
        eta: [now + span[0] * day, now + span[1] * day],
        lines: lines.map((l) => ({ name: l.p.name, qty: l.qty, img: l.p.img })),
      });
      clear();
      setCodeState("");
      setCode("");
      setBusy(false);
    }, 1300);
  };

  const date = (t: number) => new Date(t).toLocaleDateString(lang === "sv" ? "sv-SE" : "en-GB", { weekday: "short", day: "numeric", month: "short" });
  const field = (k: keyof typeof form, label: string, type = "text", wide = false) => (
    <label className={wide ? "wide" : ""}>
      <span>{label}</span>
      <input type={type} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} autoComplete="off" />
    </label>
  );

  return (
    <div className={`co${coOpen ? " open" : ""}`} aria-hidden={!coOpen}>
      <div className="co-scrim" onClick={close} />
      <div className="co-box" role="dialog" aria-modal="true" aria-label={c.co} ref={box}>
        <header className="co-head">
          <h3>{done ? c.thanks : c.co}</h3>
          <span className="co-test">{c.test}</span>
          <button type="button" className="bag-x" onClick={close} aria-label={c.close}>
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {done ? (
          <div className="co-done">
            <div className="co-seal" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/logo-b-sm.webp" alt="" />
            </div>
            <p className="co-no">
              {c.orderNo} <b>{done.no}</b>
            </p>
            <p className="co-thanks">{c.thanksSub(done.email)}</p>
            <ol className="co-steps">
              {c.steps.map((s, i) => (
                <li key={s} className={i <= step ? "on" : ""} style={{ "--k": i } as CSSProperties}>
                  <i aria-hidden>{i <= step ? "✓" : i + 1}</i>
                  <span>{i === 2 ? `${s} ${done.ship}` : s}</span>
                </li>
              ))}
            </ol>
            <ul className="co-done-items">
              {done.lines.map((l) => (
                <li key={l.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.img} alt="" />
                  <span>
                    {l.qty} × {l.name}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="co-meta">
              <div>
                <dt>{c.eta}</dt>
                <dd>{done.eta[0] === done.eta[1] ? date(done.eta[0]) : `${date(done.eta[0])} – ${date(done.eta[1])}`}</dd>
              </div>
              <div>
                <dt>{c.total}</dt>
                <dd>{kr(done.total)}</dd>
              </div>
            </dl>
            <button type="button" className="btn btn-gold" onClick={close}>
              <span>{c.keep}</span>
            </button>
          </div>
        ) : (
          <form className="co-body" onSubmit={submit}>
            <div className="co-form">
              <h4>
                <b>01</b> {c.contact}
              </h4>
              <div className="co-grid">
                {field("name", c.name, "text", true)}
                {field("email", c.email, "email", true)}
                {field("address", c.address, "text", true)}
                {field("zip", c.zip)}
                {field("city", c.city)}
              </div>

              <h4>
                <b>02</b> {c.delivery}
              </h4>
              <div className="co-ship" role="radiogroup">
                {c.ship.map((s) => {
                  const free = s.id === "ombud" && sub >= FREE_SHIP;
                  return (
                    <button type="button" key={s.id} role="radio" aria-checked={ship === s.id} className={ship === s.id ? "on" : ""} onClick={() => setShip(s.id)}>
                      <i aria-hidden />
                      <span>
                        <strong>{s.label}</strong>
                        <small>{s.note}</small>
                      </span>
                      <em>{free ? c.free : kr(s.price)}</em>
                    </button>
                  );
                })}
              </div>

              <h4>
                <b>03</b> {c.pay}
              </h4>
              <div className="co-pay" role="radiogroup">
                {Object.entries(c.pays).map(([k, v]) => (
                  <button type="button" key={k} role="radio" aria-checked={pay === k} className={pay === k ? "on" : ""} onClick={() => setPay(k)}>
                    {v}
                  </button>
                ))}
              </div>
              <p className="co-note">{c.payNote}</p>
            </div>

            <aside className="co-sum">
              <h4>{c.summary}</h4>
              <ul>
                {lines.map(({ i, qty, p, price }) => (
                  <li key={i}>
                    <span className="co-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.img} alt="" />
                      <b>{qty}</b>
                    </span>
                    <span>
                      {p.name}
                      <small>{p.tag}</small>
                    </span>
                    <em>{kr(price * qty)}</em>
                  </li>
                ))}
              </ul>
              <div className="co-code">
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setCodeState("");
                  }}
                  placeholder={c.codeHint}
                  aria-label={c.code}
                />
                <button type="button" onClick={applyCode}>
                  {c.apply}
                </button>
              </div>
              {codeState && <p className={`co-code-msg ${codeState}`}>{codeState === "ok" ? `${CODE} · ${c.codeOk}` : c.codeBad}</p>}
              <div className="co-row">
                <span>{c.sub}</span>
                <span>{kr(sub)}</span>
              </div>
              {discount > 0 && (
                <div className="co-row good">
                  <span>{c.discount}</span>
                  <span>−{kr(discount)}</span>
                </div>
              )}
              <div className="co-row">
                <span>{c.shipping}</span>
                <span>{shipCost === 0 ? c.free : kr(shipCost)}</span>
              </div>
              <div className="co-row total">
                <span>{c.total}</span>
                <strong>{kr(total)}</strong>
              </div>
              <p className="co-vat">{c.vat(kr(vat))}</p>
              {err && (
                <p className="co-err" role="alert">
                  {err}
                </p>
              )}
              <button className="btn btn-gold co-paybtn" disabled={busy || !lines.length}>
                <span>{busy ? c.paying : c.payBtn(kr(total))}</span>
              </button>
              <p className="bag-demo">{c.demo}</p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
