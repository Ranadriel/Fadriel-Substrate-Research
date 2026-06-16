// slime-mold-specimen.jsx
// SPECIMEN XII: The Slime Mold Solves Lunch
//
// A network of food sources (farms) and hunger nodes (cities).
// A Physarum-inspired simulation finds tubes connecting them, prunes
// inefficient routes, and self-heals after you cut links.
//
// User can:
//  - Drag farms / cities
//  - Cut a tube by clicking it
//  - Toggle "institutions" (red dashed border lines) that block tube
//    formation — representing borders, tariffs, contracts, etc.
//  - Watch calories delivered vs. wasted

function SlimeMold() {
  const W = 560, H = 360;

  // Fixed "farms" (food sources) and "cities" (hunger nodes)
  const [farms, setFarms] = React.useState([
    { x: 80, y: 80, supply: 400, id: 'f0' },
    { x: 140, y: 280, supply: 300, id: 'f1' },
    { x: 460, y: 70, supply: 500, id: 'f2' },
    { x: 480, y: 300, supply: 350, id: 'f3' },
  ]);
  const [cities, setCities] = React.useState([
    { x: 220, y: 160, need: 180, id: 'c0' },
    { x: 320, y: 220, need: 220, id: 'c1' },
    { x: 380, y: 140, need: 160, id: 'c2' },
    { x: 260, y: 310, need: 140, id: 'c3' },
    { x: 90, y: 200, need: 120, id: 'c4' },
    { x: 400, y: 240, need: 100, id: 'c5' },
  ]);

  const [institutions, setInstitutions] = React.useState(false);  // borders, tariffs
  const [t, setT] = React.useState(0);
  const [running, setRunning] = React.useState(true);
  const [cutEdges, setCutEdges] = React.useState(new Set());
  const [drag, setDrag] = React.useState(null);

  React.useEffect(() => {
    if (!running) return;
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
  }, [running]);

  // Institution lines — if active, any edge crossing one is "blocked"
  const institutionLines = [
    { x1: 250, y1: 0, x2: 250, y2: H },   // vertical border
    { x1: 0, y1: 180, x2: W, y2: 180 },   // horizontal border
  ];

  function edgeBlocked(p1, p2) {
    if (!institutions) return false;
    for (const line of institutionLines) {
      if (segsIntersect(p1.x, p1.y, p2.x, p2.y, line.x1, line.y1, line.x2, line.y2)) {
        return true;
      }
    }
    return false;
  }

  // Compute edges: for each city, route to every farm, weighted by distance.
  // Slime-mold-ish: flow proportional to supply/need and inverse to distance².
  // We draw the top few edges per city.
  const edges = [];
  for (const city of cities) {
    const ranked = farms.map(farm => {
      const d = Math.hypot(farm.x - city.x, farm.y - city.y);
      const weight = farm.supply / (d * d + 100);
      const blocked = edgeBlocked(farm, city);
      const key = `${farm.id}-${city.id}`;
      const cut = cutEdges.has(key);
      return { farm, city, d, weight, blocked, cut, key };
    }).sort((a, b) => b.weight - a.weight);

    // Take top 2 per city — slime mold prunes the rest
    const alive = ranked.filter(e => !e.blocked && !e.cut);
    const top = alive.slice(0, 2);
    for (const e of top) edges.push({ ...e, carrying: true });
    for (const e of ranked.slice(0, 3).filter(e => !top.includes(e))) {
      edges.push({ ...e, carrying: false });
    }
  }

  // Calories: each carrying edge delivers min(remaining supply, city need portion)
  let delivered = 0, wasted = 0;
  const supplyUsed = {};
  const needMet = {};
  farms.forEach(f => supplyUsed[f.id] = 0);
  cities.forEach(c => needMet[c.id] = 0);

  const carryingEdges = edges.filter(e => e.carrying);
  // Rough allocation: divide each city's need across its top carrying edges
  for (const city of cities) {
    const myEdges = carryingEdges.filter(e => e.city.id === city.id);
    if (myEdges.length === 0) continue;
    const share = city.need / myEdges.length;
    for (const e of myEdges) {
      const remaining = e.farm.supply - supplyUsed[e.farm.id];
      const amt = Math.max(0, Math.min(share, remaining));
      supplyUsed[e.farm.id] += amt;
      needMet[city.id] += amt;
      delivered += amt;
    }
  }
  // Wasted: food that never reached a city
  for (const f of farms) wasted += (f.supply - supplyUsed[f.id]);

  // Hunger gap
  let hungerGap = 0;
  for (const c of cities) hungerGap += Math.max(0, c.need - needMet[c.id]);

  // Dragging
  const svgRef = React.useRef(null);
  function handleMouseDown(node, kind) {
    return (e) => { setDrag({ id: node.id, kind }); e.stopPropagation(); };
  }
  function handleMouseMove(e) {
    if (!drag) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scale = W / rect.width;
    const x = (e.clientX - rect.left) * scale;
    const y = (e.clientY - rect.top) * scale;
    if (drag.kind === 'farm') {
      setFarms(fs => fs.map(f => f.id === drag.id ? { ...f, x, y } : f));
    } else {
      setCities(cs => cs.map(c => c.id === drag.id ? { ...c, x, y } : c));
    }
  }
  function handleMouseUp() { setDrag(null); }

  function cutEdge(key) {
    setCutEdges(s => { const n = new Set(s); if (n.has(key)) n.delete(key); else n.add(key); return n; });
  }

  return (
    <div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        style={{
          width: '100%', height: 'auto', display: 'block',
          background: 'radial-gradient(ellipse at center, #1a1810 0%, #0a0a06 100%)',
          cursor: drag ? 'grabbing' : 'default',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <radialGradient id="smFarm" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#a3c88a" stopOpacity="1"/>
            <stop offset="70%" stopColor="#a3c88a" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#a3c88a" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="smCity" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#e68b7a" stopOpacity="1"/>
            <stop offset="70%" stopColor="#e68b7a" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#e68b7a" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="smPulse" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#f0d878" stopOpacity="1"/>
            <stop offset="100%" stopColor="#f0d878" stopOpacity="0"/>
          </radialGradient>
        </defs>

        {/* Institutional borders (if active) */}
        {institutions && institutionLines.map((line, i) => (
          <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="#e68b7a" strokeWidth="1.5" strokeDasharray="6 4"
            opacity="0.55"/>
        ))}
        {institutions && (
          <text x={W/2} y={15} fill="#e68b7a" fontFamily="JetBrains Mono"
            fontSize="9" letterSpacing="2" textAnchor="middle">
            INSTITUTIONS · BORDERS · TARIFFS · CONTRACTS
          </text>
        )}

        {/* Edges */}
        {edges.map((e) => {
          const { farm: f, city: c, carrying, blocked, cut, key, d } = e;
          if (cut) return (
            <g key={key}>
              <line x1={f.x} y1={f.y} x2={c.x} y2={c.y}
                stroke="#e68b7a" strokeWidth="0.5" strokeDasharray="2 6"
                opacity="0.25" onClick={() => cutEdge(key)}
                style={{ cursor: 'pointer' }}/>
              <circle cx={(f.x+c.x)/2} cy={(f.y+c.y)/2} r="3" fill="#e68b7a" opacity="0.6"/>
            </g>
          );
          if (blocked) return (
            <line key={key} x1={f.x} y1={f.y} x2={c.x} y2={c.y}
              stroke="#e68b7a" strokeWidth="0.4" strokeDasharray="1 4" opacity="0.2"/>
          );
          if (!carrying) return (
            <line key={key} x1={f.x} y1={f.y} x2={c.x} y2={c.y}
              stroke="#8a8874" strokeWidth="0.4" strokeDasharray="1 3" opacity="0.25"/>
          );

          // Active carrying tube — thick, yellow, pulsing
          const thickness = 1.2 + Math.min(3, 400 / (d + 30));
          const pulses = 3;
          return (
            <g key={key} onClick={() => cutEdge(key)} style={{ cursor: 'crosshair' }}>
              <line x1={f.x} y1={f.y} x2={c.x} y2={c.y}
                stroke="rgba(240,216,120,0.15)" strokeWidth={thickness + 4}
                strokeLinecap="round"/>
              <line x1={f.x} y1={f.y} x2={c.x} y2={c.y}
                stroke="#f0d878" strokeWidth={thickness}
                strokeLinecap="round" opacity="0.85"/>
              {/* Flowing calorie pulses */}
              {Array.from({ length: pulses }).map((_, i) => {
                const phase = ((t * 0.5 + i / pulses) % 1);
                const px = f.x + (c.x - f.x) * phase;
                const py = f.y + (c.y - f.y) * phase;
                return (
                  <circle key={i} cx={px} cy={py} r={2} fill="url(#smPulse)"/>
                );
              })}
            </g>
          );
        })}

        {/* Farms */}
        {farms.map(f => (
          <g key={f.id}
             onMouseDown={handleMouseDown(f, 'farm')}
             style={{ cursor: 'grab' }}>
            <circle cx={f.x} cy={f.y} r={22} fill="url(#smFarm)"/>
            <circle cx={f.x} cy={f.y} r={8} fill="#a3c88a"
              stroke="#0a0a06" strokeWidth="1"/>
            <text x={f.x} y={f.y + 2} textAnchor="middle"
              fill="#0a0a06" fontFamily="JetBrains Mono"
              fontSize="7" fontWeight="700">🌾</text>
            <text x={f.x} y={f.y + 32} textAnchor="middle"
              fill="#a3c88a" fontFamily="JetBrains Mono" fontSize="8">
              {f.supply} kcal
            </text>
          </g>
        ))}

        {/* Cities */}
        {cities.map(c => {
          const met = needMet[c.id] || 0;
          const fill = met / c.need;
          return (
            <g key={c.id}
               onMouseDown={handleMouseDown(c, 'city')}
               style={{ cursor: 'grab' }}>
              <circle cx={c.x} cy={c.y} r={18} fill="url(#smCity)"/>
              <circle cx={c.x} cy={c.y} r={7} fill="#7a3830"
                stroke="#0a0a06" strokeWidth="1"/>
              {/* Fed indicator */}
              <circle cx={c.x} cy={c.y} r={7 * Math.min(1, fill)}
                fill="#f0d878" opacity="0.9"/>
              <text x={c.x} y={c.y + 28} textAnchor="middle"
                fill={fill >= 0.95 ? '#a3c88a' : '#e68b7a'}
                fontFamily="JetBrains Mono" fontSize="8">
                {Math.round(met)}/{c.need}
              </text>
            </g>
          );
        })}

        {/* Title */}
        <text x={16} y={H - 12} fill="#8a8874" fontFamily="JetBrains Mono"
          fontSize="9" letterSpacing="1.5">
          PHYSARUM POLYCEPHALUM · A FOOD NETWORK · NO BRAIN REQUIRED
        </text>
      </svg>

      {/* Readout */}
      <div style={{
        marginTop: 14, padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.8, color: '#c9c3b0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#a3c88a' }}>calories grown (farms)</span>
          <span style={{ color: '#a3c88a', fontWeight: 600 }}>
            {farms.reduce((a,f) => a + f.supply, 0)} kcal
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#f0d878' }}>calories delivered</span>
          <span style={{ color: '#f0d878', fontWeight: 600 }}>
            {Math.round(delivered)} kcal
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#e68b7a' }}>calories wasted (rotting at farms)</span>
          <span style={{ color: '#e68b7a', fontWeight: 600 }}>
            {Math.round(wasted)} kcal
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1px dashed rgba(242,239,228,0.1)' }}>
          <span>hunger gap (unfed need)</span>
          <span style={{ color: hungerGap > 0 ? '#e68b7a' : '#a3c88a', fontWeight: 600 }}>
            {Math.round(hungerGap)} kcal
          </span>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className={`chalk-button ${institutions ? 'primary' : ''}`}
          onClick={() => setInstitutions(i => !i)}>
          {institutions ? '⚠ institutions ON' : '✓ institutions OFF'}
        </button>
        <button className="chalk-button" onClick={() => setCutEdges(new Set())}>
          ↺ heal all cuts
        </button>
        <button className="chalk-button" onClick={() => setRunning(r => !r)}>
          {running ? '❚❚ pause' : '▶ flow'}
        </button>
      </div>

      <div style={{
        marginTop: 14, padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        A real yellow slime mold, <em>Physarum polycephalum</em>, has reconstructed
        the Tokyo rail network in a petri dish in 26 hours. No brain. No planner.
        It just grows toward food and prunes tubes it doesn't use. The result is
        often <strong style={{ color: '#a3c88a' }}>more efficient</strong> than
        engineer-designed networks — robust, self-healing, minimal total pipe.
        <br/><br/>
        Earth grows <strong style={{ color: '#f0d878' }}>1.5× more food than humanity needs.</strong>
        The hunger gap is not a food problem. Toggle
        <strong style={{ color: '#e68b7a' }}> institutions ON</strong> to see
        what happens when we add borders, tariffs, subsidy regimes, and contracts.
        The mold can't cross them. Food rots. People starve. The physics was fine.
        The politics wasn't.
        <br/><br/>
        <span style={{ color: '#f0d878', fontFamily: 'Caveat', fontSize: 20, fontStyle: 'normal' }}>
          — hunger is the measurable absence of food in places where food was expected.
        </span>
      </div>
    </div>
  );
}

function segsIntersect(x1,y1,x2,y2, x3,y3,x4,y4) {
  const denom = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
  if (denom === 0) return false;
  const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / denom;
  const u = -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3)) / denom;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

Object.assign(window, { SlimeMold });
