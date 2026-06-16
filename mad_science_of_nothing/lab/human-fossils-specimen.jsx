// human-fossils-specimen.jsx
// SPECIMEN XIII: Human Fossils — the Anthropocene strata, and the fungi
// that read the library we pretend is trash.

function HumanFossils() {
  const [depth, setDepth] = React.useState(0);           // 0 = surface, 1 = bottom
  const [fungi, setFungi] = React.useState(false);       // toggle fungal remediation
  const [fungiT, setFungiT] = React.useState(0);

  React.useEffect(() => {
    if (!fungi) { setFungiT(0); return; }
    let raf, last;
    const tick = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      setFungiT(x => Math.min(1, x + dt * 0.15));
      if (fungiT < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fungi, fungiT]);

  const W = 560, H = 420;

  // Strata from top (recent) to bottom (ancient)
  const strata = [
    { name: "Anthropocene · Plastic Layer", color: "#e68b7a", years: "1950 – now", h: 50,
      artifacts: ['bottle', 'can', 'tire', 'phone', 'bag'] },
    { name: "Holocene · Ash & Concrete",    color: "#8a8874", years: "12 kya", h: 35 },
    { name: "Pleistocene · Mammoth Bone",    color: "#b89a6a", years: "2.6 mya", h: 40,
      artifacts: ['bone'] },
    { name: "Pliocene",                      color: "#a88a5a", years: "5.3 mya", h: 40 },
    { name: "Miocene · Forests",             color: "#a3c88a", years: "23 mya", h: 45 },
    { name: "Cretaceous · K-Pg Boundary",    color: "#7a6050", years: "66 mya", h: 50,
      artifacts: ['iridium', 'dino'] },
    { name: "Jurassic",                      color: "#6a5040", years: "145 mya", h: 50,
      artifacts: ['ammonite'] },
    { name: "Triassic · Permian Extinction", color: "#5a4030", years: "252 mya", h: 50 },
    { name: "Cambrian · First Complex Life", color: "#4a3020", years: "540 mya", h: 60,
      artifacts: ['trilobite'] },
  ];

  // Compute y-position of each stratum
  const offsetY = 40;
  let y = offsetY;
  const layered = strata.map(s => {
    const obj = { ...s, y, y2: y + s.h };
    y += s.h;
    return obj;
  });
  const totalH = y;

  // Depth cursor
  const cursorY = offsetY + depth * (totalH - offsetY);
  // Which stratum is the cursor in?
  const currentStratum = layered.find(s => cursorY >= s.y && cursorY <= s.y2) || layered[0];

  // The plastic layer's remediation: as fungiT grows, items dissolve + green
  // mycelium threads spread
  const plasticLayer = layered[0];

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{
        width: '100%', height: 'auto', display: 'block',
        background: 'linear-gradient(to bottom, #1a2026 0%, #050504 100%)',
      }}>
        <defs>
          <linearGradient id="hfSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2026"/>
            <stop offset="100%" stopColor="#2a2520"/>
          </linearGradient>
          <radialGradient id="myc" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#f2efe4" stopOpacity="0.9"/>
            <stop offset="70%" stopColor="#a3c88a" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#a3c88a" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Sky band above strata */}
        <rect x="0" y="0" width={W} height={offsetY} fill="url(#hfSky)"/>
        <text x={16} y={18} fill="#c9c3b0" fontFamily="JetBrains Mono"
          fontSize="9" letterSpacing="1.5">SURFACE · 2026</text>
        <text x={W - 16} y={18} fill="#8a8874" fontFamily="EB Garamond"
          fontStyle="italic" fontSize="12" textAnchor="end">
          a core sample of earth, read downward
        </text>

        {/* Strata */}
        {layered.map((s, i) => {
          const isPlastic = i === 0;
          const dissolving = isPlastic && fungi;
          return (
            <g key={i}>
              <rect x="0" y={s.y} width={W} height={s.h}
                fill={s.color}
                opacity={dissolving ? (1 - fungiT * 0.5) : 0.85}/>
              {/* Noise: crinkly top edge */}
              <path d={stratumEdge(s.y, W, i)} fill={s.color} opacity="0.6"/>
              {/* Stratum label */}
              <text x={16} y={s.y + 14} fill="rgba(10,8,6,0.9)"
                fontFamily="JetBrains Mono" fontSize="8" letterSpacing="1.2">
                {s.name.toUpperCase()}
              </text>
              <text x={W - 16} y={s.y + 14} fill="rgba(10,8,6,0.7)"
                fontFamily="JetBrains Mono" fontSize="8" textAnchor="end">
                {s.years}
              </text>

              {/* Artifacts in this layer */}
              {s.artifacts && s.artifacts.map((a, j) => {
                const cx = 70 + j * 90 + i * 13 % 60;
                const cy = s.y + s.h * 0.6;
                const opacity = isPlastic && fungi ? (1 - fungiT) : 1;
                return <Artifact key={j} kind={a} cx={cx} cy={cy} opacity={opacity}/>;
              })}

              {/* Mycelium on plastic layer */}
              {isPlastic && fungi && (
                <g opacity={fungiT * 0.9}>
                  {Array.from({ length: 40 }).map((_, k) => {
                    const fx = (k * 47 + 17) % W;
                    const fy = s.y + 4 + ((k * 13) % (s.h - 8));
                    const r = 2 + (k % 3) * 1.5;
                    return (
                      <circle key={k} cx={fx} cy={fy} r={r * fungiT}
                        fill="url(#myc)"/>
                    );
                  })}
                  {/* Hyphae threads */}
                  {Array.from({ length: 20 }).map((_, k) => {
                    const x1 = (k * 53) % W;
                    const x2 = x1 + ((k * 37) % 60 - 30);
                    return (
                      <line key={k} x1={x1} y1={s.y + 3} x2={x2}
                        y2={s.y + s.h - 3}
                        stroke="#a3c88a" strokeWidth="0.4" opacity="0.55"/>
                    );
                  })}
                </g>
              )}

              {/* K-Pg iridium line */}
              {s.name.includes('K-Pg') && (
                <line x1="0" y1={s.y + 4} x2={W} y2={s.y + 4}
                  stroke="#f0d878" strokeWidth="1.2" opacity="0.8"/>
              )}
            </g>
          );
        })}

        {/* Depth cursor — core drill */}
        <g>
          <line x1="0" y1={cursorY} x2={W} y2={cursorY}
            stroke="#f2efe4" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7"/>
          <polygon points={`0,${cursorY - 6} 10,${cursorY} 0,${cursorY + 6}`}
            fill="#f2efe4"/>
          <text x={W - 16} y={cursorY - 4} fill="#f2efe4"
            fontFamily="Caveat" fontSize="16" textAnchor="end" fontStyle="italic">
            here
          </text>
        </g>
      </svg>

      {/* Readout */}
      <div style={{
        marginTop: 14, padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.8, color: '#c9c3b0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>current stratum</span>
          <span style={{ color: '#f0d878', fontWeight: 600 }}>{currentStratum.name}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>age</span>
          <span style={{ color: '#8fb8d4' }}>{currentStratum.years}</span>
        </div>
        {fungi && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1px dashed rgba(242,239,228,0.1)' }}>
            <span style={{ color: '#a3c88a' }}>anthropocene remediation</span>
            <span style={{ color: '#a3c88a', fontWeight: 600 }}>
              {Math.round(fungiT * 100)}% digested by fungi
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8a8874',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
          core depth
        </div>
        <input type="range" min="0" max="1" step="0.001" value={depth}
          onChange={e => setDepth(parseFloat(e.target.value))}
          className="chalk-slider"/>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8a8874',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4,
        }}>
          <span>surface · 2026</span>
          <span>540 mya</span>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className={`chalk-button ${fungi ? 'primary' : ''}`}
          onClick={() => { setFungi(f => !f); setFungiT(0); }}>
          🍄 {fungi ? 'LET IT RUN' : 'LET THE FUNGI IN'}
        </button>
      </div>

      <div style={{
        marginTop: 14, padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        Future archaeologists will identify our era by a bright reddish-brown
        band — the <strong style={{ color: '#e68b7a' }}>plastic layer</strong> —
        the way we identify the K-Pg boundary by a line of iridium. It's already
        being laid down in every lake bed, every ocean trench, every city
        landfill. We throw things "<em>away</em>," but <strong>"away"</strong>
        doesn't exist. "Away" is a negative-space fiction. Every atom we
        discard is still here.
        <br/><br/>
        But: <strong style={{ color: '#a3c88a' }}>Pestalotiopsis microspora</strong>,
        a fungus from the Amazon, <em>eats polyurethane.</em>
        <strong style={{ color: '#a3c88a' }}> Ideonella sakaiensis</strong>, a
        bacterium, evolved to digest PET in our lifetime — we watched it happen
        in a Japanese recycling plant. Mealworms digest styrofoam.
        <strong style={{ color: '#a3c88a' }}> Mycelium</strong> turns our
        agricultural waste into furniture, leather, bricks, insulation.
        <br/><br/>
        Fungi don't see garbage. They see <em style={{ color: '#f0d878' }}>food.</em>
        The plastic layer is not a crisis. It is <strong>a meal waiting to be
        eaten by an organism that already exists.</strong> We just have to
        stop burying it in conditions it can't breathe in.
        <br/><br/>
        <span style={{ color: '#f0d878', fontFamily: 'Caveat', fontSize: 20, fontStyle: 'normal' }}>
          — "away" is a human fiction. matter only moves; it never leaves.
        </span>
      </div>
    </div>
  );
}

function Artifact({ kind, cx, cy, opacity }) {
  const glyphs = {
    bottle: '🧴', can: '🥫', tire: '⚙', phone: '📱', bag: '🛍',
    bone: '🦴', iridium: '✦', dino: '🦖', ammonite: '@', trilobite: '◇',
  };
  const g = glyphs[kind] || '·';
  return (
    <text x={cx} y={cy} textAnchor="middle" fontSize="16"
      fill="rgba(10,8,6,0.85)" opacity={opacity}
      fontFamily="EB Garamond">
      {g}
    </text>
  );
}

function stratumEdge(y, W, seed) {
  const pts = [];
  pts.push(`M 0 ${y}`);
  for (let i = 0; i <= 24; i++) {
    const x = (i / 24) * W;
    const jitter = (Math.sin(i * 1.7 + seed * 3) + Math.cos(i * 2.3 + seed)) * 2;
    pts.push(`L ${x} ${y + jitter}`);
  }
  pts.push(`L ${W} ${y - 10} L 0 ${y - 10} Z`);
  return pts.join(' ');
}

Object.assign(window, { HumanFossils });
