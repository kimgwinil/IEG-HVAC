// Shared UI components and icons.

const { useMemo } = React;

// ── Icons (Lucide-style strokes) ─────────────────────────────────────────
const Icon = ({ name, size = 18, stroke = 'currentColor', strokeWidth = 1.8, fill = 'none' }) => {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill, stroke, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
  };
  const paths = {
    dashboard:
      <><path d="M3 13h8V3H3v10Z" /><path d="M13 21h8V11h-8v10Z" /><path d="M3 21h8v-6H3v6Z" /><path d="M13 9h8V3h-8v6Z" /></>,
    schematic:
      <><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.5 6h7M6 8.5v7m12-7v7M8.5 18h7"/></>,
    mode:
      <><path d="M12 3v3"/><path d="M12 18v3"/><path d="M5.6 5.6 7.7 7.7"/><path d="M16.3 16.3 18.4 18.4"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="M5.6 18.4 7.7 16.3"/><path d="M16.3 7.7 18.4 5.6"/><circle cx="12" cy="12" r="3.5"/></>,
    ai:
      <><path d="M9 4v3"/><path d="M15 4v3"/><path d="M9 17v3"/><path d="M15 17v3"/><path d="M4 9h3"/><path d="M4 15h3"/><path d="M17 9h3"/><path d="M17 15h3"/><rect x="7" y="7" width="10" height="10" rx="2"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></>,
    energy:
      <path d="M13 2 4.5 13.5h6L10 22l9-13h-6l1-7Z"/>,
    trend:
      <><path d="M3 17 9 11l4 4 8-8"/><path d="M15 7h6v6"/></>,
    alarm:
      <><path d="M6 8a6 6 0 0 1 12 0c0 6 3 7 3 7H3s3-1 3-7Z"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    settings:
      <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></>,
    thermo:
      <><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0Z"/></>,
    drop:
      <path d="M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12Z"/>,
    co2:
      <><circle cx="12" cy="12" r="9"/><path d="M8 10.5a2.5 2.5 0 1 1 0 3"/><path d="M14 9.5h3M14 14.5h3M15.5 9.5v5"/></>,
    bolt:
      <path d="M13 2 4.5 13.5h6L10 22l9-13h-6l1-7Z"/>,
    leaf:
      <><path d="M11 20A7 7 0 0 1 4 13V4h9a7 7 0 0 1 0 14h-2v2Z"/><path d="M11 20 17 14"/></>,
    sun:
      <><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></>,
    snow:
      <><path d="M12 2v20"/><path d="M2 12h20"/><path d="M4.93 4.93 19.07 19.07"/><path d="M19.07 4.93 4.93 19.07"/></>,
    fan:
      <><path d="M12 12c0-3 1.5-7 5-7s4 4 1 6-5 1-6 1Z"/><path d="M12 12c-3 0-7 1.5-7 5s4 4 6 1 1-5 1-6Z"/><path d="M12 12c0 3-1.5 7-5 7s-4-4-1-6 5-1 6-1Z"/><path d="M12 12c3 0 7-1.5 7-5s-4-4-6-1-1 5-1 6Z"/><circle cx="12" cy="12" r="1.5"/></>,
    purifier:
      <><rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M9 16h6"/></>,
    play:  <path d="M6 4l14 8-14 8V4Z" fill="currentColor" stroke="none"/>,
    pause: <><rect x="6" y="5" width="4" height="14" fill="currentColor" stroke="none"/><rect x="14" y="5" width="4" height="14" fill="currentColor" stroke="none"/></>,
    check: <path d="M5 12l5 5L20 7"/>,
    chev:  <path d="M9 6l6 6-6 6"/>,
    plus:  <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    minus: <path d="M5 12h14"/>,
    arrowUp: <path d="M12 19V5M5 12l7-7 7 7"/>,
    arrowDown: <path d="M12 5v14M5 12l7 7 7-7"/>,
    flat: <path d="M5 12h14"/>,
    globe:
      <><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></>,
    eq:
      <><path d="M4 18h4M10 14h4M16 8h4"/><circle cx="6" cy="18" r="2"/><circle cx="12" cy="14" r="2"/><circle cx="18" cy="8" r="2"/></>,
  };
  return <svg {...props}>{paths[name]}</svg>;
};

// ── Stat card ────────────────────────────────────────────────────────────
function StatCard({ tone = 'mint', icon, label, value, unit, foot, trend, sparkData, sparkColor, compact = false }) {
  return (
    <div className={`stat ${tone} ${compact ? 'compact' : ''}`}>
      <div className="stat-h">
        <div className="stat-label">{label}</div>
        <div className="stat-ico"><Icon name={icon} size={18} /></div>
      </div>
      <div>
        <span className="stat-val">{value}</span>
        {unit && <span className="stat-unit">{unit}</span>}
      </div>
      {sparkData ? (
        <Spark data={sparkData} color={sparkColor || 'currentColor'} />
      ) : (
        <div className="stat-foot">
          <span>{foot}</span>
          {trend && (
            <span className={`stat-trend ${trend.dir}`}>
              <Icon name={trend.dir === 'up' ? 'arrowUp' : trend.dir === 'down' ? 'arrowDown' : 'flat'} size={10} strokeWidth={2.2} />
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sparkline ────────────────────────────────────────────────────────────
function Spark({ data, color = '#14B8A6', height = 36, fill = true, smooth = true, padY = 6 }) {
  const path = useMemo(() => {
    if (!data || data.length < 2) return { line: '', area: '' };
    const w = 200, h = height;
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    const xs = data.map((_, i) => (i / (data.length - 1)) * w);
    const ys = data.map(v => h - padY - ((v - min) / range) * (h - padY * 2));
    let line = '';
    if (smooth) {
      // Catmull-Rom to bezier
      for (let i = 0; i < xs.length - 1; i++) {
        const x0 = xs[Math.max(0, i - 1)], y0 = ys[Math.max(0, i - 1)];
        const x1 = xs[i], y1 = ys[i];
        const x2 = xs[i + 1], y2 = ys[i + 1];
        const x3 = xs[Math.min(xs.length - 1, i + 2)], y3 = ys[Math.min(ys.length - 1, i + 2)];
        const cp1x = x1 + (x2 - x0) / 6;
        const cp1y = y1 + (y2 - y0) / 6;
        const cp2x = x2 - (x3 - x1) / 6;
        const cp2y = y2 - (y3 - y1) / 6;
        if (i === 0) line += `M ${x1} ${y1} `;
        line += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2} `;
      }
    } else {
      line = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');
    }
    const area = `${line} L ${w} ${h} L 0 ${h} Z`;
    return { line, area };
  }, [data, height, smooth, padY]);

  return (
    <svg className="spark" viewBox={`0 0 200 ${height}`} preserveAspectRatio="none">
      {fill && (
        <path d={path.area} fill={color} opacity="0.12" />
      )}
      <path d={path.line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Linechart (larger, with axes) ────────────────────────────────────────
function LineChart({ series, height = 220, padY = 18, padL = 36, padR = 12, padT = 12, padB = 22, yTicks = 4, xLabels = [] }) {
  // series: [{ label, color, data }]
  if (!series || !series.length) return null;
  const w = 800; // viewBox width
  const h = height;
  const data = series.flatMap(s => s.data);
  const min = Math.floor(Math.min(...data) - 1);
  const max = Math.ceil(Math.max(...data) + 1);
  const range = max - min || 1;
  const len = Math.max(...series.map(s => s.data.length));
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const xAt = i => padL + (i / (len - 1)) * plotW;
  const yAt = v => padT + plotH - ((v - min) / range) * plotH;

  // path generator
  const pathFor = (arr) => {
    if (arr.length < 2) return '';
    let s = `M ${xAt(0)} ${yAt(arr[0])}`;
    for (let i = 1; i < arr.length; i++) {
      const xp = xAt(i - 1), yp = yAt(arr[i - 1]);
      const x = xAt(i), y = yAt(arr[i]);
      const cx = (xp + x) / 2;
      s += ` C ${cx} ${yp}, ${cx} ${y}, ${x} ${y}`;
    }
    return s;
  };

  const yTickVals = [];
  for (let i = 0; i <= yTicks; i++) {
    yTickVals.push(min + (range * i) / yTicks);
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', width: '100%', height }}>
      {/* gridlines */}
      {yTickVals.map((v, i) => (
        <g key={i}>
          <line x1={padL} x2={w - padR} y1={yAt(v)} y2={yAt(v)} stroke="#E7EBF0" strokeWidth="1" />
          <text x={padL - 6} y={yAt(v) + 4} fontSize="10" textAnchor="end" fill="#8A93A4" fontFamily="JetBrains Mono">
            {Number.isInteger(v) ? v : v.toFixed(1)}
          </text>
        </g>
      ))}
      {/* x labels */}
      {xLabels.map((l, i) => {
        const x = padL + (i / Math.max(1, xLabels.length - 1)) * plotW;
        return (
          <text key={i} x={x} y={h - 6} fontSize="10" textAnchor="middle" fill="#8A93A4" fontFamily="JetBrains Mono">{l}</text>
        );
      })}
      {/* series */}
      {series.map((s, idx) => (
        <g key={idx}>
          <path d={pathFor(s.data)} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </svg>
  );
}

// ── Donut / gauge ────────────────────────────────────────────────────────
function Donut({ value, max = 100, label, color = '#14B8A6', sub, size = 130 }) {
  const r = 52, c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  const labelSize = size <= 112 ? 20 : 22;
  const subSize = size <= 112 ? 9 : 10;
  return (
    <svg width={size} height={size} viewBox="0 0 130 130">
      <circle cx="65" cy="65" r={r} stroke="#ECEFF3" strokeWidth="11" fill="none" />
      <circle
        cx="65" cy="65" r={r}
        stroke={color} strokeWidth="11" fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - pct * c}
        transform="rotate(-90 65 65)"
      />
      <text x="65" y="63" textAnchor="middle" fontFamily="JetBrains Mono" fontSize={labelSize} fontWeight="600" fill="#0F1A2E">{label}</text>
      {sub && <text x="65" y="80" textAnchor="middle" fontFamily="Pretendard" fontSize={subSize} fill="#5B6577">{sub}</text>}
    </svg>
  );
}

// ── Slider row ───────────────────────────────────────────────────────────
function SliderRow({ label, value, min, max, step = 1, unit = '', onChange, color = 'cool' }) {
  return (
    <div className="slider-row">
      <div className="slider-h">
        <span className="lbl">{label}</span>
        <span className="val">{value}{unit && <span style={{ fontSize: 12, color: 'var(--ink-3)', marginLeft: 4 }}>{unit}</span>}</span>
      </div>
      <input className={`slider ${color}`} type="range" min={min} max={max} step={step} value={value}
             onChange={e => onChange(Number(e.target.value))} />
    </div>
  );
}

// ── Toggle ───────────────────────────────────────────────────────────────
function Toggle({ on, onChange, label }) {
  return (
    <button className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} style={{ background: 'transparent', border: 0 }}>
      <span className="sw"></span>
      {label && <span>{label}</span>}
    </button>
  );
}

// ── Bar segment chart (for energy breakdown) ─────────────────────────────
function StackedBar({ segments, height = 12 }) {
  const total = segments.reduce((a, b) => a + b.value, 0) || 1;
  return (
    <div style={{ display: 'flex', height, borderRadius: 999, overflow: 'hidden', background: '#ECEFF3' }}>
      {segments.map((s, i) => (
        <div key={i} style={{ width: `${(s.value / total) * 100}%`, background: s.color }} title={`${s.label}: ${s.value}`} />
      ))}
    </div>
  );
}

// expose globally
Object.assign(window, { Icon, StatCard, Spark, LineChart, Donut, SliderRow, Toggle, StackedBar });
