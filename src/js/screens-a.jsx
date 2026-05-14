// Screens part 1: Dashboard · Schematic · Mode Control
const { useState: useStateA, useEffect: useEffectA } = React;

// ── DASHBOARD ────────────────────────────────────────────────────────────
function DashboardScreen({ s, set, L }) {
  const last = (arr, n = 60) => arr.slice(-n);
  const off = !s.power;
  // When power=off: show '—' for values, empty array for sparklines
  const pv  = (fmt) => off ? '—' : fmt();
  const pd  = (arr) => off ? [] : last(arr);

  return (
    <div style={{ display: 'grid', gridTemplateRows: '106px 196px minmax(0, 1fr)', gap: 10, height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 9 }}>
        <StatCard compact tone="sky"   icon="thermo"  label={L('m_indoorTemp')}  value={pv(() => s.indoorTemp.toFixed(1))}  unit="°C"  sparkData={pd(s.hist.indoorTemp)}  sparkColor="#2A6FDB" foot={`${L('m_target')} ${s.targetTemp}°C`} />
        <StatCard compact tone="mint"  icon="drop"    label={L('m_indoorRH')}    value={pv(() => s.indoorRH.toFixed(1))}    unit="%"   sparkData={pd(s.hist.indoorRH)}    sparkColor="#1F8A5B" />
        <StatCard compact tone="peach" icon="co2"     label={L('m_co2')}         value={pv(() => String(Math.round(s.co2)))} unit="ppm" sparkData={pd(s.hist.co2)}        sparkColor="#D97757" />
        <StatCard compact tone="lilac" icon="bolt"    label={L('m_power')}       value={pv(() => s.powerKW.toFixed(2))}     unit="kW"  sparkData={pd(s.hist.powerKW)}     sparkColor="#6B5BD2" />
        <StatCard compact tone="lemon" icon="eq"      label={L('m_eer')}         value={pv(() => s.eer.toFixed(2))}         unit=""    sparkData={pd(s.hist.eer)}         sparkColor="#9C7B14" />
        <StatCard compact tone="rose"  icon="sun"     label={L('m_outdoorTemp')} value={pv(() => s.outdoorTemp.toFixed(1))} unit="°C"  sparkData={pd(s.hist.outdoorTemp)} sparkColor="#C0364E" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 10, minHeight: 0 }}>
        <div className="card" style={{ padding: 12 }}>
          <div className="card-h">
            <div className="title">{L('l_quickctl')}</div>
            <div className="seg" style={{ fontSize: 11 }}>
              {(['cool','heat','auto','off']).filter(m => !(s.version === 'malaysia' && m === 'heat')).map(m => (
                <button key={m} className={s.mode === m ? 'active' : ''} onClick={() => set({ mode: m })}>{L('mode_' + m)}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <SliderRow label={L('a_setpoint')} unit="°C" min={16} max={30} color={s.mode === 'heat' ? 'warm' : 'cool'} value={s.targetTemp} onChange={(v) => set({ targetTemp: v })} />
              <SliderRow label={L('a_fan')} unit="/5" min={0} max={5} value={s.fanSpeed} onChange={(v) => set({ fanSpeed: v })} />
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              <SliderRow label={L('a_targetRH')} unit="%" min={30} max={70} value={s.targetRH} onChange={(v) => set({ targetRH: v })} />
              <SliderRow label={L('a_targetCO2')} unit="ppm" min={600} max={1500} step={50} value={s.targetCO2} onChange={(v) => set({ targetCO2: v })} />
            </div>
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <ToggleLine on={s.humidifierOn}  onChange={v => set({ humidifierOn: v })}  label={L('c_humid')} />
            <ToggleLine on={s.airPurifierOn} onChange={v => set({ airPurifierOn: v })} label={L('c_purif')} />
            <ToggleLine on={s.ventilationOn} onChange={v => set({ ventilationOn: v })} label={L('mode_fan')} />
          </div>
        </div>

        <div className="card" style={{ padding: 12, minHeight: 0 }}>
          <div className="card-h">
            <div className="title">{L('c_compressor')}</div>
            <span className={`stat-trend ${s.compressorOn ? 'down' : 'flat'}`} style={{ padding: '2px 8px' }}>
              {off ? 'OFFLINE' : s.compressorOn ? L('s_run') : L('s_idle')}
            </span>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', padding: '2px 0 0 0' }}>
            <Donut value={s.compFreqHz} max={110} color={s.compressorOn ? '#2A6FDB' : '#B8C0CC'}
                   label={off ? '—' : `${s.compFreqHz.toFixed(0)}`} sub="Hz" size={108} />
          </div>
        </div>

        <div className="card" style={{ padding: 12, minHeight: 0 }}>
          <div className="card-h">
            <div className="title">{L('m_pm25')}</div>
            <span className={`stat-trend ${!off && s.pm25 < 35 ? 'down' : !off && s.pm25 < 75 ? 'flat' : 'up'}`} style={{ padding: '2px 8px' }}>
              {off ? 'OFFLINE' : s.pm25 < 35 ? 'Good' : s.pm25 < 75 ? 'Moderate' : 'Poor'}
            </span>
          </div>
          <div style={{ display: 'grid', placeItems: 'center', padding: '2px 0 0 0' }}>
            <Donut value={off ? 0 : Math.min(s.pm25, 120)} max={120}
                   color={off ? '#B8C0CC' : s.pm25 < 35 ? '#1F8A5B' : s.pm25 < 75 ? '#D97757' : '#C0364E'}
                   label={off ? '—' : s.pm25.toFixed(0)} sub="µg/m³" size={108} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 10, minHeight: 0 }}>
        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0 }}>
          <div className="card-h">
            <div className="title">{L('l_realtime')}</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
              <Legend dot="#2A6FDB" label={L('m_indoorTemp')} />
              <Legend dot="#1F8A5B" label={L('m_indoorRH')} />
              <Legend dot="#D97757" label={L('m_co2')} />
            </div>
          </div>
          {off
            ? <div style={{ display: 'grid', placeItems: 'center', color: 'var(--ink-4)', fontSize: 13, fontFamily: 'JetBrains Mono', gap: 6 }}>
                <div style={{ fontSize: 28, opacity: .3 }}>⏻</div>
                <div>전원 OFF — 신호 없음</div>
              </div>
            : <DualAxisChart hist={s.hist} L={L} />
          }
        </div>
        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0 }}>
          <div className="card-h">
            <div className="title">{L('nav_alarm')}</div>
            <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{s.alarms.length} {L('l_now').toLowerCase()}</span>
          </div>
          <div style={{ overflow: 'auto', display: 'grid', alignContent: 'start' }}>
            {s.alarms.length === 0 && (
              <div style={{ padding: 14, color: 'var(--ink-4)', fontSize: 12, textAlign: 'center' }}>
                <Icon name="check" size={20} stroke="var(--mint-d)" />
                <div style={{ marginTop: 4 }}>{L('ai_status_normal')}</div>
              </div>
            )}
            {s.alarms.map(a => (
              <div key={a.id + a.t} className={`alarm-row ${a.ack ? 'ack' : ''}`}>
                <span className={`sev ${a.sev}`}>{a.sev.toUpperCase()}</span>
                <span className="t">{L(a.id)}</span>
                <span className="when">{a.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ dot, label }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--ink-3)' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot }}></span>{label}
    </span>
  );
}

function ToggleLine({ on, onChange, label }) {
  return (
    <button className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)}
            style={{ background: 'transparent', border: 0, padding: 0 }}>
      <span className="sw"></span>
      <span style={{ color: 'var(--ink-2)', fontSize: 12, fontWeight: 600 }}>{label}</span>
    </button>
  );
}

function DualAxisChart({ hist, L }) {
  const N = 60;
  const t = hist.indoorTemp.slice(-N), rh = hist.indoorRH.slice(-N), co2 = hist.co2.slice(-N);
  const w = 800, h = 200, padL = 36, padR = 36, padT = 12, padB = 22;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const n = Math.max(t.length, 2);
  const xAt = i => padL + (i / (n - 1)) * plotW;
  const seriesPath = (arr, mn, mx) => {
    if (arr.length < 2) return '';
    const range = mx - mn || 1;
    const yAt = v => padT + plotH - ((v - mn) / range) * plotH;
    let s = `M ${xAt(0)} ${yAt(arr[0])}`;
    for (let i = 1; i < arr.length; i++) {
      const xp = xAt(i - 1), yp = yAt(arr[i - 1]), x = xAt(i), y = yAt(arr[i]), cx = (xp + x) / 2;
      s += ` C ${cx} ${yp}, ${cx} ${y}, ${x} ${y}`;
    }
    return s;
  };
  const tMin = 18, tMax = 30, co2Min = 400, co2Max = 1600, rhMin = 20, rhMax = 80;
  const yAtT = v => padT + plotH - ((v - tMin) / (tMax - tMin)) * plotH;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      {[18, 22, 26, 30].map(v => (
        <g key={v}>
          <line x1={padL} x2={w - padR} y1={yAtT(v)} y2={yAtT(v)} stroke="#E7EBF0" />
          <text x={padL - 6} y={yAtT(v) + 4} fontSize="10" textAnchor="end" fill="#8A93A4" fontFamily="JetBrains Mono">{v}°</text>
        </g>
      ))}
      {[600, 1000, 1400].map(v => (
        <text key={v} x={w - padR + 4} y={padT + plotH - ((v - co2Min) / (co2Max - co2Min)) * plotH + 4}
              fontSize="10" textAnchor="start" fill="#8A93A4" fontFamily="JetBrains Mono">{v}</text>
      ))}
      <path d={seriesPath(t, tMin, tMax)} fill="none" stroke="#2A6FDB" strokeWidth="2" />
      <path d={seriesPath(rh, rhMin, rhMax)} fill="none" stroke="#1F8A5B" strokeWidth="2" opacity="0.85" />
      <path d={seriesPath(co2, co2Min, co2Max)} fill="none" stroke="#D97757" strokeWidth="2" opacity="0.85" />
    </svg>
  );
}

// ── SCHEMATIC ────────────────────────────────────────────────────────────
function SchematicScreen({ s, set, L, onPick }) {
  const isKorea = s.version === 'korea';
  const flow    = s.compressorOn || s.heaterOn;
  const heat    = s.heaterOn || s.fourWayValve === 'heat';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 244px', gridTemplateRows: 'minmax(0, 1fr) auto', gap: 8, height: '100%', overflow: 'hidden' }}>
      {/* ── SVG schematic ── */}
      <div className="card" style={{ gridColumn: '1', gridRow: '1', padding: 0, overflow: 'visible', display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0 }}>
        <div className="card-h" style={{ padding: '6px 10px 0' }}>
          <div>
            <div className="title">{L('nav_schematic')} — {isKorea ? 'KOREA' : 'MALAYSIA'} · {L('mode_' + s.mode).toUpperCase()}</div>
            <div style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 2 }}>Click any component to view its principle</div>
          </div>
          <div style={{ display: 'flex', gap: 6, fontSize: 9.5 }}>
            <Legend dot="#D97757" label="Hot gas / High-P" />
            <Legend dot="#2A6FDB" label="Liquid / Low-P" />
            <Legend dot="#1F8A5B" label="Air flow" />
          </div>
        </div>
        <div style={{ padding: '0 6px 6px', minHeight: 0 }}>
          <SchematicSVG s={s} isKorea={isKorea} flow={flow} heat={heat} L={L} onPick={onPick} />
        </div>
      </div>

      {/* ── Right: operation + outdoor status ── */}
      <div style={{ gridColumn: '2', gridRow: '1', minHeight: 0 }}>
        <SchematicControlPanel s={s} set={set} L={L} isKorea={isKorea} sections={['control', 'status']} />
      </div>

      {/* ── Below schematic flow (left column only) ── */}
      <div style={{ gridColumn: '1', gridRow: '2', minHeight: 0 }}>
        <SchematicControlPanel s={s} set={set} L={L} isKorea={isKorea} sections={['accessories']} layout="horizontal" />
      </div>
    </div>
  );
}

// ── SCHEMATIC CONTROL PANEL (right side) ─────────────────────────────────
function SchematicControlPanel({ s, set, L, isKorea, sections = ['control', 'status', 'accessories'], layout = 'vertical' }) {
  const compRun = s.compressorOn;
  const T_disc  = compRun ? `${(s.outdoorTemp + 30).toFixed(0)}°C` : '—';
  const T_cond  = compRun ? `${(s.outdoorTemp + 14).toFixed(0)}°C` : '—';
  const T_evap  = compRun ? `${(s.indoorTemp  -  8).toFixed(1)}°C` : '—';
  const P_hi    = compRun ? `${(s.outdoorTemp / 10 + 3.1).toFixed(1)} MPa` : '—';
  const P_lo    = compRun ? `${(s.indoorTemp / 25  + 0.58).toFixed(2)} MPa` : '—';
  const exvPct  = compRun ? `${(s.exvOpenPct ?? 35).toFixed(0)}%` : '—';
  const sh      = compRun ? `${(s.superheat ?? 5.5).toFixed(1)}°C` : '—';
  const sc      = compRun ? `${(s.subcooling ?? 3.0).toFixed(1)}°C` : '—';

  const SecHead = ({ title, sub, color }) => (
    <div style={{ borderLeft: `4px solid ${color}`, paddingLeft: 10, marginBottom: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: '.06em', textTransform: 'uppercase' }}>{title}</div>
      <div style={{ fontSize: 10, color: 'var(--ink-4)' }}>{sub}</div>
    </div>
  );

  const LiveRow = ({ label, value, color, mono = true }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '5px 0', borderBottom: '1px solid var(--line-soft)' }}>
      <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600 }}>{label}</span>
      <span style={{ fontFamily: mono ? 'JetBrains Mono' : 'inherit', fontWeight: 700,
                     fontSize: 13, color: color || 'var(--ink)' }}>{value}</span>
    </div>
  );

  const FanBtn = ({ lv }) => (
    <button onClick={() => set({ fanSpeed: lv })}
            style={{
              flex: 1, height: 32, borderRadius: 7, fontWeight: 700, fontSize: 11,
              fontFamily: 'JetBrains Mono',
              background: lv <= s.fanSpeed && s.fanSpeed > 0 ? '#F6EDC8' : '#F1F4F8',
              border: '1px solid ' + (s.fanSpeed === lv ? '#D6BB55' : 'var(--line)'),
              color: lv <= s.fanSpeed && s.fanSpeed > 0 ? '#9C7B14' : 'var(--ink-4)',
              boxShadow: s.fanSpeed === lv ? `0 0 0 2px #D6BB5540` : 'none',
            }}>{lv}</button>
  );

  const accessoriesHorizontal = sections.length === 1 && sections[0] === 'accessories' && layout === 'horizontal';

  return (
    <div style={{ display: 'grid', gap: 6, alignContent: 'start', overflow: 'auto', height: '100%' }}>

      {sections.includes('control') && (
      <div className="card" style={{ padding: '9px 9px 8px' }}>
        <SecHead title="운전 제어" sub="Operation Control" color="#6B5BD2" />

        {/* Mode */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-4)', fontWeight: 600, letterSpacing: '.04em', marginBottom: 6, textTransform: 'uppercase' }}>모드</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {['cool','heat','auto','dry','fan','off'].filter(m => !(!isKorea && m === 'heat')).map(m => {
              const col = { cool:'#2A6FDB', heat:'#D97757', auto:'#1F8A5B', dry:'#6B5BD2', fan:'#9C7B14', off:'#8A93A4' }[m];
              const active = s.mode === m;
              return (
                <button key={m} onClick={() => set({ mode: m })}
                        style={{
                          height: 29, borderRadius: 8, fontSize: 10, fontWeight: 700,
                          background: active ? col + '18' : '#F7F9FB',
                          border: `1.5px solid ${active ? col : 'var(--line)'}`,
                          color: active ? col : 'var(--ink-3)',
                        }}>{L('mode_' + m)}</button>
              );
            })}
          </div>
        </div>

        {/* Setpoint */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10.5, color: 'var(--ink-4)', fontWeight: 600, letterSpacing: '.04em', marginBottom: 6, textTransform: 'uppercase' }}>설정 온도 Setpoint</div>
          <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 36px', gap: 8, alignItems: 'center' }}>
            <button className="btn" style={{ height: 32, padding: 0, justifyContent: 'center', borderRadius: 9 }}
                    onClick={() => set({ targetTemp: Math.max(16, s.targetTemp - 1) })}>
              <Icon name="minus" size={16} />
            </button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 700, lineHeight: 1,
                            color: s.mode === 'heat' ? '#D97757' : '#2A6FDB' }}>
                {s.targetTemp}<span style={{ fontSize: 14, marginLeft: 2, color: 'var(--ink-3)' }}>°C</span>
              </div>
              <input type="range" className="slider" min={16} max={30} step={1} value={s.targetTemp}
                     onChange={e => set({ targetTemp: Number(e.target.value) })}
                     style={{ marginTop: 6, width: '100%' }} />
            </div>
            <button className="btn" style={{ height: 32, padding: 0, justifyContent: 'center', borderRadius: 9 }}
                    onClick={() => set({ targetTemp: Math.min(30, s.targetTemp + 1) })}>
              <Icon name="plus" size={16} />
            </button>
          </div>
        </div>

        {/* Fan speed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 10.5, color: 'var(--ink-4)', fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase' }}>팬 속도 Fan Speed</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 13, color: '#9C7B14' }}>
              L{s.fanSpeed} · {(s.fanSpeed * 280).toFixed(0)} CMM
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[0,1,2,3,4,5].map(lv => <FanBtn key={lv} lv={lv} />)}
          </div>
        </div>
      </div>
      )}

      {sections.includes('status') && (
      <div className="card" style={{ padding: '9px 9px 8px' }}>
        <SecHead title="실외기 상태" sub="Outdoor Unit — live" color="#D97757" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div style={{
            background: compRun ? '#EBF4FF' : '#F7F9FB',
            borderRadius: 10, padding: '10px 12px',
            border: `1.5px solid ${compRun ? '#2A6FDB40' : 'var(--line-soft)'}`,
          }}>
            <div style={{ fontSize: 9.5, color: 'var(--ink-4)', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 4 }}>압축기 Comp.</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 19, color: compRun ? '#2A6FDB' : '#B8C0CC', lineHeight: 1 }}>
              {s.compFreqHz.toFixed(0)}<span style={{ fontSize: 11, fontWeight: 400, marginLeft: 2 }}>Hz</span>
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--ink-4)', marginTop: 3 }}>{s.powerKW.toFixed(2)} kW</div>
          </div>
          <div style={{
            background: compRun ? '#FFF5F0' : '#F7F9FB',
            borderRadius: 10, padding: '10px 12px',
            border: `1.5px solid ${compRun ? '#D9775740' : 'var(--line-soft)'}`,
          }}>
            <div style={{ fontSize: 9.5, color: 'var(--ink-4)', fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 4 }}>응축기 Cond.</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 19, color: compRun ? '#D97757' : '#B8C0CC', lineHeight: 1 }}>
              {T_cond}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--ink-4)', marginTop: 3 }}>{P_hi} ↑</div>
          </div>
        </div>

        <LiveRow label="토출 온도 T_disc"    value={T_disc} color={compRun ? '#D97757' : 'var(--ink-4)'} />
        <LiveRow label="흡입 온도 T_suct"    value={compRun ? `${(s.indoorTemp - 5).toFixed(1)}°C` : '—'} color={compRun ? '#2A6FDB' : 'var(--ink-4)'} />
        <LiveRow label="저압 P_lo"           value={P_lo}   color={compRun ? '#2A6FDB' : 'var(--ink-4)'} />
        <LiveRow label="EXV 개도"            value={exvPct} color={compRun ? '#9C7B14' : 'var(--ink-4)'} />
        <LiveRow label="과열도 SH"           value={sh}     color={compRun ? '#6B5BD2' : 'var(--ink-4)'} />
        <LiveRow label="과냉각도 SC"         value={sc}     color={compRun ? '#6B5BD2' : 'var(--ink-4)'} />
        <LiveRow label="증발 온도 T_evap"    value={T_evap} color={compRun ? '#2A6FDB' : 'var(--ink-4)'} />
      </div>
      )}

      {sections.includes('accessories') && (
      <div className="card" style={{ padding: accessoriesHorizontal ? '8px 10px' : '9px 9px 8px' }}>
        <SecHead title="부속 장치" sub="Accessories Control" color="#1F8A5B" />

        {accessoriesHorizontal ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 1.05fr 1.2fr', gap: 10, alignItems: 'start' }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7,
                                background: s.humidifierOn && s.power ? '#DCF1E6' : '#F1F4F8',
                                color: s.humidifierOn && s.power ? '#1F8A5B' : 'var(--ink-4)',
                                display: 'grid', placeItems: 'center' }}>
                    <Icon name="drop" size={13} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: s.humidifierOn && s.power ? '#1F8A5B' : 'var(--ink-3)' }}>{L('c_humid')}</span>
                </div>
                <Toggle on={s.humidifierOn} onChange={v => set({ humidifierOn: v })} />
              </div>
              {s.humidifierOn && s.power && (
                <SliderRow label={`RH ${s.targetRH}%`} unit="%" min={30} max={70} step={5}
                           value={s.targetRH} onChange={v => set({ targetRH: v })} />
              )}
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7,
                                background: s.airPurifierOn && s.power ? '#E8E2F4' : '#F1F4F8',
                                color: s.airPurifierOn && s.power ? '#6B5BD2' : 'var(--ink-4)',
                                display: 'grid', placeItems: 'center' }}>
                    <Icon name="purifier" size={13} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: s.airPurifierOn && s.power ? '#6B5BD2' : 'var(--ink-3)' }}>{L('c_purif')}</span>
                </div>
                <Toggle on={s.airPurifierOn} onChange={v => set({ airPurifierOn: v })} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'JetBrains Mono' }}>PM2.5 {s.pm25.toFixed(0)} µg/m³</div>
            </div>

            <div style={{ display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 7,
                                background: s.ventilationOn && s.power ? '#FBE3D5' : '#F1F4F8',
                                color: s.ventilationOn && s.power ? '#D97757' : 'var(--ink-4)',
                                display: 'grid', placeItems: 'center' }}>
                    <Icon name="fan" size={13} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: s.ventilationOn && s.power ? '#D97757' : 'var(--ink-3)' }}>Ventilation</span>
                </div>
                <Toggle on={s.ventilationOn} onChange={v => set({ ventilationOn: v })} />
              </div>
              {s.ventilationOn && s.power ? (
                <SliderRow label={`CO₂ ${s.targetCO2} ppm`} unit="ppm" min={600} max={1500} step={50}
                           value={s.targetCO2} onChange={v => set({ targetCO2: v })} />
              ) : (
                <div style={{ fontSize: 11, color: 'var(--ink-3)', fontFamily: 'JetBrains Mono' }}>{Math.round(s.co2)} ppm</div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Humidifier */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7,
                                background: s.humidifierOn && s.power ? '#DCF1E6' : '#F1F4F8',
                                color: s.humidifierOn && s.power ? '#1F8A5B' : 'var(--ink-4)',
                                display: 'grid', placeItems: 'center' }}>
                    <Icon name="drop" size={14} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.humidifierOn && s.power ? '#1F8A5B' : 'var(--ink-3)' }}>
                    {L('c_humid')}
                  </span>
                </div>
                <Toggle on={s.humidifierOn} onChange={v => set({ humidifierOn: v })} />
              </div>
              {s.humidifierOn && s.power && (
                <SliderRow label={`RH 목표 ${s.targetRH}%`} unit="%" min={30} max={70} step={5}
                           value={s.targetRH} onChange={v => set({ targetRH: v })} />
              )}
            </div>

            {/* Air purifier */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7,
                                background: s.airPurifierOn && s.power ? '#E8E2F4' : '#F1F4F8',
                                color: s.airPurifierOn && s.power ? '#6B5BD2' : 'var(--ink-4)',
                                display: 'grid', placeItems: 'center' }}>
                    <Icon name="purifier" size={14} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.airPurifierOn && s.power ? '#6B5BD2' : 'var(--ink-3)' }}>
                    {L('c_purif')} · PM2.5 {s.pm25.toFixed(0)} µg/m³
                  </span>
                </div>
                <Toggle on={s.airPurifierOn} onChange={v => set({ airPurifierOn: v })} />
              </div>
            </div>

            {/* Ventilation */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: s.ventilationOn ? 6 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7,
                                background: s.ventilationOn && s.power ? '#FBE3D5' : '#F1F4F8',
                                color: s.ventilationOn && s.power ? '#D97757' : 'var(--ink-4)',
                                display: 'grid', placeItems: 'center' }}>
                    <Icon name="fan" size={14} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.ventilationOn && s.power ? '#D97757' : 'var(--ink-3)' }}>
                    환기 Ventilation · {Math.round(s.co2)} ppm
                  </span>
                </div>
                <Toggle on={s.ventilationOn} onChange={v => set({ ventilationOn: v })} />
              </div>
              {s.ventilationOn && s.power && (
                <SliderRow label={`CO₂ 한계 ${s.targetCO2} ppm`} unit="ppm" min={600} max={1500} step={50}
                           value={s.targetCO2} onChange={v => set({ targetCO2: v })} />
              )}
            </div>
          </>
        )}
      </div>
      )}
    </div>
  );
}

// ── SCHEMATIC SVG ─────────────────────────────────────────────────────────
function SchematicSVG({ s, isKorea, flow, heat, L, onPick }) {
  const compRun  = s.compressorOn;
  const fanSpd   = s.fanSpeed;
  const heating  = isKorea && heat;
  const exvOpen  = (s.exvOpenPct  ?? 35).toFixed(0);
  const sh       = (s.superheat   ?? 5.5).toFixed(1);
  const sc       = (s.subcooling  ?? 3.0).toFixed(1);

  const T_evap = compRun ? `${(s.indoorTemp  - 8).toFixed(1)}°C`  : '—';
  const T_cond = compRun ? `${(s.outdoorTemp + 14).toFixed(0)}°C` : '—';
  const T_disc = compRun ? `${(s.outdoorTemp + 30).toFixed(0)}°C` : '—';
  const P_hi   = compRun ? `${(s.outdoorTemp / 10 + 3.1).toFixed(1)}` : '—';
  const P_lo   = compRun ? `${(s.indoorTemp / 25 + 0.58).toFixed(2)}` : '—';

  const fanAnim  = fanSpd > 0 ? `fanSpin ${Math.max(0.4, 1.8 - fanSpd / 5 * 1.3)}s linear infinite` : 'none';
  const condAnim = compRun ? 'fanSpin 0.9s linear infinite' : 'none';
  const pc = color => `pipe ${color}${flow ? ' run' : ''}`;

  // ── helpers ──
  const Hit = ({ comp, x, y, w, h }) => (
    <g style={{ cursor: 'pointer' }} onClick={() => onPick && onPick(comp)}>
      <rect x={x} y={y} width={w} height={h} fill="transparent" />
    </g>
  );

  // Measurement point pin (numbered circle)
  const Pin = ({ x, y, n }) => (
    <g>
      <circle cx={x} cy={y} r={11} fill="#0F2D55" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize={9} fill="#fff" fontWeight={700}>{n}</text>
    </g>
  );

  // Text with white background pill — key fix for text overlaps
  const Tag = ({ x, y, text, bg = '#fff', color = 'var(--ink-3)', mono = false, bold = false, size = 9.5 }) => {
    const ew = text.length * (mono ? 6.8 : 6.4) + 8;
    return (
      <g>
        <rect x={x - ew / 2} y={y - 10} width={ew} height={14} rx={3} fill={bg} opacity={0.92} />
        <text x={x} y={y} textAnchor="middle" fontSize={size} fill={color}
              fontFamily={mono ? 'JetBrains Mono' : 'inherit'}
              fontWeight={bold ? 700 : 400}>{text}</text>
      </g>
    );
  };

  // Fin-tube coil — fin sheets + tube cross-section circles
  const Coil = ({ x, y, w, h, active, cols = 7, rows = 3 }) => {
    const cw = (w - 10) / cols, ch = (h - 10) / rows;
    const ac  = active ? '#2A6FDB' : '#B8C0CC';
    const bg  = active ? '#E5F0FF' : '#F7F9FB';
    const tc  = active ? '#1B55B0' : '#8A93A4'; // tube fill
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} rx={5} fill={bg} stroke={ac} strokeWidth={1.5} />
        {/* fin sheets — vertical lines */}
        {Array.from({ length: cols + 1 }, (_, i) => (
          <line key={`v${i}`} x1={x + 5 + i * cw} y1={y + 4} x2={x + 5 + i * cw} y2={y + h - 4}
                stroke={ac} strokeWidth={0.8} opacity={0.35} />
        ))}
        {/* tube cross-sections — circles at each grid intersection */}
        {Array.from({ length: rows }, (_, j) =>
          Array.from({ length: cols }, (_, i) => {
            const cx = x + 5 + (i + 0.5) * cw, cy = y + 5 + (j + 0.5) * ch;
            return (
              <g key={`t${j}-${i}`}>
                <circle cx={cx} cy={cy} r={Math.min(cw, ch) * 0.32} fill="#fff" stroke={ac} strokeWidth={1.2} />
                <circle cx={cx} cy={cy} r={Math.min(cw, ch) * 0.16} fill={tc} />
              </g>
            );
          })
        )}
      </g>
    );
  };

  // Axial fan — 4 swept blades with highlight + central hub
  const FanBlade = ({ r, color = '#7A8FAD' }) => {
    const hi = color === '#9AAAC0' ? '#B8C8D8' : '#8ABAEE';
    return (
      <g>
        {[0, 90, 180, 270].map(a => (
          <g key={a} transform={`rotate(${a})`}>
            <path d={`M0,${-r * 0.14} Q${r * 0.28},${-r * 0.45} ${r * 0.12},${-r * 0.88} Q${-r * 0.18},${-r * 0.72} ${-r * 0.08},${-r * 0.3} Z`}
                  fill={color} opacity={0.92} />
            <path d={`M${r * 0.04},${-r * 0.22} Q${r * 0.16},${-r * 0.44} ${r * 0.1},${-r * 0.72}`}
                  stroke={hi} strokeWidth={1.2} fill="none" opacity={0.7} strokeLinecap="round" />
          </g>
        ))}
        <circle r={r * 0.16} fill="#6B7A90" />
        <circle r={r * 0.08} fill="#3D4A58" />
      </g>
    );
  };

  return (
    <svg className="schem-svg" viewBox="-28 -24 980 548" preserveAspectRatio="xMidYMin meet">
      <style>{`
        @keyframes fanSpin { to { transform: rotate(360deg); } }
        @keyframes flowDash { to { stroke-dashoffset: -24; } }
        @keyframes airPuff  { 0%{opacity:0;transform:translateX(-14px)} 50%{opacity:1} 100%{opacity:0;transform:translateX(14px)} }
        .schem-svg .lbl      { font-size:11px; fill:#5B6577; font-weight:700; letter-spacing:.04em; }
        .schem-svg .lbl-sub  { fill:#8A93A4; }
        .schem-svg .node-bg  { fill:#F4F7FB; stroke:#D9DEE5; stroke-width:1.5; }
        .schem-svg .pin-bg   { fill:#0F2D55; }
        .schem-svg .lbl-num  { fill:#fff; font-weight:700; }
        .schem-svg .pipe      { fill:none; stroke-width:4.5; stroke-linecap:round; stroke-linejoin:round; }
        .schem-svg .pipe.hot  { stroke:#D97757; }
        .schem-svg .pipe.cold { stroke:#2A6FDB; }
        .schem-svg .pipe-glow { fill:none; stroke-linecap:round; stroke-linejoin:round; }
        .schem-svg .pipe-glow.hot  { stroke:#D97757; stroke-width:12; opacity:.18; }
        .schem-svg .pipe-glow.cold { stroke:#2A6FDB; stroke-width:12; opacity:.18; }
        .schem-svg .pipe.run  { stroke-dasharray:14 7; animation:flowDash 0.7s linear infinite; }
        .schem-svg .pipe.hot.run  { stroke-dasharray:14 7; animation:flowDash 0.7s linear infinite; }
        .schem-svg .pipe.cold.run { stroke-dasharray:14 7; animation:flowDash 1.1s linear infinite reverse; }
      `}</style>

      {/* ─── OUTDOOR UNIT ─────────────────────────────────────────── */}
      <rect className="node-bg" x="6" y="6" width="218" height="448" rx="12" />
      <rect className="node-bg" x="442" y="6" width="458" height="448" rx="12" />

      {/* ─── REFRIGERANT PIPES — drawn first so component graphics & Tags render on top ─── */}
      {/* glow shadows */}
      <path className="pipe-glow hot"
            d={isKorea ? 'M 58,306 L 58,18 L 488,18 L 488,70'
                       : 'M 58,306 L 58,18 L 704,18 L 704,70'} />
      <path className={`pipe-glow ${heating ? 'hot' : 'cold'}`}
            d="M 170,364 L 170,442 L 704,442 L 704,122" />
      <path className="pipe-glow cold"
            d="M 442,122 L 310,122 L 310,395 L 96,395 L 96,378" />
      {/* actual pipe lines */}
      <path className={pc('hot')}
            d={isKorea ? 'M 58,306 L 58,18 L 488,18 L 488,70'
                       : 'M 58,306 L 58,18 L 704,18 L 704,70'} />
      <path className={pc(heating ? 'hot' : 'cold')}
            d="M 170,364 L 170,442 L 704,442 L 704,122" />
      <path className={pc('cold')}
            d="M 442,122 L 310,122 L 310,395 L 96,395 L 96,378"
            opacity="0.9" />

      {/* Header — y=30 clears the hot-gas pipe glow at y=18 */}
      <text x="115" y="30" textAnchor="middle" className="lbl">OUTDOOR UNIT</text>
      <Pin x={36} y={48} n="①" />
      <Tag x={96} y={48} text={s.power ? `${s.outdoorTemp.toFixed(1)}°C 외기` : '— 외기'} bg="#FFF3EC" color={s.power ? '#D97757' : '#8A93A4'} mono bold />

      {/* Condenser fan ── circle center at (115, 100) r=54 */}
      <g transform="translate(115,100)">
        {/* outer casing + guard rings */}
        <circle r="56" fill="#DDE2E9" stroke="#B0BAC5" strokeWidth="2" />
        <circle r="54" fill="#EEF1F4" stroke="#C8D0D9" strokeWidth="1" />
        {[38, 24].map(gr => <circle key={gr} r={gr} fill="none" stroke="#C8D0D9" strokeWidth={0.7} strokeDasharray="2 4" />)}
        <g style={{ transformOrigin: '0 0', animation: condAnim }}>
          <FanBlade r={46} color={compRun ? '#5A7FAD' : '#9AAAC0'} />
        </g>
        {/* motor hub */}
        <circle r="10" fill="#5A6578" stroke="#3D4A58" strokeWidth="1.5" />
        <circle r="5"  fill="#2D3748" />
      </g>
      {/* Fan labels — safely below circle (circle bottom at y=154) */}
      <text x="115" y="166" textAnchor="middle" className="lbl-sub" fontSize={9.5}>Cond. Fan</text>
      <Tag x={115} y={179} text={compRun ? '1500 CMM' : 'STOP'} bg={compRun ? '#E5F0FF' : '#F1F4F8'} color={compRun ? '#2A6FDB' : '#8A93A4'} mono bold />

      {/* Condenser coil — y starts at 192 */}
      <Coil x={20} y={192} w={178} h={56} active={compRun} cols={8} rows={3} />
      {/* HIGH-P overlay inside coil — right margin, white pill renders on top */}
      <Tag x={179} y={218} text={`${P_hi} MPa HIGH-P`} bg={compRun ? '#FFF0E8' : '#F1F4F8'} color={compRun ? '#D97757' : '#8A93A4'} mono size={8} />
      {/* Labels below coil */}
      <text x="109" y="259" textAnchor="middle" className="lbl-sub" fontSize={9.5}>Condenser Coil</text>
      <Tag x={109} y={271} text={T_cond} bg={compRun ? '#FFF0E8' : '#F1F4F8'} color={compRun ? '#D97757' : '#8A93A4'} mono bold size={10} />

      {/* Compressor — hermetic scroll dome */}
      <Pin x={58} y={284} n="②" />
      {/* dome body */}
      <rect x="22" y="320" width="74" height="58" rx="4"
            fill={compRun ? '#D6E8FF' : '#EAEEF3'} stroke={compRun ? '#2A6FDB' : '#9AAAC0'} strokeWidth="2" />
      <ellipse cx="59" cy="320" rx="37" ry="14"
               fill={compRun ? '#C0DAFF' : '#DDE2E9'} stroke={compRun ? '#2A6FDB' : '#9AAAC0'} strokeWidth="2" />
      {/* top terminal box */}
      <rect x="45" y="306" width="28" height="9" rx="2"
            fill={compRun ? '#2A6FDB' : '#8A93A4'} />
      {/* "COMP" name inside dome cap */}
      <text x="59" y="319" textAnchor="middle" fontSize={8.5} fontWeight={800} letterSpacing=".08em"
            fill={compRun ? '#0F3D7A' : '#7A8FAD'}>COMP</text>
      {/* scroll symbol inside dome body */}
      <g transform="translate(59,348)">
        <path d="M0,-13 Q11,-13 13,0 Q13,11 0,13 Q-11,13 -13,0"
              fill="none" stroke={compRun ? '#1B55B0' : '#B8C0CC'} strokeWidth="2"
              style={{ animation: compRun ? 'flowDash 1.0s linear infinite reverse' : 'none' }}
              strokeDasharray={compRun ? '5 3' : '0'} />
        <path d="M0,-7 Q6,-7 7,0 Q7,6 0,7 Q-6,7 -7,0"
              fill="none" stroke={compRun ? '#1B55B0' : '#B8C0CC'} strokeWidth="1.5" />
        <circle r="3" fill={compRun ? '#2A6FDB' : '#B8C0CC'} />
      </g>
      {/* corner bolts */}
      {[[26,324],[88,324],[26,374],[88,374]].map(([bx,by],i) => (
        <circle key={i} cx={bx} cy={by} r="3.5" fill="#7A8FAD" stroke="#5A6880" strokeWidth="1" />
      ))}
      {/* Hz and kW — in the space between dome bottom (y=378) and suction pipe (y=390) */}
      <text x="59" y="388" textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fontWeight={700}
            fill={compRun ? '#2A6FDB' : '#8A93A4'}>{s.compFreqHz.toFixed(0)} Hz</text>
      <text x="59" y="399" textAnchor="middle" fontFamily="JetBrains Mono" fontSize={9} fill="var(--ink-4)">{s.powerKW.toFixed(2)} kW</text>
      {/* component name label — clearly identifies what shows Hz */}
      <text x="59" y="411" textAnchor="middle" className="lbl-sub" fontSize={9}>Scroll Comp.</text>
      {/* T_disc — to the right of dome, below Pin ② */}
      <Tag x={147} y={325} text={`↑ ${T_disc}`} bg={compRun ? '#FFF0E8' : '#F1F4F8'} color={compRun ? '#D97757' : '#8A93A4'} mono bold />
      <text x="147" y="335" textAnchor="middle" fontSize={8} fill={compRun ? '#D97757' : '#C8D0D9'}>Discharge</text>

      {/* EXV — center (170, 345) */}
      <Pin x={170} y={286} n="③" />
      <g transform="translate(170,340)">
        {/* actuator motor cap */}
        <rect x="-12" y="-40" width="24" height="18" rx="4"
              fill={compRun ? '#D97757' : '#B8C0CC'} stroke={compRun ? '#B05A38' : '#8A93A4'} strokeWidth="1.5" />
        <line x1="-6" y1="-36" x2="-6" y2="-26" stroke="rgba(255,255,255,0.5)" strokeWidth={1} />
        {/* pipe flange above */}
        <rect x="-7" y="-24" width="14" height="6" rx="1" fill={compRun ? '#E8A07A' : '#CDD3DB'} />
        {/* valve body — diamond */}
        <polygon points="0,-18 20,0 0,18 -20,0"
                 fill="#fff" stroke={compRun ? '#D97757' : '#B8C0CC'} strokeWidth="2" />
        <polygon points="0,-8 8,0 0,8 -8,0"
                 fill={compRun ? '#D97757' : '#B8C0CC'} />
        {/* pipe flange below */}
        <rect x="-7" y="18" width="14" height="6" rx="1" fill={compRun ? '#E8A07A' : '#CDD3DB'} />
      </g>
      {/* EXV labels — RIGHT side of diamond to avoid suction pipe at y=390 */}
      <text x="200" y="340" textAnchor="start" className="lbl-sub" fontSize={9.5}>EXV</text>
      <Tag x={207} y={353} text={`${exvOpen}%`} bg={compRun ? '#FFF0E8' : '#F1F4F8'} color={compRun ? '#D97757' : '#8A93A4'} mono bold />
      {/* Low pressure — above suction pipe at y=390, with clear gap */}
      <Tag x={136} y={372} text={`${P_lo} MPa`} bg={compRun ? '#EEF5FF' : '#F1F4F8'} color={compRun ? '#2A6FDB' : '#8A93A4'} mono />
      <text x="136" y="382" textAnchor="middle" fontSize={8} fill={compRun ? '#2A6FDB' : '#C8D0D9'}>LOW-P ↓</text>

      {/* ─── INDOOR UNIT ─────────────────────────────────────── translate(434,0) */}
      <g transform="translate(434,0)">
        <text x="237" y="30" textAnchor="middle" className="lbl">INDOOR UNIT</text>

        {/* Pin row — y=38: top at y=27 (clears glow y=24), bottom at y=49 (clears box y=52) */}
        {isKorea && <Pin x={54}  y={38} n="⑥" />}   {/* 4-way */}
        {isKorea && <Pin x={156} y={38} n="⑤" />}   {/* PTC */}
        <Pin x={270} y={38} n="④" />                 {/* Evap */}
        <Pin x={420} y={38} n="⑧" />                 {/* Blower */}

        {/* 4-Way Valve — Korea only, box x=16-92, center y=105 */}
        {isKorea && (
          <g>
            <rect x="16" y="52" width="76" height="70" rx="8"
                  fill="#fff" stroke={heating ? '#D97757' : '#2A6FDB'} strokeWidth="2" />
            <g transform="translate(54,86)">
              <circle r="17" fill="none" stroke={heating ? '#D97757' : '#2A6FDB'} strokeWidth="1.5" />
              <path d={heating ? 'M-11,-4 L11,-4' : 'M-11,4 L11,4'}
                    stroke={heating ? '#D97757' : '#2A6FDB'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d={heating ? 'M-5,6 L5,6' : 'M-5,-6 L5,-6'}
                    stroke={heating ? '#D97757' : '#2A6FDB'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
            <text x="54" y="133" textAnchor="middle" className="lbl-sub" fontSize={9.5}>4-Way Valve</text>
            <Tag x={54} y={146} text={heating ? 'HEAT' : 'COOL'} bg={heating ? '#FFF0E8' : '#EEF5FF'} color={heating ? '#D97757' : '#2A6FDB'} mono bold />
          </g>
        )}

        {/* PTC Heater — Korea only, box x=102-208, center y=105 */}
        {isKorea && (
          <g>
            <rect x="102" y="52" width="108" height="70" rx="8"
                  fill="#fff" stroke={s.heaterOn ? '#D97757' : '#C8D0D9'} strokeWidth="2" />
            <g transform="translate(156,86)">
              <path d="M-40,0 L-28,-14 L-16,14 L-4,-14 L8,14 L20,-14 L32,14 L40,0"
                    stroke={s.heaterOn ? '#D97757' : '#C8D0D9'} strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {s.heaterOn && [-24, -8, 8, 24].map((dx, i) => (
                <line key={i} x1={dx} y1="18" x2={dx} y2="28" stroke="#D97757" strokeWidth="1.5" opacity="0.7"
                      style={{ animation: `airPuff ${1.1 + i * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.18}s` }} />
              ))}
            </g>
            <text x="156" y="133" textAnchor="middle" className="lbl-sub" fontSize={9.5}>PTC Heater</text>
            <Tag x={156} y={146} text={s.heaterOn ? '3.0 kW' : 'OFF'} bg={s.heaterOn ? '#FFF0E8' : '#F1F4F8'} color={s.heaterOn ? '#D97757' : '#8A93A4'} mono bold />
          </g>
        )}

        {/* Malaysia only: visible suction segment from evap left (x=216) to unit wall (x=8) */}
        {!isKorea && (
          <path fill="none" stroke="#2A6FDB" strokeWidth="4.5" strokeLinecap="round"
                strokeDasharray={flow ? '14 7' : '0'}
                style={flow ? { animation: 'flowDash 1.1s linear infinite reverse' } : {}}
                d="M 216,122 L 8,122" opacity="0.9" />
        )}

        {/* Evaporator — coil x=216-354, center 285 */}
        <Coil x={216} y={52} w={138} h={70} active={compRun} cols={8} rows={3} />
        <text x="285" y="133" textAnchor="middle" className="lbl-sub" fontSize={9.5}>Evaporator</text>
        <Tag x={285} y={146} text={T_evap}                   bg={compRun ? '#EEF5FF' : '#F1F4F8'} color={compRun ? '#2A6FDB' : '#8A93A4'} mono bold />
        <Tag x={285} y={161} text={`SH ${compRun ? sh : '—'}°C`} bg="#F7F9FB" color="var(--ink-4)" mono />

        {/* Blower fan — center (420, 155) */}
        <g transform="translate(420,140)">
          <circle r="50" fill="#DDE2E9" stroke="#B0BAC5" strokeWidth="2" />
          <circle r="48" fill="#EEF1F4" stroke="#C8D0D9" strokeWidth="1" />
          {[32, 20].map(gr => <circle key={gr} r={gr} fill="none" stroke="#C8D0D9" strokeWidth={0.7} strokeDasharray="2 4" />)}
          <g style={{ transformOrigin: '0 0', animation: fanAnim }}>
            <FanBlade r={40} color={fanSpd > 0 ? '#6A9CC8' : '#9AAAC0'} />
          </g>
          <circle r="9" fill="#5A6578" stroke="#3D4A58" strokeWidth="1.5" />
          <circle r="4"  fill="#2D3748" />
        </g>
        {/* Blower labels — safely below fan bottom (y=188) */}
        <text x="420" y="198" textAnchor="middle" className="lbl-sub" fontSize={9.5}>Blower Fan</text>
        <Tag x={420} y={212} text={`L${fanSpd} · ${(fanSpd * 280).toFixed(0)} CMM`}
             bg={fanSpd > 0 ? '#F6EDC8' : '#F1F4F8'} color={fanSpd > 0 ? '#9C7B14' : '#8A93A4'} mono bold />

        {/* Air-flow arrows — exit right side of indoor unit */}
        {fanSpd > 0 && s.power && [90, 128, 166].map((y, i) => (
          <g key={i} style={{ animation: `airPuff ${Math.max(0.8, 2 - fanSpd * 0.22)}s linear infinite`, animationDelay: `${i * 0.3}s` }}>
            <path d={`M448,${y} l28,0 m-7,-5 l7,5 l-7,5`} stroke="#1F8A5B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>
        ))}

        {/* ── Accessories row — y=230 to y=420 ─────────────────── */}

        {/* Humidifier — center (62, 320) */}
        <Pin x={62} y={228} n="⑦" />
        <g transform="translate(62,320)">
          <circle r="34" fill={s.humidifierOn && s.power ? '#E5F8EF' : '#F7F9FB'}
                  stroke={s.humidifierOn && s.power ? '#1F8A5B' : '#C8D0D9'} strokeWidth="2" />
          <path d="M0,-18 Q10,-5 10,5 Q10,18 0,22 Q-10,18 -10,5 Q-10,-5 0,-18 Z"
                fill={s.humidifierOn && s.power ? '#1F8A5B' : '#C8D0D9'} />
          {s.humidifierOn && s.power && [-16, 0, 16].map((dx, i) => (
            <circle key={i} cx={dx} cy={-40} r="3.5" fill="#1F8A5B" opacity="0.65"
                    style={{ animation: `airPuff 1.4s ease-in-out infinite`, animationDelay: `${i * 0.38}s` }} />
          ))}
        </g>
        <text x="62" y="364" textAnchor="middle" className="lbl-sub" fontSize={9.5}>{L('c_humid')}</text>
        <Tag x={62} y={377} text={s.humidifierOn && s.power ? '8 L/h' : 'OFF'} bg={s.humidifierOn && s.power ? '#DCF1E6' : '#F1F4F8'} color={s.humidifierOn && s.power ? '#1F8A5B' : '#8A93A4'} mono bold />

        {/* CO₂ sensor — center (200, 300) */}
        <g transform="translate(200,300)">
          <rect x="-44" y="-28" width="88" height="58" rx="9" fill="#fff" stroke="#C8D0D9" strokeWidth="1.5" />
          <text x="0" y="-10" textAnchor="middle" fontSize={10} fill="#5B6577" fontWeight={700} letterSpacing=".04em">CO₂</text>
          <text x="0" y="10" textAnchor="middle" fontSize={15} fontFamily="JetBrains Mono" fill={s.power ? '#D97757' : '#B8C0CC'} fontWeight={700}>
            {s.power ? Math.round(s.co2) : '—'}
          </text>
          <text x="0" y="24" textAnchor="middle" fontSize={9} fontFamily="JetBrains Mono" fill="#8A93A4">ppm NDIR</text>
        </g>

        {/* PM2.5 — center (200, 380) */}
        <g transform="translate(200,380)">
          <rect x="-44" y="-18" width="88" height="36" rx="7" fill="#F7F9FB" stroke="#E0E5EC" strokeWidth="1" />
          <text x="0" y="-4" textAnchor="middle" fontSize={9} fill="var(--ink-4)" fontWeight={600}>PM2.5</text>
          <text x="0" y="12" textAnchor="middle" fontSize={13} fontFamily="JetBrains Mono" fontWeight={700}
                fill={!s.power ? '#B8C0CC' : s.pm25 < 35 ? '#1F8A5B' : s.pm25 < 75 ? '#D97757' : '#C0364E'}>
            {s.power ? s.pm25.toFixed(0) : '—'}<tspan fontSize="9" fill="var(--ink-4)">{s.power ? ' µg' : ''}</tspan>
          </text>
        </g>

        {/* Air purifier — center (340, 320) */}
        <Pin x={340} y={228} n="⑨" />
        <g transform="translate(340,320)">
          <rect x="-36" y="-32" width="72" height="62" rx="9"
                fill={s.airPurifierOn && s.power ? '#EDE5F6' : '#F7F9FB'}
                stroke={s.airPurifierOn && s.power ? '#6B5BD2' : '#C8D0D9'} strokeWidth="2" />
          {[-20, -10, 0, 10, 20].map((dy, i) => (
            <line key={i} x1="-28" y1={dy - 5} x2="28" y2={dy - 5}
                  stroke={s.airPurifierOn && s.power ? '#6B5BD2' : '#C8D0D9'} strokeWidth="1.5" />
          ))}
          <text x="0" y="22" textAnchor="middle" fontSize={8} fill={s.airPurifierOn && s.power ? '#6B5BD2' : '#8A93A4'} fontWeight={700}>HEPA H13</text>
        </g>
        <text x="340" y="364" textAnchor="middle" className="lbl-sub" fontSize={9.5}>{L('c_purif')}</text>
        <Tag x={340} y={377} text={s.airPurifierOn && s.power ? 'ON' : 'OFF'} bg={s.airPurifierOn && s.power ? '#EDE5F6' : '#F1F4F8'} color={s.airPurifierOn && s.power ? '#6B5BD2' : '#8A93A4'} mono bold />

        {/* Suction + SC info — above liquid pipe at y=442 */}
        <Tag x={230} y={430} text={compRun ? `흡입 ${(s.indoorTemp - 5).toFixed(1)}°C · SC ${sc}°C` : '—'} bg="#F1F4F8" color={compRun ? '#2A6FDB' : 'var(--ink-4)'} mono />
      </g>

      {/* ─── HIT AREAS (invisible, on top) ─── */}
      <Hit comp="condenser"  x="16"  y="52"  w="188" h="200" />
      <Hit comp="compressor" x="14"  y="276" w="90"  h="140" />
      <Hit comp="exv"        x="142" y="276" w="76"  h="120" />
      {isKorea && <Hit comp="fourway"   x="450" y="44"  w="84"  h="112" />}
      {isKorea && <Hit comp="heater"    x="536" y="44"  w="116" h="112" />}
      <Hit comp="evaporator" x="650" y="44"  w="146" h="134" />
      <Hit comp="blower"     x="830" y="86"  w="78"  h="130" />
      <Hit comp="humidifier" x="472" y="238" w="80"  h="152" />
      <Hit comp="co2_sensor" x="612" y="258" w="96"  h="82" />
      <Hit comp="purifier"   x="752" y="238" w="80"  h="152" />
    </svg>
  );
}

// ── MODE CONTROL ─────────────────────────────────────────────────────────
function ModeScreen({ s, set, L }) {
  const isKorea = s.version === 'korea';
  const modes = [
    { id: 'auto', name: L('mode_auto'), desc: 'AI selects best mode',  icon: 'ai',    tone: 'auto', disabled: false },
    { id: 'cool', name: L('mode_cool'), desc: 'Refrigerant cycle',     icon: 'snow',  tone: 'cool', disabled: false },
    { id: 'heat', name: L('mode_heat'), desc: 'Heat pump + PTC',       icon: 'sun',   tone: 'heat', disabled: !isKorea },
    { id: 'dry',  name: L('mode_dry'),  desc: 'Dehumidify only',       icon: 'drop',  tone: 'dry',  disabled: false },
    { id: 'fan',  name: L('mode_fan'),  desc: 'Air circulation',       icon: 'fan',   tone: 'fan',  disabled: false },
    { id: 'off',  name: L('mode_off'),  desc: 'System on standby',     icon: 'pause', tone: 'off',  disabled: false },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 12, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', gap: 12 }}>
        <div className="card">
          <div className="card-h"><div className="title">Operation Mode</div></div>
          <div className="mode-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
            {modes.map(m => (
              <button key={m.id}
                      className={`mode-tile ${s.mode === m.id ? 'active ' + m.tone : ''} ${m.disabled ? 'disabled' : ''}`}
                      onClick={() => !m.disabled && set({ mode: m.id })}
                      disabled={m.disabled}>
                <div className="ico"><Icon name={m.icon} size={20} /></div>
                <div className="name">{m.name}</div>
                <div className="desc">{m.desc}</div>
                {m.disabled && <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, color: 'var(--ink-4)', fontWeight: 600 }}>N/A</div>}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div className="card">
            <div className="title" style={{ marginBottom: 12 }}>{L('a_setpoint')}</div>
            <BigSetter value={s.targetTemp} unit="°C" min={16} max={30} step={1} onChange={(v) => set({ targetTemp: v })} color={s.mode === 'heat' ? '#D97757' : '#2A6FDB'} />
          </div>
          <div className="card">
            <div className="title" style={{ marginBottom: 12 }}>{L('a_fan')}</div>
            <FanSetter value={s.fanSpeed} onChange={(v) => set({ fanSpeed: v })} />
          </div>
          <div className="card">
            <div className="title" style={{ marginBottom: 12 }}>{L('a_targetRH')}</div>
            <BigSetter value={s.targetRH} unit="%" min={30} max={70} step={5} onChange={(v) => set({ targetRH: v })} color="#1F8A5B" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          <SubSystemCard title={L('c_humid')}  icon="drop"     on={s.humidifierOn}  onToggle={v => set({ humidifierOn: v })}  detail={s.humidifierOn && s.power ? '8 L/h' : '—'} accent="#1F8A5B" />
          <SubSystemCard title={L('c_purif')}  icon="purifier" on={s.airPurifierOn} onToggle={v => set({ airPurifierOn: v })} detail={`PM2.5 ${s.pm25.toFixed(0)} µg/m³`} accent="#6B5BD2" />
          <SubSystemCard title="Ventilation"   icon="fan"      on={s.ventilationOn} onToggle={v => set({ ventilationOn: v })} detail={`CO₂ ${Math.round(s.co2)} ppm`} accent="#D97757" />
        </div>
      </div>
      <LiveResponsePanel s={s} L={L} />
    </div>
  );
}

// ── LIVE RESPONSE PANEL ───────────────────────────────────────────────────
function LiveResponsePanel({ s, L }) {
  const mode = s.mode;
  const modeColor = { cool:'#2A6FDB', heat:'#D97757', auto:'#1F8A5B', dry:'#6B5BD2', fan:'#9C7B14', off:'#8A93A4' }[mode] || '#8A93A4';
  const Δ = s.indoorTemp - s.targetTemp;
  const reaching = Math.max(0, Math.min(100, 100 - Math.abs(Δ) * 12));
  const statusText = !s.power ? 'System Off'
    : mode === 'off'  ? 'Standby — Compressor Idle'
    : mode === 'cool' ? `Cooling  ·  Δ ${Δ >= 0 ? '+' : ''}${Δ.toFixed(1)}°C  →  ${s.targetTemp}°C`
    : mode === 'heat' ? `Heating  ·  Δ ${Δ >= 0 ? '+' : ''}${Δ.toFixed(1)}°C  →  ${s.targetTemp}°C`
    : mode === 'auto' ? `Auto  ·  ${Δ > 0.5 ? 'Cooling' : Δ < -0.5 ? 'Heating' : 'Holding'}  →  ${s.targetTemp}°C`
    : mode === 'dry'  ? `Dehumidifying  ·  RH ${s.indoorRH.toFixed(1)}%  →  ${s.targetRH}%`
    : `Circulating  ·  L${s.fanSpeed}  ·  ${(s.fanSpeed * 280).toFixed(0)} CMM`;
  const off = !s.power;
  const sensors = [
    { key: 'indoorTemp', label: L('m_indoorTemp'), value: off ? '—' : s.indoorTemp.toFixed(1), unit: '°C',  color: '#2A6FDB', hist: off ? [] : s.hist.indoorTemp },
    { key: 'indoorRH',   label: L('m_indoorRH'),   value: off ? '—' : s.indoorRH.toFixed(1),   unit: '%',   color: '#1F8A5B', hist: off ? [] : s.hist.indoorRH },
    { key: 'co2',        label: L('m_co2'),         value: off ? '—' : String(Math.round(s.co2)), unit: 'ppm', color: '#D97757', hist: off ? [] : s.hist.co2 },
    { key: 'powerKW',    label: L('m_power'),       value: off ? '—' : s.powerKW.toFixed(2),    unit: 'kW',  color: '#6B5BD2', hist: off ? [] : s.hist.powerKW },
    { key: 'eer',        label: L('m_eer'),         value: off ? '—' : s.eer.toFixed(2),        unit: '',    color: '#9C7B14', hist: off ? [] : s.hist.eer },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: 10, height: '100%' }}>
      <div className="card" style={{ background: modeColor + '10', border: `1.5px solid ${modeColor}30`, padding: '12px 14px' }}>
        <div style={{ fontSize: 10, color: modeColor, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 }}>▶ System Response</div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.45, fontFamily: 'JetBrains Mono' }}>{statusText}</div>
        <div style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-4)', marginBottom: 4 }}>
            <span>Now: {s.indoorTemp.toFixed(1)}°C</span><span>Target: {s.targetTemp}°C</span>
          </div>
          <div style={{ height: 5, background: '#E7EBF0', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, transition: 'width 0.7s ease', background: reaching > 80 ? '#1F8A5B' : modeColor, width: `${reaching}%` }} />
          </div>
          <div style={{ textAlign: 'right', fontSize: 9.5, color: 'var(--ink-4)', marginTop: 3, fontFamily: 'JetBrains Mono' }}>{reaching.toFixed(0)}% at target</div>
        </div>
      </div>
      <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0, padding: '12px 14px' }}>
        <div className="card-h" style={{ marginBottom: 8 }}>
          <div className="title">Live Response</div>
          <span style={{ fontSize: 9, color: 'var(--ink-4)', fontFamily: 'JetBrains Mono', background: '#F1F4F8', padding: '2px 7px', borderRadius: 6 }}>1 s</span>
        </div>
        <div style={{ display: 'grid', gap: 10, alignContent: 'start', overflow: 'hidden' }}>
          {sensors.map(sen => (
            <div key={sen.key} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid var(--line-soft)' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--ink-4)', fontWeight: 600, marginBottom: 3 }}>{sen.label}</div>
                <Spark data={(sen.hist || []).slice(-60)} color={sen.color} height={22} padY={3} />
              </div>
              <div style={{ textAlign: 'right', minWidth: 62 }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 17, color: sen.color }}>{sen.value}</span>
                {sen.unit && <span style={{ fontSize: 10, color: 'var(--ink-3)', marginLeft: 2 }}>{sen.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--ink-4)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 4 }}>{L('c_compressor')}</div>
          <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 22, color: s.compressorOn ? '#2A6FDB' : 'var(--ink-4)' }}>
            {s.compFreqHz.toFixed(0)}<span style={{ fontSize: 11, color: 'var(--ink-4)', fontWeight: 400, marginLeft: 3 }}>Hz</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-4)', marginTop: 4, fontFamily: 'JetBrains Mono', display: 'grid', gap: 1 }}>
            <span>EXV {s.compressorOn ? (s.exvOpenPct ?? 35).toFixed(0) : '—'}%</span>
            <span>SH {s.compressorOn ? (s.superheat ?? 5.5).toFixed(1) : '—'}°C · SC {s.compressorOn ? (s.subcooling ?? 3).toFixed(1) : '—'}°C</span>
          </div>
        </div>
        <Donut value={s.compFreqHz} max={110} color={s.compressorOn ? '#2A6FDB' : '#B8C0CC'} label={s.compFreqHz.toFixed(0)} sub="Hz" size={78} />
      </div>
    </div>
  );
}

function BigSetter({ value, unit, min, max, step, onChange, color = '#2A6FDB' }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '46px 1fr 46px', gap: 12, alignItems: 'center' }}>
      <button className="btn lg" style={{ height: 46, width: 46, padding: 0, justifyContent: 'center', borderRadius: 12 }} onClick={() => onChange(Math.max(min, value - step))}><Icon name="minus" size={18} /></button>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 56, lineHeight: 1, color, letterSpacing: '-.04em' }}>
          {value}<span style={{ fontSize: 22, marginLeft: 4, color: 'var(--ink-3)' }}>{unit}</span>
        </div>
        <input type="range" className="slider" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ marginTop: 10 }} />
      </div>
      <button className="btn lg" style={{ height: 46, width: 46, padding: 0, justifyContent: 'center', borderRadius: 12 }} onClick={() => onChange(Math.min(max, value + step))}><Icon name="plus" size={18} /></button>
    </div>
  );
}

function FanSetter({ value, onChange }) {
  return (
    <div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 56, fontWeight: 600, color: '#9C7B14', textAlign: 'center', lineHeight: 1, letterSpacing: '-.04em' }}>L{value}</div>
      <div style={{ display: 'flex', gap: 4, marginTop: 18 }}>
        {[0,1,2,3,4,5].map(lv => (
          <button key={lv} onClick={() => onChange(lv)} style={{
            flex: 1, height: 36, borderRadius: 8,
            background: lv <= value ? 'linear-gradient(180deg,#F6EDC8,#E9D88A)' : '#F1F4F8',
            border: '1px solid ' + (lv <= value ? '#D6BB55' : 'var(--line)'),
            color: lv <= value ? '#9C7B14' : 'var(--ink-3)',
            fontWeight: 700, fontSize: 12, fontFamily: 'JetBrains Mono'
          }}>{lv}</button>
        ))}
      </div>
    </div>
  );
}

function SubSystemCard({ title, icon, on, onToggle, detail, accent }) {
  return (
    <div className="card" style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: on ? accent + '22' : '#F1F4F8', color: on ? accent : 'var(--ink-3)', display: 'grid', placeItems: 'center' }}>
        <Icon name={icon} size={20} />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{detail}</div>
      </div>
      <Toggle on={on} onChange={onToggle} />
    </div>
  );
}

Object.assign(window, { DashboardScreen, SchematicScreen, ModeScreen });
