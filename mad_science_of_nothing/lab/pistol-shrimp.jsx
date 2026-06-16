// pistol-shrimp.jsx
// The pistol shrimp snap animation, in three acts:
//  1. COCK — claw pulled back, tension visible
//  2. SNAP — claw slams shut, high-velocity water jet emerges
//  3. CAVITATION — void forms, collapses, flashes (sonoluminescence)
//     + sonic boom ring radiates outward
//
// Loops every ~3s. User can slow it down with a slider to appreciate
// the microsecond-scale physics.

function PistolShrimp() {
  const [t, setT] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [speed, setSpeed] = React.useState(1);

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

  const W = 700, H = 340;
  const CYCLE = 3.5;         // seconds
  const phase = (t % CYCLE) / CYCLE;   // 0..1

  // Phase windows
  const P_COCK   = 0.45;  // 0 → 0.45 — pulling back + tension
  const P_SNAP   = 0.50;  // 0.45 → 0.50 — the snap itself (very fast)
  const P_BUBBLE = 0.62;  // 0.50 → 0.62 — bubble grows
  const P_COLLAPSE = 0.68;// 0.62 → 0.68 — bubble collapses
  const P_FLASH = 0.75;   // 0.68 → 0.75 — sonoluminescence flash
  const P_BOOM = 1.0;     // 0.75 → 1.0 — sonic boom ring fades

  // Normalized sub-phases
  const cockU = Math.min(1, phase / P_COCK);          // 0..1 during cock
  const snapU = clamp01((phase - P_COCK) / (P_SNAP - P_COCK));
  const bubbleU = clamp01((phase - P_SNAP) / (P_BUBBLE - P_SNAP));
  const collapseU = clamp01((phase - P_BUBBLE) / (P_COLLAPSE - P_BUBBLE));
  const flashU = clamp01((phase - P_COLLAPSE) / (P_FLASH - P_COLLAPSE));
  const boomU  = clamp01((phase - P_COLLAPSE) / (P_BOOM - P_COLLAPSE));

  // Claw angle: 0 = closed, ~55deg open at full cock. Eases in, snaps out.
  // During COCK: slow ease from 0 up to 55°
  // During SNAP: violent drop from 55° to 0° in microseconds (use ease-out quint)
  const claw = cockU > 0 && snapU === 0
    ? 55 * easeInOut(cockU)
    : 55 * (1 - Math.pow(snapU, 0.25));   // fast snap shut

  // Shrimp position
  const cx = W / 2 - 70, cy = H / 2 + 30;

  // Jet length — the water jet emerges at snap and extends rightward briefly
  const jetLen = snapU > 0 ? 80 * (1 - Math.pow(1 - snapU, 3)) * (1 - bubbleU * 0.5) : 0;

  // Bubble radius — grows then collapses
  let bubbleR = 0;
  if (bubbleU > 0 && bubbleU < 1) bubbleR = 22 * easeOut(bubbleU);
  else if (collapseU > 0 && collapseU < 1) bubbleR = 22 * (1 - Math.pow(collapseU, 2));

  // Flash intensity
  const flashI = flashU > 0 ? (flashU < 0.3 ? flashU / 0.3 : Math.pow(1 - (flashU - 0.3) / 0.7, 1.5)) : 0;

  // Boom ring
  const boomR = boomU * 260;
  const boomOpacity = boomU > 0 ? (1 - boomU) * 0.6 : 0;

  const bubbleCenter = { x: cx + 120 + jetLen * 0.3, y: cy - 6 };

  // Prey fish — swims right-to-left; gets stunned by the boom.
  // Simple repeating trajectory.
  const fishCycle = (t * 0.35) % 1;
  const fishX = W - 40 - fishCycle * 400;
  const fishY = cy - 40 + Math.sin(t * 1.2) * 6;
  // Stun state: when boom reaches the fish
  const distToFish = Math.hypot(fishX - bubbleCenter.x, fishY - bubbleCenter.y);
  const stunned = boomU > 0 && boomR > distToFish - 20 && boomR < distToFish + 40;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', display: 'block',
                 background: 'linear-gradient(to bottom, #0d1e2a 0%, #07101a 100%)' }}>
        <defs>
          <radialGradient id="psFlash" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fffbe0" stopOpacity="1"/>
            <stop offset="30%" stopColor="#f0d878" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#f0d878" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="psBubble" cx="0.4" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" stopOpacity="0.25"/>
            <stop offset="60%" stopColor="rgba(200,220,230,0.4)" stopOpacity="0.12"/>
            <stop offset="100%" stopColor="rgba(200,220,230,0)" stopOpacity="0"/>
          </radialGradient>
          <linearGradient id="psShrimp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e68b7a"/>
            <stop offset="60%" stopColor="#b85a4a"/>
            <stop offset="100%" stopColor="#7a3830"/>
          </linearGradient>
          <filter id="psGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4"/>
          </filter>
        </defs>

        {/* Caustics */}
        <g opacity="0.15">
          {Array.from({ length: 6 }).map((_, i) => {
            const y = 30 + i * 50;
            return (
              <path key={i}
                d={`M 0 ${y} Q ${W*0.25} ${y - 5} ${W*0.5} ${y} T ${W} ${y}`}
                fill="none" stroke="rgba(143,200,220,0.35)" strokeWidth="0.5"/>
            );
          })}
        </g>

        {/* Prey fish */}
        {fishX > -50 && (
          <g transform={`translate(${fishX} ${fishY}) ${stunned ? 'rotate(' + (-30 + Math.sin(t*30)*20) + ')' : ''}`}>
            <ellipse cx={0} cy={0} rx={14} ry={5} fill="#8fb8d4" opacity={stunned ? 0.6 : 0.9}/>
            <path d={`M 12 0 L 20 -5 L 20 5 Z`} fill="#8fb8d4" opacity={stunned ? 0.6 : 0.9}/>
            <circle cx={-9} cy={-1} r={1.2} fill="#0a0a0a"/>
            {stunned && (
              <text x={0} y={-12} fill="#f0d878" fontFamily="Caveat" fontSize="16"
                    textAnchor="middle">*stunned*</text>
            )}
          </g>
        )}

        {/* Sonic boom ring */}
        {boomOpacity > 0.01 && (
          <>
            <circle cx={bubbleCenter.x} cy={bubbleCenter.y} r={boomR}
              fill="none" stroke="#f0d878" strokeWidth="1.5" opacity={boomOpacity}/>
            <circle cx={bubbleCenter.x} cy={bubbleCenter.y} r={boomR * 0.85}
              fill="none" stroke="rgba(240,216,120,0.4)" strokeWidth="0.8"
              opacity={boomOpacity}/>
          </>
        )}

        {/* Water jet */}
        {jetLen > 0 && (
          <g opacity={Math.max(0, 1 - bubbleU * 1.5)}>
            <path d={`M ${cx + 90} ${cy - 4}
                      Q ${cx + 90 + jetLen * 0.5} ${cy - 10}
                        ${cx + 90 + jetLen} ${cy - 6}
                      L ${cx + 90 + jetLen} ${cy + 2}
                      Q ${cx + 90 + jetLen * 0.5} ${cy - 2}
                        ${cx + 90} ${cy + 4} Z`}
                  fill="rgba(200,220,230,0.35)" stroke="rgba(200,220,230,0.5)"
                  strokeWidth="0.5"/>
            {/* Jet streak lines */}
            {[0.2, 0.5, 0.8].map((f, i) => (
              <line key={i}
                x1={cx + 90 + jetLen * f * 0.8} y1={cy - 2 + i}
                x2={cx + 90 + jetLen * f} y2={cy - 2 + i}
                stroke="rgba(255,255,255,0.6)" strokeWidth="0.5"/>
            ))}
          </g>
        )}

        {/* Bubble (cavitation void) */}
        {bubbleR > 0.5 && (
          <g>
            <circle cx={bubbleCenter.x} cy={bubbleCenter.y} r={bubbleR}
              fill="url(#psBubble)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.8"/>
            {/* Rim highlight */}
            <ellipse cx={bubbleCenter.x - bubbleR * 0.3} cy={bubbleCenter.y - bubbleR * 0.3}
              rx={bubbleR * 0.25} ry={bubbleR * 0.15} fill="rgba(255,255,255,0.4)"/>
          </g>
        )}

        {/* SONOLUMINESCENCE FLASH — the surface of the sun, briefly */}
        {flashI > 0 && (
          <g>
            <circle cx={bubbleCenter.x} cy={bubbleCenter.y} r={60 * flashI}
              fill="url(#psFlash)" opacity={flashI} filter="url(#psGlow)"/>
            <circle cx={bubbleCenter.x} cy={bubbleCenter.y} r={12 * flashI}
              fill="#fffbe0" opacity={flashI}/>
            {/* Radial rays */}
            {flashI > 0.4 && Array.from({ length: 8 }).map((_, i) => {
              const ang = (i / 8) * Math.PI * 2;
              const r1 = 14 * flashI;
              const r2 = 40 * flashI;
              return (
                <line key={i}
                  x1={bubbleCenter.x + Math.cos(ang) * r1}
                  y1={bubbleCenter.y + Math.sin(ang) * r1}
                  x2={bubbleCenter.x + Math.cos(ang) * r2}
                  y2={bubbleCenter.y + Math.sin(ang) * r2}
                  stroke="#fffbe0" strokeWidth="1.5" opacity={flashI}/>
              );
            })}
          </g>
        )}

        {/* ═══ THE SHRIMP ═══ */}
        <g transform={`translate(${cx} ${cy})`}>
          {/* Tail (right side of shrimp - behind body) */}
          <g transform={`translate(-90, -8)`}>
            {/* Segmented tail */}
            {[-60, -48, -36, -24, -12].map((x, i) => (
              <path key={i} d={`M ${x} 0 Q ${x + 6} -14 ${x + 12} 0
                                Q ${x + 6} 4 ${x} 0 Z`}
                    fill="url(#psShrimp)" stroke="#4a1e18" strokeWidth="0.5"/>
            ))}
            {/* Fan tail */}
            <path d="M -72 -2 L -92 -14 L -96 -4 L -92 6 L -72 2 Z"
                  fill="#b85a4a" stroke="#4a1e18" strokeWidth="0.5"/>
          </g>

          {/* Body / cephalothorax */}
          <ellipse cx={-30} cy={-8} rx={35} ry={16} fill="url(#psShrimp)"
                   stroke="#4a1e18" strokeWidth="0.8"/>
          {/* Body highlight */}
          <ellipse cx={-32} cy={-14} rx={24} ry={5} fill="rgba(255,220,200,0.4)"/>

          {/* Eye */}
          <circle cx={-4} cy={-14} r={3.5} fill="#1a0a08"/>
          <circle cx={-2.5} cy={-15.5} r={1} fill="#e68b7a" opacity="0.8"/>
          {/* Stalk */}
          <line x1={-10} y1={-10} x2={-4} y2={-14} stroke="#4a1e18" strokeWidth="1.5"/>

          {/* Antennae */}
          <path d={`M -5 -12 Q ${10 + Math.sin(t*2)*5} ${-26 + Math.cos(t*2)*3}
                    ${25 + Math.sin(t*1.5)*8} ${-30 + Math.cos(t*1.5)*5}`}
                fill="none" stroke="#4a1e18" strokeWidth="0.8"/>
          <path d={`M -5 -10 Q ${8 + Math.cos(t*2)*4} ${-22 + Math.sin(t*2)*3}
                    ${22 + Math.cos(t*1.8)*6} ${-26 + Math.sin(t*1.8)*5}`}
                fill="none" stroke="#4a1e18" strokeWidth="0.8"/>

          {/* Small legs underneath */}
          {[-50, -40, -30, -20, -10].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={6} x2={x - 2} y2={14} stroke="#4a1e18" strokeWidth="0.8"/>
              <line x1={x - 2} y1={14} x2={x + 1} y2={18} stroke="#4a1e18" strokeWidth="0.8"/>
            </g>
          ))}

          {/* Small normal claw (left) */}
          <g transform={`translate(5, -4)`}>
            <line x1={0} y1={0} x2={10} y2={-2} stroke="#4a1e18" strokeWidth="2.5"/>
            <path d="M 10 -2 L 20 -6 L 18 0 Z" fill="url(#psShrimp)" stroke="#4a1e18" strokeWidth="0.5"/>
            <path d="M 10 -2 L 20 2 L 22 -2 Z" fill="url(#psShrimp)" stroke="#4a1e18" strokeWidth="0.5"/>
          </g>

          {/* ═══ THE BIG CLAW — the pistol ═══ */}
          <g transform={`translate(5, 0) rotate(${-8})`}>
            {/* Arm */}
            <path d="M 0 0 L 22 -4 L 26 6 L 2 8 Z" fill="url(#psShrimp)"
                  stroke="#4a1e18" strokeWidth="0.8"/>
            {/* Joint */}
            <circle cx={24} cy={1} r={3} fill="#7a3830" stroke="#4a1e18" strokeWidth="0.5"/>

            {/* Claw base (dactyl housing) */}
            <g transform={`translate(24, 1)`}>
              <path d="M 0 -3 L 40 -8 L 55 0 L 40 6 L 0 3 Z" fill="url(#psShrimp)"
                    stroke="#4a1e18" strokeWidth="0.8"/>
              {/* Lower jaw (fixed) */}
              <path d="M 38 2 L 58 6 L 60 10 L 38 8 Z" fill="#b85a4a"
                    stroke="#4a1e18" strokeWidth="0.6"/>

              {/* Upper jaw (dactyl) - ROTATES for cock + snap */}
              <g transform={`rotate(${-claw} 38 2)`}>
                <path d="M 38 2 L 62 -4 L 62 -8 L 38 -4 Z" fill="#b85a4a"
                      stroke="#4a1e18" strokeWidth="0.6"/>
                {/* Plunger */}
                <rect x={54} y={-7} width={8} height={4} fill="#7a3830" stroke="#4a1e18" strokeWidth="0.4"/>
              </g>

              {/* Tension indicator during cock */}
              {cockU > 0.1 && snapU === 0 && (
                <g opacity={cockU * 0.8}>
                  {[0, 1, 2].map(i => (
                    <path key={i}
                      d={`M ${45 + i*2} ${-15 - i*3}
                          Q ${48 + i*2} ${-20 - i*3} ${51 + i*2} ${-15 - i*3}`}
                      fill="none" stroke="#f0d878" strokeWidth="0.8"/>
                  ))}
                  <text x={52} y={-24} fill="#f0d878" fontFamily="Caveat" fontSize="12"
                        textAnchor="middle">cocking...</text>
                </g>
              )}

              {/* SNAP lines at moment of firing */}
              {snapU > 0 && snapU < 0.8 && (
                <g opacity={1 - snapU} stroke="#fffbe0" strokeWidth="1.5"
                   fill="none" strokeLinecap="round">
                  <line x1={48} y1={-18} x2={52} y2={-24}/>
                  <line x1={58} y1={-14} x2={64} y2={-18}/>
                  <line x1={65} y1={-6} x2={72} y2={-6}/>
                  <line x1={48} y1={14} x2={52} y2={20}/>
                  <line x1={58} y1={10} x2={64} y2={14}/>
                </g>
              )}
            </g>
          </g>
        </g>

        {/* Phase label HUD */}
        <text x={16} y={22} fill="rgba(200,220,230,0.6)"
              fontFamily="EB Garamond" fontStyle="italic" fontSize="14">
          Alpheus randalli
        </text>
        <text x={16} y={38} fill="rgba(200,220,230,0.4)"
              fontFamily="JetBrains Mono" fontSize="9" letterSpacing="1.5">
          PISTOL SHRIMP · 4,700°C · 218 dB · BUBBLE WEAPON
        </text>

        {/* Phase meter */}
        <g transform={`translate(${W - 180} 22)`}>
          <text x={0} y={0} fill="#8a8874" fontFamily="JetBrains Mono"
                fontSize="9" letterSpacing="1.5">
            {phaseLabel(phase)}
          </text>
        </g>
      </svg>

      <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="chalk-button" onClick={() => setPaused(p => !p)}>
          {paused ? '▶ snap' : '❚❚ pause'}
        </button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8a8874',
            letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2,
          }}>
            speed · {speed.toFixed(2)}× {speed < 0.5 ? '(slow-mo)' : ''}
          </div>
          <input type="range" min="0.05" max="2" step="0.05" value={speed}
            onChange={e => setSpeed(parseFloat(e.target.value))}
            className="chalk-slider"/>
        </div>
      </div>

      <div style={{ marginTop: 14, padding: '12px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 14,
        color: '#c9c3b0', lineHeight: 1.5 }}>
        The claw snaps at ~100 km/h. The water jet's pressure drops below vapor
        pressure. A <strong>void forms</strong>. When it collapses, the interior
        briefly reaches <strong>~4,700°C</strong> — the surface of the sun — and
        emits a flash of light (<em>sonoluminescence</em>) plus a crack of
        <strong> ~218 dB</strong>, louder than a jet engine. All from a shrimp
        the size of your pinky fingernail, using <strong>nothing</strong> as
        its weapon.
      </div>
    </div>
  );
}

function clamp01(x) { return Math.max(0, Math.min(1, x)); }
function easeInOut(x) { return x < 0.5 ? 2*x*x : 1 - Math.pow(-2*x+2, 2)/2; }
function easeOut(x) { return 1 - Math.pow(1 - x, 3); }
function phaseLabel(p) {
  if (p < 0.45) return 'COCKING';
  if (p < 0.50) return '▶ SNAP';
  if (p < 0.62) return 'JET + VOID';
  if (p < 0.68) return 'COLLAPSE';
  if (p < 0.75) return '★ FLASH';
  return 'BOOM RING';
}

Object.assign(window, { PistolShrimp });
