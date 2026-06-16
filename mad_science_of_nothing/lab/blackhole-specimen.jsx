// blackhole-specimen.jsx
// SPECIMEN XI: THE BLACK HOLE — the keystone of the cabinet.
// The heaviest density of nothing expressed in mathematical form.
//
// Visual: an accretion disk swirling into a black disk. Infalling test
// particles red-shift and "freeze" at the horizon (time dilation).
// Hawking radiation trickles out as faint pairs from the horizon's edge,
// slowly shrinking the hole over cosmological timescales. Controls let
// you adjust mass and toggle Hawking evaporation. Photon sphere visible
// at r = 1.5 r_s.

function BlackHole() {
  const [t, setT] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [mass, setMass] = React.useState(1.0);         // in arbitrary solar-ish units
  const [evaporating, setEvaporating] = React.useState(false);
  const [showInfall, setShowInfall] = React.useState(true);

  // Effective mass when evaporating: shrinks over time.
  const [effMass, setEffMass] = React.useState(mass);
  React.useEffect(() => { setEffMass(mass); }, [mass]);

  React.useEffect(() => {
    if (paused) return;
    let raf, last;
    const tick = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      setT(x => x + dt);
      if (evaporating) {
        // Hawking luminosity ∝ 1/M^2. Mass shrinks. At end, runaway.
        setEffMass(m => {
          const next = m - dt * (0.02 / Math.max(0.05, m * m));
          return Math.max(0.01, next);
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, evaporating]);

  const W = 560, H = 360;
  const cx = W / 2, cy = H / 2;

  // Schwarzschild radius ∝ mass
  const rs = 22 + effMass * 28;         // event horizon radius (visual)
  const photonR = rs * 1.5;              // photon sphere
  const iscoR = rs * 3;                  // innermost stable circular orbit
  const diskOuter = rs * 5.8;

  // Accretion disk particles
  const diskParticles = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 180; i++) {
      const band = Math.pow(Math.random(), 0.5);  // bias toward center
      arr.push({
        band,
        phase: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 1.5,
        vOffset: (Math.random() - 0.5) * 0.18,    // small vertical scatter
        hueShift: Math.random(),
      });
    }
    return arr;
  }, []);

  // Infalling test particles — periodically spawn, orbit in toward horizon,
  // slow asymptotically (time dilation), freeze and redshift at rs.
  const infallers = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 6; i++) {
      arr.push({
        startAngle: (i / 6) * Math.PI * 2 + Math.random() * 0.5,
        startR: diskOuter * (1.4 + Math.random() * 0.3),
        phase: i * 0.8,
        period: 14,
      });
    }
    return arr;
  }, [diskOuter]);

  // Hawking radiation emission points — little pairs that appear
  // just outside horizon, one escapes, one "falls in".
  const hawkingEvents = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 40; i++) {
      arr.push({
        phase: i * 0.27,
        angle: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, []);

  // Hawking temperature T ∝ 1/M (log-ish for display)
  const hawkingT = (6e-8 / Math.max(0.01, effMass)).toExponential(2);
  // Lifetime τ ∝ M^3
  const lifetime = (Math.pow(effMass, 3) * 1e67).toExponential(1);

  // Is the hole in final evaporation (< ~5% original)?
  const finalFlash = effMass < 0.08;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{
        width: '100%', height: 'auto', display: 'block',
        background: 'radial-gradient(ellipse at center, #0a0812 0%, #02040a 100%)',
      }}>
        <defs>
          <radialGradient id="bhDisk" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fff5c8" stopOpacity="1"/>
            <stop offset="25%" stopColor="#f0d878" stopOpacity="0.9"/>
            <stop offset="55%" stopColor="#e68b7a" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#7a3830" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="bhHorizon" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#000000" stopOpacity="1"/>
            <stop offset="85%" stopColor="#000000" stopOpacity="1"/>
            <stop offset="98%" stopColor="#0a0812" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#0a0812" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="bhPhotonRing" cx="0.5" cy="0.5" r="0.5">
            <stop offset="70%" stopColor="rgba(240,216,120,0)" stopOpacity="0"/>
            <stop offset="92%" stopColor="rgba(240,216,120,0.8)" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="rgba(240,216,120,0)" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="bhFinalFlash" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fffbe0" stopOpacity="1"/>
            <stop offset="40%" stopColor="#f0d878" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#f0d878" stopOpacity="0"/>
          </radialGradient>
          <filter id="bhGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
        </defs>

        {/* Background star field, with gravitational lensing near horizon */}
        {Array.from({ length: 90 }).map((_, i) => {
          const sx = ((i * 137) % W);
          const sy = ((i * 241) % H);
          const dx = sx - cx, dy = sy - cy;
          const dist = Math.hypot(dx, dy);
          // Einstein-ring-like displacement: pull inward visually
          const pull = dist > rs + 5 ? (rs * rs * 0.8) / (dist * dist) : 0;
          const lx = sx - dx * pull * 0.6;
          const ly = sy - dy * pull * 0.6;
          if (dist < rs + 2) return null; // swallowed
          return <circle key={i} cx={lx} cy={ly} r={0.5 + (i % 3) * 0.25}
            fill="rgba(242,239,228,0.7)" opacity={0.5 + (i % 4) * 0.12}/>;
        })}

        {/* Einstein ring glow — lensed background around the horizon */}
        <circle cx={cx} cy={cy} r={rs * 1.9} fill="none"
          stroke="rgba(200,220,230,0.15)" strokeWidth="1.2"/>
        <circle cx={cx} cy={cy} r={rs * 2.15} fill="none"
          stroke="rgba(200,220,230,0.08)" strokeWidth="0.6"/>

        {/* Accretion disk — rendered as a tilted ellipse (ry < rx) for 3D feel */}
        <g transform={`translate(${cx} ${cy})`} opacity={finalFlash ? 0 : 1}>
          {/* Disk glow backdrop */}
          <ellipse cx={0} cy={0} rx={diskOuter} ry={diskOuter * 0.28}
            fill="url(#bhDisk)" opacity="0.45"/>

          {/* Individual disk particles */}
          {diskParticles.map((p, i) => {
            const r = iscoR + p.band * (diskOuter - iscoR);
            const omega = p.speed / Math.pow(r / rs, 1.5); // Keplerian
            const a = t * omega + p.phase;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r * 0.28 + p.vOffset * r * 0.1;
            // Doppler boost: approaching side (left, a ∈ [π/2, 3π/2]) brighter
            const approach = -Math.sin(a);
            const boost = 0.5 + 0.5 * approach;
            // Color: hotter (more yellow-white) at smaller r
            const heat = 1 - p.band;
            const R = 255, G = 180 + heat * 60, B = 120 + heat * 100;
            return (
              <circle key={i} cx={x} cy={y} r={0.7 + heat * 1.1}
                fill={`rgb(${R},${G|0},${B|0})`}
                opacity={0.4 + boost * 0.55}/>
            );
          })}

          {/* Back half of disk — above horizon, to sell the warp */}
          <ellipse cx={0} cy={-rs * 0.02} rx={diskOuter * 0.95}
            ry={diskOuter * 0.08}
            fill="none" stroke="url(#bhDisk)" strokeWidth="3"
            opacity="0.4"/>
        </g>

        {/* Photon sphere — light in circular orbit */}
        {!finalFlash && (
          <g transform={`translate(${cx} ${cy})`}>
            <circle cx={0} cy={0} r={photonR}
              fill="none" stroke="rgba(240,216,120,0.35)" strokeWidth="0.8"
              strokeDasharray="2 3"/>
            {/* Rotating photon blip */}
            {Array.from({ length: 3 }).map((_, i) => {
              const a = t * 2.8 + i * (Math.PI * 2 / 3);
              return (
                <circle key={i}
                  cx={Math.cos(a) * photonR}
                  cy={Math.sin(a) * photonR * 0.6}
                  r={1.2} fill="#f0d878" opacity="0.9" filter="url(#bhGlow)"/>
              );
            })}
          </g>
        )}

        {/* EVENT HORIZON — the mathematical nothing */}
        {!finalFlash && (
          <g>
            {/* Subtle shadow ring (lensing of disk behind) */}
            <circle cx={cx} cy={cy} r={rs * 1.02}
              fill="none" stroke="rgba(255,200,120,0.35)" strokeWidth="1.5"/>
            <circle cx={cx} cy={cy} r={rs}
              fill="url(#bhHorizon)" stroke="rgba(0,0,0,1)" strokeWidth="0.5"/>
          </g>
        )}

        {/* Final evaporation flash */}
        {finalFlash && (
          <g>
            <circle cx={cx} cy={cy} r={80 + Math.sin(t * 30) * 10}
              fill="url(#bhFinalFlash)" filter="url(#bhGlow)"/>
            <circle cx={cx} cy={cy} r={6} fill="#fffbe0"/>
            {Array.from({ length: 16 }).map((_, i) => {
              const a = (i / 16) * Math.PI * 2;
              return (
                <line key={i}
                  x1={cx + Math.cos(a) * 8}
                  y1={cy + Math.sin(a) * 8}
                  x2={cx + Math.cos(a) * 60}
                  y2={cy + Math.sin(a) * 60}
                  stroke="#fffbe0" strokeWidth="1.5" opacity="0.8"/>
              );
            })}
            <text x={cx} y={cy - 100} textAnchor="middle"
              fill="#fffbe0" fontFamily="EB Garamond"
              fontStyle="italic" fontSize="18">
              the hole evaporates into the vacuum
            </text>
          </g>
        )}

        {/* Infalling test particles — spiral in, red-shift, freeze */}
        {showInfall && !finalFlash && infallers.map((inf, i) => {
          const localT = ((t + inf.phase) % inf.period) / inf.period;
          // Radial descent: approaches rs asymptotically (never quite reaches)
          const r = inf.startR * Math.pow(1 - localT, 1.1) + rs * (0.5 + 0.5 * localT);
          // Angle: winds up as it falls (conservation of angular momentum)
          const omega = 1 + localT * 8;
          const a = inf.startAngle + t * omega;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r * 0.45;
          // Red shift as r → rs
          const redshift = Math.max(0, 1 - (r - rs) / (inf.startR - rs));
          const R = 255;
          const G = Math.max(40, 230 - redshift * 190);
          const B = Math.max(40, 200 - redshift * 180);
          const opacity = Math.max(0.1, 1 - redshift * 0.7);
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={2 - redshift * 0.8}
                fill={`rgb(${R},${G|0},${B|0})`} opacity={opacity}/>
              {/* Trail */}
              {redshift > 0.3 && (
                <circle cx={x} cy={y} r={3.5}
                  fill="none" stroke={`rgb(${R},${G|0},${B|0})`}
                  strokeWidth="0.4" opacity={opacity * 0.3}/>
              )}
            </g>
          );
        })}

        {/* Hawking radiation — pairs appearing at horizon, one out, one in */}
        {evaporating && !finalFlash && hawkingEvents.map((h, i) => {
          const phase = ((t * 0.8 + h.phase) % 3) / 3;
          if (phase > 0.9) return null;
          const angle = h.angle + t * 0.05;
          const baseX = cx + Math.cos(angle) * (rs + 2);
          const baseY = cy + Math.sin(angle) * (rs + 2);
          const outR = phase * 60;
          const opacity = Math.max(0, 1 - phase * 1.1);
          return (
            <g key={i} opacity={opacity}>
              {/* Escaping quantum */}
              <circle
                cx={cx + Math.cos(angle) * (rs + 2 + outR)}
                cy={cy + Math.sin(angle) * (rs + 2 + outR)}
                r={0.9} fill="#c0d8e8" filter="url(#bhGlow)"/>
              {/* Infalling (negative-energy) partner */}
              {phase < 0.2 && (
                <circle
                  cx={baseX - Math.cos(angle) * phase * 12}
                  cy={baseY - Math.sin(angle) * phase * 12}
                  r={0.7} fill="#8899aa" opacity="0.5"/>
              )}
            </g>
          );
        })}

        {/* Relativistic jet — faint axial column along ± vertical */}
        {!finalFlash && effMass > 0.2 && (
          <g opacity="0.25">
            <ellipse cx={cx} cy={cy - rs * 3} rx={rs * 0.15} ry={rs * 2.2}
              fill="rgba(200,230,255,0.4)" filter="url(#bhGlow)"/>
            <ellipse cx={cx} cy={cy + rs * 3} rx={rs * 0.15} ry={rs * 2.2}
              fill="rgba(200,230,255,0.4)" filter="url(#bhGlow)"/>
          </g>
        )}

        {/* HUD */}
        <text x="16" y="22" fill="rgba(200,220,230,0.7)"
          fontFamily="EB Garamond" fontStyle="italic" fontSize="14">
          Sagittarius ∅
        </text>
        <text x="16" y="38" fill="rgba(200,220,230,0.4)"
          fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5">
          SCHWARZSCHILD · r_s = {rs.toFixed(1)} · NON-ROTATING · UNCHARGED
        </text>
        <text x={W - 16} y="22" fill="#e68b7a"
          fontFamily="Caveat" fontSize="20" textAnchor="end">
          ∅ density → ∞
        </text>

        {/* Labels on rings (subtle) */}
        {!finalFlash && (
          <g fontFamily="JetBrains Mono" fontSize="8" fill="rgba(200,220,230,0.4)">
            <text x={cx + rs + 4} y={cy + 4}>r_s</text>
            <text x={cx + photonR + 4} y={cy - rs * 0.5 + 4}>1.5 r_s · photon sphere</text>
          </g>
        )}
      </svg>

      {/* Readouts */}
      <div style={{
        marginTop: 14, padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.8, color: '#c9c3b0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>mass M</span>
          <span style={{ color: '#f0d878', fontWeight: 600 }}>
            {effMass.toFixed(3)} M☉ {evaporating && effMass < mass && '(shrinking)'}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Hawking temperature T_H ∝ 1/M</span>
          <span style={{ color: '#8fb8d4' }}>{hawkingT} K</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>evaporation time τ ∝ M³</span>
          <span style={{ color: '#a3c88a' }}>{lifetime} yr</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, paddingTop: 6, borderTop: '1px dashed rgba(242,239,228,0.1)' }}>
          <span>interior state</span>
          <span style={{ color: '#e68b7a', fontStyle: 'italic', fontFamily: 'EB Garamond', fontSize: 14 }}>
            undefined — math gives up here
          </span>
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <ControlRow label="mass (solar)" value={mass.toFixed(2)}>
          <input type="range" min="0.3" max="3" step="0.05" value={mass}
            onChange={e => setMass(parseFloat(e.target.value))}
            disabled={evaporating}
            className="chalk-slider"/>
        </ControlRow>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="chalk-button" onClick={() => setPaused(p => !p)}>
            {paused ? '▶ resume' : '❚❚ pause'}
          </button>
          <button className={`chalk-button ${evaporating ? 'primary' : ''}`}
            onClick={() => { setEvaporating(e => !e); if (!evaporating) setEffMass(mass); }}>
            {evaporating ? '☢ evaporating...' : '☢ begin Hawking evaporation'}
          </button>
          <button className="chalk-button" onClick={() => { setEffMass(mass); setEvaporating(false); }}>
            ↺ restore
          </button>
          <button className="chalk-button" onClick={() => setShowInfall(s => !s)}>
            {showInfall ? 'hide infall' : 'show infall'}
          </button>
        </div>
      </div>

      <div style={{
        marginTop: 14, padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        The horizon is not a surface. It is a <strong style={{ color: '#f0d878' }}>definition</strong> —
        the boundary past which nothing (in both senses) returns. The singularity
        at the center is where general relativity's equations output <em style={{ color: '#e68b7a' }}>∞</em> and
        quit. We call it "singularity" because "we don't know" is harder to fit on a
        blackboard.
        <br/><br/>
        Hawking showed that the vacuum itself — the quantum foam of Specimen V —
        is <strong>disrupted</strong> by the horizon. Virtual pairs borrow energy
        from the vacuum. Near the horizon, one member of a pair escapes, one falls
        in. The escaped one becomes real. The fallen one carries <em>negative</em> energy.
        The hole <strong style={{ color: '#8fb8d4' }}>eats itself</strong> by
        using the nothing it was supposed to be swallowing.
        <br/><br/>
        <span style={{ color: '#f0d878', fontFamily: 'Caveat', fontSize: 20, fontStyle: 'normal' }}>
          — a black hole is nothing so dense it bends everything around it.
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { BlackHole });
