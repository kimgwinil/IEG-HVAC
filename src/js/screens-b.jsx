// Screens part 2: AI Analysis, Energy Analysis, Data Trend

// ── AI ANALYSIS ─────────────────────────────────────────────────────────
function AIScreen({ s, set, L }) {
  // health score derived from system state
  const healthScore = Math.round(
    100
    - Math.max(0, (s.co2 - s.targetCO2) / 30)
    - Math.max(0, (Math.abs(s.indoorTemp - s.targetTemp) - 1) * 8)
    - Math.max(0, (s.pm25 - 35) * 0.3)
    - Math.max(0, (s.compFreqHz - 95) * 0.4)
  );
  const score = Math.max(40, Math.min(100, healthScore));
  const scoreColor = score > 85 ? '#1F8A5B' : score > 70 ? '#D97757' : '#C0364E';
  const status = score > 85 ? 'Optimal' : score > 70 ? 'Acceptable' : 'Suboptimal';

  // diagnostics rows
  const diag = [
    { k: 'Compressor frequency', v: `${s.compFreqHz.toFixed(0)} Hz`, ok: s.compFreqHz < 100 },
    { k: 'Indoor Δ from setpoint', v: `${(s.indoorTemp - s.targetTemp).toFixed(1)} °C`, ok: Math.abs(s.indoorTemp - s.targetTemp) < 1.5 },
    { k: 'CO₂ vs limit', v: `${Math.round(s.co2)}/${s.targetCO2} ppm`, ok: s.co2 < s.targetCO2 },
    { k: 'PM2.5', v: `${s.pm25.toFixed(0)} µg/m³`, ok: s.pm25 < 35 },
    { k: 'Refrigerant suction T (est)', v: `${(s.indoorTemp - 8).toFixed(1)} °C`, ok: true },
    { k: 'Power draw', v: `${s.powerKW.toFixed(2)} kW`, ok: s.powerKW < 5 },
  ];

  // recommendations based on state
  const recs = [];
  if (s.outdoorTemp < 26 && s.mode === 'cool' && s.targetTemp < 26) {
    recs.push({ key: 'ai_r1' });
  }
  if (s.fanSpeed >= 4 && s.co2 < 700) {
    recs.push({ key: 'ai_r2' });
  }
  recs.push({ key: 'ai_r3' });
  if (recs.length < 2) recs.push({ key: 'ai_r3' });

  return (
    <div style={{ display: 'grid', gridTemplateRows: '138px 102px minmax(0, 1fr)', gap: 8, height: '100%', overflow: 'hidden' }}>
      {/* Health summary */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '132px 1fr 1fr', gap: 12, alignItems: 'center', padding: 10, minHeight: 0 }}>
        <div style={{ display: 'grid', placeItems: 'center' }}>
          <Donut value={score} max={100} color={scoreColor} label={String(score)} sub={L('ai_health')} size={104} />
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {L('ai_health')}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 2, color: 'var(--ink)' }}>{status}</div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.35 }}>
            {L('ai_status_normal')}.<br />
            Last full diagnostic cycle: {window.fmtClock(s.clockMin - 7)}
          </div>
        </div>
        <div style={{ display: 'grid', gap: 8 }}>
          <KPIRow label="Cycles today" value="34" delta="+8" deltaTone="up" />
          <KPIRow label="Avg EER (24h)" value={`${(s.eer * 0.95).toFixed(2)}`} delta="+0.12" deltaTone="up" />
          <KPIRow label="Predicted maintenance" value="14 days" delta={null} />
        </div>
      </div>

      {/* AI Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, minHeight: 0 }}>
        {recs.slice(0, 3).map((r, i) => (
          <div key={i} className="ai-rec" style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 40 }}>
            <div className="ai-ico"><Icon name="ai" size={14} /></div>
            <div className="t" style={{ fontSize: 12 }}>{L(r.key + '_t')}</div>
            <div className="d" style={{ fontSize: 10.5, lineHeight: 1.35 }}>{L(r.key + '_d')}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
              <button className="btn primary sm">{L('a_apply')}</button>
              <button className="btn sm">Defer</button>
            </div>
          </div>
        ))}
      </div>

      {/* Diagnostics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10, minHeight: 0 }}>
        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0 }}>
          <div className="card-h">
            <div className="title">{L('l_diagnose')}</div>
            <button className="btn sm">Run full diagnostic</button>
          </div>
          <div style={{ overflow: 'auto' }}>
            <table className="table">
              <thead>
                <tr><th>Parameter</th><th style={{ textAlign: 'right' }}>Value</th><th style={{ width: 80 }}>Status</th></tr>
              </thead>
              <tbody>
                {diag.map((d, i) => (
                  <tr key={i}>
                    <td>{d.k}</td>
                    <td className="num" style={{ textAlign: 'right' }}>{d.v}</td>
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 11, fontWeight: 700, letterSpacing: '.05em',
                        color: d.ok ? '#1F8A5B' : '#B26A00'
                      }}>
                        <span style={{
                          width: 7, height: 7, borderRadius: '50%',
                          background: d.ok ? '#1F8A5B' : '#E08C00'
                        }}></span>
                        {d.ok ? 'OK' : 'CHECK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0 }}>
          <div className="card-h"><div className="title">Model Inferences</div></div>
          <div style={{ display: 'grid', gap: 10, alignContent: 'start', overflow: 'auto' }}>
            <InferRow label="Occupancy estimate" value="2 — 3 people" conf={0.78} />
            <InferRow label="Forecast indoor T (+1h)" value={`${(s.indoorTemp + (s.targetTemp - s.indoorTemp) * 0.7).toFixed(1)} °C`} conf={0.91} />
            <InferRow label="Tomorrow peak load" value="3.8 kW · 14:20" conf={0.83} />
            <InferRow label="Filter remaining life" value="18 days" conf={0.96} />
            <InferRow label="Refrigerant charge" value="Within range" conf={0.99} />
          </div>
        </div>
      </div>
    </div>
  );
}

function KPIRow({ label, value, delta, deltaTone }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)', paddingBottom: 5 }}>
      <span style={{ fontSize: 11, color: 'var(--ink-3)' }}>{label}</span>
      <span>
        <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 14 }}>{value}</span>
        {delta && (
          <span className={`stat-trend ${deltaTone || 'flat'}`} style={{ marginLeft: 6, padding: '2px 6px' }}>
            {delta}
          </span>
        )}
      </span>
    </div>
  );
}

function InferRow({ label, value, conf }) {
  return (
    <div style={{ padding: 8, borderRadius: 10, background: '#F7F9FB' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10.5, color: 'var(--ink-3)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 10, color: 'var(--ink-4)', fontFamily: 'JetBrains Mono' }}>{Math.round(conf * 100)}%</span>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{value}</div>
      <div style={{ height: 3, background: '#E7EBF0', borderRadius: 999, marginTop: 6, overflow: 'hidden' }}>
        <div style={{ width: `${conf * 100}%`, height: '100%', background: conf > 0.85 ? '#1F8A5B' : '#D97757' }}></div>
      </div>
    </div>
  );
}

// ── ENERGY ANALYSIS ─────────────────────────────────────────────────────
function EnergyScreen({ s, L }) {
  // synthesize 24h hourly consumption based on current usage
  const baseHourly = (h) => {
    // shape: peak around 14:00, valley around 04:00
    const base = 0.6 + Math.sin((h - 6) / 24 * Math.PI * 2) * 0.4;
    const occ = (h >= 9 && h <= 22) ? 1.4 : 0.4;
    return Math.max(0.2, base * occ + (Math.random() - 0.5) * 0.15);
  };
  const hours = Array.from({ length: 24 }, (_, h) => baseHourly(h) * (s.powerKW * 0.6 + 0.8));
  const total24 = hours.reduce((a, b) => a + b, 0);
  const ratePerKWh = 280; // KRW
  const cost = total24 * ratePerKWh;

  // breakdown
  const breakdown = [
    { label: L('c_compressor'), value: total24 * 0.58, color: '#2A6FDB' },
    { label: L('c_heater'),     value: total24 * (s.version === 'korea' ? 0.18 : 0), color: '#D97757' },
    { label: L('c_blower'),     value: total24 * 0.10, color: '#9C7B14' },
    { label: L('c_humid'),      value: total24 * 0.06, color: '#1F8A5B' },
    { label: L('c_purif'),      value: total24 * 0.04, color: '#6B5BD2' },
    { label: 'Controller / Aux',value: total24 * 0.04, color: '#8A93A4' },
  ].filter(x => x.value > 0);

  // 7-day trend
  const week = Array.from({ length: 7 }, (_, i) => 14 + Math.sin(i / 2) * 3 + (i === 6 ? -2 : 0));

  return (
    <div style={{ display: 'grid', gridTemplateRows: '82px 144px 132px', gap: 6, height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
        <StatCard compact tight tone="lilac" icon="bolt" label="Today (kWh)" value={total24.toFixed(1)} unit="kWh"
                  foot={`vs yesterday`} trend={{ dir: 'down', label: '−6%' }} />
        <StatCard compact tight tone="peach" icon="bolt" label="Today (cost)" value={`₩${(cost / 1000).toFixed(1)}k`} unit=""
                  foot={`${ratePerKWh}/kWh`} trend={{ dir: 'down', label: '−4%' }} />
        <StatCard compact tight tone="mint" icon="eq" label="Avg EER (24h)" value={(s.eer * 0.95).toFixed(2)} unit=""
                  foot="Target ≥ 2.5" trend={{ dir: 'up', label: '+0.12' }} />
        <StatCard compact tight tone="sky" icon="leaf" label="CO₂ saved" value="3.4" unit="kg"
                  foot="vs baseline (eco mode)" trend={{ dir: 'up', label: '+12%' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 8, minHeight: 0 }}>
        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0, padding: 7 }}>
          <div className="card-h">
            <div className="title">{L('l_24h')} · Hourly Consumption</div>
            <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>kWh</span>
          </div>
          <HourlyBars hours={hours} />
        </div>
        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto auto 1fr', minHeight: 0, padding: 7 }}>
          <div className="card-h"><div className="title">Energy Breakdown</div></div>
          <StackedBar segments={breakdown} height={10} />
          <div style={{ display: 'grid', gap: 3, marginTop: 5, alignContent: 'start', overflow: 'auto' }}>
            {breakdown.map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5 }}>
                <span style={{ width: 7, height: 7, borderRadius: 3, background: b.color }}></span>
                <span style={{ flex: 1, color: 'var(--ink-2)', minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.label}</span>
                <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--ink)', fontWeight: 600, fontSize: 10 }}>{b.value.toFixed(1)}</span>
                <span style={{ color: 'var(--ink-4)', fontSize: 9.5, width: 28, textAlign: 'right', fontFamily: 'JetBrains Mono' }}>
                  {(b.value / total24 * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, minHeight: 0 }}>
        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0, padding: 5 }}>
          <div className="card-h">
            <div className="title">{L('l_7d')}</div>
            <span style={{ fontSize: 11, color: 'var(--ink-4)', fontFamily: 'JetBrains Mono' }}>Σ {week.reduce((a, b) => a + b, 0).toFixed(0)} kWh</span>
          </div>
          <WeeklyBars data={week} />
        </div>
        <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0, padding: 5 }}>
          <div className="card-h"><div className="title">Tariff / Demand</div></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 3, alignContent: 'start', overflow: 'auto' }}>
            <MiniMetric label="Peak Today" value="3.4" unit="kW" tone="peach" />
            <MiniMetric label="Off-peak %" value="46" unit="%" tone="mint" />
            <MiniMetric label="Avg Demand" value={(s.powerKW * 0.85).toFixed(2)} unit="kW" tone="sky" />
            <MiniMetric label="Carbon Intensity" value="430" unit="g/kWh" tone="lilac" />
            <MiniMetric label="Solar Offset" value="0.8" unit="kWh" tone="lemon" />
            <MiniMetric label="Demand Charge" value="₩4,250" unit="" tone="rose" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HourlyBars({ hours }) {
  const max = Math.max(...hours);
  return (
    <svg viewBox="0 0 800 126" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      {hours.map((v, i) => {
        const x = 32 + i * 30;
        const h = (v / max) * 84;
        const y = 108 - h;
        const isPeak = (i >= 13 && i <= 17);
        return (
          <g key={i}>
            <rect x={x} y={y} width="20" height={h} rx="3"
                  fill={isPeak ? '#D97757' : '#2A6FDB'} opacity={0.85} />
            {i % 3 === 0 && (
              <text x={x + 10} y={120} fontSize="8.5" textAnchor="middle" fill="#8A93A4" fontFamily="JetBrains Mono">
                {String(i).padStart(2, '0')}
              </text>
            )}
          </g>
        );
      })}
      <line x1="0" y1="108" x2="800" y2="108" stroke="#E7EBF0" />
    </svg>
  );
}

function WeeklyBars({ data }) {
  const max = Math.max(...data);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <svg viewBox="0 0 400 126" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      {data.map((v, i) => {
        const w = 36;
        const x = 18 + i * 53;
        const h = (v / max) * 84;
        const y = 108 - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx="6" fill="#14B8A6" opacity="0.85" />
            <text x={x + w / 2} y={y - 3} fontSize="9" textAnchor="middle" fill="#0F1A2E" fontFamily="JetBrains Mono" fontWeight="600">{v.toFixed(0)}</text>
            <text x={x + w / 2} y={120} fontSize="9" textAnchor="middle" fill="#8A93A4">{days[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function MiniMetric({ label, value, unit, tone = 'mint' }) {
  const tones = {
    mint: ['var(--mint)', 'var(--mint-d)'],
    sky: ['var(--sky)', 'var(--sky-d)'],
    peach: ['var(--peach)', 'var(--peach-d)'],
    lilac: ['var(--lilac)', 'var(--lilac-d)'],
    lemon: ['var(--lemon)', 'var(--lemon-d)'],
    rose: ['var(--rose)', 'var(--rose-d)'],
  };
  const [bg, fg] = tones[tone];
  return (
    <div style={{ padding: 5, background: bg, borderRadius: 8, minWidth: 0 }}>
      <div style={{ fontSize: 8.5, color: fg, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}<span style={{ fontSize: 9, marginLeft: 2, color: 'var(--ink-3)', fontFamily: 'Pretendard' }}>{unit}</span>
      </div>
    </div>
  );
}

// ── DATA TREND ──────────────────────────────────────────────────────────
function TrendScreen({ s, L }) {
  const [range, setRange] = React.useState('1h');
  const [series, setSeries] = React.useState({
    indoorTemp: true, indoorRH: true, co2: false, powerKW: false, outdoorTemp: false, eer: false,
  });
  const toggle = (k) => setSeries(p => ({ ...p, [k]: !p[k] }));
  const colorMap = {
    indoorTemp: '#2A6FDB', indoorRH: '#1F8A5B', co2: '#D97757',
    powerKW: '#6B5BD2', outdoorTemp: '#C0364E', eer: '#9C7B14',
  };
  const nameMap = {
    indoorTemp: L('m_indoorTemp'), indoorRH: L('m_indoorRH'), co2: L('m_co2'),
    powerKW: L('m_power'), outdoorTemp: L('m_outdoorTemp'), eer: L('m_eer'),
  };
  const unitMap = { indoorTemp: '°C', indoorRH: '%', co2: 'ppm', powerKW: 'kW', outdoorTemp: '°C', eer: '' };

  // slice based on range
  const sliceN = range === '1h' ? 60 : range === '6h' ? 180 : 360;
  const sliceArr = (a) => a.slice(-sliceN);

  // build series array
  const seriesArr = Object.keys(series).filter(k => series[k]).map(k => ({
    key: k, label: nameMap[k], unit: unitMap[k], color: colorMap[k], data: sliceArr(s.hist[k]),
  }));

  return (
    <div style={{ display: 'grid', gridTemplateRows: '78px minmax(0, 1fr) 92px', gap: 8, height: '100%', overflow: 'hidden' }}>
      <div className="card" style={{ padding: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', overflowX: 'auto', minWidth: 0 }}>
            <div className="title" style={{ marginRight: 6 }}>Signal</div>
            {Object.keys(series).map(k => (
              <button key={k}
                      onClick={() => toggle(k)}
                      style={{
                        height: 26, padding: '0 10px', borderRadius: 999,
                        border: '1px solid ' + (series[k] ? colorMap[k] : 'var(--line)'),
                        background: series[k] ? colorMap[k] + '15' : '#fff',
                        color: series[k] ? colorMap[k] : 'var(--ink-3)',
                        fontWeight: 600, fontSize: 10, letterSpacing: '.02em',
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        flex: '0 0 auto',
                      }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: colorMap[k] }}></span>
                {nameMap[k]}
              </button>
            ))}
          </div>
          <div className="seg" style={{ flex: '0 0 auto' }}>
            {['1h', '6h', '24h'].map(r => (
              <button key={r} className={range === r ? 'active' : ''} onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'grid', gridTemplateRows: 'auto 1fr', minHeight: 0, position: 'relative', padding: 10 }}>
        <div className="card-h">
          <div className="title">{nameMap.indoorTemp} / Trend</div>
          <button className="btn sm">Export CSV</button>
        </div>
        <MultiSeriesChart series={seriesArr} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 8, minHeight: 0 }}>
        {Object.keys(colorMap).map(k => {
          const arr = sliceArr(s.hist[k]);
          const cur = arr[arr.length - 1] ?? 0;
          const first = arr[0] ?? cur;
          const delta = cur - first;
          return (
            <div key={k} className="card" style={{ padding: 8, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 600 }}>{nameMap[k]}</span>
                <span style={{ fontSize: 10, color: delta >= 0 ? '#C0364E' : '#1F8A5B', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                  {delta >= 0 ? '+' : ''}{delta.toFixed(k === 'co2' ? 0 : 2)}
                </span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 16, color: 'var(--ink)', marginTop: 3 }}>
                {k === 'co2' ? Math.round(cur) : cur.toFixed(2)}<span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'Pretendard', marginLeft: 3 }}>{unitMap[k]}</span>
              </div>
              <Spark data={arr} color={colorMap[k]} height={28} padY={3} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MultiSeriesChart({ series }) {
  if (!series.length) return (
    <div style={{ display: 'grid', placeItems: 'center', color: 'var(--ink-4)', fontSize: 12 }}>
      Select a signal above to display.
    </div>
  );
  const w = 1100, h = 320;
  const padL = 40, padR = 40, padT = 12, padB = 22;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  // each series has independent normalization
  const len = Math.max(...series.map(s => s.data.length));
  const xAt = (i) => padL + (i / Math.max(1, len - 1)) * plotW;

  // We'll show only the first series' Y axis (left) and second series' Y axis (right) if any
  const pri = series[0];
  const sec = series[1];

  const seriesPath = (arr, min, max) => {
    if (arr.length < 2) return '';
    const range = max - min || 1;
    const yAt = (v) => padT + plotH - ((v - min) / range) * plotH;
    let p = `M ${xAt(0)} ${yAt(arr[0])}`;
    for (let i = 1; i < arr.length; i++) {
      const xp = xAt(i - 1), yp = yAt(arr[i - 1]);
      const x = xAt(i), y = yAt(arr[i]);
      const cx = (xp + x) / 2;
      p += ` C ${cx} ${yp}, ${cx} ${y}, ${x} ${y}`;
    }
    return p;
  };
  const seriesArea = (arr, min, max) => {
    if (arr.length < 2) return '';
    const line = seriesPath(arr, min, max);
    return `${line} L ${xAt(arr.length - 1)} ${padT + plotH} L ${xAt(0)} ${padT + plotH} Z`;
  };

  const minMax = (arr) => {
    if (!arr.length) return [0, 1];
    let min = Math.min(...arr), max = Math.max(...arr);
    const pad = (max - min) * 0.15 + 0.5;
    return [min - pad, max + pad];
  };
  const [priMin, priMax] = minMax(pri.data);
  const [secMin, secMax] = sec ? minMax(sec.data) : [0, 1];

  // gridlines from primary
  const yTicks = 5;
  const tickVals = [];
  for (let i = 0; i <= yTicks; i++) tickVals.push(priMin + (priMax - priMin) * i / yTicks);

  // x labels — show minute marks
  const xLabels = [];
  const labelN = 6;
  for (let i = 0; i <= labelN; i++) {
    const idx = Math.round((i / labelN) * (len - 1));
    const minutesAgo = Math.round((len - 1 - idx));
    xLabels.push({ idx, label: minutesAgo === 0 ? 'now' : `−${minutesAgo}m` });
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      {/* gridlines */}
      {tickVals.map((v, i) => {
        const y = padT + plotH - ((v - priMin) / (priMax - priMin)) * plotH;
        return (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#E7EBF0" />
            <text x={padL - 6} y={y + 4} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono" fill={pri.color}>{v.toFixed(1)}</text>
          </g>
        );
      })}
      {sec && [secMin, (secMin + secMax) / 2, secMax].map((v, i) => {
        const y = padT + plotH - ((v - secMin) / (secMax - secMin)) * plotH;
        return (
          <text key={i} x={w - padR + 6} y={y + 4} textAnchor="start" fontSize="10" fontFamily="JetBrains Mono" fill={sec.color}>{v.toFixed(sec.key === 'co2' ? 0 : 1)}</text>
        );
      })}
      {/* x labels */}
      {xLabels.map((xl, i) => (
        <text key={i} x={xAt(xl.idx)} y={h - 8} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="#8A93A4">{xl.label}</text>
      ))}

      {/* area + line for primary */}
      <defs>
        <linearGradient id="g-pri" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={pri.color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={pri.color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={seriesArea(pri.data, priMin, priMax)} fill="url(#g-pri)" />
      <path d={seriesPath(pri.data, priMin, priMax)} fill="none" stroke={pri.color} strokeWidth="2.2" />

      {/* secondary as overlay (normalized to its own scale, plotted on primary visual band) */}
      {series.slice(1).map((s, idx) => {
        const [mn, mx] = minMax(s.data);
        return (
          <path key={idx} d={seriesPath(s.data, mn, mx)} fill="none" stroke={s.color} strokeWidth="1.8" opacity="0.85" />
        );
      })}
    </svg>
  );
}

Object.assign(window, { AIScreen, EnergyScreen, TrendScreen });
