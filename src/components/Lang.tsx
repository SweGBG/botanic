"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dicts, type Dict, type Lang } from "@/lib/dict";

type Ctx = { lang: Lang; t: Dict; setLang: (l: Lang) => void };
const LangCtx = createContext<Ctx>({ lang: "sv", t: dicts.sv, setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sv");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("botanic-lang");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "en" || saved === "sv") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("botanic-lang", l);
    } catch {}
  };

  return <LangCtx.Provider value={{ lang, t: dicts[lang], setLang }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="lang" role="group" aria-label="Språk / Language">
      <button className={lang === "sv" ? "on" : ""} onClick={() => setLang("sv")} aria-pressed={lang === "sv"}>
        SV
      </button>
      <span aria-hidden>/</span>
      <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>
        EN
      </button>
    </div>
  );
}

/** Splits text into word spans that materialize one after another. */
export function Mat({ text, delay = 0, step = 0.06 }: { text: string; delay?: number; step?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`} className="mw" style={{ ["--wd" as string]: `${delay + i * step}s` }}>
          {w}{" "}
        </span>
      ))}
    </>
  );
}
