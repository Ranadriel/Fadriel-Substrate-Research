// crystalline-propeller.jsx
// The sheath FLEXES — it absorbs cavitation shocks by bending inward
// and springing back, like skin rolling with a punch. It doesn't
// accumulate damage from cavitation the way bronze does.
//
// A forensic panel compares three distinct "bite" signatures:
//   1. Impact     — single large crater (pebble, anchor)
//   2. Sandblast  — dense field of tiny pits (abrasive)
//   3. Cavitation — crescent-edge pits along blade edges at ~20 kHz

function CrystallinePropeller() {
  const [t, setT] = React.useState(0);
  const [speed, setSpeed] = React.useState(0.8);
  const [running, setRunning] = React.useState(true);
  const [sheathed, setSheathed] = React.useState(true);
  const [pits, setPits] = React.useState([]); // only accumulate when unsheathed
  const [flexes, setFlexes] = React.useState([]); // transient bends in the sheath
  const pitIdRef = React.useRef(0);
  const flexIdRef = React.useRef(0);

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

  const cavitating = speed > 0.5;

  React.useEffect(() => {
    if (!cavitating || !running) return;
    const id = setInterval(() => {
      const bladeAngle = t * (1 + speed * 4);
      const bladeIdx = Math.floor(Math.random() * 3);
      const bladeBase = bladeAngle + (bladeIdx * Math.PI * 2) / 3;
      const r = 34 + Math.random() * 46;
      const edgeOff = (Math.random() - 0.5) * 0.3;
      const hit = {
        id: (sheathed ? flexIdRef : pitIdRef).current++,
        birth: performance.now(),
        r: 1.2 + Math.random() * 2,
        localAngle: bladeBase + edgeOff - bladeAngle,
        dist: r,
      };
      if (sheathed) {
        // Flexes are transient — they bend and recover
        setFlexes(fs => [...fs.slice(-40), { ...hit, life: 600 }]);
      } else {
        // Pits are permanent scars in bronze
        setPits(ps => [...ps.slice(-80), hit]);
      }
    }, 320 - speed * 180);
    return () => clearInterval(id);
  }, [cavitating, running, t, speed, sheathed]);

  // Clean up expired flexes
  React.useEffect(() => {
    const id = setInterval(() => {
      const now = performance.now();
      setFlexes(fs => fs.filter(f => now - f.birth < f.life));
    }, 100);
    return () => clearInterval(id);
  }, []);

  const W = 300, H = 300;
  const cx = W/2, cy = H/2;
  const bladeAngle = t * (1 + speed * 4);

  const latticePts = React.useMemo(() => {
    const pts = [];
    const spacing = 14;
    for (let y = 0; y < H; y += spacing * 0.866) {
      const row = Math.floor(y / (spacing * 0.866));
      const offset = row % 2 === 0 ? 0 : spacing / 2;
      for (let x = -spacing; x < W + spacing; x += spacing) {
        pts.push({ x: x + offset, y, key: `${x}-${y}` });
      }
    }
    return pts;
  }, []);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 480, height: 'auto', display: 'block', background: '#07100b', margin: '0 auto' }}>
        <defs>
          <radialGradient id="bronzeGrad" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#e0c078"/>
            <stop offset="50%" stopColor="#b89654"/>
            <stop offset="100%" stopColor="#4a3820"/>
          </radialGradient>
          <radialGradient id="wakeVoid" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(14,24,18,1)"/>
            <stop offset="100%" stopColor="rgba(14,24,18,0)"/>
          </radialGradient>
          <radialGradient id="polyShell" cx="0.5" cy="0.5" r="0.8">
            <stop offset="0%" stopColor="rgba(163,200,138,0.2)"/>
            <stop offset="70%" stopColor="rgba(163,200,138,0.4)"/>
            <stop offset="100%" stopColor="rgba(163,200,138,0.12)"/>
          </radialGradient>
        </defs>

        {/* Water-crystal lattice */}
        <g>
          {latticePts.map(p => {
            const dx = p.x - cx, dy = p.y - cy;
            const r = Math.sqrt(dx*dx + dy*dy);
            const pointAngle = Math.atan2(dy, dx);
            let minAngleDiff = Infinity;
            for (let k = 0; k < 3; k++) {
              const ba = bladeAngle + (k * Math.PI * 2) / 3;
              const diff = Math.abs(((pointAngle - ba + Math.PI) % (Math.PI*2)) - Math.PI);
              if (diff < minAngleDiff) minAngleDiff = diff;
            }
            const onBladeRange = r > 30 && r < 110;
            const inWake = onBladeRange && minAngleDiff < 0.4;
            const stretch = inWake ? (0.4 - minAngleDiff) / 0.4 * speed : 0;
            const color = inWake && cavitating
              ? `rgba(143,184,212,${0.9 - stretch * 0.5})`
              : 'rgba(143,184,212,0.35)';
            const size = inWake ? 0.8 + stretch * 1.2 : 0.7;
            return (
              <circle key={p.key}
                cx={p.x + (inWake ? Math.cos(pointAngle) * stretch * 4 : 0)}
                cy={p.y + (inWake ? Math.sin(pointAngle) * stretch * 4 : 0)}
                r={size}
                fill={color}/>
            );
          })}
        </g>

        {/* Wake voids */}
        {cavitating && [0, 1, 2].map(k => {
          const ba = bladeAngle + (k * Math.PI * 2) / 3 - 0.35;
          const vx = cx + Math.cos(ba) * 80;
          const vy = cy + Math.sin(ba) * 80;
          const vr = 8 + speed * 12;
          return (
            <g key={k}>
              <circle cx={vx} cy={vy} r={vr} fill="url(#wakeVoid)" opacity="0.9"/>
              <circle cx={vx} cy={vy} r={vr} fill="none" stroke="#f2efe4" strokeWidth="0.4" opacity="0.5"/>
            </g>
          );
        })}

        {/* Prop + sheath co-rotate */}
        <g style={{ transform: `translate(${cx}px, ${cy}px) rotate(${bladeAngle}rad)`, transformOrigin: '0 0' }}>
          {/* SHEATH — outer skin, deforms per-blade based on active flexes */}
          {sheathed && [0, 1, 2].map(k => {
            // Find flexes on THIS blade (in localAngle range matching this blade)
            const bladeStart = (k * Math.PI * 2) / 3 - Math.PI * 2 / 6;
            const bladeEnd = (k * Math.PI * 2) / 3 + Math.PI * 2 / 6;
            const myFlexes = flexes.filter(f => {
              // Normalize localAngle so it compares right after blade rotation
              let a = f.localAngle;
              while (a < bladeStart - Math.PI) a += Math.PI * 2;
              while (a > bladeStart + Math.PI) a -= Math.PI * 2;
              return a >= bladeStart && a <= bladeEnd;
            });
            // Build a slightly wavy sheath path based on active flexes
            return (
              <g key={`sh-${k}`} style={{ transform: `rotate(${(k * 120)}deg)` }}>
                <SheathBlade flexes={myFlexes} kIdx={k} />
              </g>
            );
          })}

          {/* BRONZE BLADES */}
          {[0, 1, 2].map(k => (
            <g key={k} style={{ transform: `rotate(${(k * 120)}deg)` }}>
              <path d="M 0 -10 Q 40 -18 80 -6 L 85 0 L 80 6 Q 40 18 0 10 Z"
                fill="url(#bronzeGrad)" stroke="#4a3820" strokeWidth="0.5"/>
              <path d="M 0 -10 Q 40 -18 80 -6" fill="none" stroke="#f2d58a" strokeWidth="0.8" opacity="0.7"/>
            </g>
          ))}

          <circle cx={0} cy={0} r={14} fill="#4a3820" stroke="#b89654" strokeWidth="1"/>
          <circle cx={0} cy={0} r={6} fill="#1a1208"/>

          {/* PITS in bronze — only when unsheathed — PERMANENT */}
          {!sheathed && pits.map(pit => {
            const age = performance.now() - pit.birth;
            const px = Math.cos(pit.localAngle) * pit.dist;
            const py = Math.sin(pit.localAngle) * pit.dist;
            return (
              <g key={pit.id}>
                {age < 150 && (
                  <circle cx={px} cy={py} r={pit.r * 4} fill="none" stroke="#e68b7a" strokeWidth="0.5" opacity={1 - age/150}/>
                )}
                <circle cx={px} cy={py} r={pit.r} fill="#1a0a08"/>
                <circle cx={px - pit.r*0.3} cy={py - pit.r*0.3} r={pit.r * 0.4} fill="#4a1a10" opacity="0.6"/>
              </g>
            );
          })}
        </g>

        {/* HUD */}
        <text x={16} y={20} fill="#8a8874" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5">
          {sheathed ? 'BRONZE · KERATIN SHEATH' : 'BRONZE · EXPOSED'}
        </text>
        {cavitating && (
          <text x={W - 16} y={20} fill={sheathed ? '#a3c88a' : '#e68b7a'} fontFamily="EB Garamond" fontStyle="italic" fontSize="12" textAnchor="end">
            {sheathed ? 'sheath flexing · bronze intact' : 'bronze pitting · ~20 kHz'}
          </text>
        )}
      </svg>

      <div style={{
        marginTop: 14,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'JetBrains Mono', fontSize: 11, color: '#c9c3b0', lineHeight: 1.7,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>bronze damage</span>
          <span style={{ color: pits.length > 0 ? '#e68b7a' : '#a3c88a', fontWeight: 600 }}>
            {sheathed ? 'none — shocks absorbed as flex' : `${pits.length} pits · permanent`}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>active sheath flexes</span>
          <span style={{ color: '#a3c88a', fontWeight: 600 }}>
            {sheathed ? `${flexes.length} (transient)` : '— (no sheath)'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1px dashed rgba(242,239,228,0.1)' }}>
          <span>mechanism</span>
          <span style={{ fontStyle: 'italic', fontFamily: 'EB Garamond', fontSize: 14, color: sheathed ? '#a3c88a' : '#e68b7a' }}>
            {sheathed ? 'roll with the punch' : 'take it on the chin'}
          </span>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8a8874', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          blade speed · {(speed * 100).toFixed(0)}%
        </div>
        <input type="range" min="0" max="1" step="0.01" value={speed}
          onChange={e => setSpeed(parseFloat(e.target.value))}
          className="chalk-slider"/>
        <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="chalk-button" onClick={() => setRunning(r => !r)}>
            {running ? '❚❚ pause' : '▶ run'}
          </button>
          <button className={`chalk-button ${sheathed ? 'primary' : ''}`} onClick={() => setSheathed(s => !s)}>
            {sheathed ? '◉ sheath ON' : '○ sheath OFF'}
          </button>
          <button className="chalk-button" onClick={() => { setPits([]); setFlexes([]); }}>
            ↺ fresh prop
          </button>
        </div>
      </div>

      {/* FORENSIC BITE-MARK PANEL */}
      <BiteForensics />
    </div>
  );
}

function SheathBlade({ flexes }) {
  // Base outer contour of sheath — offset from bronze by ~4 units
  // Sample many points along the contour, push each inward toward center
  // of any active flex. This creates the transient dent-and-recover.
  const now = performance.now();
  // 20 samples along top edge, 20 along bottom edge, plus caps
  const topPts = [];
  const botPts = [];
  const N = 18;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    // Original outer contour (slightly larger than bronze)
    const x = u * 92 - 4;
    const topY = -14 - Math.sin(u * Math.PI) * 6;
    const botY =  14 + Math.sin(u * Math.PI) * 6;
    // Apply flex deformation
    let tdx = 0, tdy = 0, bdx = 0, bdy = 0;
    for (const f of flexes) {
      const age = now - f.birth;
      const tt = age / f.life;
      if (tt < 0 || tt > 1) continue;
      // Bend-and-recover envelope: fast push in, slow rebound
      const env = tt < 0.3 ? (tt / 0.3) : Math.pow(1 - (tt - 0.3)/0.7, 1.3);
      // Flex center in blade-local coords:
      const fx = Math.cos(f.localAngle) * f.dist;
      const fy = Math.sin(f.localAngle) * f.dist;
      const sigma = 10; // how wide the dent is
      const dTop = Math.hypot(x - fx, topY - fy);
      const dBot = Math.hypot(x - fx, botY - fy);
      const amtT = Math.exp(-(dTop*dTop)/(sigma*sigma)) * env * 5;
      const amtB = Math.exp(-(dBot*dBot)/(sigma*sigma)) * env * 5;
      // Push inward (toward y = 0)
      tdy += amtT;
      bdy -= amtB;
    }
    topPts.push([x, topY + tdy]);
    botPts.push([x, botY + bdy]);
  }
  // Build smooth path
  let path = `M ${topPts[0][0]} ${topPts[0][1]}`;
  for (let i = 1; i < topPts.length; i++) path += ` L ${topPts[i][0]} ${topPts[i][1]}`;
  path += ` L 94 0`;
  for (let i = botPts.length - 1; i >= 0; i--) path += ` L ${botPts[i][0]} ${botPts[i][1]}`;
  path += ' Z';

  return (
    <>
      <path d={path}
        fill="url(#polyShell)"
        stroke="#a3c88a"
        strokeWidth="1"
        strokeDasharray="3 2"
        opacity="0.75"/>
      {/* Little flash rings at active flex points */}
      {flexes.map(f => {
        const age = now - f.birth;
        const tt = age / f.life;
        if (tt > 0.4) return null;
        const fx = Math.cos(f.localAngle) * f.dist;
        const fy = Math.sin(f.localAngle) * f.dist;
        return (
          <circle key={f.id} cx={fx} cy={fy} r={3 + tt * 10}
            fill="none" stroke="#f0d878" strokeWidth="0.5" opacity={1 - tt/0.4}/>
        );
      })}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Bite-mark forensics: three distinct damage signatures
// ─────────────────────────────────────────────────────────────────
function BiteForensics() {
  const samples = [
    {
      name: 'IMPACT',
      subtitle: 'one event · large crater · radial fractures',
      culprit: 'pebble · anchor · dropped wrench',
      color: '#e68b7a',
      render: (
        <g>
          {/* One big crater at center */}
          <circle cx={50} cy={40} r={14} fill="#1a0a08"/>
          <circle cx={47} cy={37} r={6} fill="#4a1a10"/>
          {/* Radial fractures */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => {
            const rad = a * Math.PI / 180;
            return <line key={a}
              x1={50 + Math.cos(rad) * 14}
              y1={40 + Math.sin(rad) * 14}
              x2={50 + Math.cos(rad) * (20 + Math.random() * 8)}
              y2={40 + Math.sin(rad) * (20 + Math.random() * 8)}
              stroke="#1a0a08" strokeWidth="0.6"/>;
          })}
        </g>
      ),
    },
    {
      name: 'SANDBLAST',
      subtitle: 'many events · tiny uniform pits · even distribution',
      culprit: 'abrasive particles · suspended grit',
      color: '#f0d878',
      render: (
        <g>
          {Array.from({ length: 120 }).map((_, i) => (
            <circle key={i}
              cx={10 + Math.random() * 80}
              cy={10 + Math.random() * 60}
              r={0.4 + Math.random() * 0.6}
              fill="#1a0a08" opacity={0.6 + Math.random() * 0.4}/>
          ))}
        </g>
      ),
    },
    {
      name: 'CAVITATION',
      subtitle: 'edge-clustered · crescent pits · 20 kHz rhythm',
      culprit: 'collapsing voids · nothing',
      color: '#8fb8d4',
      render: (
        <g>
          {/* Blade edge line */}
          <path d="M 10 20 Q 50 14 90 22" stroke="#c9c3b0" strokeWidth="0.5" fill="none" strokeDasharray="2 2"/>
          {/* Crescent pits clustered along edge */}
          {Array.from({ length: 22 }).map((_, i) => {
            const u = i / 21;
            const x = 10 + u * 80 + (Math.random() - 0.5) * 4;
            const y = 20 - Math.sin(u * Math.PI) * 6 + (Math.random() * 4);
            const r = 1 + Math.random() * 1.8;
            return (
              <g key={i}>
                {/* Crescent-shaped pit: full dark circle + bright edge on one side */}
                <circle cx={x} cy={y} r={r} fill="#1a0a08"/>
                <path d={`M ${x - r*0.9} ${y - r*0.3} A ${r} ${r} 0 0 1 ${x + r*0.4} ${y - r*0.9}`}
                  fill="none" stroke="#4a1a10" strokeWidth="0.4"/>
              </g>
            );
          })}
        </g>
      ),
    },
  ];

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8a8874',
        letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 10,
        borderTop: '1px dashed rgba(242,239,228,0.2)', paddingTop: 14,
      }}>
        Forensics · <em style={{ color: '#c9c3b0', fontStyle: 'italic' }}>every attacker leaves a signature</em>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {samples.map(s => (
          <div key={s.name} style={{
            background: 'rgba(0,0,0,0.3)',
            border: `1px dashed ${s.color}40`,
            padding: 10,
          }}>
            <svg viewBox="0 0 100 70" style={{ width: '100%', height: 'auto', background: '#d4c89a', display: 'block', marginBottom: 6 }}>
              {s.render}
            </svg>
            <div style={{
              fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: 700,
              color: s.color, letterSpacing: '0.1em',
            }}>
              {s.name}
            </div>
            <div style={{
              fontFamily: 'EB Garamond', fontSize: 12, fontStyle: 'italic',
              color: '#c9c3b0', lineHeight: 1.3, marginTop: 2,
            }}>
              {s.subtitle}
            </div>
            <div style={{
              fontFamily: 'JetBrains Mono', fontSize: 9,
              color: '#8a8874', marginTop: 4,
            }}>
              {s.culprit}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 10,
        fontFamily: 'EB Garamond', fontSize: 13, fontStyle: 'italic',
        color: '#c9c3b0', textAlign: 'center', lineHeight: 1.5,
      }}>
        Marine engineers read propellers like forensic pathologists read bodies.<br/>
        Cavitation's bite — crescent, edge-clustered, rhythmic — is unmistakable.
      </div>
    </div>
  );
}

Object.assign(window, { CrystallinePropeller });
