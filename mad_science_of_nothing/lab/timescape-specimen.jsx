// timescape-specimen.jsx
// SPECIMEN IX: Timescapes
// In general relativity, clocks run slower in deeper gravitational wells.
// Wiltshire's Timescape cosmology proposes that cosmic voids — being
// emptier — have had MORE proper time elapse since the Big Bang than
// dense regions have. What we call "dark energy" may just be what you
// get when you average over a lumpy universe whose clocks disagree.
//
// Visual: a checkerboard of regions. Voids shown large and light,
// dense clusters shown small and dark. Each has its own clock ticking
// at its own rate. Drag the "dark matter density" slider and watch the
// apparent-age gap open up.

function Timescapes() {
  const [densityFrac, setDensityFrac] = React.useState(0.35); // fraction of space that's dense
  const [t, setT] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

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

  // Clock rates: void runs fast (less curvature), dense runs slow
  const voidRate = 1.0;
  const denseRate = 1 - densityFrac * 0.55; // heavier matter slows it more

  const voidAge = t * voidRate;
  const denseAge = t * denseRate;
  const naiveAge = t * (voidRate * (1 - densityFrac) + denseRate * densityFrac);

  // Apparent "dark energy" from averaging lumpy clocks
  const ageGap = voidAge - denseAge;
  const apparentLambda = ageGap * 0.3; // illustrative

  const W = 480, H = 300;
  const cols = 14, rows = 9;
  const cellW = W / cols, cellH = H / rows;

  // Build a lumpy density map. Same cells every render for stability.
  const densityMap = React.useMemo(() => {
    const arr = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Mix of soft noise centers so it looks cellular
        let d = 0;
        const centers = [
          [3, 2, 2], [10, 3, 2.2], [7, 5, 2.5], [2, 7, 1.8], [12, 7, 2]
        ];
        for (const [cx, cy, rad] of centers) {
          const dist = Math.hypot(c - cx, r - cy);
          d += Math.exp(-(dist * dist) / (2 * rad * rad));
        }
        arr.push(Math.min(1, d));
      }
    }
    return arr;
  }, []);

  // Threshold into dense/void using densityFrac
  const sorted = [...densityMap].sort((a,b) => b - a);
  const threshold = sorted[Math.floor(densityFrac * sorted.length)] ?? 0.5;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{
        width: '100%', height: 'auto', display: 'block', background: '#050a07'
      }}>
        <defs>
          <radialGradient id="voidClock" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(143,184,212,0.25)"/>
            <stop offset="100%" stopColor="rgba(143,184,212,0)"/>
          </radialGradient>
          <radialGradient id="denseClock" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(224,163,192,0.45)"/>
            <stop offset="100%" stopColor="rgba(224,163,192,0)"/>
          </radialGradient>
        </defs>

        {/* Cells */}
        {densityMap.map((d, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          const x = c * cellW, y = r * cellH;
          const isDense = d >= threshold;
          return (
            <g key={i}>
              <rect x={x} y={y} width={cellW} height={cellH}
                fill={isDense ? 'url(#denseClock)' : 'url(#voidClock)'}/>
              {/* Clock hand for each cell — tick rate depends on density */}
              <ClockHand
                cx={x + cellW/2}
                cy={y + cellH/2}
                r={Math.min(cellW, cellH) * 0.28}
                angle={(t * (isDense ? denseRate : voidRate) * 360 / 4) % 360}
                color={isDense ? 'rgba(224,163,192,0.7)' : 'rgba(143,184,212,0.7)'}
              />
            </g>
          );
        })}

        {/* Cell grid */}
        {Array.from({ length: cols + 1 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * cellW} y1="0" x2={i * cellW} y2={H}
            stroke="rgba(242,239,228,0.04)" strokeWidth="0.4"/>
        ))}
        {Array.from({ length: rows + 1 }).map((_, i) => (
          <line key={`h-${i}`} x1="0" y1={i * cellH} x2={W} y2={i * cellH}
            stroke="rgba(242,239,228,0.04)" strokeWidth="0.4"/>
        ))}

        <text x="16" y="22" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5">
          TIMESCAPE · clocks per region
        </text>
      </svg>

      {/* Age readout */}
      <div style={{
        marginTop: 14,
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.8, color: '#c9c3b0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#8fb8d4' }}>void clock (proper time)</span>
          <span style={{ color: '#8fb8d4', fontWeight: 600 }}>{voidAge.toFixed(2)} gyr</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#e0a3c0' }}>dense clock (proper time)</span>
          <span style={{ color: '#e0a3c0', fontWeight: 600 }}>{denseAge.toFixed(2)} gyr</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>age gap (void − dense)</span>
          <span style={{ color: '#f0d878', fontWeight: 600 }}>+{ageGap.toFixed(2)} gyr</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1px dashed rgba(242,239,228,0.1)' }}>
          <span>apparent Λ (from averaging)</span>
          <span style={{ color: '#e68b7a', fontStyle: 'italic', fontFamily: 'EB Garamond', fontSize: 14 }}>
            {apparentLambda.toFixed(3)} (illusory)
          </span>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <ControlRow label="dense fraction" value={`${(densityFrac * 100).toFixed(0)}%`}>
          <input type="range" min="0" max="1" step="0.01" value={densityFrac}
            onChange={e => setDensityFrac(parseFloat(e.target.value))}
            className="chalk-slider"/>
        </ControlRow>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="chalk-button" onClick={() => setPaused(p => !p)}>
            {paused ? '▶ resume' : '❚❚ pause'}
          </button>
          <button className="chalk-button" onClick={() => setT(0)}>↺ big bang</button>
        </div>
      </div>

      <div style={{
        marginTop: 14,
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        Clocks in <span style={{ color: '#e0a3c0' }}>dense regions</span> tick slow —
        mass curves spacetime, proper time drags. Clocks in <span style={{ color: '#8fb8d4' }}>voids</span> tick fast.
        Since the Big Bang, voids have <em style={{ color: '#f0d878' }}>aged more</em>
        than galaxies have.
        <br/><br/>
        When we average the universe and assume a single clock, the mismatch looks
        like <strong style={{ color: '#e68b7a' }}>accelerating expansion.</strong>
        Wiltshire proposes that what we call <em>dark energy</em> may not exist at all.
        It is an artifact of <strong style={{ color: '#f0d878' }}>averaging over the nothing.</strong>
        <br/><br/>
        <span style={{ color: '#f0d878', fontFamily: 'Caveat', fontSize: 18, fontStyle: 'normal' }}>
          — the void has had more time to exist than you have.
        </span>
      </div>
    </div>
  );
}

function ClockHand({ cx, cy, r, angle, color }) {
  const rad = (angle - 90) * Math.PI / 180;
  const hx = cx + Math.cos(rad) * r;
  const hy = cy + Math.sin(rad) * r;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="0.5" opacity="0.5"/>
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={color} strokeWidth="1.2"/>
      <circle cx={cx} cy={cy} r="1" fill={color}/>
    </g>
  );
}

Object.assign(window, { Timescapes });
