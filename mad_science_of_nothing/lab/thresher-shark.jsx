// thresher-shark.jsx — just a public Wikimedia shark gif, hotlinked.
// Way better than my bad SVG. Licensed CC-BY-SA; source linked below.

function ThresherShark() {
  // Wikimedia Special:FilePath redirects to the canonical upload URL and
  // allows hotlinking. Falls back gracefully if blocked.
  const SHARK_URL = 'https://commons.wikimedia.org/wiki/Special:FilePath/Stereogram_Tut_Animated_Shark_Small.gif';

  return (
    <div>
      <div style={{
        background: 'linear-gradient(to bottom, #0d1e2a 0%, #07101a 100%)',
        borderRadius: 4,
        padding: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 260,
        position: 'relative',
      }}>
        <img
          src={SHARK_URL}
          alt="animated shark swimming"
          style={{ maxWidth: '100%', height: 'auto', imageRendering: 'auto' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div style={{
          display: 'none',
          color: '#c9c3b0',
          fontFamily: 'EB Garamond',
          fontStyle: 'italic',
          fontSize: 14,
          textAlign: 'center',
          padding: 40,
        }}>
          [ shark.gif wouldn't load — network issue ]
        </div>

        <div style={{
          position: 'absolute', top: 12, left: 16,
          color: 'rgba(200,220,230,0.6)',
          fontFamily: 'EB Garamond', fontStyle: 'italic', fontSize: 14,
        }}>
          Alopias vulpinus
        </div>
        <div style={{
          position: 'absolute', top: 30, left: 16,
          color: 'rgba(200,220,230,0.4)',
          fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: 1.5,
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
        Upper tail-lobe can exceed body length. Used to <strong>stun prey</strong> by
        snapping faster than ~1500 m/s (speed of sound in water) — creating cavitation
        bubbles on its own terms, as a weapon. The shark is built to <em>cause</em> the
        phenomenon that destroys our propellers. And it never chips.
      </div>

      <div style={{
        marginTop: 8,
        fontFamily: 'JetBrains Mono', fontSize: 8, color: '#6a6858',
        letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        img: Wikimedia Commons · Stereogram_Tut_Animated_Shark
      </div>
    </div>
  );
}

Object.assign(window, { ThresherShark });
