import { useState, type CSSProperties, type JSX } from 'react';
import { Modal } from '../shared/Modal';

export interface TutorialModalProps {
  open: boolean;
  onClose: () => void;
}

/* ---------- tiny building blocks for the animated scenes ---------- */

const stage: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: 160,
  borderRadius: 8,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  overflow: 'hidden',
};

const bar = (width: number | string, extra: CSSProperties = {}): CSSProperties => ({
  height: 7,
  width,
  borderRadius: 4,
  backgroundColor: 'var(--color-border)',
  ...extra,
});

const cursor = (anim: string): CSSProperties => ({
  position: 'absolute',
  width: 12,
  height: 12,
  borderRadius: 9999,
  backgroundColor: 'var(--color-text-primary)',
  border: '2px solid var(--color-background)',
  boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
  zIndex: 5,
  animation: `${anim} 5s ease-in-out infinite`,
});

const card: CSSProperties = {
  position: 'absolute',
  top: '16%',
  width: '26%',
  height: '68%',
  borderRadius: 6,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
  padding: 8,
  display: 'flex',
  flexDirection: 'column',
  gap: 5,
};

/** 1 — overview: click a chapter card, dive in. */
function SceneOverview() {
  return (
    <div style={stage} aria-hidden>
      <div style={{ ...card, left: '20%', animation: 'tut1-card 5s ease-in-out infinite', zIndex: 2 }}>
        <div style={bar('50%')} />
        <div style={bar('80%', { backgroundColor: 'var(--color-highlight-zhuangzi)' })} />
        <div style={bar('90%')} />
        <div style={bar('85%', { backgroundColor: 'var(--color-highlight-laozi)' })} />
        <div style={bar('88%')} />
      </div>
      <div style={{ ...card, left: '54%', animation: 'tut1-other 5s ease-in-out infinite' }}>
        <div style={bar('50%')} />
        <div style={bar('85%')} />
        <div style={bar('90%', { backgroundColor: 'var(--color-highlight-zhuangzi)' })} />
        <div style={bar('80%')} />
        <div style={bar('88%', { backgroundColor: 'var(--color-highlight-wenzi)' })} />
      </div>
      <span style={cursor('tut1-cur')} />
    </div>
  );
}

/** 2 — click a highlight, the parallel panel slides in. */
function SceneParallel() {
  return (
    <div style={stage} aria-hidden>
      <div style={{ position: 'absolute', left: '6%', top: '18%', width: '55%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={bar('92%')} />
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <div style={bar('26%')} />
          <div
            style={bar('40%', {
              height: 10,
              backgroundColor: 'var(--color-highlight-zhuangzi)',
              animation: 'tut2-hl 5s ease-in-out infinite',
            })}
          />
          <div style={bar('20%')} />
        </div>
        <div style={bar('85%')} />
        <div style={bar('60%')} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '34%',
          borderLeft: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-high)',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
          animation: 'tut2-panel 5s ease-in-out infinite',
        }}
      >
        <div style={bar('55%')} />
        <div style={bar('90%', { backgroundColor: 'var(--color-highlight-zhuangzi)' })} />
        <div style={bar('85%')} />
        <div style={bar('88%')} />
        <div style={bar('40%')} />
      </div>
      <span style={cursor('tut2-cur')} />
    </div>
  );
}

/** 3 — sidebar: toggling a source hides its highlights. */
function SceneSidebar() {
  const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 6 };
  const dot = (color: string): CSSProperties => ({
    width: 7,
    height: 7,
    borderRadius: 9999,
    backgroundColor: color,
    flexShrink: 0,
  });
  const pill = (animated: boolean): CSSProperties => ({
    position: 'relative',
    width: 20,
    height: 11,
    borderRadius: 9999,
    backgroundColor: 'var(--color-accent)',
    flexShrink: 0,
    marginLeft: 'auto',
    animation: animated ? 'tut3-pill 5s ease-in-out infinite' : undefined,
  });
  const knob = (animated: boolean): CSSProperties => ({
    position: 'absolute',
    top: 2,
    left: 2,
    width: 7,
    height: 7,
    borderRadius: 9999,
    backgroundColor: '#fff',
    transform: 'translateX(9px)',
    animation: animated ? 'tut3-knob 5s ease-in-out infinite' : undefined,
  });
  return (
    <div style={stage} aria-hidden>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '36%',
          borderRight: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface-low)',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={row}>
          <span style={dot('var(--color-dot-zhuangzi)')} />
          <div style={bar('40%')} />
          <span style={pill(false)}><span style={knob(false)} /></span>
        </div>
        <div style={row}>
          <span style={dot('var(--color-dot-laozi)')} />
          <div style={bar('34%')} />
          <span style={pill(true)}><span style={knob(true)} /></span>
        </div>
        <div style={row}>
          <span style={dot('var(--color-dot-xunzi)')} />
          <div style={bar('44%')} />
          <span style={pill(false)}><span style={knob(false)} /></span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: '44%', top: '18%', width: '50%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={bar('90%')} />
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={bar('20%')} />
          <div
            style={bar('42%', {
              height: 10,
              backgroundColor: 'var(--color-highlight-laozi)',
              animation: 'tut3-hl 5s ease-in-out infinite',
            })}
          />
          <div style={bar('22%')} />
        </div>
        <div style={bar('82%')} />
        <div style={bar('58%')} />
      </div>
      <span style={cursor('tut3-cur')} />
    </div>
  );
}

/** 4 — top bar: hover for tooltips, moon toggles dark mode. */
function SceneTopBar() {
  const icon: CSSProperties = {
    width: 15,
    height: 15,
    borderRadius: 4,
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-surface-high)',
  };
  return (
    <div style={{ ...stage, animation: 'tut4-bg 5s ease-in-out infinite' }} aria-hidden>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 28,
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 7,
          padding: '0 12px',
        }}
      >
        <span style={icon} />
        <span style={icon} />
        <span style={icon} />
        <span style={{ ...icon, backgroundColor: 'var(--color-accent)' }} />
      </div>
      <span
        style={{
          position: 'absolute',
          top: 36,
          right: 58,
          padding: '4px 8px',
          borderRadius: 5,
          backgroundColor: 'var(--color-text-primary)',
          color: 'var(--color-background)',
          fontFamily: 'var(--font-ui)',
          fontSize: 9,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          animation: 'tut4-tip 5s ease-in-out infinite',
        }}
      >
        Light or dark mode
      </span>
      <div style={{ position: 'absolute', left: '10%', top: 56, width: '80%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={bar('80%')} />
        <div style={bar('92%')} />
        <div style={bar('65%')} />
      </div>
      <span style={cursor('tut4-cur')} />
    </div>
  );
}

/** 5 — annotate: select text, a note appears. */
function SceneAnnotate() {
  return (
    <div style={stage} aria-hidden>
      <div style={{ position: 'absolute', left: '8%', top: '22%', width: '54%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={bar('92%')} />
        <div style={{ position: 'relative' }}>
          <div style={bar('96%')} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: -3,
              height: 13,
              borderRadius: 3,
              backgroundColor: 'var(--color-highlight-annotation)',
              borderBottom: '2px dashed var(--color-accent)',
              animation: 'tut5-sel 5s ease-in-out infinite',
            }}
          />
        </div>
        <div style={bar('80%')} />
      </div>
      <div
        style={{
          position: 'absolute',
          right: '6%',
          top: '18%',
          width: '28%',
          borderRadius: 8,
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-background)',
          boxShadow: 'var(--shadow-popover)',
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 7,
          animation: 'tut5-note 5s ease-in-out infinite',
        }}
      >
        <div style={bar('45%', { backgroundColor: 'var(--color-accent)', height: 5 })} />
        <div style={bar('90%')} />
        <div style={bar('70%')} />
      </div>
      <span style={cursor('tut5-cur')} />
    </div>
  );
}

/* ---------- steps ---------- */

const STEPS: { title: string; body: string; Scene: () => JSX.Element }[] = [
  {
    title: 'Start from the overview',
    body: 'The opening screen shows every chapter from a distance — the colored marks are textual parallels. Click a chapter to zoom in.',
    Scene: SceneOverview,
  },
  {
    title: 'Read the parallels',
    body: 'Colored highlights mark passages shared with other early texts. Click one to open the source passage side by side.',
    Scene: SceneParallel,
  },
  {
    title: 'Use the sidebar',
    body: 'One row per source text: click it to list all its parallels, flip its switch to hide those highlights, and drag the length slider to filter parallels by size.',
    Scene: SceneSidebar,
  },
  {
    title: 'Top bar tools',
    body: 'Hover any button to see what it does: switch 中文/English, rhymed or prose, hide citation brackets, light or dark mode, and search with ⌘K.',
    Scene: SceneTopBar,
  },
  {
    title: 'Annotate',
    body: 'Press Annotate, then select any stretch of text — or click a highlight — to attach your own note. Notes stay on this device.',
    Scene: SceneAnnotate,
  },
];

const KEYFRAMES = `
@keyframes tut1-cur { 0%{left:68%;top:82%;opacity:1} 28%,42%{left:31%;top:46%;opacity:1} 33%{transform:scale(.7)} 38%{transform:scale(1)} 55%,80%{left:31%;top:46%;opacity:0} 95%,100%{left:68%;top:82%;opacity:1} }
@keyframes tut1-card { 0%,40%{transform:scale(1)} 58%,84%{transform:scale(2.6)} 97%,100%{transform:scale(1)} }
@keyframes tut1-other { 0%,42%{opacity:1} 56%,86%{opacity:0} 97%,100%{opacity:1} }
@keyframes tut2-cur { 0%{left:74%;top:82%} 28%,60%{left:34%;top:36%} 34%{transform:scale(.7)} 40%{transform:scale(1)} 88%,100%{left:74%;top:82%} }
@keyframes tut2-hl { 0%,32%{box-shadow:none} 40%,80%{box-shadow:0 0 0 2px var(--color-accent-bright)} 92%,100%{box-shadow:none} }
@keyframes tut2-panel { 0%,38%{transform:translateX(105%)} 52%,88%{transform:translateX(0)} 100%{transform:translateX(105%)} }
@keyframes tut3-cur { 0%{left:60%;top:75%} 28%,52%{left:31%;top:34%} 36%{transform:scale(.7)} 42%{transform:scale(1)} 74%{left:31%;top:34%} 78%{transform:scale(.7)} 84%{transform:scale(1)} 100%{left:60%;top:75%} }
@keyframes tut3-knob { 0%,38%{transform:translateX(9px)} 46%,76%{transform:translateX(0)} 86%,100%{transform:translateX(9px)} }
@keyframes tut3-pill { 0%,38%{background-color:var(--color-accent)} 46%,76%{background-color:var(--color-border-strong)} 86%,100%{background-color:var(--color-accent)} }
@keyframes tut3-hl { 0%,40%{opacity:1} 48%,78%{opacity:0.12} 88%,100%{opacity:1} }
@keyframes tut4-cur { 0%{left:50%;top:70%} 22%,48%{left:75%;top:12%} 60%,80%{left:92%;top:12%} 66%{transform:scale(.7)} 72%{transform:scale(1)} 100%{left:50%;top:70%} }
@keyframes tut4-tip { 0%,24%{opacity:0} 32%,52%{opacity:1} 60%,100%{opacity:0} }
@keyframes tut4-bg { 0%,64%{background-color:var(--color-surface)} 74%,92%{background-color:#232327} 100%{background-color:var(--color-surface)} }
@keyframes tut5-cur { 0%,10%{left:10%;top:40%} 40%{left:44%;top:40%} 55%,80%{left:44%;top:40%;opacity:1} 92%,100%{left:10%;top:40%;opacity:1} }
@keyframes tut5-sel { 0%,10%{width:0} 40%,86%{width:64%} 96%,100%{width:0} }
@keyframes tut5-note { 0%,44%{opacity:0;transform:scale(.85)} 54%,88%{opacity:1;transform:scale(1)} 96%,100%{opacity:0;transform:scale(.85)} }
`;

export function TutorialModal({ open, onClose }: TutorialModalProps) {
  const [step, setStep] = useState(0);

  if (!open) return null;

  const { title, body, Scene } = STEPS[step];
  const last = step === STEPS.length - 1;
  // Reset here so every open starts at step 1 without an effect.
  const close = () => {
    onClose();
    setStep(0);
  };

  return (
    <Modal open={open} onClose={close} title="Tutorial" size="lg" ariaLabel="Tutorial">
      <style>{KEYFRAMES}</style>
      <h3
        className="font-serif"
        style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 12 }}
      >
        How to use this site
      </h3>
      {/* key remounts the scene so its animations restart on every step */}
      <div key={step}>
        <Scene />
      </div>
      <div style={{ minHeight: 76, marginTop: 14 }}>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 4,
          }}
        >
          {step + 1}. {title}
        </p>
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            lineHeight: 1.6,
            color: 'var(--color-secondary)',
          }}
        >
          {body}
        </p>
      </div>
      <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
        <div className="flex items-center gap-2" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Go to step ${i + 1}`}
              onClick={() => setStep(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: 9999,
                border: 'none',
                padding: 0,
                backgroundColor: i === step ? 'var(--color-accent)' : 'var(--color-border)',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              style={{
                height: 36,
                padding: '0 16px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--color-secondary)',
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={() => (last ? close() : setStep(step + 1))}
            style={{
              height: 36,
              padding: '0 20px',
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              border: 'none',
              borderRadius: 'var(--radius-button)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
              fontSize: 14,
            }}
          >
            {last ? 'Got it' : 'Next'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
