// dilution-specimen.jsx
// SPECIMEN VIII: The Great Dilution → Reset
// A cosmological slider. Drag from "dense early universe" through expansion,
// Big Rip, total dilution, and loop back to the Big Bang. The frame literally
// inverts at maximum emptiness — because a universe with no scale is
// indistinguishable from a singularity.

function GreatDilution() {
  // progress 0..1: 0 = Big Bang, 0.3 = galaxies form, 0.7 = accelerated expansion,
  // 0.9 = Big Rip, 0.95 = total dilution, 1.0 = reset
  const [p, setP] = React.useState(0.15);
  const [auto, setAuto] = React.useState(false);
  const [loopReset, setLoopReset] = React.useState(0);

  React.useEffect(() => {
    if (!auto) return;
    let raf, last;
    const tick = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      setP(x => {
        const nx = x + dt * 0.04;
        if (nx >= 1) { setLoopReset(r => r + 1); return 0; }
        return nx;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto]);

  // Determine era
  const era = (() => {
    if (p < 0.05) return { name: 'Big Bang', color: '#f0d878', detail: 'scale factor → 0. pure heat, pure density.' };
    if (p < 0.18) return { name: 'Recombination', color: '#e68b7a', detail: 'photons decouple. the first light.' };
    if (p < 0.38) return { name: 'Structure Formation', color: '#a3c88a', detail: 'gravity organizes matter into galaxies.' };
    if (p < 0.58) return { name: 'Present Era', color: '#8fb8d4', detail: 'you are here. it\u2019s a good time.' };
    if (p < 0.78) return { name: 'Accelerated Expansion', color: '#8fb8d4', detail: 'dark energy wins. galaxies recede beyond reach.' };
    if (p < 0.90) return { name: 'The Long Sparse', color: '#c9c3b0', detail: 'the night sky goes black. each galaxy alone.' };
    if (p < 0.96) return { name: 'The Big Rip', color: '#e68b7a', detail: 'gravity loses to spacetime. atoms unbind.' };
    if (p < 0.995) return { name: 'Total Dilution', color: '#e0a3c0', detail: 'no interactions. no distances. no scale.' };
    return { name: 'Reset', color: '#f0d878', detail: 'without scale, emptiness = singularity. begin again.' };
  })();

  // Visualization
  const W = 480, H = 320;
  const cx = W/2, cy = H/2;

  // Scale factor a(p): starts at 0.02, grows smoothly, then explodes near rip,
  // then wraps back to 0.
  const a = (() => {
    if (p < 0.95) {
      return 0.02 + Math.pow(p / 0.95, 1.6) * 1.3;
    } else if (p < 0.995) {
      // Big Rip → infinity
      const t = (p - 0.95) / 0.045;
      return 1.32 + Math.tan(t * Math.PI * 0.49) * 2;
    } else {
      // Inverted: maximum dilution = singularity. Scale collapses to 0.
      const t = (p - 0.995) / 0.005;
      return 0.02 + (1 - t) * 8;
    }
  })();

  // Galaxy positions — fixed in comoving coordinates, drift apart with a.
  const galaxies = React.useMemo(() => {
    const arr = [];
    for (let i = 0; i < 22; i++) {
      const angle = (i * 2.3997) + Math.random() * 0.3; // golden angle
      const r = 0.1 + (i / 22) * 0.9;
      arr.push({
        rx: Math.cos(angle) * r,
        ry: Math.sin(angle) * r,
        size: 2 + (i % 4),
        hue: i,
      });
    }
    return arr;
  }, [loopReset]);

  // During rip, galaxies tear apart: stars drift off
  const ripT = Math.max(0, (p - 0.85) / 0.10);

  // Grid stretching: grid spacing scales with a
  const gridLines = 10;

  // Flash at the reset moment
  const flashOpacity = p > 0.993 ? Math.sin((p - 0.993) / 0.007 * Math.PI) : 0;

  // During the "reset" collapse, we invert the view: zoom all the way in
  // on a single point. This makes the loop feel continuous.
  const inversionZoom = p > 0.995 ? ((p - 0.995) / 0.005) : 0;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{
        width: '100%', height: 'auto', display: 'block',
        background: '#050a07',
      }}>
        <defs>
          <radialGradient id="bangGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(240,216,120,1)"/>
            <stop offset="40%" stopColor="rgba(230,139,122,0.6)"/>
            <stop offset="100%" stopColor="rgba(230,139,122,0)"/>
          </radialGradient>
          <radialGradient id="galGrad" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="rgba(242,239,228,0.9)"/>
            <stop offset="100%" stopColor="rgba(242,239,228,0)"/>
          </radialGradient>
        </defs>

        {/* Starfield — subtle */}
        {Array.from({ length: 80 }).map((_, i) => (
          <circle key={`bg-${i}`}
            cx={(i * 53) % W}
            cy={(i * 89) % H}
            r="0.4"
            fill="rgba(242,239,228,0.18)"
            opacity={1 - ripT * 0.6}
          />
        ))}

        {/* Stretching comoving grid */}
        <g opacity={0.18 * (1 - ripT * 0.8)}>
          {Array.from({ length: gridLines + 1 }).map((_, i) => {
            const frac = i / gridLines - 0.5;
            const x = cx + frac * a * 180;
            return <line key={`v-${i}`} x1={x} y1="0" x2={x} y2={H}
              stroke="rgba(143,184,212,0.5)" strokeWidth="0.4"/>;
          })}
          {Array.from({ length: gridLines + 1 }).map((_, i) => {
            const frac = i / gridLines - 0.5;
            const y = cy + frac * a * 180;
            return <line key={`h-${i}`} x1="0" y1={y} x2={W} y2={y}
              stroke="rgba(143,184,212,0.5)" strokeWidth="0.4"/>;
          })}
        </g>

        {/* Big Bang fireball (early era) */}
        {p < 0.12 && (
          <g opacity={1 - (p / 0.12)}>
            <circle cx={cx} cy={cy} r={80 + (1 - p/0.12) * 100} fill="url(#bangGrad)"/>
          </g>
        )}

        {/* Galaxies */}
        {galaxies.map((g, i) => {
          // Physical position = comoving * scale factor
          const x = cx + g.rx * a * 150;
          const y = cy + g.ry * a * 150;

          // If outside frame, don't draw
          if (x < -20 || x > W + 20 || y < -20 || y > H + 20) return null;

          // During rip, galaxies dim and spread into fragments
          const dim = 1 - ripT * 0.9;
          const starCount = ripT < 0.5 ? 1 : Math.floor(1 + ripT * 6);

          if (p < 0.12) return null; // hidden during bang

          return (
            <g key={i}>
              {Array.from({ length: starCount }).map((_, j) => {
                const offset = j === 0 ? 0 : (j - starCount/2) * ripT * 18;
                const ox = offset * Math.cos(i + j);
                const oy = offset * Math.sin(i + j);
                return (
                  <g key={j}>
                    <circle cx={x + ox} cy={y + oy} r={g.size * dim * 2.5} fill="url(#galGrad)"/>
                    <circle cx={x + ox} cy={y + oy} r={g.size * dim * 0.8} fill="#f2efe4" opacity={dim}/>
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Rip glyphs — jagged tears across the field */}
        {ripT > 0.3 && (
          <g opacity={Math.min(1, (ripT - 0.3) * 2)}>
            {Array.from({ length: 6 }).map((_, i) => {
              const y = (i / 5) * H;
              const jag = Array.from({ length: 8 }).map((_, j) => {
                const x = (j / 7) * W;
                const dy = (j % 2 === 0 ? -1 : 1) * 6;
                return `${x},${y + dy}`;
              }).join(' L ');
              return <polyline key={i} points={jag} fill="none"
                stroke="#e68b7a" strokeWidth="0.6" strokeDasharray="1 3"/>;
            })}
          </g>
        )}

        {/* Inversion collapse — a bright point forming at center as the
            universe "folds through" nothing into the next Big Bang */}
        {inversionZoom > 0 && (
          <circle cx={cx} cy={cy}
            r={80 * inversionZoom}
            fill="url(#bangGrad)"
            opacity={inversionZoom}/>
        )}

        {/* Reset flash */}
        {flashOpacity > 0 && (
          <rect width={W} height={H} fill="#f2efe4" opacity={flashOpacity * 0.6}/>
        )}

        {/* HUD */}
        <text x="16" y="22" fill="#8a8874" fontFamily="JetBrains Mono" fontSize="10" letterSpacing="1.5">
          COSMOLOGICAL TIMELINE · a(t)
        </text>
        <text x={W - 16} y="22" fill={era.color} fontFamily="EB Garamond" fontStyle="italic" fontSize="13" textAnchor="end">
          {era.name}
        </text>
      </svg>

      {/* Readouts */}
      <div style={{
        marginTop: 14,
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.8, color: '#c9c3b0',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>scale factor a</span>
          <span style={{ color: era.color, fontWeight: 600 }}>
            {a > 100 ? '∞' : a < 0.05 ? a.toExponential(2) : a.toFixed(3)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>era</span>
          <span style={{ color: era.color, fontStyle: 'italic', fontFamily: 'EB Garamond', fontSize: 14 }}>{era.name}</span>
        </div>
        <div style={{ fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 14, color: '#c9c3b0', marginTop: 8, paddingTop: 8, borderTop: '1px dashed rgba(242,239,228,0.1)' }}>
          {era.detail}
        </div>
      </div>

      {/* Timeline slider */}
      <div style={{ marginTop: 16 }}>
        <input type="range" min="0" max="1" step="0.001" value={p}
          onChange={e => { setP(parseFloat(e.target.value)); setAuto(false); }}
          className="chalk-slider"/>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8a8874',
          letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 6,
        }}>
          <span>bang</span>
          <span>now</span>
          <span>rip</span>
          <span>reset</span>
        </div>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        <button className="chalk-button primary" onClick={() => setAuto(a => !a)}>
          {auto ? '❚❚ pause' : '▶ run the universe'}
        </button>
        <button className="chalk-button" onClick={() => setP(0)}>↺ bang</button>
        <button className="chalk-button" onClick={() => setP(0.93)}>→ rip</button>
      </div>

      <div style={{
        marginTop: 14,
        padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        Dark energy dilutes the universe. Past a critical point, <em style={{ color: '#e68b7a' }}>spacetime itself
        unbinds</em> — galaxies, stars, atoms, nuclei, spacetime — faster than any force can resist.
        At <strong style={{ color: '#e0a3c0' }}>maximum emptiness</strong>, every point is infinitely far from
        every other. No interactions. No distances. <em>No scale.</em>
        <br/><br/>
        And a universe with no scale <strong style={{ color: '#f0d878' }}>is mathematically indistinguishable from a singularity.</strong>
        The nothing folds through itself and becomes the next Big Bang.
        <br/><br/>
        <span style={{ color: '#f0d878', fontFamily: 'Caveat', fontSize: 18, fontStyle: 'normal' }}>
          — maximum dilution = maximum density. the nothing IS the something.
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { GreatDilution });
