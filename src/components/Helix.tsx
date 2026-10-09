import type { CSSProperties } from "react";

type Props = {
  n?: number;
  speed?: number;
  labels?: string[];
  every?: number;
  className?: string;
};

/** CSS-only DNA double helix. Each rung = two beads on opposite sine phases + a stretching link. */
export default function Helix({ n = 28, speed = 9, labels = [], every = 4, className = "" }: Props) {
  return (
    <div className={`helix ${className}`} style={{ "--hs": `${speed}s`, "--n": n } as CSSProperties} aria-hidden>
      {Array.from({ length: n }, (_, i) => {
        const label = labels.length && i % every === 2 ? labels[Math.floor(i / every) % labels.length] : null;
        return (
          <span key={i} className={`rung${label ? " has-label" : ""}`} style={{ "--i": i } as CSSProperties}>
            <i className="bead a" />
            <i className="link" />
            <i className="bead b" />
            {label && <em className="rung-label">{label}</em>}
          </span>
        );
      })}
    </div>
  );
}
