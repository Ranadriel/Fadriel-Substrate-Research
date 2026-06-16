// adaptive-whiptail.jsx
// The "whiptail" propeller — inspired by the thresher shark.
// Blades carry sensors (heat, vibration, electrical, cavitation-acoustics)
// and PIVOT adaptively to escape the pressure-drop regime that causes
// cavitation. Instead of rigid blades slamming into water, these sweep,
// flex, and find the slipstream in real time.

function AdaptiveWhiptail() {
  const [t, setT] = React.useState(0);
  const [speed, setSpeed] = React.useState(0.85);
  const [adaptive, setAdaptive] = React.useState(true);
  const [running, setRunning] = React.useState(true);

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

  // Cavitation threshold: rigid prop cavitates above ~0.5, adaptive shifts it up
  const rigidCavitating = speed > 0.5;
  const adaptiveCavitating = adaptive && speed > 0.92; // almost never

  const cavitating = adaptive ? adaptiveCavitating : rigidCavitating;

  const W = 320, H = 320;
  const cx = W/2, cy = H/2;
  const bladeAngle = t * (1 + speed * 4);

  // Per-blade sensor state — each blade independently reads its own
  // local pressure and flexes in response.
  const blades = [0, 1, 2].map(k => {
    const base = bladeAngle + (k * Math.PI * 2) / 3;
    // Simulated sensor reading: pressure drop depends on speed and a
    // little per-blade noise so they move independently.
    const noise = Math.sin(t * (2 + k * 0.3) + k * 1.7) * 0.1;
    const pressureDrop = Math.max(0, speed - 0.3) + noise;

    // Adaptive response: the blade pitches/skews to reduce its own pressure drop
    const adaptiveResponse = adaptive ? Math.min(1, pressureDrop * 1.4) : 0;

    return {
      k, base,
      pitch: adaptive ? adaptiveResponse * 0.4 : 0,     // radians of twist
      sweep: adaptive ? adaptiveResponse * 0.3 : 0,     // back-sweep radians
      taper: adaptive ? adaptiveResponse * 0.5 : 0,     // tip thinning
      whip:  adaptive ? adaptiveResponse * 12 : 0,      // tip deflection px
      sensorTemp: 0.3 + pressureDrop * 0.7,
      sensorVib:  0.2 + pressureDrop * 0.8,
      sensorElec: 0.4 + Math.abs(noise) * 2,
      pressureDrop,
    };
  });

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', maxWidth: 520, height: 'auto', display: 'block', background: '#07100b', margin: '0 auto' }}>
        <defs>
          <radialGradient id="wtBronze" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#e0c078"/>
            <stop offset="60%" stopColor="#b89654"/>
            <stop offset="100%" stopColor="#4a3820"/>
          </radialGradient>
          <radialGradient id="wtVoid" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(14,24,18,1)"/>
            <stop offset="100%" stopColor="rgba(14,24,18,0)"/>
          </radialGradient>
          <linearGradient id="slipstream" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(143,200,220,0)"/>
            <stop offset="50%" stopColor="rgba(143,200,220,0.5)"/>
            <stop offset="100%" stopColor="rgba(143,200,220,0)"/>
          </linearGradient>
        </defs>

        {/* Water flow streaks — bending smoothly around adaptive blades */}
        <g opacity="0.3">
          {Array.from({ length: 14 }).map((_, i) => {
            const y = (i / 14) * H;
            const phase = (t * 60 * (0.3 + speed)) % 30;
            return (
              <line key={i}
                x1={-20 + phase} y1={y}
                x2={10 + phase} y2={y + (adaptive ? Math.sin((y + t * 40) * 0.02) * 2 : 0)}
                stroke="rgba(143,184,212,0.3)" strokeWidth="0.4"/>
            );
          })}
        </g>

        {/* Wake voids — only when cavitating */}
        {cavitating && blades.map(b => {
          const ba = b.base - 0.35;
          const vx = cx + Math.cos(ba) * 85;
          const vy = cy + Math.sin(ba) * 85;
          const vr = 6 + speed * 12;
          return (
            <g key={`v${b.k}`}>
              <circle cx={vx} cy={vy} r={vr} fill="url(#wtVoid)" opacity="0.85"/>
              <circle cx={vx} cy={vy} r={vr} fill="none" stroke="#f2efe4" strokeWidth="0.4" opacity="0.5"/>
            </g>
          );
        })}

        {/* Slipstream glow when adaptive is finding it */}
        {adaptive && speed > 0.5 && blades.map(b => {
          const ba = b.base + 0.2 + b.sweep;
          return (
            <path key={`ss${b.k}`}
              d={`M ${cx} ${cy} L ${cx + Math.cos(ba) * 110} ${cy + Math.sin(ba) * 110}`}
              stroke="url(#slipstream)" strokeWidth="8" opacity="0.6"/>
          );
        })}

        {/* Propeller hub */}
        <circle cx={cx} cy={cy} r={16} fill="#4a3820" stroke="#b89654" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={8} fill="#1a1208"/>

        {/* The three blades — each adapts independently */}
        {blades.map(b => (
          <AdaptiveBlade key={b.k} cx={cx} cy={cy} blade={b} />
        ))}

        {/* Sensor readouts on each blade */}
        {adaptive && blades.map(b => {
          const labelA = b.base + 0.05;
          const lx = cx + Math.cos(labelA) * 55;
          const ly = cy + Math.sin(labelA) * 55;
          return (
            <g key={`s${b.k}`}>
              <circle cx={lx} cy={ly} r={3} fill="#a3c88a" opacity={0.6 + b.pressureDrop}/>
              <circle cx={lx} cy={ly} r={8} fill="none" stroke="#a3c88a" strokeWidth="0.4"
                opacity={b.pressureDrop * 0.8}>
                <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite"/>
                <animate attributeName="opacity" values="0.8;0;0.8" dur="1.5s" repeatCount="indefinite"/>
              </circle>
            </g>
          );
        })}

        {/* HUD */}
        <text x={16} y={20} fill="#8a8874" fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5">
          {adaptive ? 'WHIPTAIL · ADAPTIVE PITCH/SKEW' : 'RIGID · FIXED GEOMETRY'}
        </text>
        <text x={W - 16} y={20}
          fill={cavitating ? '#e68b7a' : (adaptive && speed > 0.5 ? '#a3c88a' : '#c9c3b0')}
          fontFamily="EB Garamond" fontStyle="italic" fontSize="12" textAnchor="end">
          {cavitating ? 'cavitating' : (adaptive && speed > 0.5 ? 'riding the slipstream' : 'below threshold')}
        </text>
      </svg>

      {/* Sensor dashboard — three blades, each with heat / vibration / electrical / acoustic reads */}
      <div style={{
        marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
      }}>
        {blades.map(b => (
          <div key={b.k} style={{
            padding: '8px 10px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px dashed rgba(163,200,138,0.25)',
            fontFamily: 'JetBrains Mono', fontSize: 9,
            color: '#c9c3b0', lineHeight: 1.7,
          }}>
            <div style={{ color: '#a3c88a', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 4 }}>
              BLADE {b.k + 1}
            </div>
            <SensorBar label="heat"  value={b.sensorTemp} color="#e68b7a"/>
            <SensorBar label="vib"   value={b.sensorVib}  color="#f0d878"/>
            <SensorBar label="elec"  value={b.sensorElec} color="#8fb8d4"/>
            <div style={{ marginTop: 4, paddingTop: 4, borderTop: '1px dashed rgba(242,239,228,0.1)', fontStyle: 'italic', fontFamily: 'EB Garamond', fontSize: 11, color: adaptive ? '#a3c88a' : '#8a8874' }}>
              {adaptive ? `pitch ${(b.pitch * 57.3).toFixed(0)}° · sweep ${(b.sweep * 57.3).toFixed(0)}°` : 'rigid'}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 12,
        padding: '12px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 14,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        Thresher sharks solved this in the Cretaceous. Their long upper tail-lobe is flexible,
        tapered, and <em>alive</em> — it senses its own shear stress and adjusts.
        <br/><br/>
        <strong style={{ color: '#a3c88a' }}>Adaptive propeller logic:</strong> each blade
        carries sensors for heat, vibration, and electrical noise. When any of them spikes —
        the three primary acoustic signatures of cavitation — centrifugal-moment actuators
        pitch the blade out of the danger regime and into the <em>slipstream</em> behind it,
        where pressure is still above vapor point. The blade
        <strong style={{ color: '#a3c88a' }}> gets out of its own way.</strong>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8a8874', marginBottom: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          rotor speed · {(speed * 100).toFixed(0)}%
        </div>
        <input type="range" min="0" max="1" step="0.01" value={speed}
          onChange={e => setSpeed(parseFloat(e.target.value))}
          className="chalk-slider"/>
        <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="chalk-button" onClick={() => setRunning(r => !r)}>
            {running ? '❚❚ pause' : '▶ run'}
          </button>
          <button className={`chalk-button ${adaptive ? 'primary' : ''}`} onClick={() => setAdaptive(a => !a)}>
            {adaptive ? '◉ adaptive ON' : '○ adaptive OFF'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdaptiveBlade({ cx, cy, blade }) {
  // Draw a tapered, whip-like blade. Pitch = twist along length.
  // Sweep = rotate base angle. Whip = tip displacement perpendicular to blade.
  const { base, pitch, sweep, taper, whip } = blade;
  const effectiveAngle = base + sweep;
  // Path in blade-local coords (x = along blade, y = perpendicular)
  // Root thick, tip thin, with tip deflection from whip flex.
  const L = 100;
  const rootHalf = 10;
  const tipHalf = Math.max(1.5, (10 - taper * 7));

  // Build top and bottom edges with curves, applying whip deflection on tip
  const topPts = [];
  const botPts = [];
  const N = 14;
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const halfW = rootHalf * (1 - u) + tipHalf * u;
    // Natural airfoil bulge
    const bulge = Math.sin(u * Math.PI) * 4;
    // Whip flex: tip deflects perpendicular (in blade-local y)
    const flex = Math.pow(u, 2.5) * whip;
    const x = u * L;
    topPts.push([x, -halfW - bulge + flex - Math.sin(u * Math.PI * 0.8) * pitch * 4]);
    botPts.push([x,  halfW + bulge + flex + Math.sin(u * Math.PI * 0.8) * pitch * 4]);
  }
  let path = `M ${topPts[0][0]} ${topPts[0][1]}`;
  for (let i = 1; i < topPts.length; i++) path += ` L ${topPts[i][0]} ${topPts[i][1]}`;
  for (let i = botPts.length - 1; i >= 0; i--) path += ` L ${botPts[i][0]} ${botPts[i][1]}`;
  path += ' Z';

  // Leading edge highlight (top edge)
  let edge = `M ${topPts[0][0]} ${topPts[0][1]}`;
  for (let i = 1; i < topPts.length; i++) edge += ` L ${topPts[i][0]} ${topPts[i][1]}`;

  return (
    <g style={{ transform: `translate(${cx}px, ${cy}px) rotate(${effectiveAngle}rad)`, transformOrigin: '0 0' }}>
      <path d={path} fill="url(#wtBronze)" stroke="#4a3820" strokeWidth="0.5"/>
      <path d={edge} fill="none" stroke="#f2d58a" strokeWidth="0.8" opacity="0.75"/>
      {/* A thin internal "nerve" line — the sensor trace */}
      <path d={`M 4 0 Q ${L*0.5} ${whip * 0.5} ${L - 2} ${whip}`}
        fill="none" stroke="#a3c88a" strokeWidth="0.4" strokeDasharray="2 2" opacity="0.6"/>
    </g>
  );
}

function SensorBar({ label, value, color }) {
  const v = Math.min(1, Math.max(0, value));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: '#8a8874', width: 28 }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${v*100}%`, background: color, opacity: 0.85 }}/>
      </div>
    </div>
  );
}

Object.assign(window, { AdaptiveWhiptail });
