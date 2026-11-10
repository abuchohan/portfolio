import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, ChefHat, Code2, Github, Pause, Play } from 'lucide-react';
import './App.css';

const CookRoom = lazy(() => import('./components/CookRoom'));
export type Activity = 'coding' | 'cooking';
const CYCLE_LENGTH = 12000;

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    return this.state.failed ? <div className="scene-fallback"><ChefHat size={64} strokeWidth={1} /><p>A little code. A little cooking.<br />Something good is on the way.</p></div> : this.props.children;
  }
}

function App() {
  const [activity, setActivity] = useState<Activity>('coding');
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [paused, setPaused] = useState(reducedMotion);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReducedMotion(preference.matches); if (preference.matches) setPaused(true); };
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (paused) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => { clearTimeout(timer); if (!document.hidden) timer = setTimeout(() => setActivity(value => value === 'coding' ? 'cooking' : 'coding'), CYCLE_LENGTH); };
    schedule();
    document.addEventListener('visibilitychange', schedule);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', schedule); };
  }, [activity, paused, cycle]);

  const changeActivity = (next: Activity) => { setActivity(next); setCycle(value => value + 1); };

  return (
    <div className="placeholder-page">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Abu Chohan home"><span className="monogram">ac<span>.</span></span><span className="wordmark-name">Abu Chohan<span>Developer & occasional chef</span></span></a>
        <a className="contact-link" href="mailto:abuchohan@hotmail.co.uk">Say hello <ArrowUpRight size={16} /></a>
      </header>
      <main>
        <div className="intro">
          <div className="construction-label"><span className="status-dot" /> A FRESH START IS ON THE MENU</div>
          <h1>New website is<br />being <span className="headline-accent">cooked up<svg viewBox="0 0 370 17" fill="none" aria-hidden="true"><path d="M4 11C85 2 217 2 365 8M39 14C129 7 249 7 329 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg></span><span className="headline-period">.</span></h1>
          <p>A little coding. A little cooking. Something good takes time.<br className="desktop-break" /> Make yourself at home while I put the finishing touches on.</p>
        </div>
        <section className="room-section" aria-label="An isometric room with Abu alternating between coding at his desk and cooking at the stove">
          <div className="scene-decoration decoration-left" aria-hidden="true"><span>THE WORK IN PROGRESS</span><svg viewBox="0 0 58 66" fill="none"><path d="M5 4C3 26 22 39 48 42M38 30L50 43L35 49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          <div className="scene-decoration decoration-right" aria-hidden="true"><span>100% HOMEMADE</span><svg width="26" height="26" viewBox="0 0 26 26" fill="none"><path d="M13 2v22M2 13h22M5 5l16 16M5 21L21 5" stroke="currentColor" strokeWidth="1.5" /></svg></div>
          <div className="room-canvas"><SceneBoundary><Suspense fallback={<div className="scene-loading"><span className="status-dot" /> Setting the table…</div>}><CookRoom activity={activity} paused={paused} reducedMotion={reducedMotion} /></Suspense></SceneBoundary></div>
          <div className="room-caption" aria-live="polite"><span className="status-dot" /><span>{activity === 'coding' ? 'Turning coffee into code' : 'Letting the ideas simmer'}</span><span className="caption-ellipsis" aria-hidden="true">...</span></div>
        </section>
        <div className="activity-controls">
          <div className="activity-switch" role="group" aria-label="Choose what Abu is doing">
            <button className={activity === 'coding' ? 'activity-button active' : 'activity-button'} aria-pressed={activity === 'coding'} onClick={() => changeActivity('coding')}><Code2 size={17} /> Coding <span className="button-indicator" /></button>
            <button className={activity === 'cooking' ? 'activity-button active' : 'activity-button'} aria-pressed={activity === 'cooking'} onClick={() => changeActivity('cooking')}><ChefHat size={17} /> Cooking <span className="button-indicator" /></button>
          </div>
          <button className="pause-button" onClick={() => setPaused(value => !value)} aria-label={paused ? 'Play animation and automatic activity switching' : 'Pause animation and automatic activity switching'} title={paused ? 'Play animation' : 'Pause animation'}>{paused ? <Play size={15} /> : <Pause size={15} />}</button>
        </div>
        <p className="interaction-hint">{paused ? 'Taking a breather. Pick an activity to explore.' : 'Switch it up, or just watch me do my thing.'}</p>
      </main>
      <footer className="site-footer"><span>Good things are worth the wait.</span><div><a href="https://github.com/abuchohan" target="_blank" rel="noreferrer"><Github size={15} /> GitHub <ArrowUpRight size={13} /></a><span className="footer-divider" /><span>© {new Date().getFullYear()} Abu Chohan</span></div></footer>
    </div>
  );
}
export default App;
