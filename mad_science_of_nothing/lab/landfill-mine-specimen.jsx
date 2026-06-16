// landfill-mine-specimen.jsx
// SPECIMEN XIV: The Gold Mine of Away
// Landfill mining — "urban mining" — is a real, growing industry.
// Every ton of discarded phones contains more gold than a ton of gold ore.
// A U-Haul dumpster in 2019 was, by weight, a better copper deposit than
// most working mines.

function LandfillMine() {
  const [mined, setMined] = React.useState(0);    // tons processed
  const [mining, setMining] = React.useState(false);

  React.useEffect(() => {
    if (!mining) return;
    let raf, last;
    const tick = (ts) => {
      if (last == null) last = ts;
      const dt = (ts - last) / 1000;
      last = ts;
      setMined(x => Math.min(100, x + dt * 8));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mining]);

  // Per ton of mixed landfill, approximate yields (real-ish orders of magnitude)
  const yields = [
    { name: "copper",     color: "#e68b7a", perTon: 0.8,   unit: "kg",   note: "wire, motors, pennies" },
    { name: "aluminum",   color: "#c9c3b0", perTon: 3.2,   unit: "kg",   note: "cans, foil, housings" },
    { name: "steel",      color: "#8a8874", perTon: 18.0,  unit: "kg",   note: "appliances, rebar" },
    { name: "gold",       color: "#f0d878", perTon: 0.35,  unit: "g",    note: "from circuit boards" },
    { name: "silver",     color: "#d8d8e0", perTon: 1.8,   unit: "g",    note: "solder, contacts" },
    { name: "palladium",  color: "#a3c88a", perTon: 0.12,  unit: "g",    note: "catalysts, caps" },
    { name: "rare earths",color: "#e0a3c0", perTon: 2.4,   unit: "g",    note: "magnets, screens" },
    { name: "lithium",    color: "#8fb8d4", perTon: 0.9,   unit: "g",    note: "batteries" },
    { name: "ABS/PET",    color: "#a88a5a", perTon: 74.0,  unit: "kg",   note: "reprocessable plastic" },
  ];

  // Estimated market value per ton of mixed landfill (rough, for flavor)
  const pricePerUnit = {
    "copper": 9,     // $/kg
    "aluminum": 2.5,
    "steel": 0.4,
    "gold": 80,      // $/g
    "silver": 0.8,   // $/g
    "palladium": 35, // $/g
    "rare earths": 1,
    "lithium": 0.08,
    "ABS/PET": 0.7,  // $/kg
  };

  let valuePerTon = 0;
  for (const y of yields) {
    valuePerTon += y.perTon * pricePerUnit[y.name];
  }
  const totalValue = valuePerTon * mined;

  const W = 560, H = 280;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{
        width: '100%', height: 'auto', display: 'block',
        background: 'linear-gradient(to bottom, #2a2520 0%, #0a0804 100%)',
      }}>
        <defs>
          <linearGradient id="lmGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2f22"/>
            <stop offset="100%" stopColor="#1a1208"/>
          </linearGradient>
        </defs>

        {/* Pit cross-section */}
        <rect x={0} y={0} width={W} height={H} fill="url(#lmGround)"/>

        {/* Layers of junk in the pit */}
        {[
          { y: 40, c: "#e68b7a", label: "plastic bags · tire rubber · food packaging" },
          { y: 80, c: "#8a8874", label: "washing machines · U-Haul mattresses · drywall" },
          { y: 120, c: "#a88a5a", label: "electronics · phones · circuit boards ★" },
          { y: 160, c: "#7a6050", label: "construction debris · concrete · copper wire ★" },
          { y: 200, c: "#5a4030", label: "older strata · mercury · lead pipes" },
          { y: 240, c: "#3a2818", label: "the bottom · whatever fell first" },
        ].map((layer, i) => (
          <g key={i}>
            <rect x={0} y={layer.y} width={W} height={40}
              fill={layer.c} opacity={0.5 + (mined / 100) * 0.2 * (1 - i * 0.1)}/>
            {/* Scattered artifact glyphs */}
            {Array.from({ length: 6 }).map((_, j) => {
              const x = 20 + j * 90 + (i * 17) % 30;
              const y = layer.y + 22 + ((j + i) % 3) * 4;
              const glyphs = ['◇','□','▽','◉','⬢','✦','○','◆','⬣'];
              const g = glyphs[(i * 7 + j * 3) % glyphs.length];
              return (
                <text key={j} x={x} y={y} fill="rgba(10,8,4,0.7)"
                  fontFamily="JetBrains Mono" fontSize="10">{g}</text>
              );
            })}
            <text x={W - 16} y={layer.y + 16} fill="rgba(242,239,228,0.55)"
              fontFamily="EB Garamond" fontStyle="italic" fontSize="10"
              textAnchor="end">
              {layer.label}
            </text>
          </g>
        ))}

        {/* Drill / extraction beam */}
        <g transform={`translate(${80 + mined * 3}, 0)`}>
          <rect x={-4} y={0} width={8} height={260 - mined * 0.5} fill="#f0d878" opacity="0.45"/>
          <polygon points={`-8,${260 - mined * 0.5} 0,${275 - mined * 0.5} 8,${260 - mined * 0.5}`}
            fill="#f0d878"/>
          {mining && (
            <g>
              {Array.from({ length: 5 }).map((_, i) => (
                <circle key={i}
                  cx={((mined * 3 + i * 7) % 20) - 10}
                  cy={(i * 30 + mined * 5) % 240}
                  r={1.5} fill="#f0d878" opacity={0.7 - i * 0.1}/>
              ))}
            </g>
          )}
        </g>

        {/* HUD */}
        <text x={16} y={18} fill="#c9c3b0" fontFamily="JetBrains Mono"
          fontSize="10" letterSpacing="1.5">
          URBAN MINE · SECTOR ∅/U-HAUL
        </text>
        <text x={16} y={H - 10} fill="#8a8874" fontFamily="JetBrains Mono"
          fontSize="9" letterSpacing="1">
          {mined.toFixed(1)} TONS PROCESSED
        </text>
      </svg>

      {/* Yield table */}
      <div style={{
        marginTop: 14,
        background: 'rgba(0,0,0,0.3)',
        border: '1px dashed rgba(242,239,228,0.15)',
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.3fr 0.9fr 2fr 1fr',
          padding: '8px 14px',
          fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8a8874',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          borderBottom: '1px solid rgba(242,239,228,0.1)',
        }}>
          <div>material</div>
          <div style={{ textAlign: 'right' }}>recovered</div>
          <div style={{ paddingLeft: 16 }}>notes</div>
          <div style={{ textAlign: 'right' }}>$ value</div>
        </div>
        {yields.map((y, i) => {
          const recovered = y.perTon * mined;
          const value = recovered * pricePerUnit[y.name];
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1.3fr 0.9fr 2fr 1fr',
              padding: '9px 14px',
              borderBottom: i < yields.length - 1 ? '1px dashed rgba(242,239,228,0.07)' : 'none',
              alignItems: 'center',
            }}>
              <div style={{ color: y.color, fontFamily: 'EB Garamond',
                fontSize: 14, fontStyle: 'italic' }}>
                {y.name}
              </div>
              <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono',
                fontSize: 11, color: '#f2efe4' }}>
                {recovered < 100 ? recovered.toFixed(2) : recovered.toFixed(0)} {y.unit}
              </div>
              <div style={{ paddingLeft: 16, fontFamily: 'EB Garamond',
                fontStyle: 'italic', fontSize: 12, color: '#8a8874' }}>
                {y.note}
              </div>
              <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono',
                fontSize: 11, color: '#f0d878' }}>
                ${value.toFixed(0)}
              </div>
            </div>
          );
        })}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.3fr 0.9fr 2fr 1fr',
          padding: '12px 14px',
          background: 'rgba(240,216,120,0.08)',
          borderTop: '1px solid rgba(240,216,120,0.3)',
          fontFamily: 'JetBrains Mono', fontWeight: 700,
        }}>
          <div style={{ color: '#f0d878', letterSpacing: '0.15em', fontSize: 11 }}>
            TOTAL RECLAIMED
          </div>
          <div></div>
          <div></div>
          <div style={{ textAlign: 'right', color: '#f0d878', fontSize: 14 }}>
            ${totalValue.toFixed(0)}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className={`chalk-button ${mining ? 'primary' : ''}`}
          onClick={() => setMining(m => !m)}>
          {mining ? '❚❚ halt extraction' : '⛏ begin mining'}
        </button>
        <button className="chalk-button" onClick={() => { setMined(0); setMining(false); }}>
          ↺ reset pit
        </button>
      </div>

      <div style={{
        marginTop: 14, padding: '14px 16px',
        background: 'rgba(0,0,0,0.25)',
        border: '1px dashed rgba(242,239,228,0.15)',
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 15,
        color: '#c9c3b0', lineHeight: 1.5,
      }}>
        A ton of discarded cell phones contains more gold than
        <strong style={{ color: '#f0d878' }}> a ton of gold ore.</strong> The
        industry calls it <em>urban mining</em>. It already exists. Belgium's
        Umicore processes 350,000 tons of e-waste a year and recovers enough
        precious metal to make a profit bigger than some actual mines.
        <br/><br/>
        Every U-Haul dumpster in America is a <strong style={{ color: '#e68b7a' }}>
        geological formation</strong> — layered, ore-bearing, accessible at
        surface pressure. We buried the richest copper deposits in human
        history and called them "landfills." The only thing stopping us from
        <em> going back for them</em> is that we haven't admitted yet that
        <strong style={{ color: '#a3c88a' }}> "trash"</strong> is just ore
        with a legal category problem.
        <br/><br/>
        <span style={{ color: '#f0d878', fontFamily: 'Caveat', fontSize: 20, fontStyle: 'normal' }}>
          — the future's gold mines have already been dug. we just buried them first.
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { LandfillMine });
