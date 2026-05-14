// Screens part 3: Alarm / Diagnostics, Settings

// ── ALARM SCREEN ────────────────────────────────────────────────────────
function AlarmScreen({ s, set, L }) {
  const [filter, setFilter] = React.useState('all');
  const filtered = filter === 'all' ? s.alarms : s.alarms.filter(a => a.sev === filter);

  // simulated event log
  const events = [
    { t: '09:24:01', tag: 'INFO',  msg: 'Compressor frequency adjusted to 62Hz' },
    { t: '09:21:18', tag: 'CTRL',  msg: 'Setpoint changed to 24°C by operator' },
    { t: '09:08:34', tag: 'INFO',  msg: 'HEPA filter life: 78% remaining' },
    { t: '08:55:12', tag: 'WARN',  msg: 'CO₂ exceeded threshold (1180 ppm)' },
    { t: '08:42:00', tag: 'INFO',  msg: 'Air purifier auto-enabled' },
    { t: '08:32:05', tag: 'INFO',  msg: 'Defrost cycle scheduled' },
    { t: '08:14:22', tag: 'CTRL',  msg: 'System power on — startup sequence OK' },
    { t: '08:14:18', tag: 'INFO',  msg: 'AI control engine initialized' },
  ];

  const counts = {
    crit: s.alarms.filter(a => a.sev === 'crit').length,
    warn: s.alarms.filter(a => a.sev === 'warn').length,
    info: s.alarms.filter(a => a.sev === 'info').length,
  };

  const ackAll = () => {
    set({ alarms: s.alarms.map(a => ({ ...a, ack: true })) });
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', gap: 12, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) auto', gap: 10, alignItems: 'center' }}>
        <SevCard sev="crit" count={counts.crit} active={filter === 'crit'} onClick={() => setFilter(filter === 'crit' ? 'all' : 'crit')} label="Critical" />
        <SevCard sev="warn" count={counts.warn} active={filter === 'warn'} onClick={() => setFilter(filter === 'warn' ? 'all' : 'warn')} label="Warning" />
        <SevCard sev="info" count={counts.info} active={filter === 'info'} onClick={() => setFilter(filter === 'info' ? 'all' : 'info')} label="Info" />
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => setFilter('all')}>All</button>
          <button className="btn primary" onClick={ackAll}>{L('l_acknowledge')} All</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, minHeight: 0 }}>
        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0 }}>
          <div className="card-h">
            <div className="title">Active {L('nav_alarm')}</div>
            <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{filtered.length} shown</span>
          </div>
          <div style={{ overflow: 'auto' }}>
            {filtered.length === 0 && (
              <div style={{ padding: 30, textAlign: 'center', color: 'var(--ink-4)', fontSize: 12 }}>
                <div style={{ display: 'grid', placeItems: 'center', gap: 8 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--mint)', display: 'grid', placeItems: 'center', color: 'var(--mint-d)' }}>
                    <Icon name="check" size={24} strokeWidth={2.4} />
                  </div>
                  <div>{L('ai_status_normal')}</div>
                </div>
              </div>
            )}
            {filtered.map((a, i) => (
              <div key={i} className={`alarm-row ${a.ack ? 'ack' : ''}`}
                   style={{ gridTemplateColumns: '70px 1fr auto auto', alignItems: 'center' }}>
                <span className={`sev ${a.sev}`}>{a.sev.toUpperCase()}</span>
                <span className="t">{L(a.id)}</span>
                <span className="when">{a.t}</span>
                {!a.ack ? (
                  <button className="btn sm"
                          onClick={() => set({ alarms: s.alarms.map(x => x.id === a.id && x.t === a.t ? { ...x, ack: true } : x) })}>
                    {L('l_acknowledge')}
                  </button>
                ) : (
                  <span style={{ fontSize: 10, color: 'var(--mint-d)', fontWeight: 700 }}>ACK</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0 }}>
          <div className="card-h"><div className="title">{L('l_history')}</div></div>
          <div style={{ overflow: 'auto', fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--ink-2)' }}>
            {events.map((e, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '60px 60px 1fr', gap: 8,
                padding: '6px 4px',
                borderBottom: '1px solid var(--line-soft)',
                alignItems: 'center'
              }}>
                <span style={{ color: 'var(--ink-4)' }}>{e.t}</span>
                <span style={{
                  fontSize: 9, padding: '1px 6px', borderRadius: 4, textAlign: 'center',
                  background: e.tag === 'WARN' ? '#FFF4E5' : e.tag === 'CTRL' ? '#E5F2FB' : '#F1F4F8',
                  color:      e.tag === 'WARN' ? '#B26A00' : e.tag === 'CTRL' ? '#2A6FDB' : 'var(--ink-3)',
                  fontWeight: 700, letterSpacing: '.04em',
                }}>{e.tag}</span>
                <span style={{ fontFamily: 'Pretendard', color: 'var(--ink-2)' }}>{e.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SevCard({ sev, count, active, onClick, label }) {
  const colors = {
    crit: ['#FBE9EC', '#C0364E'],
    warn: ['#FFF4E5', '#B26A00'],
    info: ['#E5F2FB', '#2A6FDB'],
  };
  const [bg, fg] = colors[sev];
  return (
    <button onClick={onClick}
      style={{
        background: '#fff', border: '1px solid ' + (active ? fg : 'var(--line-soft)'),
        borderRadius: 14, padding: 14, textAlign: 'left',
        display: 'grid', gridTemplateColumns: '46px 1fr', gap: 12, alignItems: 'center',
        boxShadow: active ? `0 0 0 2px ${fg}33` : 'none'
      }}>
      <div style={{ width: 46, height: 46, borderRadius: 10, background: bg, color: fg, display: 'grid', placeItems: 'center' }}>
        <Icon name="alarm" size={22} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 26, fontWeight: 600, color: 'var(--ink)', lineHeight: 1 }}>{count}</div>
      </div>
    </button>
  );
}

// ── SETTINGS SCREEN ─────────────────────────────────────────────────────
function SettingsScreen({ s, set, L, tweaks, setTweak }) {
  const isKorea = s.version === 'korea';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, height: '100%' }}>
      <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
        <div className="card">
          <div className="card-h"><div className="title">{L('l_specs')}</div></div>
          <table className="table">
            <tbody>
              <SpecRow k="Version" v={isKorea ? 'Korea (4-Season)' : 'Malaysia (Cooling)'} />
              <SpecRow k="Refrigerant" v="R410A" />
              <SpecRow k="Compressor" v="3.0 kW Inverter Scroll" />
              <SpecRow k="Heater" v={isKorea ? '3 kW PTC' : '—'} />
              <SpecRow k="Power Supply" v="3Φ 380V 60Hz" />
              <SpecRow k="Op. Temp Range" v="10 ~ 45 °C" />
              <SpecRow k="Op. Humidity" v="20 ~ 90 %RH" />
              <SpecRow k="CO₂ Sensor" v="0 ~ 2000 ppm NDIR" />
              <SpecRow k="HMI" v="10″ Touch + AI Function" />
              <SpecRow k="PLC" v="LS PLC + I/O" />
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-h"><div className="title">{L('set_about')}</div></div>
          <div style={{ display: 'grid', gap: 8, fontSize: 12, color: 'var(--ink-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>System</span><span style={{ fontFamily: 'JetBrains Mono' }}>IEG-HVAC AI Control</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Firmware</span><span style={{ fontFamily: 'JetBrains Mono' }}>v 2.4.1 · 2026-05-12</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>AI Engine</span><span style={{ fontFamily: 'JetBrains Mono' }}>IEG-AI · core 1.6</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Serial</span><span style={{ fontFamily: 'JetBrains Mono' }}>IEG-HVAC-KR-00427</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Web</span><span style={{ fontFamily: 'JetBrains Mono' }}>www.ieg.kr</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
        <div className="card">
          <div className="card-h"><div className="title">Display</div></div>
          <div style={{ display: 'grid', gap: 14 }}>
            <SettingRow label={L('set_language')}>
              <div className="seg">
                <button className={tweaks.lang === 'en' ? 'active' : ''} onClick={() => setTweak('lang', 'en')}>EN</button>
                <button className={tweaks.lang === 'ko' ? 'active' : ''} onClick={() => setTweak('lang', 'ko')}>한국어</button>
              </div>
            </SettingRow>
            <SettingRow label={L('set_temp_unit')}>
              <div className="seg">
                <button className={tweaks.unit === 'C' ? 'active' : ''} onClick={() => setTweak('unit', 'C')}>°C</button>
                <button className={tweaks.unit === 'F' ? 'active' : ''} onClick={() => setTweak('unit', 'F')}>°F</button>
              </div>
            </SettingRow>
            <SettingRow label="System Version">
              <div className="seg">
                <button className={s.version === 'korea' ? 'active' : ''} onClick={() => set({ version: 'korea' })}>Korea</button>
                <button className={s.version === 'malaysia' ? 'active' : ''} onClick={() => set({ version: 'malaysia', mode: s.mode === 'heat' ? 'cool' : s.mode })}>Malaysia</button>
              </div>
            </SettingRow>
          </div>
        </div>

        <div className="card">
          <div className="card-h"><div className="title">Targets & Limits</div></div>
          <div style={{ display: 'grid', gap: 14 }}>
            <SliderRow label={L('a_setpoint')} unit="°C" min={16} max={30}
                       value={s.targetTemp} onChange={(v) => set({ targetTemp: v })} />
            <SliderRow label={L('a_targetRH')} unit="%" min={30} max={70}
                       value={s.targetRH} onChange={(v) => set({ targetRH: v })} />
            <SliderRow label={L('a_targetCO2')} unit="ppm" min={600} max={1500} step={50}
                       value={s.targetCO2} onChange={(v) => set({ targetCO2: v })} />
          </div>
        </div>

        <div className="card">
          <div className="card-h"><div className="title">{L('set_logging')}</div></div>
          <div style={{ display: 'grid', gap: 14 }}>
            <SettingRow label="Sample interval">
              <div className="seg">
                {['1s','5s','30s','1m'].map(v => (
                  <button key={v} className={v === '1s' ? 'active' : ''}>{v}</button>
                ))}
              </div>
            </SettingRow>
            <SettingRow label="Retention">
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--ink)' }}>30 days · 1.2 GB free</span>
            </SettingRow>
            <SettingRow label="Cloud sync">
              <Toggle on={true} onChange={() => {}} />
            </SettingRow>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({ k, v }) {
  return (
    <tr>
      <td style={{ color: 'var(--ink-3)' }}>{k}</td>
      <td className="num" style={{ textAlign: 'right' }}>{v}</td>
    </tr>
  );
}

function SettingRow({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 600 }}>{label}</span>
      {children}
    </div>
  );
}

Object.assign(window, { AlarmScreen, SettingsScreen });
