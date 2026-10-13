// Fixed night-sky backdrop: haze, stars, moon, and rising embers.
// Purely decorative, so it is hidden from assistive tech.

// Deterministic pseudo-random numbers so the markup is identical on every render.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = rng(42);

const STARS = Array.from({ length: 46 }, () => ({
  left: (rand() * 100).toFixed(2),
  top: (rand() * 60).toFixed(2),
  size: (1 + rand() * 2).toFixed(1),
  dur: (3 + rand() * 4).toFixed(1),
  delay: (rand() * 6).toFixed(1),
}));

// Embers rise from near the --fx position (set in globals.css) and drift outward.
const EMBERS = Array.from({ length: 18 }, () => ({
  off: ((rand() - 0.5) * 14).toFixed(1),
  size: (3 + rand() * 4).toFixed(1),
  dur: (7 + rand() * 7).toFixed(1),
  delay: (-rand() * 14).toFixed(1),
  drift: Math.round((rand() - 0.5) * 160),
}));

export default function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--dur": `${s.dur}s`,
            "--delay": `${s.delay}s`,
          }}
        />
      ))}

      <div className="moon" />

      <div className="embers">
        {EMBERS.map((e, i) => (
          <span
            key={i}
            className="ember"
            style={{
              left: `calc(var(--fx, 50%) + ${e.off}%)`,
              width: `${e.size}px`,
              height: `${e.size}px`,
              "--dur": `${e.dur}s`,
              "--delay": `${e.delay}s`,
              "--drift": `${e.drift}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
