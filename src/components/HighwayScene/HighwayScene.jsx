import "./HighwayScene.css";

// A self-contained inline SVG so the whole site stays static — no
// image assets to fetch, everything renders from this one file.
// It's split into layers (sky / hills / dhaba / road / truck) with
// comments so you can swap or restyle any single layer independently.
export default function HighwayScene() {
  return (
    <svg
      className="highway-scene"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky-top)" />
          <stop offset="55%" stopColor="var(--sky-mid)" />
          <stop offset="100%" stopColor="var(--sky-bottom)" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe9b0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffe9b0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b2620" />
          <stop offset="100%" stopColor="var(--asphalt)" />
        </linearGradient>
      </defs>

      {/* -- sky -- */}
      <rect x="0" y="0" width="1600" height="900" fill="url(#sky)" />
      <g className="scene-moon">
        <circle cx="1180" cy="330" r="220" fill="url(#sunGlow)" />
        <circle cx="1180" cy="330" r="70" fill="#ffdf8f" opacity="0.9" />
      </g>

      {/* -- distant hills -- */}
      <path
        d="M0,560 L120,500 260,545 420,470 600,530 780,480 960,540 1140,470 1320,530 1600,480 1600,900 0,900 Z"
        fill="#3a2a3c"
        opacity="0.6"
      />
      <path
        d="M0,610 L180,560 380,600 560,540 760,595 980,545 1180,600 1400,555 1600,600 1600,900 0,900 Z"
        fill="#2a2030"
        opacity="0.75"
      />

      {/* -- roadside dhaba stall, left -- */}
      <g transform="translate(60,430)">
        <rect x="0" y="120" width="360" height="220" fill="#4a2f22" />
        <polygon points="-30,120 390,120 340,40 20,40" fill="var(--sign-red)" />
        <polygon points="20,40 340,40 300,-10 60,-10" fill="var(--sign-red-dark)" />
        {/* string lights along the awning */}
        <g fill="var(--headlight)">
          {Array.from({ length: 10 }).map((_, i) => (
            <circle
              key={i}
              className="scene-bulb"
              style={{ animationDelay: `${i * 0.25}s` }}
              cx={10 + i * 38}
              cy="128"
              r="4.5"
            />
          ))}
        </g>
        <rect x="40" y="180" width="80" height="160" fill="#1f140d" />
        <rect x="260" y="150" width="70" height="190" fill="#1f140d" />
      </g>

      {/* -- road -- */}
      <polygon points="0,900 1600,900 1050,700 550,700" fill="url(#road)" />
      <g stroke="#f3e3c3" strokeWidth="8" strokeDasharray="40 34" opacity="0.55">
        <line x1="800" y1="900" x2="800" y2="700" />
      </g>

      {/* -- foreground palm silhouette, right -- */}
      <g transform="translate(1430,540)" fill="#1c2b1a" opacity="0.85">
        <rect x="18" y="60" width="14" height="220" />
        <path d="M25,60 C-40,20 -70,-30 -60,-70 C-10,-50 15,-10 25,60 Z" />
        <path d="M25,60 C90,10 120,-40 100,-75 C50,-55 30,-15 25,60 Z" />
        <path d="M25,60 C-20,90 -60,110 -80,90 C-50,60 -10,40 25,60 Z" />
      </g>

      {/* -- truck, animated driving left to right along the road -- */}
      <g className="scene-truck">
        <g transform="translate(0,760) scale(1.15)">
          <ellipse cx="70" cy="86" rx="120" ry="14" fill="#000" opacity="0.35" />
          {/* trailer */}
          <rect x="-40" y="-10" width="150" height="78" rx="6" fill="var(--sand)" />
          <rect x="-40" y="-10" width="150" height="16" fill="var(--sign-red)" />
          {/* cab */}
          <rect x="112" y="14" width="60" height="54" rx="8" fill="var(--sign-red)" />
          <rect x="120" y="22" width="30" height="22" rx="3" fill="#bfe3ff" />
          <circle className="scene-headlight" cx="172" cy="58" r="7" fill="var(--headlight)" />
          {/* wheels */}
          <circle cx="0" cy="76" r="18" fill="#141210" />
          <circle cx="70" cy="76" r="18" fill="#141210" />
          <circle cx="150" cy="76" r="18" fill="#141210" />
          <circle cx="0" cy="76" r="6" fill="#4a4640" />
          <circle cx="70" cy="76" r="6" fill="#4a4640" />
          <circle cx="150" cy="76" r="6" fill="#4a4640" />
        </g>
      </g>
    </svg>
  );
}
