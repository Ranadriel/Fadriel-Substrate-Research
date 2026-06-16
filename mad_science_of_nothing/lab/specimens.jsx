// specimens.jsx
// Interactive visual specimens for each principle of nothing.
// Components exported to window at bottom.

// ═══════════════════════════════════════════════════════════════════
// SPECIMEN 1: Shadow Speedometer
// Rotate a flashlight at the center. Watch the shadow-edge velocity
// on a distant wall climb past c.
// ═══════════════════════════════════════════════════════════════════

function ShadowSpeedometer() {
  // angular velocity of the flashlight (rad/s)
  const [omega, setOmega] = React.useState(2.0);
  // distance to wall (meters). Starts modest, user can crank it up.
  const [distance, setDistance] = React.useState(50);
  const [angle, setAngle] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const rafRef = React.useRef(null);
  const lastTs = React.useRef(null);

  React.useEffect(() => {
    if (paused) return;
    const tick = (ts) => {
      if (lastTs.current == null) lastTs.current = ts;
      const dt = (ts - lastTs.current) / 1000;
      lastTs.current = ts;
      setAngle(a => a + omega * dt);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTs.current = null;
    };
  }, [omega, paused]);

  // v = ω * r.  Display in units of c (3e8 m/s).
  const c = 299792458;
  const shadowV = omega * distance;
  const vOverC = shadowV / c;

  // Visualization: flashlight at center of an SVG, beam pointed at angle,
  // shadow-edge landing on an arc at radius R.
  const W = 480, H = 360;
  const cx = W / 2, cy = H / 2 + 20;
  const beamR = 160; // visual radius in SVG units (the wall)

  // Clamp angle for visual sweep to keep it on the visible arc
  const visAngle = angle;
  const tipX = cx + beamR * Math.cos(visAngle);
  const tipY = cy + beamR * Math.sin(visAngle);

  // Arc path for the "wall" — a quarter arc behind the tip
  const wallStart = visAngle - Math.PI / 2.6;
  const wallEnd = visAngle + Math.PI / 2.6;

  const arcPath = (() => {
    const x1 = cx + beamR * Math.cos(wallStart);
    const y1 = cy + beamR * Math.sin(wallStart);
    const x2 = cx + beamR * Math.cos(wallEnd);
    const y2 = cy + beamR * Math.sin(wallEnd);
    return `M ${x1} ${y1} A ${beamR} ${beamR} 0 0 1 ${x2} ${y2}`;
  })();

  const superluminal = vOverC > 1;

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Faint gridlines */}
        <defs>
          <pattern id="shadowGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(242,239,228,0.04)" strokeWidth="0.5"/>
          </pattern>
          <radialGradient id="beamGrad" cx="0" cy="0.5" r="1">
            <stop offset="0%" stopColor="rgba(240,216,120,0.85)"/>
            <stop offset="100%" stopColor="rgba(240,216,120,0)"/>
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill="url(#shadowGrid)"/>

        {/* Wall arc */}
        <path
          d={arcPath}
          fill="none"
          stroke={superluminal ? '#e68b7a' : '#8fb8d4'}
          strokeWidth="2"
          strokeDasharray="4 6"
          style={{ transition: 'stroke 200ms' }}
        />

        {/* Beam cone */}
        <g style={{ transform: `translate(${cx}px, ${cy}px) rotate(${visAngle}rad)`, transformOrigin: '0 0' }}>
          <polygon
            points={`0,0 ${beamR},-18 ${beamR},18`}
            fill="url(#beamGrad)"
            opacity="0.6"
          />
          <line x1="0" y1="0" x2={beamR} y2="0" stroke="#f0d878" strokeWidth="1.5" strokeDasharray="2 4" opacity="0.7"/>
        </g>

        {/* Flashlight at center */}
        <circle cx={cx} cy={cy} r={12} fill="#1a2a1e" stroke="#f0d878" strokeWidth="2"/>
        <circle cx={cx} cy={cy} r={4} fill="#f0d878"/>

        {/* Shadow spot indicator */}
        <circle cx={tipX} cy={tipY} r="8" fill={superluminal ? '#e68b7a' : '#a3c88a'} opacity="0.9"/>
        <circle cx={tipX} cy={tipY} r="14" fill="none" stroke={superluminal ? '#e68b7a' : '#a3c88a'} strokeWidth="1" opacity="0.4"/>

        {/* Labels */}
        <text x="16" y="26" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5">FLASHLIGHT</text>
        <text x={cx + 18} y={cy + 4} fill="#c9c3b0" fontFamily="EB Garamond" fontStyle="italic" fontSize="13">source</text>
        <text x={tipX + 14} y={tipY - 6} fill="#f2efe4" fontFamily="EB Garamond" fontStyle="italic" fontSize="14">
          shadow-edge
        </text>
      </svg>

      {/* Readouts */}
      <div style={{
        marginTop: 14,
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 12,
        lineHeight: 1.8,
        color: '#c9c3b0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>shadow velocity</span>
          <span style={{ color: superluminal ? '#e68b7a' : '#a3c88a', fontWeight: 600 }}>
            {shadowV.toExponential(3)} m/s
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>in units of c</span>
          <span style={{ color: superluminal ? '#e68b7a' : '#a3c88a', fontWeight: 600 }}>
            {vOverC < 0.001 ? vOverC.toExponential(2) : vOverC.toFixed(3)} c
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1px dashed rgba(242,239,228,0.1)' }}>
          <span>status</span>
          <span style={{ color: superluminal ? '#e68b7a' : '#8fb8d4', fontStyle: 'italic', fontFamily: 'EB Garamond' }}>
            {superluminal ? 'faster than light ✦' : 'subluminal'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <ControlRow label="rotation ω" value={`${omega.toFixed(2)} rad/s`}>
          <input type="range" min="0.1" max="20" step="0.1" value={omega}
            onChange={e => setOmega(parseFloat(e.target.value))}
            className="chalk-slider"/>
        </ControlRow>
        <ControlRow label="distance to wall" value={formatDistance(distance)}>
          <input type="range" min="1" max="1e9" step="1" value={distance}
            onChange={e => setDistance(parseFloat(e.target.value))}
            className="chalk-slider"
            style={{ '--log': 1 }}
            />
        </ControlRow>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button className="chalk-button" onClick={() => setPaused(p => !p)}>
            {paused ? '▶ resume' : '❚❚ pause'}
          </button>
          <button className="chalk-button primary" onClick={() => setDistance(4e8)}>
            → sweep the Moon
          </button>
          <button className="chalk-button" onClick={() => { setDistance(50); setOmega(2); }}>
            ↺ reset
          </button>
        </div>
      </div>
    </div>
  );
}

function formatDistance(d) {
  if (d >= 1e9) return `${(d/1e9).toFixed(2)} Gm`;
  if (d >= 1e6) return `${(d/1e6).toFixed(2)} Mm`;
  if (d >= 1e3) return `${(d/1e3).toFixed(2)} km`;
  return `${d.toFixed(1)} m`;
}

function ControlRow({ label, value, children }) {
  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontFamily: 'EB Garamond, serif', fontStyle: 'italic', fontSize: 14,
        color: '#c9c3b0', marginBottom: 4,
      }}>
        <span>{label}</span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontStyle: 'normal', fontSize: 11, color: '#f0d878' }}>{value}</span>
      </div>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SPECIMEN 2: Silence Meter
// Click to descend through progressively quieter rooms.
// Each level shows a sound signature (visual waveform) going flatter.
// ═══════════════════════════════════════════════════════════════════

const SILENCE_LEVELS = [
  { db: 60, name: 'ordinary conversation', color: '#e68b7a', detail: 'air is thick with voice, footsteps, the fridge' },
  { db: 40, name: 'library', color: '#f0d878', detail: 'whispers, page turns, HVAC' },
  { db: 20, name: 'rustling leaves', color: '#a3c88a', detail: 'you notice your own breath' },
  { db: 10, name: 'recording studio', color: '#8fb8d4', detail: 'the room itself is the loudest thing' },
  { db: 0, name: 'threshold of hearing', color: '#8fb8d4', detail: 'the softest sound a healthy human ear can detect' },
  { db: -9, name: 'Microsoft anechoic chamber', color: '#e0a3c0', detail: 'you hear your heartbeat. it is loud.' },
  { db: -20, name: 'Orfield Labs, Minneapolis', color: '#e0a3c0', detail: 'your bones creak. your eyeballs move audibly.' },
  { db: -24, name: 'deepest measured silence', color: '#f2efe4', detail: 'hallucinations begin within minutes' },
];

function SilenceMeter() {
  const [level, setLevel] = React.useState(0);
  const current = SILENCE_LEVELS[level];

  // waveform amplitude scales with loudness
  const amp = Math.max(0, (current.db + 30) / 90); // 0..1

  // animated waveform
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const tick = (ts) => {
      setT(ts / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 480, H = 220;
  const points = [];
  const N = 140;
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * W;
    // complex wave: multiple sines + noise, scaled by amp
    const phase = i * 0.18;
    const y = H/2
      + Math.sin(phase + t * 2.4) * 28 * amp
      + Math.sin(phase * 2.3 + t * 3.1) * 14 * amp
      + Math.sin(phase * 0.7 + t * 1.7) * 18 * amp
      + (Math.random() - 0.5) * 3 * (amp * amp);
    points.push(`${x},${y}`);
  }
  const path = `M ${points.join(' L ')}`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Horizon line (silence) */}
        <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="rgba(242,239,228,0.12)" strokeWidth="1" strokeDasharray="2 4"/>
        {/* dB gridlines */}
        {[0.2, 0.4, 0.6, 0.8].map((f, i) => (
          <line key={i} x1="0" y1={f*H} x2={W} y2={f*H} stroke="rgba(242,239,228,0.04)" strokeWidth="0.5"/>
        ))}

        {/* The waveform */}
        <path d={path} fill="none" stroke={current.color} strokeWidth="1.5" opacity="0.9"/>
        {/* Mirrored below for symmetry */}
        <path d={path} fill="none" stroke={current.color} strokeWidth="1" opacity="0.4"
          style={{ transform: `scaleY(-1) translate(0, -${H}px)`, transformOrigin: '0 0' }}/>

        {/* dB axis labels */}
        <text x="8" y="16" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1">dB</text>
        <text x={W-8} y="16" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" letterSpacing="1">
          t →
        </text>
      </svg>

      <div style={{
        marginTop: 14,
        padding: '16px 18px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 20, color: current.color }}>
            {current.name}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 600, color: current.color }}>
            {current.db > 0 ? '+' : ''}{current.db} dB
          </span>
        </div>
        <div style={{ fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15, color: '#c9c3b0', marginTop: 6, lineHeight: 1.5 }}>
          {current.detail}
        </div>
      </div>

      {/* Ladder */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {SILENCE_LEVELS.map((lvl, i) => (
          <button key={i}
            onClick={() => setLevel(i)}
            className="chalk-button"
            style={{
              textAlign: 'left',
              opacity: i === level ? 1 : 0.6,
              borderColor: i === level ? lvl.color : 'rgba(242,239,228,0.2)',
              color: i === level ? lvl.color : '#c9c3b0',
              fontSize: 14,
              padding: '6px 14px',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
            <span style={{ fontStyle: 'italic' }}>{lvl.name}</span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11, fontStyle: 'normal' }}>
              {lvl.db > 0 ? '+' : ''}{lvl.db} dB
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SPECIMEN 3: Hole Lattice
// A grid of electrons. Click one to remove it; the "hole" moves
// like its own particle as neighbors hop in.
// ═══════════════════════════════════════════════════════════════════

function HoleLattice() {
  const COLS = 11, ROWS = 7;
  const total = COLS * ROWS;
  const [holeIdx, setHoleIdx] = React.useState(Math.floor(total / 2));
  const [autoPlay, setAutoPlay] = React.useState(true);

  // Auto-drift: the hole slowly wanders
  React.useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => {
      setHoleIdx(h => {
        const r = Math.floor(h / COLS), c = h % COLS;
        const dirs = [[0,1],[0,-1],[1,0],[-1,0]].filter(([dr,dc]) =>
          r+dr >= 0 && r+dr < ROWS && c+dc >= 0 && c+dc < COLS
        );
        const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
        return (r+dr) * COLS + (c+dc);
      });
    }, 700);
    return () => clearInterval(id);
  }, [autoPlay]);

  const W = 480, H = 300;
  const padX = 32, padY = 32;
  const cellW = (W - padX*2) / (COLS - 1);
  const cellH = (H - padY*2) / (ROWS - 1);

  const holeR = Math.floor(holeIdx / COLS);
  const holeC = holeIdx % COLS;
  const holeX = padX + holeC * cellW;
  const holeY = padY + holeR * cellH;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Faint lattice connections */}
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS - 1 }).map((_, c) => (
            <line key={`h-${r}-${c}`}
              x1={padX + c * cellW} y1={padY + r * cellH}
              x2={padX + (c+1) * cellW} y2={padY + r * cellH}
              stroke="rgba(242,239,228,0.1)" strokeWidth="0.5"/>
          ))
        )}
        {Array.from({ length: ROWS - 1 }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => (
            <line key={`v-${r}-${c}`}
              x1={padX + c * cellW} y1={padY + r * cellH}
              x2={padX + c * cellW} y2={padY + (r+1) * cellH}
              stroke="rgba(242,239,228,0.1)" strokeWidth="0.5"/>
          ))
        )}

        {/* Electrons */}
        {Array.from({ length: total }).map((_, i) => {
          if (i === holeIdx) return null;
          const r = Math.floor(i / COLS), c = i % COLS;
          const x = padX + c * cellW, y = padY + r * cellH;
          return (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => { setHoleIdx(i); setAutoPlay(false); }}>
              <circle cx={x} cy={y} r={7} fill="#8fb8d4" opacity="0.9"/>
              <text x={x} y={y+3} textAnchor="middle" fontFamily="EB Garamond" fontSize="10" fill="#0e1812" fontWeight="600">−</text>
            </g>
          );
        })}

        {/* The hole — circled in yellow, with + sign and a gentle glow */}
        <g style={{ transition: 'transform 500ms cubic-bezier(.2,.8,.3,1.4)', transform: `translate(${holeX}px, ${holeY}px)` }}>
          <circle cx={0} cy={0} r={16} fill="none" stroke="#f0d878" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8">
            <animate attributeName="r" values="13;18;13" dur="2.5s" repeatCount="indefinite"/>
          </circle>
          <circle cx={0} cy={0} r={9} fill="none" stroke="#f0d878" strokeWidth="2"/>
          <text x={0} y={4} textAnchor="middle" fontFamily="EB Garamond" fontStyle="italic" fontSize="14" fill="#f0d878" fontWeight="600">+</text>
        </g>

        <text x="16" y="20" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5">LATTICE (click any electron)</text>
      </svg>

      <div style={{
        marginTop: 14,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        The yellow ring is the <span style={{ color: '#f0d878' }}>hole</span> — a place where an electron <em>isn't</em>.
        When a neighbor hops in to fill it, the hole appears to move the opposite way.
        The <strong style={{ color: '#8fb8d4' }}>absence</strong> has momentum, charge, effective mass. We call it a positron. It's real.
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        <button className="chalk-button" onClick={() => setAutoPlay(a => !a)}>
          {autoPlay ? '❚❚ pause drift' : '▶ resume drift'}
        </button>
        <button className="chalk-button" onClick={() => setHoleIdx(Math.floor(total / 2))}>↺ recenter</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SPECIMEN 4: Cavitation (no-water)
// A blade sweeps through water. Past a critical speed, the water
// cannot close behind it fast enough — a pocket of vacuum opens up,
// revealing the "nothing underneath" that was always there.
// The collapse that follows is the water's violent attempt to
// re-claim the space it was too slow to hold.
// ═══════════════════════════════════════════════════════════════════

function CavitationField() {
  const [speed, setSpeed] = React.useState(0.85); // blade speed 0..1
  const [t, setT] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [bubbles, setBubbles] = React.useState([]);
  const idRef = React.useRef(0);
  const lastSpawn = React.useRef(0);

  React.useEffect(() => {
    if (paused) return;
    let raf, last;
    const tick = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      setT(x => x + dt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  const W = 480, H = 280;
  const cx = W/2, cy = H/2;

  // Blade: a rotating line segment. Critical speed for cavitation ~0.5.
  const bladeAngle = t * (1 + speed * 5);
  const bladeR = 90;
  const tipX = cx + Math.cos(bladeAngle) * bladeR;
  const tipY = cy + Math.sin(bladeAngle) * bladeR;

  const cavitating = speed > 0.48;

  // Spawn bubbles in the blade's wake when cavitating
  React.useEffect(() => {
    if (!cavitating || paused) return;
    const now = performance.now();
    if (now - lastSpawn.current > (120 - speed * 80)) {
      lastSpawn.current = now;
      // Spawn just behind the tip
      const backAngle = bladeAngle - 0.3;
      const sx = cx + Math.cos(backAngle) * (bladeR * (0.5 + Math.random() * 0.5));
      const sy = cy + Math.sin(backAngle) * (bladeR * (0.5 + Math.random() * 0.5));
      const id = idRef.current++;
      setBubbles(bs => [...bs.slice(-30), {
        id, x: sx, y: sy,
        birth: performance.now(),
        life: 1400 + Math.random() * 400,
        maxR: 6 + Math.random() * 8 + speed * 10,
      }]);
    }
  }, [t, cavitating, speed, paused, bladeAngle]);

  // Cleanup
  React.useEffect(() => {
    const id = setInterval(() => {
      const now = performance.now();
      setBubbles(bs => bs.filter(b => now - b.birth < b.life));
    }, 200);
    return () => clearInterval(id);
  }, []);

  const onClick = (e) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    const id = idRef.current++;
    setBubbles(bs => [...bs, {
      id, x: p.x, y: p.y,
      birth: performance.now(),
      life: 1800,
      maxR: 14,
    }]);
  };

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} onClick={onClick}
        style={{ width: '100%', height: 'auto', display: 'block', cursor: 'crosshair', background: '#07100b' }}>
        <defs>
          <radialGradient id="waterGrad" cx="0.5" cy="0.5" r="0.7">
            <stop offset="0%" stopColor="rgba(143,184,212,0.14)"/>
            <stop offset="100%" stopColor="rgba(143,184,212,0.04)"/>
          </radialGradient>
          <radialGradient id="vacuumGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(14,24,18,1)"/>
            <stop offset="70%" stopColor="rgba(14,24,18,0.9)"/>
            <stop offset="100%" stopColor="rgba(14,24,18,0)"/>
          </radialGradient>
        </defs>

        {/* Water body */}
        <rect width={W} height={H} fill="url(#waterGrad)"/>

        {/* Flow streaks — subtle water motion */}
        {Array.from({ length: 14 }).map((_, i) => {
          const y = (i / 14) * H;
          const offset = (t * 12 * (0.3 + speed)) % 40;
          return (
            <line key={i}
              x1={-40 + offset} y1={y}
              x2={20 + offset} y2={y + 1}
              stroke="rgba(143,184,212,0.15)" strokeWidth="0.5"/>
          );
        })}

        {/* Blade hub */}
        <circle cx={cx} cy={cy} r={10} fill="#0e1812" stroke="#c9c3b0" strokeWidth="1"/>

        {/* Blade */}
        <g style={{ transform: `translate(${cx}px, ${cy}px) rotate(${bladeAngle}rad)`, transformOrigin: '0 0' }}>
          <path d={`M 0 -6 L ${bladeR} -2 L ${bladeR + 4} 0 L ${bladeR} 2 L 0 6 Z`}
            fill="#c9c3b0" stroke="#f2efe4" strokeWidth="0.5"/>
        </g>

        {/* Motion blur trail behind blade */}
        <g opacity={0.35}>
          {[-1, -2, -3, -4, -5].map((off, i) => {
            const a = bladeAngle + off * 0.08 * (1 + speed);
            return (
              <g key={i} style={{ transform: `translate(${cx}px, ${cy}px) rotate(${a}rad)`, transformOrigin: '0 0' }}>
                <path d={`M 10 -3 L ${bladeR - 4} -1 L ${bladeR} 0 L ${bladeR - 4} 1 L 10 3 Z`}
                  fill="#c9c3b0" opacity={0.18 - i * 0.03}/>
              </g>
            );
          })}
        </g>

        {/* Cavitation bubbles — pockets of vacuum */}
        {bubbles.map(b => {
          const age = performance.now() - b.birth;
          const tt = Math.min(1, age / b.life);
          // Grow during first 55%, then crash implode in last 45%
          const r = tt < 0.55
            ? b.maxR * (tt / 0.55)
            : b.maxR * Math.pow(1 - (tt - 0.55)/0.45, 1.5);
          const opacity = tt < 0.55 ? 1 : Math.max(0, 1 - (tt - 0.55)/0.45);
          const imploding = tt > 0.9;
          return (
            <g key={b.id}>
              {/* The vacuum inside — darker than water */}
              <circle cx={b.x} cy={b.y} r={r} fill="url(#vacuumGrad)" opacity={opacity * 0.9}/>
              {/* Skin of the bubble — water straining to close */}
              <circle cx={b.x} cy={b.y} r={r} fill="none"
                stroke={imploding ? '#e68b7a' : '#f2efe4'}
                strokeWidth={imploding ? 2 : 1}
                opacity={opacity}/>
              {/* Highlight — light bending across the void */}
              <circle cx={b.x - r*0.3} cy={b.y - r*0.3} r={Math.max(0, r * 0.2)}
                fill="rgba(242,239,228,0.35)" opacity={opacity * 0.7}/>
              {/* Collapse shockwave */}
              {imploding && (
                <>
                  <circle cx={b.x} cy={b.y} r={r * 4} fill="none"
                    stroke="#e68b7a" strokeWidth="0.6" opacity={1 - (tt - 0.9)/0.1}/>
                  <circle cx={b.x} cy={b.y} r={r * 2.5} fill="none"
                    stroke="#f0d878" strokeWidth="0.5" opacity={0.5 * (1 - (tt - 0.9)/0.1)}/>
                </>
              )}
            </g>
          );
        })}

        {/* HUD */}
        <text x="16" y="20" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5">
          BLADE v WATER · click to seed a void manually
        </text>
        <text x={W-16} y="20" fill={cavitating ? '#e68b7a' : '#8fb8d4'} fontFamily="EB Garamond" fontStyle="italic" fontSize="12" textAnchor="end">
          {cavitating ? 'cavitating' : 'below threshold'}
        </text>
      </svg>

      <div style={{
        marginTop: 14,
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.8, color: '#c9c3b0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>tip velocity</span>
          <span style={{ color: cavitating ? '#e68b7a' : '#a3c88a', fontWeight: 600 }}>
            {(speed * 140).toFixed(1)} m/s
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>local pressure</span>
          <span style={{ color: cavitating ? '#e68b7a' : '#8fb8d4', fontWeight: 600 }}>
            {cavitating ? `− ${(speed * 3).toFixed(2)} kPa` : `+ ${((1-speed) * 100).toFixed(1)} kPa`}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1px dashed rgba(242,239,228,0.1)' }}>
          <span>water closure rate</span>
          <span style={{ color: cavitating ? '#e68b7a' : '#a3c88a', fontStyle: 'italic', fontFamily: 'EB Garamond', fontSize: 14 }}>
            {cavitating ? 'too slow — void exposed' : 'keeping up'}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <ControlRow label="blade speed" value={`${(speed * 100).toFixed(0)}%`}>
          <input type="range" min="0" max="1" step="0.01" value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="chalk-slider"/>
        </ControlRow>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="chalk-button" onClick={() => setPaused(p => !p)}>
            {paused ? '▶ resume' : '❚❚ pause'}
          </button>
          <button className="chalk-button primary" onClick={() => setSpeed(1)}>
            → full throttle
          </button>
          <button className="chalk-button" onClick={() => { setSpeed(0.2); setBubbles([]); }}>
            ↺ calm
          </button>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════
// SPECIMEN 5: Quantum Vacuum Foam
// A field of virtual particle-antiparticle pairs appearing and
// annihilating. "Nothing" is boiling.
// ═══════════════════════════════════════════════════════════════════

function QuantumFoam() {
  const [pairs, setPairs] = React.useState([]);
  const idRef = React.useRef(0);
  const [, tick] = React.useState(0);

  React.useEffect(() => {
    const spawn = () => {
      const id = idRef.current++;
      const x = Math.random() * 460 + 10;
      const y = Math.random() * 220 + 10;
      const angle = Math.random() * Math.PI * 2;
      const life = 600 + Math.random() * 700;
      setPairs(ps => [...ps, { id, x, y, angle, birth: performance.now(), life }]);
    };
    // spawn bursts
    const id = setInterval(spawn, 90);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    let raf;
    const t = () => { tick(x => x + 1); raf = requestAnimationFrame(t); };
    raf = requestAnimationFrame(t);
    return () => cancelAnimationFrame(raf);
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => {
      const now = performance.now();
      setPairs(ps => ps.filter(p => now - p.birth < p.life));
    }, 200);
    return () => clearInterval(id);
  }, []);

  const W = 480, H = 260;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <rect width={W} height={H} fill="rgba(0,0,0,0.3)"/>
        {/* faint starfield */}
        {Array.from({ length: 60 }).map((_, i) => {
          const x = (i * 37) % W;
          const y = (i * 53) % H;
          return <circle key={i} cx={x} cy={y} r="0.5" fill="rgba(242,239,228,0.12)"/>;
        })}

        {pairs.map(p => {
          const age = performance.now() - p.birth;
          const t = Math.min(1, age / p.life);
          // separation grows then shrinks
          const sep = 14 * Math.sin(t * Math.PI);
          const dx = Math.cos(p.angle) * sep;
          const dy = Math.sin(p.angle) * sep;
          const opacity = Math.sin(t * Math.PI);
          const annihilating = t > 0.88;
          return (
            <g key={p.id}>
              {annihilating && (
                <circle cx={p.x} cy={p.y} r={8 * (1 - (t-0.88)/0.12)}
                  fill="none" stroke="#f0d878" strokeWidth="0.5"
                  opacity={1 - (t-0.88)/0.12}/>
              )}
              {/* particle */}
              <circle cx={p.x + dx} cy={p.y + dy} r={2.5}
                fill="#8fb8d4" opacity={opacity}/>
              {/* antiparticle */}
              <circle cx={p.x - dx} cy={p.y - dy} r={2.5}
                fill="#e68b7a" opacity={opacity}/>
              {/* subtle connecting arc */}
              <line x1={p.x+dx} y1={p.y+dy} x2={p.x-dx} y2={p.y-dy}
                stroke="rgba(242,239,228,0.15)" strokeWidth="0.5"
                strokeDasharray="1 2" opacity={opacity * 0.7}/>
            </g>
          );
        })}

        <text x="16" y="22" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5">QUANTUM VACUUM · ∅</text>
        <text x={W-16} y={H-12} fill="#8a8874" fontFamily="EB Garamond" fontStyle="italic" fontSize="11" textAnchor="end">
          ΔE · Δt ≥ ℏ/2
        </text>
      </svg>
      <div style={{
        marginTop: 14,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        A perfect vacuum. <em>Nothing there.</em> Except uncertainty forbids stillness —
        so virtual <span style={{ color: '#8fb8d4' }}>particle</span> /
        <span style={{ color: '#e68b7a' }}> antiparticle</span> pairs pop into existence,
        borrow energy from the void, and annihilate before the universe can check the receipts.
        The vacuum has <strong>pressure</strong>. Empty space is not empty.
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SPECIMEN 6: Dark Matter Map
// Visible galaxies rotating. Toggle "visible matter" vs "dark halo"
// to reveal the invisible something that makes them rotate correctly.
// ═══════════════════════════════════════════════════════════════════

function DarkMatterMap() {
  const [showHalo, setShowHalo] = React.useState(true);
  const [t, setT] = React.useState(0);

  React.useEffect(() => {
    let raf;
    const tick = (ts) => {
      setT(ts / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 480, H = 300;
  const cx = W/2, cy = H/2;

  // Stars in a spiral galaxy — visible matter
  const stars = [];
  for (let i = 0; i < 120; i++) {
    const r = 20 + Math.random() * 110;
    const a = (i / 120) * Math.PI * 6 + r * 0.03 + t * 0.15 * (80 / (r + 20));
    stars.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * 0.55, r });
  }

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <rect width={W} height={H} fill="rgba(0,0,0,0.35)"/>

        {/* Dark halo — dim cloud much larger than visible galaxy */}
        {showHalo && (
          <>
            <defs>
              <radialGradient id="haloGrad" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="rgba(224,163,192,0.12)"/>
                <stop offset="70%" stopColor="rgba(224,163,192,0.04)"/>
                <stop offset="100%" stopColor="rgba(224,163,192,0)"/>
              </radialGradient>
            </defs>
            <circle cx={cx} cy={cy} r={200} fill="url(#haloGrad)"/>
            <circle cx={cx} cy={cy} r={180} fill="none" stroke="rgba(224,163,192,0.3)" strokeWidth="0.5" strokeDasharray="2 6"/>
            <circle cx={cx} cy={cy} r={150} fill="none" stroke="rgba(224,163,192,0.2)" strokeWidth="0.5" strokeDasharray="2 6"/>
            <text x={cx} y={30} textAnchor="middle" fontFamily="EB Garamond" fontStyle="italic" fontSize="12" fill="#e0a3c0">
              inferred dark halo
            </text>
          </>
        )}

        {/* Galactic disk dust */}
        <ellipse cx={cx} cy={cy} rx={130} ry={22} fill="rgba(143,184,212,0.04)"/>

        {/* Stars */}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r > 80 ? 0.8 : 1.2} fill="#f2efe4" opacity={0.9 - s.r * 0.003}/>
        ))}

        {/* Galactic core */}
        <circle cx={cx} cy={cy} r={8} fill="#f0d878" opacity="0.9"/>
        <circle cx={cx} cy={cy} r={14} fill="none" stroke="#f0d878" strokeWidth="0.5" opacity="0.4"/>

        <text x="16" y="22" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5">SPIRAL GALAXY · rotation curve</text>
      </svg>

      {/* Rotation curve mini-chart */}
      <RotationCurve showHalo={showHalo} />

      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        <button className="chalk-button primary" onClick={() => setShowHalo(h => !h)}>
          {showHalo ? 'hide dark halo' : 'reveal dark halo'}
        </button>
      </div>
      <div style={{
        marginTop: 14,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        Stars at the galaxy's edge rotate <em>too fast</em>. Visible matter alone can't hold them in.
        So we infer an <strong style={{ color: '#e0a3c0' }}>invisible halo</strong> — something we cannot see, touch, or detect directly.
        We know it's there only by what it <em>does</em> to things we <em>can</em> see.
        The universe is <strong style={{ color: '#e0a3c0' }}>~27% nothing-we-can-find</strong>.
      </div>
    </div>
  );
}

function RotationCurve({ showHalo }) {
  // Two curves: Newtonian (drops off) vs observed (flat).
  const W = 480, H = 80;
  const newtonian = [];
  const observed = [];
  for (let i = 0; i <= 40; i++) {
    const x = (i / 40) * W;
    const r = i / 40;
    // Newtonian: rises then falls like 1/sqrt(r)
    const nV = r < 0.2 ? r * 5 * 0.8 : 0.8 / Math.sqrt(r * 3);
    // Observed: rises then flattens
    const oV = r < 0.2 ? r * 5 * 0.8 : 0.8;
    newtonian.push(`${x},${H - nV * (H-20) - 10}`);
    observed.push(`${x},${H - oV * (H-20) - 10}`);
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', marginTop: 8 }}>
      <rect width={W} height={H} fill="rgba(0,0,0,0.25)"/>
      <line x1="0" y1={H-10} x2={W} y2={H-10} stroke="rgba(242,239,228,0.15)" strokeWidth="0.5"/>
      <path d={`M ${newtonian.join(' L ')}`} fill="none" stroke="#8fb8d4" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8"/>
      {showHalo && (
        <path d={`M ${observed.join(' L ')}`} fill="none" stroke="#e0a3c0" strokeWidth="1.5"/>
      )}
      <text x="8" y="14" fill="#8fb8d4" fontFamily="EB Garamond" fontStyle="italic" fontSize="11">predicted (visible matter only)</text>
      {showHalo && (
        <text x="8" y="28" fill="#e0a3c0" fontFamily="EB Garamond" fontStyle="italic" fontSize="11">observed (with dark halo)</text>
      )}
      <text x={W-8} y="14" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="9" textAnchor="end" letterSpacing="1">v(r)</text>
    </svg>
  );
}

Object.assign(window, {
  ShadowSpeedometer, SilenceMeter, HoleLattice,
  CavitationField, QuantumFoam, DarkMatterMap,
});
