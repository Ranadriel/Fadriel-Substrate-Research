// piston-twin-specimen.jsx
// Twin diagram: diesel piston (compression ignition) vs water piston
// cavitation. Mirror images — one crushes something into violence,
// the other fails to close over something and the void does the violence.

function PistonTwin() {
  const [phase, setPhase] = React.useState(0); // 0..1 shared cycle
  const [auto, setAuto] = React.useState(true);

  React.useEffect(() => {
    if (!auto) return;
    let raf, last;
    const tick = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      setPhase(p => (p + dt * 0.35) % 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  // Diesel cycle phases: intake (0-0.25), compression (0.25-0.5),
  // ignition (0.5-0.55), power (0.55-0.8), exhaust (0.8-1)
  // Cavitation cycle: blade sweep (0-0.4), void growth (0.4-0.65),
  // implosion (0.65-0.75), aftermath (0.75-1)

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <DieselPiston phase={phase} />
        <WaterPiston phase={phase} />
      </div>

      <div style={{
        marginTop: 14,
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.55,
      }}>
        Two pistons. One <strong style={{ color: '#f0d878' }}>compresses something into violence</strong>:
        fuel + air squeezed until they ignite. The other <strong style={{ color: '#8fb8d4' }}>
        fails to close over something, exposing nothing</strong> — a void that collapses
        with violence the fluid could never muster on its own.
        <br/><br/>
        <em style={{ color: '#e68b7a' }}>Diesel pressurizes something. Cavitation pressurizes nothing.</em>
        Both produce equal fury. The diesel gets the credit.
      </div>

      <div style={{ marginTop: 14 }}>
        <input type="range" min="0" max="1" step="0.001" value={phase}
          onChange={e => { setPhase(parseFloat(e.target.value)); setAuto(false); }}
          className="chalk-slider"/>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8a8874',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6,
        }}>
          <span>intake / sweep</span>
          <span>compress / open</span>
          <span>ignite / collapse</span>
          <span>exhaust / aftermath</span>
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
          <button className="chalk-button" onClick={() => setAuto(a => !a)}>
            {auto ? '❚❚ pause' : '▶ run'}
          </button>
          <button className="chalk-button" onClick={() => setPhase(0)}>↺ top-dead-center</button>
        </div>
      </div>
    </div>
  );
}

function DieselPiston({ phase }) {
  const W = 220, H = 300;
  // Piston position: down at 0, up at 0.5 (TDC), down again at 1
  // Simplified: TDC near 0.5
  const stroke = Math.sin(phase * Math.PI * 2 - Math.PI/2) * 0.5 + 0.5; // 0..1
  const pistonY = 80 + (1 - stroke) * 120; // pistonY small = up

  const inCompression = phase > 0.25 && phase < 0.5;
  const igniting = phase > 0.48 && phase < 0.6;
  const power = phase > 0.55 && phase < 0.8;

  // Density readout: mass per cell. Cylinder cross-section constant.
  const chamberHeight = Math.max(8, pistonY - 46);
  const density = 200 / chamberHeight;

  // Fuel droplets injected near TDC
  const injecting = phase > 0.45 && phase < 0.52;

  const fuelDroplets = [];
  if (injecting) {
    for (let i = 0; i < 5; i++) {
      const p = (phase - 0.45) / 0.07;
      fuelDroplets.push({
        x: W/2 + (i - 2) * 8,
        y: 60 + p * (pistonY - 70),
        r: 1.5,
      });
    }
  }

  // Heat particles during ignition/power
  const flames = [];
  if (igniting || power) {
    for (let i = 0; i < 18; i++) {
      const angle = Math.random() * Math.PI * 2;
      const rr = Math.random() * 30;
      flames.push({
        x: W/2 + Math.cos(angle) * rr,
        y: pistonY - 20 + Math.sin(angle) * 15,
        r: 2 + Math.random() * 3,
      });
    }
  }

  return (
    <div style={{
      padding: '12px 10px',
      background: 'rgba(0,0,0,0.2)',
      border: '1px dashed rgba(242,239,228,0.15)',
      borderRadius: 2,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.15em',
        color: '#8a8874', textTransform: 'uppercase', marginBottom: 8, textAlign: 'center',
      }}>
        DIESEL · compression of <span style={{ color: '#f0d878' }}>something</span>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#f0d878', textAlign: 'center', marginBottom: 4 }}>
        density: {density.toFixed(2)}× &nbsp;·&nbsp; volume: 1.00× (fixed)
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {/* Cylinder walls */}
        <rect x={40} y={40} width={W-80} height={H-60} fill="none"
          stroke="#c9c3b0" strokeWidth="1.5"/>
        {/* FIXED REFERENCE GRID — space does not change */}
        <g opacity="0.25">
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`dv-${i}`} x1={42 + i * ((W-84)/6)} y1={46} x2={42 + i * ((W-84)/6)} y2={H-26}
              stroke="#8fb8d4" strokeWidth="0.4" strokeDasharray="1 2"/>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`dh-${i}`} x1={42} y1={46 + i * ((H-72)/9)} x2={W-42} y2={46 + i * ((H-72)/9)}
              stroke="#8fb8d4" strokeWidth="0.4" strokeDasharray="1 2"/>
          ))}
        </g>
        {/* Cylinder head */}
        <rect x={W/2 - 3} y={20} width={6} height={20} fill="#c9c3b0"/>
        <text x={W/2} y={16} textAnchor="middle" fontFamily="EB Garamond" fontStyle="italic" fontSize="10" fill="#c9c3b0">
          fuel injector
        </text>

        {/* Compressed gas — density shown by dot density */}
        {(() => {
          const chamberTop = 46;
          const chamberBottom = pistonY;
          const compression = 200 / Math.max(20, chamberBottom - chamberTop);
          const dots = [];
          const dotCount = 20 + Math.floor(compression * 8);
          for (let i = 0; i < dotCount; i++) {
            dots.push(
              <circle key={i}
                cx={50 + Math.random() * (W - 100)}
                cy={chamberTop + 4 + Math.random() * Math.max(4, chamberBottom - chamberTop - 8)}
                r={1}
                fill={inCompression ? '#f0d878' : '#8fb8d4'}
                opacity={0.6}/>
            );
          }
          return <g>{dots}</g>;
        })()}

        {/* Fuel droplets */}
        {fuelDroplets.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#e0a3c0"/>
        ))}

        {/* Ignition flames */}
        {(igniting || power) && (
          <g>
            {flames.map((f, i) => (
              <circle key={i} cx={f.x} cy={f.y} r={f.r} fill={i % 2 === 0 ? '#f0d878' : '#e68b7a'} opacity="0.7"/>
            ))}
            <circle cx={W/2} cy={pistonY - 18} r={28} fill="#f0d878" opacity={igniting ? 0.4 : 0.15}/>
          </g>
        )}

        {/* Piston */}
        <rect x={42} y={pistonY} width={W-84} height={36} fill="#2a3d2e" stroke="#c9c3b0" strokeWidth="1.5"/>
        <rect x={42} y={pistonY + 6} width={W-84} height={2} fill="#c9c3b0" opacity="0.5"/>
        <rect x={42} y={pistonY + 12} width={W-84} height={2} fill="#c9c3b0" opacity="0.5"/>

        {/* Connecting rod */}
        <line x1={W/2} y1={pistonY + 30} x2={W/2} y2={H - 20} stroke="#c9c3b0" strokeWidth="3"/>
        <circle cx={W/2} cy={pistonY + 30} r={3} fill="#c9c3b0"/>

        {/* Crankshaft indicator */}
        <circle cx={W/2} cy={H - 10} r={8} fill="#0e1812" stroke="#c9c3b0" strokeWidth="1.5"/>
        <line x1={W/2} y1={H - 10}
          x2={W/2 + Math.cos(phase * Math.PI * 2 - Math.PI/2) * 8}
          y2={H - 10 + Math.sin(phase * Math.PI * 2 - Math.PI/2) * 8}
          stroke="#f0d878" strokeWidth="1.5"/>

        {/* Label for phase */}
        <text x={W/2} y={H - 30} textAnchor="middle" fontFamily="EB Garamond" fontStyle="italic" fontSize="12"
          fill={igniting ? '#e68b7a' : inCompression ? '#f0d878' : '#c9c3b0'}>
          {phase < 0.25 ? 'intake' :
           phase < 0.5 ? 'compression ↑' :
           phase < 0.6 ? 'IGNITION ✦' :
           phase < 0.8 ? 'power ↓' : 'exhaust'}
        </text>
      </svg>
    </div>
  );
}

function WaterPiston({ phase }) {
  const W = 220, H = 300;
  const stroke = Math.sin(phase * Math.PI * 2 - Math.PI/2) * 0.5 + 0.5;
  const pistonY = 80 + (1 - stroke) * 120;

  // As piston retreats FAST (coming down from TDC), water can't follow.
  // A void opens on the underside of the piston.
  const retreating = phase > 0.5 && phase < 0.85;
  const voidGrowing = phase > 0.52 && phase < 0.72;
  const imploding = phase > 0.72 && phase < 0.82;
  const recovered = phase > 0.82;

  // Void radius grows during retreat, then collapses
  let voidR = 0;
  if (voidGrowing) {
    voidR = ((phase - 0.52) / 0.20) * 34;
  } else if (imploding) {
    voidR = 34 * (1 - (phase - 0.72) / 0.10) ** 1.5;
  }

  // Density: water volume / cell volume. When void opens, density drops below 1.
  const chamberHeight = Math.max(8, pistonY - 46);
  const waterVolume = chamberHeight - (voidR * voidR * Math.PI) / (W - 84);
  const density = Math.max(0.2, waterVolume / chamberHeight);

  return (
    <div style={{
      padding: '12px 10px',
      background: 'rgba(0,0,0,0.2)',
      border: '1px dashed rgba(242,239,228,0.15)',
      borderRadius: 2,
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.15em',
        color: '#8a8874', textTransform: 'uppercase', marginBottom: 8, textAlign: 'center',
      }}>
        WATER · exposure of <span style={{ color: '#8fb8d4' }}>nothing</span>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8fb8d4', textAlign: 'center', marginBottom: 4 }}>
        density: {density.toFixed(2)}× &nbsp;·&nbsp; volume: 1.00× (fixed)
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <radialGradient id="waterVoid" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(14,24,18,1)"/>
            <stop offset="75%" stopColor="rgba(14,24,18,0.9)"/>
            <stop offset="100%" stopColor="rgba(14,24,18,0)"/>
          </radialGradient>
        </defs>

        {/* Cylinder walls */}
        <rect x={40} y={40} width={W-80} height={H-60} fill="none"
          stroke="#c9c3b0" strokeWidth="1.5"/>
        {/* FIXED REFERENCE GRID — space does not change */}
        <g opacity="0.25">
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`wv-${i}`} x1={42 + i * ((W-84)/6)} y1={46} x2={42 + i * ((W-84)/6)} y2={H-26}
              stroke="#8fb8d4" strokeWidth="0.4" strokeDasharray="1 2"/>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`wh-${i}`} x1={42} y1={46 + i * ((H-72)/9)} x2={W-42} y2={46 + i * ((H-72)/9)}
              stroke="#8fb8d4" strokeWidth="0.4" strokeDasharray="1 2"/>
          ))}
        </g>
        {/* Cylinder head (closed top) */}
        <rect x={32} y={32} width={W-64} height={14} fill="#1a2a1e" stroke="#c9c3b0" strokeWidth="1.5"/>

        {/* Water body — subtle blue fill + flow lines */}
        <rect x={42} y={46} width={W-84} height={pistonY - 46} fill="rgba(143,184,212,0.12)"/>

        {/* Flow lines indicating water trying to rush in */}
        {retreating && Array.from({ length: 4 }).map((_, i) => {
          const y = 50 + i * ((pistonY - 60) / 3);
          return (
            <g key={i}>
              <line x1={45} y1={y} x2={W/2 - voidR - 2} y2={y}
                stroke="rgba(143,184,212,0.4)" strokeWidth="0.5" strokeDasharray="2 3"/>
              <line x1={W - 45} y1={y} x2={W/2 + voidR + 2} y2={y}
                stroke="rgba(143,184,212,0.4)" strokeWidth="0.5" strokeDasharray="2 3"/>
              <polygon points={`${W/2 - voidR - 2},${y} ${W/2 - voidR - 6},${y - 2} ${W/2 - voidR - 6},${y + 2}`}
                fill="rgba(143,184,212,0.5)"/>
              <polygon points={`${W/2 + voidR + 2},${y} ${W/2 + voidR + 6},${y - 2} ${W/2 + voidR + 6},${y + 2}`}
                fill="rgba(143,184,212,0.5)"/>
            </g>
          );
        })}

        {/* The void bubble under the piston */}
        {voidR > 0 && (
          <g>
            <circle cx={W/2} cy={pistonY - 4} r={voidR} fill="url(#waterVoid)"/>
            <circle cx={W/2} cy={pistonY - 4} r={voidR} fill="none"
              stroke={imploding ? '#e68b7a' : '#f2efe4'}
              strokeWidth={imploding ? 1.5 : 0.8}
              opacity="0.9"/>
            <text x={W/2} y={pistonY - 4} textAnchor="middle"
              fontFamily="EB Garamond" fontStyle="italic" fontSize="10"
              fill={imploding ? '#e68b7a' : '#c9c3b0'}>
              ∅
            </text>
          </g>
        )}

        {/* Implosion shockwave */}
        {imploding && (
          <>
            <circle cx={W/2} cy={pistonY - 4} r={34 + (phase - 0.72) * 200}
              fill="none" stroke="#e68b7a" strokeWidth="0.6"
              opacity={1 - (phase - 0.72) / 0.1}/>
            <circle cx={W/2} cy={pistonY - 4} r={34 + (phase - 0.72) * 140}
              fill="none" stroke="#f0d878" strokeWidth="0.4"
              opacity={0.6 * (1 - (phase - 0.72) / 0.1)}/>
          </>
        )}

        {/* Piston */}
        <rect x={42} y={pistonY} width={W-84} height={36} fill="#2a3d2e" stroke="#c9c3b0" strokeWidth="1.5"/>
        <rect x={42} y={pistonY + 6} width={W-84} height={2} fill="#c9c3b0" opacity="0.5"/>
        <rect x={42} y={pistonY + 12} width={W-84} height={2} fill="#c9c3b0" opacity="0.5"/>

        {/* Connecting rod */}
        <line x1={W/2} y1={pistonY + 30} x2={W/2} y2={H - 20} stroke="#c9c3b0" strokeWidth="3"/>
        <circle cx={W/2} cy={pistonY + 30} r={3} fill="#c9c3b0"/>

        {/* Crankshaft */}
        <circle cx={W/2} cy={H - 10} r={8} fill="#0e1812" stroke="#c9c3b0" strokeWidth="1.5"/>
        <line x1={W/2} y1={H - 10}
          x2={W/2 + Math.cos(phase * Math.PI * 2 - Math.PI/2) * 8}
          y2={H - 10 + Math.sin(phase * Math.PI * 2 - Math.PI/2) * 8}
          stroke="#8fb8d4" strokeWidth="1.5"/>

        <text x={W/2} y={H - 30} textAnchor="middle" fontFamily="EB Garamond" fontStyle="italic" fontSize="12"
          fill={imploding ? '#e68b7a' : voidGrowing ? '#8fb8d4' : '#c9c3b0'}>
          {phase < 0.5 ? 'filled — piston up' :
           phase < 0.72 ? 'void opens ∅' :
           phase < 0.82 ? 'IMPLOSION ✦' : 'refilled'}
        </text>
      </svg>
    </div>
  );
}

Object.assign(window, { PistonTwin });
