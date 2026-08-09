import "./TruckArtBorder.css";

// Wraps the hero title in the visual language of the reference photo:
// candy-stripe edges (the kind painted on a truck's bumper/chassis),
// a painted flower medallion in each corner, and a pair of tassels
// like the ones hung from a real truck's mirrors and grille.
export default function TruckArtBorder({ children }) {
  return (
    <div className="truck-art-border">
      <div
        className="truck-art-border__stripe truck-art-border__stripe--top"
        aria-hidden="true"
      />
      <Tassel side="left" />
      <Tassel side="right" />

      <div className="truck-art-border__inner">
        <Medallion corner="tl" />
        <Medallion corner="tr" />
        {children}
        <Medallion corner="bl" />
        <Medallion corner="br" />
      </div>

      <div
        className="truck-art-border__stripe truck-art-border__stripe--bottom"
        aria-hidden="true"
      />
    </div>
  );
}

function Medallion({ corner }) {
  return (
    <svg
      className={`truck-art-medallion truck-art-medallion--${corner}`}
      viewBox="0 0 60 60"
      aria-hidden="true"
    >
      <circle cx="30" cy="30" r="26" fill="none" stroke="var(--headlight)" strokeWidth="3" />
      <path
        d="M30 8 C36 18 44 20 52 18 C46 26 46 34 52 42 C44 40 36 42 30 52 C24 42 16 40 8 42 C14 34 14 26 8 18 C16 20 24 18 30 8 Z"
        fill="var(--sign-blue)"
        stroke="var(--paper)"
        strokeWidth="1.5"
      />
      <circle cx="30" cy="30" r="7" fill="var(--headlight)" />
    </svg>
  );
}

function Tassel({ side }) {
  return (
    <svg
      className={`truck-art-tassel truck-art-tassel--${side}`}
      viewBox="0 0 40 90"
      aria-hidden="true"
    >
      <line x1="20" y1="0" x2="20" y2="16" stroke="#2a2018" strokeWidth="3" />
      <circle cx="20" cy="24" r="10" fill="#1a1512" />
      {Array.from({ length: 7 }).map((_, i) => (
        <line
          key={i}
          x1={8 + i * 4}
          y1="34"
          x2={8 + i * 4}
          y2="86"
          stroke="#1a1512"
          strokeWidth="2.5"
        />
      ))}
    </svg>
  );
}
