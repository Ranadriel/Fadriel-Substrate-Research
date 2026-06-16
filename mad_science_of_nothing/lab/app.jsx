// app.jsx — The Mad Science of Nothing

function Masthead() {
  return (
    <header className="masthead">
      <div className="institute">⚛ Institute of Negative Space ⚛</div>
      <h1 className="title">
        The <em>Mad Science</em>
        <span className="of">of</span>
        <span className="nothing">nothing</span>
      </h1>
      <div className="subtitle">
        A field manual for phenomena that only exist<br/>
        by virtue of not being there.
      </div>
      <div className="byline">— collected by Rana</div>
    </header>
  );
}

function Thesis() {
  return (
    <section className="thesis">
      <div className="label">Thesis</div>
      <p>
        Relativity forbids <strong>things</strong> from moving faster than light.
        It says nothing about <em>nothings.</em>
      </p>
      <p>
        Every measurement of absence is secretly a measurement of a presence that
        was expected and <em>failed to arrive.</em> Invert the lens: instead of
        measuring what is, measure what isn't. The physics doesn't change — the
        <strong>vocabulary</strong> does. And with the new vocabulary, phenomena
        that seemed unrelated <em>start to rhyme.</em>
      </p>
      <p>
        This isn't a paper of new physics. It's a cabinet: every specimen here
        is textbook, frontier, or documented field science that someone else
        already did. What's new is the <strong>shelf</strong> — one lens,
        <em> absence as identity</em>, laid across fourteen otherwise distant
        phenomena. Poke at them.
      </p>
    </section>
  );
}

function Specimen({ num, title, accent, children, prose, belowProse }) {
  return (
    <section className="specimen">
      <div className="specimen-header">
        <span className="specimen-num">Specimen {num}</span>
        <h2 className="specimen-title">
          {title}{accent && <span className="accent"> {accent}</span>}
        </h2>
      </div>
      <div className="specimen-body">
        <div className="specimen-prose">
          {prose}
          {belowProse && <div style={{ marginTop: 24 }}>{belowProse}</div>}
        </div>
        <div className="specimen-figure">
          <div className="figure-label">Fig. {num}</div>
          {children}
        </div>
      </div>
    </section>
  );
}

function App() {
  return (
    <div className="board">
      <Masthead />
      <Thesis />

      <Specimen
        num="I"
        title="The shadow that outruns its own light,"
        accent="or: sweeping the moon"
        prose={<>
          <p>
            Point a flashlight at a distant wall and spin. The <em>edge of the shadow</em>
            traces an arc at velocity <strong>v = ωr</strong>. Crank r up enough and v
            exceeds c. No physics is broken. The shadow is not a thing — it's a running
            accounting of where light <em>failed to land</em>.
          </p>
          <p>
            Each point on the wall independently goes dark the moment its photon stops
            arriving. Nothing travels. The <strong>pattern of absence</strong> simply
            updates.
          </p>
          <p style={{ fontSize: '0.92em', fontStyle: 'italic', opacity: 0.8 }}>
            And this isn't just schoolbook geometry. <strong>Berry and Nye</strong>
            predicted in the 1970s that <em>optical phase singularities</em> — dark
            vortices buried inside laser light — should occasionally outrun the waves
            that host them. In <strong>2026</strong>, <strong>Kaminer et al.</strong>
            <em> (Nature, </em>arXiv:2509.17675<em>)</em> used ultrafast transmission
            electron microscopy (~3 fs resolution) to film exactly this in hexagonal
            boron nitride: dark points moving at roughly <strong>1.04 c</strong>,
            with unbounded velocities during vortex annihilation. The prediction stood
            for fifty years. The experiment caught it. Absence doesn't need light's
            permission to travel.
          </p>
          <div className="aside">
            "The darkness does not arrive. The light simply fails to."
          </div>
        </>}
      >
        <ShadowSpeedometer />
        <div className="figure-caption">Drag ω and r. At the Moon, the shadow's edge is hilariously superluminal.</div>
      </Specimen>

      <Specimen
        num="II"
        title="Silence is measurable,"
        accent="and it goes negative"
        prose={<>
          <p>
            We measure sound relative to the threshold of human hearing. Below that
            threshold, dB goes <strong>negative</strong>. In Microsoft's anechoic chamber
            the ambient level sits at roughly <em>−20 dBA</em>.
          </p>
          <p>
            At that level, your own body is the loudest thing in the universe.
            You hear your heartbeat first. Then your breath. Then your bones.
            Then — after a few minutes — things that were never there at all.
          </p>
          <div className="aside">
            You cannot measure silence without first expecting sound.
          </div>
        </>}
      >
        <SilenceMeter />
        <div className="figure-caption">Descend the ladder. The waveform flattens; the captions do not.</div>
      </Specimen>

      <Specimen
        num="III"
        title="The hole is a particle,"
        accent="— and it has charge"
        prose={<>
          <p>
            Remove an electron from a lattice. The empty seat behaves like a particle:
            it has momentum, effective mass, and opposite charge. We call it a
            <em> hole</em> — a quasiparticle — and we do semiconductor physics with it
            as if it were real. (Its antimatter cousin the <em>positron</em> is a
            different beast: a genuine particle. But the hole is the cleaner specimen
            for this cabinet, because the hole is <strong>literally nothing</strong>
            behaving like something.)
          </p>
          <p>
            The hole isn't <em>there</em>. It's <strong>where an electron
            should be and isn't.</strong> Same for phonon holes, lattice vacancies,
            bubbles of no-something in a field of something. Absence propagates.
            Absence interacts. Absence has <strong>identity</strong>.
          </p>
        </>}
      >
        <HoleLattice />
        <div className="figure-caption">Click any electron. Watch the hole drift.</div>
      </Specimen>

      <Specimen
        num="IV"
        title="Cavitation,"
        accent="— the creation of nothing from something"
        prose={<>
          <p>
            Something moves too fast. The fluid around it <em>cannot close behind itself
            quickly enough</em>. A gap opens. Pressure falls below the vapor point.
            For a moment, there is <strong>no water</strong> where water should be —
            and the <em>nothing underneath</em>, which was always there, is briefly visible.
          </p>
          <p>
            The bubble is not filled with vacuum because vacuum was summoned. The vacuum
            was <em>already there.</em> The water simply failed to occupy it. Cavitation
            is the <strong>moment of exposure</strong> — a pocket of the same nothingness
            that lies beneath every atom, temporarily un-covered.
          </p>
          <p>
            When the water finally catches up and rushes in, it meets itself at a single
            point. Pressures reach <em>10⁹ Pa</em>. Temperatures rival the surface of the Sun.
            It chews through steel propellers. The violence of the <strong>closure</strong>
            exceeds anything the water could have done on its own.
          </p>
          <div className="aside">
            The nothing didn't arrive. The something just failed to stay.
          </div>
        </>}
      >
        <CavitationField />
        <div className="figure-caption">Spin the blade past ~50%. The water can't close fast enough; the void is exposed.</div>
      </Specimen>

      <Specimen
        num="IV·b"
        title="Two pistons,"
        accent="a mirror argument"
        prose={<>
          <p>
            A <strong style={{ color: '#f0d878' }}>diesel piston</strong> climbs and
            crushes air + fuel into itself. Pressure rises. Heat accumulates.
            At the top of the stroke, the mixture ignites and drives the piston down.
            <em> The violence is compression's child.</em>
          </p>
          <p>
            A <strong style={{ color: '#8fb8d4' }}>water piston</strong> does the opposite.
            Falling too fast, it <em>pulls away</em> from the fluid beneath. Water can't follow.
            A pocket of <strong>nothing</strong> is exposed. When the water finally rushes in,
            it meets itself with fury that rivals the diesel's ignition.
            <em> The violence is absence's child.</em>
          </p>
          <div className="aside">
            Look at the grid. <strong>The space doesn't change.</strong> Only the density does.
            Compression crams more material into each cell. Cavitation steals material out of every cell
            at once — and when the water finally rushes back, each collapsing bubble fires a
            <em> microjet</em> that hammers the surface at Mach-like speeds. The damage isn't one
            big blow; it's a <strong>fatigue storm</strong> of microscopic impacts, each smaller
            than a grain of sand, repeating millions of times a second.
          </div>
          <p>
            This is why boats eat propellers. Cavitation is <strong style={{ color: '#e68b7a' }}>sonic acid</strong> —
            a vibration attack at the crystal-lattice scale that dissolves any material not rated for
            ultra-high-frequency shear. Bronze, stainless, titanium — all chewed through by pockets of
            <em> nothing.</em>
          </p>
        </>}
      >
        <PistonTwin />
        <div className="figure-caption">Grid fixed. Space never moves. Density is everything.</div>
      </Specimen>

      <Specimen
        num="IV·c"
        title="Sheathing the sacrifice,"
        accent="— a polymer shell for the bronze"
        prose={<>
          <p>
            The sheath doesn't <em>degrade</em> from cavitation — it <strong>flexes</strong>.
            Each ultrasonic crack pushes the skin inward a few microns; the polymer
            springs back and forgets. It's the difference between getting <em>punched</em>
            and getting <em>hit</em>: a body that rolls with the blow takes no damage
            at all. Bronze can't roll. Polymer can.
          </p>
          <p>
            Think <strong>keratin</strong> — nails, hooves, rhino horn. Compliant,
            vibration-damping, built to absorb high-frequency abuse. The sheath <em>is</em>
            susceptible to solid impacts (a pebble chips it, an anchor tears it) but
            that's fine: <strong>it's not there to be armor.</strong> It's there to be
            skin. You don't replace bone when the skin scrapes; you let the skin scrape.
          </p>
          <p>
            And here's the forensic gift: <em>every attacker leaves a different signature.</em>
            A pebble leaves a crater. Grit leaves a sandblast field. Cavitation leaves
            crescent-edged pits clustered along the blade's leading edge, rhythmic at
            roughly 20 kHz. A marine engineer reads a propeller like a pathologist reads
            a body — and <strong>cavitation's bite is unmistakable.</strong>
          </p>
          <div className="aside">
            The polymer is not armor. It is <em>skin.</em> It takes the punch by moving.
          </div>
        </>}
      >
        <CrystallinePropeller />
        <div className="figure-caption">Keratin logic. Toggle the sheath — watch the bronze stay clean, and the skin do the dying.</div>
      </Specimen>

      <Specimen
        num="IV·d"
        title="Or just ask the shark,"
        accent="— biomimetic cavitation defeat"
        prose={<>
          <p>
            The thresher shark has a tail longer than its body. It's <em>flexible,
            tapered, sensor-rich, and alive.</em> It snaps that tail hard enough
            to drop the pressure behind it below the vapor point — <strong>cavitating
            on purpose</strong> to stun prey — and it <strong>doesn't tear itself
            apart</strong>. Four hundred million years of R&D. No pits. No sheath.
            No polymer. The tip isn't supersonic; it doesn't need to be. It just
            needs to accelerate fast enough that the water behind it can't keep up.
          </p>
          <p>
            The trick isn't shape alone. It's <strong>feedback.</strong> Every blade
            (fin, tail, pectoral) carries receptors: <em>heat, shear, vibration,
            electrical noise.</em> The instant any of them reads the acoustic signature
            of a failure mode, the tissue <em>pivots itself out of the way</em> — adjusting
            pitch, sweep, taper — to slide into the slipstream behind the problem.
          </p>
          <p>
            A propeller with the same trick would carry centrifugal-moment actuators
            on each blade, driven by local sensors. When cavitation starts, the blade
            <strong> moves.</strong> Not by program. By <em>reflex.</em> The void never
            forms because the geometry that would have caused it <strong>is no longer there.</strong>
          </p>
          <div className="aside">
            WHY MAN MAKE MACHINE? BIOLOGY ALREADY HAVE ANSWER. 🦈
          </div>
        </>}
        belowProse={<>
          <div style={{
            background: 'linear-gradient(to bottom, #0d1e2a 0%, #07101a 100%)',
            borderRadius: 2,
            padding: 0,
            overflow: 'hidden',
            position: 'relative',
          }}>
            <img
              src="assets/thresher.gif"
              alt="thresher shark swimming"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div style={{
              position: 'absolute', top: 12, left: 16,
              color: 'rgba(230,240,245,0.85)',
              fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 14,
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}>
              Alopias vulpinus
            </div>
            <div style={{
              position: 'absolute', top: 30, left: 16,
              color: 'rgba(230,240,245,0.65)',
              fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1.5,
              textShadow: '0 1px 3px rgba(0,0,0,0.8)',
            }}>
              COMMON THRESHER · 400M YRS R&amp;D
            </div>
          </div>
          <div style={{
            marginTop: 14, padding: '12px 16px',
            background: 'rgba(0,0,0,0.25)',
            border: '1px dashed rgba(242,239,228,0.15)',
            fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 14,
            color: '#c9c3b0', lineHeight: 1.5,
          }}>
            Upper tail-lobe can exceed body length. Used to <strong>stun prey</strong>
            via rapid acceleration — the pressure drop behind the tail dips below the
            vapor point and cavitation bubbles form, on the shark's own terms, as a
            weapon. The shark is built to <em>cause</em> the phenomenon that destroys
            our propellers. And it never chips.
          </div>
          <div className="figure-caption" style={{ marginTop: 10 }}>The instructor.</div>
        </>}
      >
        <AdaptiveWhiptail />
        <div className="figure-caption">Toggle adaptive. Push past 50%. Watch the rigid prop tear water; watch the whiptail dance.</div>
        <div style={{
          marginTop: 16,
          padding: '14px 18px',
          background: 'rgba(230, 139, 122, 0.08)',
          border: '1px dashed rgba(230, 139, 122, 0.4)',
          fontFamily: 'JetBrains Mono', fontSize: 11, lineHeight: 1.7,
          color: '#c9c3b0',
        }}>
          <div style={{
            fontWeight: 700, letterSpacing: '0.2em', color: '#e68b7a',
            fontSize: 10, marginBottom: 8,
          }}>
            ⚠ CLASSIFICATION NOTICE · EYES ONLY · TOP SECRET
          </div>
          <div style={{ fontFamily: 'EB Garamond', fontSize: 14, fontStyle: 'italic', color: '#c9c3b0', lineHeight: 1.5 }}>
            This document contains information freely available in any tide pool,
            kindergarten, or fish tank. Readers advised to consult a <strong>shark</strong>
            before consulting a <strong>defense contractor</strong>.
            <br/><br/>
            <span style={{ color: '#f0d878' }}>
              Birds fly? <em>CLASSIFY LIFT.</em> Geckos climb walls? <em>CLASSIFY VAN DER WAALS.</em>
              Octopi camouflage? <em>FIVE BILLION DOLLAR ADAPTIVE TEXTILE PROGRAM.</em>
            </span>
            <br/><br/>
            <span style={{ color: '#a3c88a', fontWeight: 600, fontStyle: 'normal', fontFamily: 'JetBrains Mono', fontSize: 12, letterSpacing: '0.15em' }}>
              🦈 UNGA. BUNGA.
            </span>
          </div>
        </div>
      </Specimen>

      <Specimen
        num="V"
        title="The vacuum is not empty,"
        accent="ℏ knows"
        prose={<>
          <p>
            Perfect emptiness is forbidden. Heisenberg: <em>ΔE · Δt ≥ ℏ/2.</em> The
            field cannot sit at rest, so it boils — virtual particle/antiparticle
            pairs flash into existence, borrow energy from nothing, and annihilate
            before the universe can check the receipts.
          </p>
          <p>
            The vacuum has <strong>pressure</strong>. The vacuum has
            <strong> temperature</strong>. The vacuum has <em>structure</em>.
            The nothing is the most crowded place in physics.
          </p>
        </>}
      >
        <QuantumFoam />
        <div className="figure-caption">Each pair lives for ~ℏ/ΔE before the universe notices.</div>
      </Specimen>

      <Specimen
        num="VI"
        title="Reality bends faster than light,"
        accent="the spacetime scissor"
        prose={<>
          <p>
            A mass bends spacetime. Light rays curve with it. Where a geodesic
            meets a detector, we see an <em>apparent image</em>. This image is
            not a photon. It's the <strong>intersection</strong> of a warped
            geometry and an observer — a scissor point made of reality.
          </p>
          <p>
            Sweep the mass past. The image whips across the sky faster than any
            single photon could fly. The <strong>shape</strong> of spacetime
            updates everywhere. Geometry has no speed limit — only the signals
            that write it do.
          </p>
          <div className="aside">
            Gravity as the universe's scissor tips — closing, endlessly, at infinity.
          </div>
        </>}
      >
        <GravityScissors />
        <div className="figure-caption">Mass drifts, spacetime rumples, the apparent image outruns c.</div>
      </Specimen>

      <Specimen
        num="VII"
        title="The dark that holds galaxies,"
        accent="— invisible somethings"
        prose={<>
          <p>
            Stars at the galaxy's edge rotate too fast. Kepler's equations,
            applied to the visible matter, predict they should have flown off
            long ago. They didn't.
          </p>
          <p>
            So we infer a <em>dark halo</em> — a mass we cannot see, cannot touch,
            cannot detect directly. We know it's there only by what it
            <strong> does</strong> to things we can see. Roughly
            <em> 27% of the universe</em> is this kind of inferred nothing.
            The other 68% is <strong>dark energy</strong>, which is worse.
          </p>
          <div className="aside">
            Most of the universe is a silhouette.
          </div>
        </>}
      >
        <DarkMatterMap />
        <div className="figure-caption">Toggle the halo. The rotation curve only makes sense with it.</div>
      </Specimen>

      <Specimen
        num="VIII"
        title="The Great Dilution,"
        accent="or: how nothing resets"
        prose={<>
          <p>
            Dark energy doesn't just expand the universe — some models say it
            <em> accelerates the acceleration.</em> In that case, gravity
            eventually loses to spacetime itself. Galaxies unbind. Stars unbind.
            Planets, atoms, nuclei — all torn apart by the <strong>stretching
            of the frame they lived in.</strong>
          </p>
          <p>
            At the far end: every point is infinitely far from every other.
            No interactions. No distances. No observers. No <em>scale.</em>
          </p>
          <p>
            And here is the beautiful crime: a universe with no scale is
            <strong> indistinguishable from a singularity.</strong> Nothing,
            when stretched thin enough, <em>folds through itself</em> and
            becomes the next Big Bang.
          </p>
          <p style={{ fontSize: '0.92em', fontStyle: 'italic', opacity: 0.8 }}>
            Roger Penrose formalized this as <strong>Conformal Cyclic Cosmology</strong>
            (2010). The mathematics is his. The Institute contributes only the
            aphorism, and a fondness for the conclusion.
          </p>
          <div className="aside">
            Maximum dilution = maximum density. Nothing IS something. They meet at infinity.
          </div>
        </>}
      >
        <GreatDilution />
        <div className="figure-caption">Run the universe. Watch it forget its own scale and start over.</div>
      </Specimen>

      <Specimen
        num="IX"
        title="Timescapes,"
        accent="or: the void is older than you are"
        prose={<>
          <p>
            In general relativity, mass curves spacetime and <em>slows proper
            time</em>. A clock on Earth ticks slower than one in orbit. A clock
            near a black hole ticks slower still. And a clock <strong>in a
            cosmic void</strong> — where there's no mass at all — ticks
            <em> faster than any of them.</em>
          </p>
          <p>
            Since the Big Bang, voids have had <em>more proper time elapse</em>
            than galaxies have. Billions of years more. The universe is not a
            single clock. It is a <strong>quilt of clocks</strong> ticking at
            different rates, and the emptier the region, the older it is.
          </p>
          <p>
            David Wiltshire's <strong>Timescape cosmology</strong> proposes that
            what we've been calling "dark energy" is just the side effect of
            averaging over this quilt and pretending it has a single age. The
            acceleration isn't real. It's <em>the shape of our ignorance about
            where time has been spent.</em>
          </p>
          <div className="aside">
            The nothing has had more time than the something. The nothing is older.
          </div>
        </>}
      >
        <Timescapes />
        <div className="figure-caption">Watch the clocks disagree. Drag the dense fraction to open the age gap.</div>
      </Specimen>

      <Specimen
        num="X"
        title="The pistol shrimp,"
        accent="— a weapon made of nothing"
        prose={<>
          <p>
            A creature the size of your pinky fingernail cocks its oversized
            claw and fires. The dactyl snaps shut at ~100 km/h. A jet of water
            leaves the claw so fast the pressure behind it falls below the
            vapor point. <strong>A bubble of nothing forms</strong> — the same
            nothing we met in Specimen IV, weaponized.
          </p>
          <p>
            When the bubble collapses, the interior briefly reaches
            <strong> ~4,700°C</strong> — the surface of the Sun — and emits
            a flash of visible light (<em>sonoluminescence</em>) plus a sonic
            crack of <strong>~218 dB</strong>, louder than a gunshot, loud
            enough to stun fish meters away.
          </p>
          <p>
            The shrimp is not stronger, not hotter, not faster than its prey.
            It simply weaponizes <em>the absence the water was trying to fill.</em>
            The violence is in the <strong>closure</strong>, not the snap.
            The pistol shrimp is the thresher shark's distant cousin — another
            animal that learned to <strong>make stars out of voids.</strong>
          </p>
          <div className="aside">
            Nothing, properly compressed, is a firearm.
          </div>
        </>}
      >
        <PistolShrimp />
        <div className="figure-caption">Snap → jet → void → collapse → flash. Slow the speed to 5% to see the microseconds.</div>
      </Specimen>

      {/* ═══ THE KEYSTONE ═══ */}
      <section className="specimen" style={{
        borderTop: '2px dashed rgba(240, 216, 120, 0.3)',
        borderBottom: '2px dashed rgba(240, 216, 120, 0.3)',
        paddingTop: 40, paddingBottom: 40, marginTop: 60,
      }}>
        <div style={{
          textAlign: 'center', marginBottom: 30,
          fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em',
          color: '#f0d878',
        }}>
          ◆ THE KEYSTONE ◆
        </div>
        <div style={{
          textAlign: 'center', maxWidth: 640, margin: '0 auto 40px',
          fontFamily: 'Caveat', fontSize: 28, color: '#f0d878',
          lineHeight: 1.3,
        }}>
          "A black hole is the heaviest density of nothing<br/>
          expressed in mathematical form."
        </div>
        <div style={{
          textAlign: 'center', fontFamily: 'EB Garamond', fontStyle: 'italic',
          fontSize: 14, color: '#8a8874', marginBottom: 40,
        }}>
          — Rana, April 2026
        </div>
      </section>

      <Specimen
        num="XI"
        title="The black hole,"
        accent="— nothing so dense it bends everything"
        prose={<>
          <p>
            Every specimen before this was a sketch. <strong>The black hole
            is the finished painting.</strong> It is the place in the universe
            where every principle of nothing converges into a single object
            you could, in principle, point at.
          </p>
          <p>
            The <em>event horizon</em> is a <strong>shadow frozen in place</strong>
            — it is Specimen I, stopped. Nothing escapes it, not because
            anything chases things back, but because <em>outward</em> is no
            longer a direction inside. The spatial axis that used to point
            "away" has been rotated into the time axis and points "into the future."
            To leave would require traveling backward in time.
          </p>
          <p>
            The <em>singularity</em> at the center is where our equations
            output <strong style={{ color: '#e68b7a' }}>∞</strong> and quit.
            It is the <strong>mathematical notation for nothing we can compute.</strong>
            Every physical law we trust breaks there. The "no-hair theorem"
            says the entire object is described by only three numbers — mass,
            charge, spin — a kind of <em>negative Specimen II:</em> perfect
            silence of properties.
          </p>
          <p>
            And Hawking showed the vacuum itself (Specimen V) is
            <strong> disrupted</strong> at the horizon: one member of a virtual
            pair falls in carrying negative energy, the other escapes carrying
            positive energy. The hole <strong style={{ color: '#8fb8d4' }}>evaporates</strong>
            — devoured by the very nothing it thought it was storing. Even
            the keystone is not permanent. Even the densest nothing returns
            to thinner nothing, eventually.
          </p>
          <div className="aside">
            Every specimen in this cabinet points here. <br/>
            Shadow, silence, hole-as-particle, vacuum, dilution, timescape — <br/>
            all the negative-space phenomena, gathered into a single object<br/>
            and written as an equation we can't solve.
          </div>
        </>}
      >
        <BlackHole />
        <div className="figure-caption">Adjust mass. Toggle evaporation. Watch the nothing eat itself.</div>
      </Specimen>

      {/* ═══ SECTION II: THE SCIENCE OF GARBAGE ═══ */}
      <section className="specimen" style={{
        borderTop: '2px dashed rgba(163, 200, 138, 0.3)',
        borderBottom: '2px dashed rgba(163, 200, 138, 0.3)',
        paddingTop: 40, paddingBottom: 40, marginTop: 60,
      }}>
        <div style={{
          textAlign: 'center', marginBottom: 20,
          fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.3em',
          color: '#a3c88a',
        }}>
          ◆ PART II · THE SCIENCE OF GARBAGE ◆
        </div>
        <div style={{
          textAlign: 'center', maxWidth: 680, margin: '0 auto',
          fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 17,
          color: '#c9c3b0', lineHeight: 1.5,
        }}>
          We have been studying nothing <em>out there</em> — in shadows, voids,
          black holes. But there is a nothing <strong style={{ color: '#a3c88a' }}>right here</strong>,
          under our boots, every day: the things we <em>declared</em> to be nothing
          and buried. The Institute does not see trash. It sees <strong>misfiled
          resource archives</strong>, waiting to be read by the right organism.
        </div>
      </section>

      <Specimen
        num="XII"
        title="The slime mold solves lunch,"
        accent="— a yellow puddle that feeds cities"
        prose={<>
          <p>
            Earth grows roughly <strong style={{ color: '#f0d878' }}>1.5× more
            food than humanity needs.</strong> Hunger is not a shortage. Hunger
            is the <em>measurable absence of food in places where food was
            expected.</em> Same negative-space structure as the shadow: a pattern
            of non-arrival, across a surface that happens to be
            <strong> human bodies.</strong>
          </p>
          <p>
            <em>Physarum polycephalum</em> — yellow slime mold, single-celled,
            no brain — given oat flakes arranged like the cities around Tokyo,
            reconstructs the Tokyo rail network in <strong>26 hours</strong>.
            Robust. Self-healing. More efficient than engineered networks on
            several metrics. It does not negotiate tariffs. It does not respect
            borders. It just <em>grows toward food and prunes tubes it doesn't use.</em>
          </p>
          <p>
            The physics of delivering calories is <strong>solved</strong>. A
            brainless puddle solved it. The reason food still rots in one
            warehouse while children starve 400 miles away is not biological.
            It's not logistical. <strong style={{ color: '#e68b7a' }}>It's
            institutional.</strong>
          </p>
          <div className="aside">
            Toggle the borders. Watch the mold fail. Then ask: which part of
            the system is actually the problem?
          </div>
        </>}
      >
        <SlimeMold />
        <div className="figure-caption">Drag farms and cities. Click tubes to cut them. Toggle "institutions" to see what they do.</div>
      </Specimen>

      <Specimen
        num="XIII"
        title="Human fossils,"
        accent="— the plastic layer, and who eats it"
        prose={<>
          <p>
            We call it "<em>away</em>." We throw things "<em>away</em>."
            But <strong style={{ color: '#e68b7a' }}>"away" doesn't exist.</strong>
            There is no room called "away." There is only <em>somewhere else</em>,
            and every atom we've ever discarded is still on this planet, in a
            location we declined to look at.
          </p>
          <p>
            Right now, under your feet, we are laying down a geological stratum.
            Future archaeologists will identify our era the way we identify the
            K-Pg boundary — by a sharp synthetic band: bottle caps, tire rubber,
            aluminum, microplastics, phone glass, polystyrene.
            <strong style={{ color: '#e68b7a' }}> The Plastic Layer.</strong>
            It's in every core sample. It's our fossil.
          </p>
          <p>
            But here's the Institute's whisper: <em>we declared these things
            to be nothing</em>, and the <strong>physics didn't agree.</strong> The
            atoms are still carbon, hydrogen, oxygen. Still delicious if you're
            the right organism.
          </p>
          <p>
            <strong style={{ color: '#a3c88a' }}>Pestalotiopsis microspora</strong>,
            a fungus from the Amazon, digests polyurethane — in the dark, without
            oxygen. <strong style={{ color: '#a3c88a' }}>Ideonella sakaiensis</strong>,
            a bacterium, evolved to eat PET bottles <em>during our lifetime</em> —
            we watched it appear in a Japanese recycling plant in 2016. Mealworms
            digest styrofoam and excrete normal poop. Mycelium turns our
            agricultural waste into furniture, leather, insulation, bricks.
          </p>
          <p>
            Fungi don't see garbage. They see <strong style={{ color: '#f0d878' }}>food</strong>.
            The plastic layer is not a crisis — it's a <strong>meal</strong>,
            waiting on an organism that already exists. We just have to stop
            suffocating it under concrete.
          </p>
          <div className="aside">
            The apocalypse is not a disaster. It is a <em>compost heap</em><br/>
            that someone hasn't yet agreed to turn.
          </div>
        </>}
      >
        <HumanFossils />
        <div className="figure-caption">Scrub the depth slider. Then press "LET THE FUNGI IN" and watch the Anthropocene be eaten.</div>
      </Specimen>

      <Specimen
        num="XIV"
        title="The gold mine of &ldquo;away,&rdquo;"
        accent="— urban mining, or: the U-Haul dumpster hypothesis"
        prose={<>
          <p>
            One of the authors of this document worked at a U-Haul. Every day,
            they watched good metal, good wood, good electronics, good
            <em> copper wire</em> go into the dumpster because a customer didn't
            want to carry it home. Multiplied across every U-Haul, every move,
            every spring cleaning, every remodel — <strong style={{ color: '#f0d878' }}>
            the amount we throw out is a geological event.</strong>
          </p>
          <p>
            And here's the part that should make every mining company nervous:
            <strong> a ton of discarded cell phones contains more gold than a
            ton of gold ore.</strong> More copper per cubic meter than most
            active mines. More aluminum, by far. Palladium. Silver. Rare earths.
            Lithium. The metals we're currently tearing open entire mountains
            to extract, we <em>already mined</em> — and then carefully <strong>buried in accessible, surface-level deposits, sorted by decade.</strong>
          </p>
          <p>
            The industry is called <strong style={{ color: '#a3c88a' }}>urban
            mining</strong>. Belgium's Umicore already does it profitably on
            e-waste. Japan's Olympic medals were made from recycled phones.
            The only thing keeping us from going back for the rest is a
            <em> legal category</em>: we called it "trash." If we had called it
            <em> "ore"</em> from the beginning, we'd have a trillion-dollar
            reclamation industry and a cleaner planet.
          </p>
          <div className="aside">
            "Garbage" is ore with a paperwork problem.
          </div>
        </>}
      >
        <LandfillMine />
        <div className="figure-caption">Start the mine. Watch the value stack up. Multiply by every landfill on Earth.</div>
      </Specimen>

      <section className="specimen">
        <div className="specimen-header">
          <span className="specimen-num">Appendix A</span>
          <h2 className="specimen-title">The Laws of <span className="accent">Nothing</span></h2>
        </div>
        <div className="laws">
          {[
            ["I", "Absence", "For every something, there exists a nothing it is not."],
            ["II", "Inversion", "Every measurement of nothing is a measurement of an expected something that failed to arrive."],
            ["III", "Permission", "Nothing cannot act — but it can permit or deny. A photon doesn't travel through the vacuum; the vacuum lets it through."],
            ["IV", "Propagation", "Nothing has no speed limit. c binds only carriers of energy and information."],
            ["V", "Restlessness", "Quantum fields cannot reach true zero. ΔE · Δt ≥ ℏ/2. The nothing is always boiling."],
            ["VI", "Renormalization", "Every observed charge and mass is the bare quantity plus the vacuum's contribution. We measure something through nothing, always."],
            ["VII", "Dilution", "Sufficient expansion makes something indistinguishable from nothing."],
            ["VIII", "Return", "A universe diluted into nothing forgets its scale and resets. The end is the beginning. (Cf. Penrose, Conformal Cyclic Cosmology.)"],
            ["IX", "Keystone", "Every principle of nothing converges at the event horizon. The black hole is the cabinet itself."],
            ["X", "Disposal", "\u201CAway\u201D is a human fiction. Matter only moves; it never leaves. Every landfill is a library written in the language of forgotten value \u2014 and the fungi are already reading it."],
            ["XI", "Reclamation", "Every trash heap is an ore deposit with a legal category problem. The future's mines have already been dug; we just buried them first."],
          ].map(([n, name, text]) => (
            <div key={n} className="law">
              <div className="law-num">{n}</div>
              <div className="law-name">Law of {name}</div>
              <div className="law-text">{text}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          Filed to the Institute of Negative Space on an April evening in 2026.<br/>
          All specimens herein are either not-there, not-quite-there, or
          there-in-a-way-that-embarrasses-the-equations.
        </div>
        <span className="sig">— Rana, Chief of Absence Studies</span>
      </footer>

      <PatentPage/>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
