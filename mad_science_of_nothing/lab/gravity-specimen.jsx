// gravity-specimen.jsx
// SPECIMEN: Gravitational Scissors / Reality Lens
// A foreground mass drifts across a field of background stars. The
// apparent image of a star whips across the sky as the lens passes —
// and the image point (the "scissor" of warped spacetime and a light
// ray) can move faster than c. Reality is faster than light, when
// reality is nothing but a relationship between things.

function GravityScissors() {
  const [t, setT] = React.useState(0);
  const [mass, setMass] = React.useState(60);   // visual "mass" → lens strength
  const [speed, setSpeed] = React.useState(0.6); // lens drift speed
  const [paused, setPaused] = React.useState(false);
  const [showGrid, setShowGrid] = React.useState(true);

  React.useEffect(() => {
    if (paused) return;
    let raf, last;
    const tick = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      setT(x => x + dt * speed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, speed]);

  const W = 480, H = 300;
  const cx = W/2, cy = H/2;

  // Lens position: oscillates across the field
  const lensX = cx + Math.sin(t) * (W * 0.38);
  const lensY = cy + Math.cos(t * 0.7) * 40;

  // Background stars — fixed positions
  const stars = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 70; i++) {
      arr.push({
        x: (i * 71) % (W - 40) + 20,
        y: ((i * 113) % (H - 40)) + 20,
        r: 0.7 + (i % 4) * 0.3,
        id: i,
      });
    }
    return arr;
  }, []);

  // Focal star — we track its apparent image as the lens passes.
  // This is the "scissor point" whose velocity we measure.
  const focalStar = { x: cx - 40, y: cy + 10 };

  // Lensing model (toy): apparent position = true + deflection toward lens
  // deflection ~ mass / distance
  function applyLens(sx, sy) {
    const dx = sx - lensX;
    const dy = sy - lensY;
    const r2 = dx*dx + dy*dy;
    const r = Math.sqrt(r2) + 1;
    // Einstein-ring-ish pull toward lens. Saturate when very close.
    const pull = Math.min(40, (mass * 30) / r);
    return { x: sx - (dx / r) * pull, y: sy - (dy / r) * pull, pull, r };
  }

  const focalApparent = applyLens(focalStar.x, focalStar.y);

  // Compute apparent velocity of focal image by numerical derivative
  const prevApparent = React.useRef({ x: focalApparent.x, y: focalApparent.y, t: 0 });
  const lastTick = React.useRef(t);
  const [apparentV, setApparentV] = React.useState(0);
  React.useEffect(() => {
    const prev = prevApparent.current;
    const dt = t - prev.t;
    if (dt > 0.0001) {
      const dx = focalApparent.x - prev.x;
      const dy = focalApparent.y - prev.y;
      const v = Math.sqrt(dx*dx + dy*dy) / dt;
      setApparentV(v);
      prevApparent.current = { x: focalApparent.x, y: focalApparent.y, t };
    }
  }, [t, focalApparent.x, focalApparent.y]);

  // Scale: treat screen px as parsecs → shadow velocity in c units
  // Fictional but illustrative: when the lens sweeps past, apparent v
  // spikes toward arbitrarily high multiples of c.
  const vOverC = apparentV * (1 / 12); // tuned so wisps cross c during sweep

  const superluminal = vOverC > 1;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block', background: '#07100b' }}>
        {/* Distorted grid (spacetime bending) */}
        {showGrid && (
          <g opacity="0.35">
            {Array.from({ length: 13 }).map((_, i) => {
              const baseX = (i / 12) * W;
              const pts = [];
              for (let j = 0; j <= 20; j++) {
                const baseY = (j / 20) * H;
                const r = Math.hypot(baseX - lensX, baseY - lensY) + 1;
                const pull = Math.min(18, (mass * 12) / r);
                const dx = baseX - lensX, dy = baseY - lensY;
                pts.push(`${baseX - (dx/r) * pull},${baseY - (dy/r) * pull}`);
              }
              return <polyline key={`vg-${i}`} points={pts.join(' ')} fill="none"
                stroke="rgba(143,184,212,0.35)" strokeWidth="0.4"/>;
            })}
            {Array.from({ length: 9 }).map((_, i) => {
              const baseY = (i / 8) * H;
              const pts = [];
              for (let j = 0; j <= 30; j++) {
                const baseX = (j / 30) * W;
                const r = Math.hypot(baseX - lensX, baseY - lensY) + 1;
                const pull = Math.min(18, (mass * 12) / r);
                const dx = baseX - lensX, dy = baseY - lensY;
                pts.push(`${baseX - (dx/r) * pull},${baseY - (dy/r) * pull}`);
              }
              return <polyline key={`hg-${i}`} points={pts.join(' ')} fill="none"
                stroke="rgba(143,184,212,0.35)" strokeWidth="0.4"/>;
            })}
          </g>
        )}

        {/* Background stars — drawn at their apparent (lensed) positions */}
        {stars.map(s => {
          const a = applyLens(s.x, s.y);
          const sz = s.r + Math.min(2, a.pull * 0.05);
          return <circle key={s.id} cx={a.x} cy={a.y} r={sz} fill="#f2efe4" opacity="0.85"/>;
        })}

        {/* The focal star — its TRUE position (faint) */}
        <circle cx={focalStar.x} cy={focalStar.y} r={2.5} fill="rgba(143,184,212,0.3)"/>
        <text x={focalStar.x + 8} y={focalStar.y - 6} fill="rgba(143,184,212,0.55)"
          fontFamily="EB Garamond" fontStyle="italic" fontSize="10">true position</text>

        {/* Focal star's APPARENT image — the scissor point */}
        <circle cx={focalApparent.x} cy={focalApparent.y} r={5}
          fill={superluminal ? '#e68b7a' : '#f0d878'}/>
        <circle cx={focalApparent.x} cy={focalApparent.y} r={10} fill="none"
          stroke={superluminal ? '#e68b7a' : '#f0d878'} strokeWidth="1" opacity="0.5"/>
        <text x={focalApparent.x + 12} y={focalApparent.y + 4} fill={superluminal ? '#e68b7a' : '#f0d878'}
          fontFamily="EB Garamond" fontStyle="italic" fontSize="11">apparent image</text>

        {/* Trail showing where the apparent image has been */}
        <ApparentTrail focalStar={focalStar} applyLens={applyLens} steps={30} />

        {/* Lens — the drifting mass */}
        <defs>
          <radialGradient id="lensGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(224,163,192,0.7)"/>
            <stop offset="60%" stopColor="rgba(224,163,192,0.15)"/>
            <stop offset="100%" stopColor="rgba(224,163,192,0)"/>
          </radialGradient>
        </defs>
        <circle cx={lensX} cy={lensY} r={mass * 0.7} fill="url(#lensGrad)"/>
        <circle cx={lensX} cy={lensY} r={6} fill="#0e1812" stroke="#e0a3c0" strokeWidth="1.5"/>
        <text x={lensX + 10} y={lensY - 8} fill="#e0a3c0"
          fontFamily="EB Garamond" fontStyle="italic" fontSize="11">foreground mass</text>

        <text x="16" y="22" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5">
          GRAVITATIONAL LENS · tracking apparent image
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
          <span>apparent image velocity</span>
          <span style={{ color: superluminal ? '#e68b7a' : '#a3c88a', fontWeight: 600 }}>
            {apparentV.toFixed(1)} px/s
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>in units of c</span>
          <span style={{ color: superluminal ? '#e68b7a' : '#a3c88a', fontWeight: 600 }}>
            {vOverC.toFixed(3)} c
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1px dashed rgba(242,239,228,0.1)' }}>
          <span>status</span>
          <span style={{ color: superluminal ? '#e68b7a' : '#8fb8d4', fontStyle: 'italic', fontFamily: 'EB Garamond' }}>
            {superluminal ? 'reality is faster than light ✦' : 'subluminal'}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <ControlRow label="lens mass" value={`${mass.toFixed(0)}`}>
          <input type="range" min="10" max="200" step="1" value={mass}
            onChange={e => setMass(parseFloat(e.target.value))} className="chalk-slider"/>
        </ControlRow>
        <ControlRow label="drift speed" value={`${speed.toFixed(2)}×`}>
          <input type="range" min="0.05" max="3" step="0.05" value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))} className="chalk-slider"/>
        </ControlRow>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="chalk-button" onClick={() => setPaused(p => !p)}>
            {paused ? '▶ resume' : '❚❚ pause'}
          </button>
          <button className="chalk-button" onClick={() => setShowGrid(g => !g)}>
            {showGrid ? 'hide spacetime grid' : 'show spacetime grid'}
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        A mass bends spacetime. Light rays bend with it. The <em style={{ color: '#f0d878' }}>apparent image</em> of a background star
        is the <strong style={{ color: '#e0a3c0' }}>intersection</strong> of a warped geodesic and a detector — a scissor point made of
        <em style={{ color: '#f0d878' }}> reality itself</em>. When the lens sweeps past, the image whips across the sky far faster than
        any photon's flight. <strong style={{ color: '#e68b7a' }}>Geometry has no speed limit.</strong>
      </div>
    </div>
  );
}

function ApparentTrail({ focalStar, applyLens, steps = 30 }) {
  // Sample last N positions of the apparent image
  const history = React.useRef([]);
  const [, tick] = React.useState(0);

  React.useEffect(() => {
    let raf;
    const t = () => {
      const a = applyLens(focalStar.x, focalStar.y);
      history.current.push({ x: a.x, y: a.y });
      if (history.current.length > steps) history.current.shift();
      tick(x => x + 1);
      raf = requestAnimationFrame(t);
    };
    raf = requestAnimationFrame(t);
    return () => cancelAnimationFrame(raf);
  }, [focalStar.x, focalStar.y, steps]);

  return (
    <g>
      {history.current.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="#f0d878"
          opacity={(i / history.current.length) * 0.4}/>
      ))}
    </g>
  );
}

Object.assign(window, { GravityScissors });
