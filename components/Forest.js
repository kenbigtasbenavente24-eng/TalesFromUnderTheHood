// The ground at the bottom of the page: two rows of pine silhouettes.

function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const rand = rng(7);

// Two rows of pines across a 2400-wide canvas.
const BACK = [];
for (let x = 20; x < 2400; x += 70 + rand() * 50) {
  BACK.push({ x: Math.round(x), s: (0.65 + rand() * 0.3).toFixed(2) });
}
const FRONT = [];
for (let x = 40; x < 2400; x += 120 + rand() * 80) {
  FRONT.push({ x: Math.round(x), s: (0.95 + rand() * 0.3).toFixed(2) });
}

export default function Forest() {
  return (
    <footer className="ground" aria-hidden="true">
      <svg className="trees" viewBox="0 0 2400 220" preserveAspectRatio="xMidYMax slice">
        <defs>
          <g id="pine">
            <path d="M0 -160 L32 -98 L17 -98 L42 -50 L21 -50 L50 0 L-50 0 L-21 -50 L-42 -50 L-17 -98 L-32 -98 Z" />
            <rect x="-6" y="-2" width="12" height="16" />
          </g>
        </defs>
        {BACK.map((t, i) => (
          <use key={`b${i}`} href="#pine" fill="#1a0d3a" transform={`translate(${t.x} 206) scale(${t.s})`} />
        ))}
        {FRONT.map((t, i) => (
          <use key={`f${i}`} href="#pine" fill="#0b051c" transform={`translate(${t.x} 206) scale(${t.s})`} />
        ))}
        <rect x="0" y="206" width="2400" height="14" fill="#0b051c" />
      </svg>
    </footer>
  );
}
