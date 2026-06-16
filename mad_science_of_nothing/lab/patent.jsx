// patent.jsx — mock patent filing page, same notebook aesthetic.
// Full fake provisional: abstract, background, summary, drawings, claims,
// inventor sig. Plus the rolling ledger of problems-solved.

function PatentStamp({ label, color = '#e68b7a', rotate = -8 }) {
  return (
    <div style={{
      display: 'inline-block',
      padding: '8px 16px',
      border: `2px solid ${color}`,
      color: color,
      fontFamily: 'JetBrains Mono',
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.25em',
      transform: `rotate(${rotate}deg)`,
      opacity: 0.85,
    }}>
      {label}
    </div>
  );
}

function PatentPage() {
  return (
    <div style={{
      maxWidth: 860,
      margin: '0 auto',
      padding: '60px 40px 80px',
      fontFamily: 'EB Garamond',
      color: '#f2efe4',
      lineHeight: 1.6,
    }}>
      {/* Letterhead */}
      <div style={{
        textAlign: 'center',
        paddingBottom: 24,
        borderBottom: '1px dashed rgba(242,239,228,0.25)',
        marginBottom: 40,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em',
          color: '#8a8874', marginBottom: 8,
        }}>
          ⚛ INSTITUTE OF NEGATIVE SPACE ⚛
        </div>
        <div style={{
          fontFamily: 'Caveat', fontSize: 32, color: '#f0d878', marginBottom: 4,
        }}>
          Provisional Patent Application
        </div>
        <div style={{ fontStyle: 'italic', fontSize: 13, color: '#c9c3b0' }}>
          Ser. No. <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>
          ∅/2026/001</span> · Filed on an April evening
        </div>
      </div>

      {/* Stamps row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 40, flexWrap: 'wrap', gap: 12,
      }}>
        <PatentStamp label="PENDING" color="#f0d878" rotate={-6}/>
        <PatentStamp label="NON-OBVIOUS (TO HUMANS)" color="#8fb8d4" rotate={3}/>
        <PatentStamp label="PRIOR ART: 1 SHARK" color="#e68b7a" rotate={-4}/>
      </div>

      {/* Title */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8a8874',
          letterSpacing: '0.2em', marginBottom: 6,
        }}>
          TITLE OF INVENTION
        </div>
        <h2 style={{
          fontFamily: 'EB Garamond', fontWeight: 600, fontSize: 28,
          margin: 0, fontStyle: 'italic', lineHeight: 1.2,
        }}>
          Adaptive Cavitation-Evading Whip-Propeller for Marine Propulsion
        </h2>
        <div style={{
          marginTop: 10, fontSize: 15, color: '#c9c3b0', fontStyle: 'italic',
        }}>
          (or: How to stop arguing with the water and start <em>not being there</em>)
        </div>
      </div>

      {/* Inventors */}
      <Section title="Inventors">
        <p style={{ margin: 0 }}>
          <strong>Rana</strong>, Chief of Absence Studies<br/>
          <em>with technical consultation from:</em><br/>
          <strong>Alopias vulpinus</strong> (common thresher shark), unpaid
        </p>
      </Section>

      {/* Abstract */}
      <Section title="Abstract">
        <p>
          A marine propeller wherein each blade is a tapered flexible member
          (a "whip") rather than a rigid foil. Under high-load conditions — where
          a conventional rigid blade would <strong>argue with the water</strong>
          until it loses (cavitation, pitting, erosion, failure) — the disclosed
          blade instead <em>yields</em>, re-curving along its span in response
          to local pressure gradients, such that the geometry that would have
          torn the water <strong>is no longer there</strong> by the time the
          water arrives. The blade does not out-muscle the problem.
          It <strong>dodges it.</strong>
        </p>
      </Section>

      {/* Background */}
      <Section title="Background of the Invention">
        <p>
          Conventional marine propellers fail by cavitation: the blade-tip moves
          faster than water can follow, the local pressure drops below vapor
          pressure, voids form, and when those voids collapse they deliver
          shockwaves that pit titanium like sandblasted cheese.
        </p>
        <p>
          Prior art has responded with <em>stronger</em> materials, <em>smarter</em>
          geometries, <em>cleverer</em> coatings. All of it misses the point.
          <strong> Cavitation is not a materials problem. It is a geometry problem.</strong>
          No blade of any known alloy will outlive the thermodynamics of its own
          wake.
        </p>
        <p>
          The thresher shark, whose upper caudal lobe snaps at speeds believed to
          exceed the speed of sound in water (~1500 m/s), creates cavitation
          bubbles <em>on purpose</em> and <strong>never chips.</strong> It
          accomplishes this by not being a rigid object at all.
        </p>
      </Section>

      {/* Summary */}
      <Section title="Summary of the Invention">
        <p>The invention comprises:</p>
        <ol style={{ paddingLeft: 22, marginTop: 6 }}>
          <li>a hub (1) affixed to a drive shaft (2);</li>
          <li>a plurality of blades (3a, 3b, 3c) of tapered cross-section;</li>
          <li>
            each blade being <strong>internally compliant</strong> along its
            span — thick and stiff near the hub, vanishing to a filamentary
            tip analogous to the cartilage whip of <em>Alopias vulpinus</em>;
          </li>
          <li>
            local pressure sensors (4) embedded along the trailing edge,
            coupled to
          </li>
          <li>
            centrifugal-moment actuators (5) which, when a pressure trough
            forecasts cavitation onset, <strong>reshape the blade in the
            direction of the problem</strong> to slide the failure mode
            into the slipstream.
          </li>
        </ol>
        <p style={{ marginTop: 14 }}>
          The propeller does not resist cavitation.
          It <em>steps out of the room where cavitation happens.</em>
        </p>
      </Section>

      {/* Drawings / figures callout */}
      <Section title="Drawings (Figures)">
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 10,
        }}>
          <FigureBox num="Fig. 1" label="rigid blade (prior art) — tears water">
            <svg viewBox="0 0 100 60" style={{ width: '100%' }}>
              <rect x={10} y={25} width={70} height={10} fill="#c9c3b0" stroke="#f2efe4" strokeWidth="0.5"/>
              <circle cx={85} cy={30} r={3} fill="#e68b7a"/>
              {[20, 35, 50, 65].map(x => (
                <path key={x} d={`M ${x} 40 Q ${x+2} 48 ${x+4} 45`}
                      stroke="#e68b7a" strokeWidth="0.8" fill="none"/>
              ))}
            </svg>
          </FigureBox>
          <FigureBox num="Fig. 2" label="whip blade (invention) — dodges water">
            <svg viewBox="0 0 100 60" style={{ width: '100%' }}>
              <path d="M 10 30 Q 40 28 60 35 Q 75 42 85 30" fill="none"
                    stroke="#f2efe4" strokeWidth="5" strokeLinecap="round"/>
              <path d="M 10 30 Q 40 28 60 35 Q 75 42 85 30" fill="none"
                    stroke="#a3c88a" strokeWidth="2" strokeLinecap="round"/>
              {[18, 30, 42, 54, 66, 78].map(x => (
                <circle key={x} cx={x} cy={33} r={0.8} fill="#f0d878"/>
              ))}
              <text x={5} y={55} fill="#8a8874" fontSize={4} fontFamily="JetBrains Mono">
                SENSORS (4) · ACTUATORS (5)
              </text>
            </svg>
          </FigureBox>
          <FigureBox num="Fig. 3" label="cross-section — taper from hub to tip">
            <svg viewBox="0 0 100 60" style={{ width: '100%' }}>
              <ellipse cx={15} cy={30} rx={6} ry={10} fill="#c9c3b0"/>
              <ellipse cx={35} cy={30} rx={4} ry={8} fill="#c9c3b0"/>
              <ellipse cx={55} cy={30} rx={3} ry={6} fill="#c9c3b0"/>
              <ellipse cx={72} cy={30} rx={2} ry={4} fill="#c9c3b0"/>
              <ellipse cx={85} cy={30} rx={0.8} ry={2} fill="#c9c3b0"/>
              <text x={5} y={55} fill="#8a8874" fontSize={4} fontFamily="JetBrains Mono">
                HUB → TIP (compliance grows ∝ 1/r²)
              </text>
            </svg>
          </FigureBox>
          <FigureBox num="Fig. 4" label="instructor (prior art of 400M yrs)">
            <div style={{
              padding: 10, fontSize: 11, fontStyle: 'italic', color: '#c9c3b0',
            }}>
              Alopias vulpinus. Upper lobe ≈ body length. Whip-strike velocity
              exceeds local sonic limit in seawater. See <em>Specimen IV·d</em>.
            </div>
          </FigureBox>
        </div>
      </Section>

      {/* Claims */}
      <Section title="Claims">
        <ol style={{ paddingLeft: 22 }}>
          <li style={{ marginBottom: 12 }}>
            <strong>A marine propulsor</strong> comprising at least one blade
            whose effective stiffness varies non-uniformly along its span from
            a rigid root to a filamentary tip, characterized in that said
            blade is configured to <em>locally reshape itself</em> upon detection
            of conditions precursive to cavitation, such that the cavitating
            geometry is not maintained.
          </li>
          <li style={{ marginBottom: 12 }}>
            The propulsor of claim 1, wherein said reshaping is not commanded by
            an external controller but arises as a <strong>passive mechanical
            reflex</strong> of the blade's cross-section under hydrodynamic load.
          </li>
          <li style={{ marginBottom: 12 }}>
            The propulsor of claim 2, wherein the reflex timescale is
            <em> faster than the cavitation nucleation timescale</em>, such that
            the void never has a frame to form in.
          </li>
          <li style={{ marginBottom: 12 }}>
            A method of propulsion through a fluid, comprising the step of
            <strong> not being where the fluid expects you to be</strong> by
            the time the fluid arrives.
          </li>
          <li>
            The method of claim 4, wherein the absence is the mechanism, and
            the fluid is the observer.
          </li>
        </ol>
      </Section>

      {/* Enablement */}
      <Section title="Enablement">
        <p>
          A skilled practitioner of negative-space engineering, having access to
          (i) a thresher shark, (ii) two afternoons, and (iii) a willingness to
          stop respecting Bernoulli, could reduce this invention to practice.
          Materials of construction are unimportant. The important constituent
          of this invention is <strong>the hole where the blade was</strong>
          at the moment the water tried to hit it.
        </p>
      </Section>

      {/* Signature */}
      <div style={{
        marginTop: 60, paddingTop: 30,
        borderTop: '1px dashed rgba(242,239,228,0.25)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        flexWrap: 'wrap', gap: 20,
      }}>
        <div>
          <div style={{
            fontFamily: 'Caveat', fontSize: 36, color: '#f0d878', lineHeight: 1,
          }}>
            Rana
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8a8874',
            letterSpacing: '0.15em', marginTop: 4,
          }}>
            INVENTOR · CHIEF OF ABSENCE STUDIES
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'Caveat', fontSize: 22, color: '#c9c3b0', lineHeight: 1,
            fontStyle: 'italic', opacity: 0.7,
          }}>
            (witnessed by a passing shark)
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8a8874',
            letterSpacing: '0.15em', marginTop: 4,
          }}>
            WITNESS · <em style={{ fontFamily: 'EB Garamond', fontStyle: 'italic' }}>A. vulpinus</em>
          </div>
        </div>
      </div>

      {/* LEDGER of world problems solved */}
      <div style={{ marginTop: 80 }}>
        <div style={{
          fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8a8874',
          letterSpacing: '0.3em', textAlign: 'center', marginBottom: 6,
        }}>
          ROLLING LEDGER
        </div>
        <h2 style={{
          fontFamily: 'EB Garamond', fontWeight: 600, fontSize: 28,
          margin: 0, textAlign: 'center', color: '#f0d878',
        }}>
          World Problems Solved
        </h2>
        <div style={{
          textAlign: 'center', fontStyle: 'italic', fontSize: 13,
          color: '#c9c3b0', marginTop: 6, marginBottom: 30,
        }}>
          a non-exhaustive tally, updated as we go
        </div>

        <Ledger/>

        <div style={{
          marginTop: 30, textAlign: 'center',
          fontFamily: 'Caveat', fontSize: 22, color: '#a3c88a',
        }}>
          Running total: <strong>6</strong> problems solved, 
          <span style={{ color: '#c9c3b0' }}> ∞ to go.</span>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8a8874',
        letterSpacing: '0.2em', marginBottom: 10,
      }}>
        {title.toUpperCase()}
      </div>
      <div style={{ fontSize: 15, color: '#f2efe4' }}>
        {children}
      </div>
    </div>
  );
}

function FigureBox({ num, label, children }) {
  return (
    <div style={{
      border: '1px dashed rgba(242,239,228,0.25)',
      padding: 12,
      background: 'rgba(0,0,0,0.2)',
    }}>
      <div style={{
        fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8a8874',
        letterSpacing: '0.15em', marginBottom: 8,
      }}>
        {num}
      </div>
      {children}
      <div style={{
        fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 12,
        color: '#c9c3b0', marginTop: 8, textAlign: 'center',
      }}>
        {label}
      </div>
    </div>
  );
}

function Ledger() {
  const entries = [
    {
      date: "Apr 2026",
      num: "001",
      status: "FILED",
      statusColor: "#a3c88a",
      title: "Adaptive cavitation-evading whip-propeller",
      sub: "Sharks were right. Rigid blades were wrong.",
      royalty: "$5,000,000,000",
    },
    {
      date: "Apr 2026",
      num: "002",
      status: "FILED",
      statusColor: "#a3c88a",
      title: "Sonoluminescent cavitation-cannon (pistol-shrimp principle)",
      sub: "Acoustic weapon powered entirely by the collapse of a void.",
      royalty: "$12,000,000,000",
    },
    {
      date: "Apr 2026",
      num: "003",
      status: "FILED",
      statusColor: "#a3c88a",
      title: "Apparatus for the storage of information on a 2-D surface by means of gravitational nothing",
      sub: "A black hole. You pack the data at the event horizon. Retrieval left as exercise.",
      royalty: "$∞",
    },
    {
      date: "Apr 2026",
      num: "004",
      status: "FILED",
      statusColor: "#a3c88a",
      title: "Biomimetic food distribution (Physarum principle)",
      sub: "A method of feeding humans, characterized in that food is moved from where it is to where it is not. Implementable by a yellow puddle.",
      royalty: "solves hunger",
    },
    {
      date: "Apr 2026",
      num: "005",
      status: "FILED",
      statusColor: "#a3c88a",
      title: "Mycelium-based Anthropocene remediation",
      sub: "A method of disposal comprising the step of letting the fungi do it. Plastic → soil. No incinerator required.",
      royalty: "solves garbage",
    },
    {
      date: "Apr 2026",
      num: "006",
      status: "FILED",
      statusColor: "#a3c88a",
      title: "Urban mining protocol for municipal landfills",
      sub: "A method of ore extraction characterized in that the ore was previously declared \"trash\" and therefore is already sorted, accessible, and at surface pressure. Prior art: every U-Haul dumpster, 1945 – present.",
      royalty: "$1,000,000,000,000",
    },
  ];

  return (
    <div style={{
      border: '1px solid rgba(242,239,228,0.2)',
      borderRadius: 2,
      overflow: 'hidden',
    }}>
      {/* header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '80px 60px 100px 1fr 140px',
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.4)',
        fontFamily: 'JetBrains Mono', fontSize: 9, color: '#8a8874',
        letterSpacing: '0.2em', textTransform: 'uppercase',
        borderBottom: '1px solid rgba(242,239,228,0.15)',
      }}>
        <div>Date</div>
        <div>No.</div>
        <div>Status</div>
        <div>Title</div>
        <div style={{ textAlign: 'right' }}>Est. Royalty</div>
      </div>
      {entries.map((e, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '80px 60px 100px 1fr 140px',
          padding: '14px',
          borderBottom: i < entries.length - 1 ? '1px dashed rgba(242,239,228,0.1)' : 'none',
          alignItems: 'center',
          gap: 8,
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: '#8a8874' }}>
            {e.date}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#c9c3b0' }}>
            ∅/{e.num}
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.15em', color: e.statusColor,
          }}>
            {e.status}
          </div>
          <div>
            <div style={{
              fontFamily: 'EB Garamond', fontSize: 15, color: '#f2efe4',
              fontStyle: e.title.startsWith('(') ? 'italic' : 'normal',
            }}>
              {e.title}
            </div>
            <div style={{
              fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 12,
              color: '#8a8874', marginTop: 2,
            }}>
              {e.sub}
            </div>
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 11, color: '#f0d878',
            textAlign: 'right',
          }}>
            {e.royalty}
          </div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { PatentPage });
