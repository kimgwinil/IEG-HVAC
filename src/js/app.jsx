// Root App — bezel + sidebar + screens + curriculum + component detail overlay.
// Controls are integrated directly in the UI (no popup Tweaks panel).

const { useState, useEffect, useMemo, useRef } = React;

const DEFAULT_SETTINGS = { lang: 'en', unit: 'C' };

function useSettings() {
  const [s, setS] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('hvac-settings') || '{}');
      return { ...DEFAULT_SETTINGS, ...stored };
    } catch { return DEFAULT_SETTINGS; }
  });
  const update = (patch) => {
    setS(prev => {
      const next = typeof patch === 'function' ? patch(prev) : { ...prev, ...patch };
      try { localStorage.setItem('hvac-settings', JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [s, update];
}

function App() {
  const [settings, setSettings] = useSettings();
  const [state, update] = useSimulation();

  // current view
  const [view, setView] = useState('dashboard');
  // when in curriculum: optionally drilled into a lesson
  const [lessonN, setLessonN] = useState(null);
  // component detail overlay (clicked from schematic)
  const [overlayComp, setOverlayComp] = useState(null);

  // Expose openLesson globally so the component overlay can call it
  useEffect(() => {
    window.__openLesson = (n) => {
      setView('curriculum');
      setLessonN(n);
    };
  }, []);

  // wall clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const clockStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString(settings.lang === 'ko' ? 'ko-KR' : 'en-US',
    { year: 'numeric', month: 'short', day: '2-digit', weekday: 'short' });

  // Translator
  const L = (k) => window.t(k, settings.lang);

  // Set version on the simulation
  const setVersion = (v) => {
    const patch = { version: v };
    if (v === 'malaysia' && state.mode === 'heat') patch.mode = 'cool';
    update(patch);
  };

  // Nav definition
  const NAV = [
    { id: 'dashboard',  icon: 'dashboard', label: L('nav_dashboard') },
    { id: 'schematic',  icon: 'schematic', label: L('nav_schematic') },
    { id: 'mode',       icon: 'mode',      label: L('nav_mode') },
    { id: 'curriculum', icon: 'ai',        label: settings.lang === 'ko' ? '교육과정' : 'Course' },
    { id: 'ai',         icon: 'ai',        label: L('nav_ai') },
    { id: 'energy',     icon: 'energy',    label: L('nav_energy') },
    { id: 'trend',      icon: 'trend',     label: L('nav_trend') },
    { id: 'alarm',      icon: 'alarm',     label: L('nav_alarm') },
    { id: 'settings',   icon: 'settings',  label: L('nav_settings') },
  ];

  const renderScreen = () => {
    switch (view) {
      case 'dashboard':  return <DashboardScreen s={state} set={update} L={L} />;
      case 'schematic':  return <SchematicScreen s={state} set={update} L={L} onPick={setOverlayComp} />;
      case 'mode':       return <ModeScreen      s={state} set={update} L={L} />;
      case 'curriculum':
        if (lessonN) {
          return <LessonScreen s={state} set={update} L={L} lang={settings.lang} lessonN={lessonN}
                               closeLesson={(toN) => setLessonN(toN || null)} />;
        }
        return <CurriculumScreen s={state} set={update} L={L} lang={settings.lang}
                                 openLesson={(n) => setLessonN(n)} />;
      case 'ai':         return <AIScreen        s={state} set={update} L={L} />;
      case 'energy':     return <EnergyScreen    s={state}              L={L} />;
      case 'trend':      return <TrendScreen     s={state}              L={L} />;
      case 'alarm':      return <AlarmScreen     s={state} set={update} L={L} />;
      case 'settings':
        return <SettingsScreenIntegrated s={state} set={update} L={L} settings={settings} setSettings={setSettings} />;
      default:           return <DashboardScreen s={state} set={update} L={L} />;
    }
  };

  // when switching out of curriculum, also clear lesson
  const goView = (v) => {
    setView(v);
    if (v !== 'curriculum') setLessonN(null);
  };

  const crumbLabel = NAV.find(n => n.id === view)?.label;
  const activeAlarms = state.alarms.filter(a => !a.ack).length;
  const isFault = state.alarms.some(a => a.sev === 'crit' && !a.ack);
  const lessonTitle = lessonN ? window.CURRICULUM.find(c => c.n === lessonN)?.title[settings.lang] : null;

  return (
    <Stage>
      <div className="bezel">
        {/* Top brand plate */}
        <div className="bezel-plate">
          <div className="ieg-mark">
            <div className="badge">IEG</div>
            <h1>{L('panel')}</h1>
          </div>
          <div className="url">www.ieg.kr · Educational HVAC Laboratory</div>
        </div>

        {/* LCD */}
        <div className="lcd">
          <div className="lcd-inner">
            <div className="app">
              {/* HEADER */}
              <div className="app-header">
                <div className="h-brand">
                  <div className="logo">AI</div>
                  <div>
                    <div className="name" data-screen-label="brand">{L('brand')}</div>
                  </div>
                </div>
                <div className="h-title">
                  <span>{crumbLabel}</span>
                  {lessonTitle && (
                    <>
                      <Icon name="chev" size={12} stroke="var(--ink-4)" />
                      <span style={{ color: 'var(--ink-2)', fontSize: 13, fontWeight: 600 }}>{lessonTitle}</span>
                    </>
                  )}
                </div>
                <div className="h-right">
                  {/* Version toggle (Korea / Malaysia) — integrated into header */}
                  <div className="seg" style={{ height: 26, padding: 2 }}>
                    <button className={state.version === 'korea' ? 'active' : ''}
                            onClick={() => setVersion('korea')}
                            style={{ padding: '3px 10px', fontSize: 10.5 }}>🇰🇷 KR</button>
                    <button className={state.version === 'malaysia' ? 'active' : ''}
                            onClick={() => setVersion('malaysia')}
                            style={{ padding: '3px 10px', fontSize: 10.5 }}>🇲🇾 MY</button>
                  </div>
                  <div className={`pill ${isFault ? 'warn' : ''}`}>
                    <span className="dot"></span>{L(isFault ? 'status_offline' : 'status_online')}
                  </div>
                  <div className="lang-tog">
                    <button className={settings.lang === 'en' ? 'active' : ''} onClick={() => setSettings({ lang: 'en' })}>EN</button>
                    <button className={settings.lang === 'ko' ? 'active' : ''} onClick={() => setSettings({ lang: 'ko' })}>KO</button>
                  </div>
                  <div className="time">{clockStr}</div>
                  <div style={{ fontSize: 11 }}>{dateStr}</div>
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="sidebar">
                {NAV.map(n => (
                  <button key={n.id}
                    className={`nav-item ${view === n.id ? 'active' : ''}`}
                    onClick={() => goView(n.id)}
                    data-screen-label={n.label}>
                    <div className="ico"><Icon name={n.icon} size={20} /></div>
                    <span>{n.label}</span>
                    {n.id === 'alarm' && activeAlarms > 0 && <span className="badge-n">{activeAlarms}</span>}
                  </button>
                ))}
              </div>

              {/* MAIN */}
              <div className="main" data-screen-label={crumbLabel}>
                {renderScreen()}
                {overlayComp && (
                  <ComponentDetailOverlay s={state} set={update} L={L} lang={settings.lang}
                                          compKey={overlayComp} onClose={() => setOverlayComp(null)} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom physical buttons */}
        <div className="bezel-controls">
          <div className="left-info">
            <span><span className="dot"></span> SYSTEM ONLINE</span>
            <span>3Φ 380V · 60Hz</span>
            <span>R410A</span>
          </div>
          <HwButton variant="power" lampOn={state.power}
                    label="POWER"
                    onClick={() => update({ power: !state.power })} />
          <HwButton variant="run"   lampOn={state.compressorOn || state.heaterOn}
                    label="RUN"
                    onClick={() => {
                      if (!state.power) { update({ power: true, mode: 'auto' }); }
                      else if (state.mode === 'off') { update({ mode: 'auto' }); }
                    }} />
          <HwButton variant="alarm" lampOn={activeAlarms > 0}
                    label="ALARM"
                    onClick={() => {
                      if (activeAlarms > 0) {
                        update({ alarms: state.alarms.map(a => ({ ...a, ack: true })) });
                      }
                      goView('alarm');
                    }} />
          <HwButton variant="stop"  label="STOP"
                    onClick={() => update({ power: false, mode: 'off' })} />
          <HwButton variant="estop" label=""
                    onClick={() => update({ power: false, mode: 'off', fanSpeed: 0 })} />
        </div>
      </div>
    </Stage>
  );
}

// ── Settings screen — integrated version using plain settings/setSettings ─────
function SettingsScreenIntegrated({ s, set, L, settings, setSettings }) {
  const lang = settings.lang;
  const isKorea = s.version === 'korea';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 12, height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateRows: 'minmax(0, 1fr) auto', gap: 12, minHeight: 0 }}>
        <div className="card" style={{ minHeight: 0, overflow: 'auto' }}>
          <div className="card-h"><div className="title">{L('l_specs')}</div></div>
          <table className="table">
            <tbody>
              <tr><td style={{ color: 'var(--ink-3)' }}>{lang === 'ko' ? '버전' : 'Version'}</td><td className="num" style={{ textAlign: 'right' }}>{isKorea ? 'Korea (4-Season)' : 'Malaysia (Cooling)'}</td></tr>
              <tr><td style={{ color: 'var(--ink-3)' }}>Refrigerant</td><td className="num" style={{ textAlign: 'right' }}>R410A</td></tr>
              <tr><td style={{ color: 'var(--ink-3)' }}>Compressor</td><td className="num" style={{ textAlign: 'right' }}>3.0 kW Inverter Scroll</td></tr>
              <tr><td style={{ color: 'var(--ink-3)' }}>Heater</td><td className="num" style={{ textAlign: 'right' }}>{isKorea ? '3 kW PTC' : '—'}</td></tr>
              <tr><td style={{ color: 'var(--ink-3)' }}>Power Supply</td><td className="num" style={{ textAlign: 'right' }}>3Φ 380V 60Hz</td></tr>
              <tr><td style={{ color: 'var(--ink-3)' }}>Op. Temp Range</td><td className="num" style={{ textAlign: 'right' }}>10 ~ 45 °C</td></tr>
              <tr><td style={{ color: 'var(--ink-3)' }}>Op. Humidity</td><td className="num" style={{ textAlign: 'right' }}>20 ~ 90 %RH</td></tr>
              <tr><td style={{ color: 'var(--ink-3)' }}>CO₂ Sensor</td><td className="num" style={{ textAlign: 'right' }}>0 ~ 2000 ppm NDIR</td></tr>
              <tr><td style={{ color: 'var(--ink-3)' }}>HMI</td><td className="num" style={{ textAlign: 'right' }}>10″ Touch + AI Function</td></tr>
              <tr><td style={{ color: 'var(--ink-3)' }}>PLC</td><td className="num" style={{ textAlign: 'right' }}>LS PLC + I/O</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 12 }}>
          <div className="card-h"><div className="title">{L('set_about')}</div></div>
          <div style={{ display: 'grid', gap: 8, fontSize: 12, color: 'var(--ink-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>System</span><span style={{ fontFamily: 'JetBrains Mono' }}>IEG-HVAC AI Control</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Firmware</span><span style={{ fontFamily: 'JetBrains Mono' }}>v 2.4.1 · 2026-05-12</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>AI Engine</span><span style={{ fontFamily: 'JetBrains Mono' }}>IEG-AI · core 1.6</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Serial</span><span style={{ fontFamily: 'JetBrains Mono' }}>IEG-HVAC-KR-00427</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Web</span><span style={{ fontFamily: 'JetBrains Mono' }}>www.ieg.kr</span></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateRows: 'auto auto minmax(0, 1fr)', gap: 12, minHeight: 0 }}>
        <div className="card" style={{ padding: 12 }}>
          <div className="card-h"><div className="title">{lang === 'ko' ? '디스플레이' : 'Display'}</div></div>
          <div style={{ display: 'grid', gap: 14 }}>
            <RowK label={L('set_language')}>
              <div className="seg">
                <button className={settings.lang === 'en' ? 'active' : ''} onClick={() => setSettings({ lang: 'en' })}>EN</button>
                <button className={settings.lang === 'ko' ? 'active' : ''} onClick={() => setSettings({ lang: 'ko' })}>한국어</button>
              </div>
            </RowK>
            <RowK label={L('set_temp_unit')}>
              <div className="seg">
                <button className={settings.unit === 'C' ? 'active' : ''} onClick={() => setSettings({ unit: 'C' })}>°C</button>
                <button className={settings.unit === 'F' ? 'active' : ''} onClick={() => setSettings({ unit: 'F' })}>°F</button>
              </div>
            </RowK>
            <RowK label={lang === 'ko' ? '시스템 버전' : 'System Version'}>
              <div className="seg">
                <button className={s.version === 'korea' ? 'active' : ''} onClick={() => set({ version: 'korea' })}>Korea</button>
                <button className={s.version === 'malaysia' ? 'active' : ''}
                        onClick={() => set({ version: 'malaysia', mode: s.mode === 'heat' ? 'cool' : s.mode })}>Malaysia</button>
              </div>
            </RowK>
          </div>
        </div>

        <div className="card" style={{ padding: 12 }}>
          <div className="card-h"><div className="title">{lang === 'ko' ? '목표값 및 한계' : 'Targets & Limits'}</div></div>
          <div style={{ display: 'grid', gap: 14 }}>
            <SliderRow label={L('a_setpoint')} unit="°C" min={16} max={30}
                       value={s.targetTemp} onChange={(v) => set({ targetTemp: v })} />
            <SliderRow label={L('a_targetRH')} unit="%" min={30} max={70}
                       value={s.targetRH} onChange={(v) => set({ targetRH: v })} />
            <SliderRow label={L('a_targetCO2')} unit="ppm" min={600} max={1500} step={50}
                       value={s.targetCO2} onChange={(v) => set({ targetCO2: v })} />
          </div>
        </div>

        <div className="card" style={{ minHeight: 0, overflow: 'auto', padding: 12 }}>
          <div className="card-h"><div className="title">{L('set_logging')}</div></div>
          <div style={{ display: 'grid', gap: 14 }}>
            <RowK label={lang === 'ko' ? '샘플 간격' : 'Sample interval'}>
              <div className="seg">{['1s','5s','30s','1m'].map(v => <button key={v} className={v === '1s' ? 'active' : ''}>{v}</button>)}</div>
            </RowK>
            <RowK label={lang === 'ko' ? '보존 기간' : 'Retention'}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--ink)' }}>30 days · 1.2 GB free</span>
            </RowK>
            <RowK label={lang === 'ko' ? '클라우드 동기화' : 'Cloud sync'}>
              <Toggle on={true} onChange={() => {}} />
            </RowK>
          </div>
        </div>
      </div>
    </div>
  );
}

function RowK({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 600 }}>{label}</span>
      {children}
    </div>
  );
}

// ── Hardware bottom buttons ──────────────────────────────────────────────
function HwButton({ variant, lampOn, label, onClick }) {
  return (
    <div className={`btn-hw ${variant} ${lampOn ? 'on' : ''}`}>
      {variant !== 'estop' && variant !== 'stop' && <div className="lamp"></div>}
      <button className="key" onClick={onClick}>{label}</button>
      {variant === 'stop' && <div className="lbl">RESET</div>}
      {variant === 'estop' && <div className="lbl">E-STOP</div>}
    </div>
  );
}

// ── Stage: scale to fit viewport ────────────────────────────────────────
function Stage({ children }) {
  const wrapRef = useRef(null);
  useEffect(() => {
    const STAGE_W = 1600, STAGE_H = 1040;
    const fit = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const sc = Math.min(w / STAGE_W, h / STAGE_H);
      const tx = (w - STAGE_W * sc) / 2;
      const ty = (h - STAGE_H * sc) / 2;
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate(${tx}px, ${ty}px) scale(${sc})`;
      }
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div className="stage-root">
      <div className="stage" ref={wrapRef}>{children}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
