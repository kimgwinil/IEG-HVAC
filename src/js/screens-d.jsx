// Screens part 4: Curriculum (16-session training) + Component Detail overlay
// Sections are visually distinguished by color: objectives=blue, theory=purple, procedure=green, observation=orange

const { useState: useStateD } = React;

// ── signal & input metadata ─────────────────────────────────────────────
const SIGNAL_META = {
  indoorTemp:  { ko: '실내 온도',    en: 'Indoor T',    unit: '°C',    color: '#2A6FDB', fmt: v => v.toFixed(1) },
  indoorRH:    { ko: '실내 습도',    en: 'Indoor RH',   unit: '%',     color: '#1F8A5B', fmt: v => v.toFixed(1) },
  outdoorTemp: { ko: '실외 온도',    en: 'Outdoor T',   unit: '°C',    color: '#C0364E', fmt: v => v.toFixed(1) },
  co2:         { ko: 'CO₂',          en: 'CO₂',         unit: 'ppm',   color: '#D97757', fmt: v => Math.round(v) },
  powerKW:     { ko: '전력',          en: 'Power',       unit: 'kW',    color: '#6B5BD2', fmt: v => v.toFixed(2) },
  eer:         { ko: 'EER',          en: 'EER',         unit: '',      color: '#9C7B14', fmt: v => v.toFixed(2) },
  compFreqHz:  { ko: '압축기 주파수', en: 'Comp. Freq',  unit: 'Hz',    color: '#2A6FDB', fmt: v => v.toFixed(0) },
  pm25:        { ko: 'PM2.5',        en: 'PM2.5',       unit: 'µg/m³', color: '#6B5BD2', fmt: v => v.toFixed(0) },
};

const INPUT_META = {
  mode:          { kind: 'mode' },
  targetTemp:    { kind: 'slider', min: 16, max: 30, step: 1,  unit: '°C',  label: { ko: '설정 온도', en: 'Setpoint' } },
  targetRH:      { kind: 'slider', min: 30, max: 70, step: 5,  unit: '%',   label: { ko: '목표 습도', en: 'Target RH' } },
  targetCO2:     { kind: 'slider', min: 600, max: 1500, step: 50, unit: 'ppm', label: { ko: 'CO₂ 한계', en: 'CO₂ Limit' } },
  fanSpeed:      { kind: 'slider', min: 0,  max: 5,  step: 1,  unit: '/5',  label: { ko: '팬 단계',  en: 'Fan Step' } },
  humidifierOn:  { kind: 'toggle', label: { ko: '가습기',    en: 'Humidifier' } },
  airPurifierOn: { kind: 'toggle', label: { ko: '공기 청정', en: 'Air Purifier' } },
  ventilationOn: { kind: 'toggle', label: { ko: '환기',      en: 'Ventilation' } },
  power:         { kind: 'toggle', label: { ko: '전원',      en: 'Power' } },
};

// ── section color palette ────────────────────────────────────────────────
const SEC = {
  obj:   { main: '#2A6FDB', bg: '#EDF3FF', border: '#C3D8FC', label: { ko: '학습 목표', en: 'Learning Objectives' }, icon: '🎯' },
  prin:  { main: '#6B5BD2', bg: '#F1EEFF', border: '#D4CCFA', label: { ko: '동작 원리', en: 'Operating Principle' }, icon: '⚙️' },
  deep:  { main: '#7C3AED', bg: '#F6F1FF', border: '#DDD0FF', label: { ko: '이론 심화', en: 'Deep Theory' }, icon: '📘' },
  proc:  { main: '#1F8A5B', bg: '#E8F8F0', border: '#B2E3CC', label: { ko: '실습 절차', en: 'Lab Procedure' }, icon: '🔬' },
  obs:   { main: '#D97757', bg: '#FFF3EC', border: '#FAD0B8', label: { ko: '실시간 관찰', en: 'Live Observation' }, icon: '📊' },
  input: { main: '#5B6577', bg: '#F4F6F9', border: '#D9DEE5', label: { ko: '입력 조정', en: 'Inputs' }, icon: '🎛️' },
  check: { main: '#B45309', bg: '#FFF7ED', border: '#F3D3A1', label: { ko: '이론 확인 문제', en: 'Theory Check' }, icon: '📝' },
  eval:  { main: '#BE185D', bg: '#FFF1F6', border: '#F7C7DA', label: { ko: '평가 문항', en: 'Assessment Tasks' }, icon: '✅' },
};

// ── category colors for the curriculum grid ──────────────────────────────
const COMP_CAT = {
  system:     { color: '#0E8A7C', bg: '#DCF1E6', label: { ko: '시스템',   en: 'System' } },
  compressor: { color: '#2A6FDB', bg: '#DDEBFB', label: { ko: '부품',     en: 'Component' } },
  condenser:  { color: '#2A6FDB', bg: '#DDEBFB', label: { ko: '부품',     en: 'Component' } },
  exv:        { color: '#2A6FDB', bg: '#DDEBFB', label: { ko: '부품',     en: 'Component' } },
  evaporator: { color: '#2A6FDB', bg: '#DDEBFB', label: { ko: '부품',     en: 'Component' } },
  refrigerant:{ color: '#6B5BD2', bg: '#E8E2F4', label: { ko: '냉매',     en: 'Refrigerant' } },
  fourway:    { color: '#6B5BD2', bg: '#E8E2F4', label: { ko: '히트펌프', en: 'Heat Pump' } },
  heater:     { color: '#C0364E', bg: '#FBD7DC', label: { ko: '가열',     en: 'Heating' } },
  blower:     { color: '#D97757', bg: '#FBE3D5', label: { ko: '공기 이송', en: 'Airflow' } },
  humidifier: { color: '#1F8A5B', bg: '#DCF1E6', label: { ko: '습도',     en: 'Humidity' } },
  purifier:   { color: '#1F8A5B', bg: '#DCF1E6', label: { ko: '공기 질',  en: 'Air Quality' } },
  trh_sensor: { color: '#9C7B14', bg: '#F6EDC8', label: { ko: '센서',     en: 'Sensor' } },
  co2_sensor: { color: '#9C7B14', bg: '#F6EDC8', label: { ko: '센서',     en: 'Sensor' } },
  plc:        { color: '#5B6577', bg: '#F4F6F9', label: { ko: 'PLC',      en: 'PLC' } },
  ai:         { color: '#C0364E', bg: '#FBD7DC', label: { ko: 'AI',       en: 'AI' } },
};

// ── key formulas per session ─────────────────────────────────────────────
const LESSON_FORMULAS = {
  1:  [{ name: { ko: '성능 계수',         en: 'Coefficient of Performance' }, eq: 'COP = Q_out / W_in' },
       { name: { ko: '에너지 효율 비',     en: 'Energy Efficiency Ratio' },   eq: 'EER = 3.412 × COP' }],
  2:  [{ name: { ko: '냉동 사이클 COP',   en: 'Refrigeration COP' },          eq: 'COP = (h₁ − h₄) / (h₂ − h₁)' },
       { name: { ko: '카르노 COP 상한',   en: 'Carnot COP limit' },            eq: 'COP_max = T_L / (T_H − T_L)' }],
  3:  [{ name: { ko: '압축기 소요 동력',  en: 'Compressor power' },            eq: 'P = ṁ × (h₂ − h₁) / η_mech' },
       { name: { ko: '냉방 능력',          en: 'Cooling capacity' },            eq: 'Q_cool = ṁ × (h₁ − h₄)  [kW]' }],
  4:  [{ name: { ko: '응축 열량',          en: 'Condenser heat rejection' },    eq: 'Q_cond = ṁ × (h₂ − h₃)  [kW]' },
       { name: { ko: 'LMTD 열교환',       en: 'LMTD heat exchange' },           eq: 'Q = UA × ΔT_LM' }],
  5:  [{ name: { ko: '과열도 (SH)',        en: 'Superheat' },                   eq: 'SH = T_evap_out − T_sat(P_low)  [°C]' },
       { name: { ko: '팽창 등엔탈피',      en: 'Isenthalpic expansion' },       eq: 'h₃ = h₄  (EXV 전후)' }],
  6:  [{ name: { ko: '현열 부하',          en: 'Sensible heat load' },          eq: 'Q_s = ṁ_air × cp × ΔT  [kW]' },
       { name: { ko: '잠열 부하',          en: 'Latent heat load' },            eq: 'Q_l = ṁ_air × hfg × Δω  [kW]' }],
  7:  [{ name: { ko: 'P-h 4개 지점',      en: 'P-h four state points' },       eq: '1→2 압축  2→3 응축  3→4 팽창  4→1 증발' },
       { name: { ko: '비체적 비 (R410A)', en: 'Specific volume ratio (R410A)' },eq: 'v₂/v₁ ≈ 1.6× R22  (고압 특성)' }],
  8:  [{ name: { ko: '히트펌프 COP',      en: 'Heat pump COP' },               eq: 'COP_HP = Q_heat / W = COP_cool + 1' },
       { name: { ko: '제상 개시 조건',    en: 'Defrost trigger' },              eq: 'T_coil < −3°C  또는  ΔP > 기준값' }],
  9:  [{ name: { ko: 'PTC 자기 제한',     en: 'PTC self-limiting' },           eq: 'R(T) = R₀ × exp(α × ΔT)  →  I ↓ 자동' },
       { name: { ko: '보조 열량',          en: 'Auxiliary heat output' },       eq: 'Q_aux = V² / R(T)  [kW]' }],
  10: [{ name: { ko: '팬 법칙 — 풍량',   en: 'Fan law — airflow' },            eq: 'CMM ∝ N  (회전수 비례)' },
       { name: { ko: '팬 법칙 — 동력',   en: 'Fan law — power' },              eq: 'W ∝ N³  (3승 법칙)' }],
  11: [{ name: { ko: '가습 수분량',       en: 'Added moisture' },              eq: 'Δω = ΔRH × p_sat(T) / p_atm  [g/kg]' },
       { name: { ko: '상대 습도 시상수', en: 'RH time constant' },             eq: 'τ = V_room / (ACH × Q_humid)  [min]' }],
  12: [{ name: { ko: 'PM 1차 감쇠',      en: 'PM first-order decay' },         eq: 'PM(t) = PM₀ × e^(−t/τ)' },
       { name: { ko: '시상수 τ',          en: 'Time constant τ' },             eq: 'τ = V_room / CADR  [min]' }],
  13: [{ name: { ko: 'NTC R-T 특성',     en: 'NTC R-T characteristic' },       eq: 'R = R₀ × exp(B × (1/T − 1/T₀))' },
       { name: { ko: '용량형 습도',       en: 'Capacitive RH' },               eq: 'C ∝ ε(RH)  →  ΔC/C₀ ≈ 0.4% / %RH' }],
  14: [{ name: { ko: 'Beer-Lambert 법칙', en: 'Beer-Lambert law' },             eq: 'I = I₀ × exp(−ε × c × L)' },
       { name: { ko: 'ABC 영점 보정',    en: 'ABC baseline correction' },      eq: 'C_drift ≈ min(CO₂, 7-day window)' }],
  15: [{ name: { ko: 'PID 제어',         en: 'PID control' },                  eq: 'u(t) = Kp·e + Ki·∫e dt + Kd·ė' },
       { name: { ko: 'Modbus RTU 프레임', en: 'Modbus RTU frame' },            eq: 'Addr | Func | Data | CRC16' }],
  16: [{ name: { ko: 'EER (순간 효율)',  en: 'Instantaneous EER' },            eq: 'EER = Q_cool [kW] / P_in [kW]' },
       { name: { ko: 'ESEER (계절 효율)', en: 'Seasonal ESEER' },              eq: 'ESEER = Σ(weight_i × EER_i)  (4-point)' }],
};

// ── SectionHeader — colored strip with left border ───────────────────────
function SectionHeader({ sec, extra }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      borderLeft: `4px solid ${sec.main}`,
      paddingLeft: 10, marginBottom: 10,
    }}>
      <span style={{ fontSize: 15 }}>{sec.icon}</span>
      <span style={{
        fontSize: 11.5, fontWeight: 700, color: sec.main,
        letterSpacing: '.07em', textTransform: 'uppercase',
      }}>{sec.label.ko} · {sec.label.en}</span>
      {extra && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--ink-4)', fontFamily: 'JetBrains Mono' }}>{extra}</span>}
    </div>
  );
}

// ── FormulaBox — styled monospace equation block ─────────────────────────
function FormulaBox({ formulas, lang }) {
  if (!formulas || !formulas.length) return null;
  return (
    <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
      {formulas.map((f, i) => (
        <div key={i} style={{
          background: '#F1EEFF', borderRadius: 8,
          border: '1px solid #D4CCFA', padding: '8px 12px',
          display: 'grid', gap: 3,
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#6B5BD2', letterSpacing: '.05em', textTransform: 'uppercase' }}>
            {f.name[lang] || f.name.ko}
          </div>
          <div style={{
            fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 500,
            color: '#2E1E6E', letterSpacing: '.02em',
            background: 'rgba(107,91,210,.07)', padding: '5px 10px', borderRadius: 5,
          }}>
            {f.eq}
          </div>
        </div>
      ))}
    </div>
  );
}

function DeepTheoryBox({ theory, lang, compact = false }) {
  if (!theory) return null;
  const content = theory[lang] || theory.ko || theory.en;
  if (!content) return null;
  const bullets = compact ? (content.bullets || []).slice(0, 3) : (content.bullets || []);

  return (
    <div style={{
      background: SEC.deep.bg, borderRadius: 12,
      border: `1px solid ${SEC.deep.border}`, padding: '16px 18px',
      display: 'grid', gap: 12,
      minHeight: compact ? 0 : 240,
    }}>
      <SectionHeader sec={SEC.deep} />
      <div style={{
        background: 'rgba(255,255,255,.58)',
        border: '1px solid rgba(124,58,237,.12)',
        borderRadius: 10,
        padding: compact ? '12px 14px' : '16px 18px',
      }}>
        {content.summary && (
          <p style={{ margin: 0, fontSize: compact ? 12.5 : 14, color: '#3F266B', lineHeight: compact ? 1.72 : 1.82 }}>
            {content.summary}
          </p>
        )}
        {bullets.length > 0 && (
          <ul style={{ margin: content.summary ? '12px 0 0 0' : 0, padding: '0 0 0 20px', fontSize: compact ? 12.5 : 13.5, color: '#3F266B', lineHeight: compact ? 1.72 : 1.8 }}>
            {bullets.map((item, i) => (
              <li key={i} style={{ marginBottom: 8 }}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function AssessmentBox({ sec, items, lang, compact = false, extra }) {
  if (!items || !items.length) return null;
  const viewItems = compact ? items.slice(0, 2) : items;

  return (
    <div style={{
      background: sec.bg, borderRadius: 12,
      border: `1px solid ${sec.border}`, padding: '16px 18px',
      display: 'grid', gap: 12,
      minHeight: compact ? 0 : 210,
    }}>
      <SectionHeader sec={sec} extra={extra} />
      <div style={{
        background: 'rgba(255,255,255,.62)',
        border: '1px solid rgba(190,24,93,.10)',
        borderRadius: 10,
        padding: compact ? '12px 14px' : '16px 18px',
      }}>
        <ol style={{ margin: 0, padding: '0 0 0 22px', fontSize: compact ? 12.5 : 13.5, color: '#4A2435', lineHeight: compact ? 1.68 : 1.78 }}>
          {viewItems.map((item, i) => (
            <li key={i} style={{ marginBottom: 8 }}>{item}</li>
          ))}
        </ol>
      </div>
      {compact && items.length > viewItems.length && (
        <div style={{ marginTop: 8, fontSize: 10.5, color: 'var(--ink-4)', fontFamily: 'JetBrains Mono' }}>
          {lang === 'ko' ? `+ ${items.length - viewItems.length}개 추가 문항은 본 차수 화면에서 확인` : `+ ${items.length - viewItems.length} more items on the full lesson screen`}
        </div>
      )}
    </div>
  );
}

// ── CURRICULUM SCREEN ────────────────────────────────────────────────────
function CurriculumScreen({ s, set, L, lang, openLesson }) {
  const [filter, setFilter] = useStateD('all');

  const CAT_FILTERS = [
    ['all',        { ko: '전체',      en: 'All' }],
    ['system',     { ko: '시스템',    en: 'System' }],
    ['components', { ko: '주요 부품', en: 'Components' }],
    ['sensors',    { ko: '센서/계측', en: 'Sensors' }],
    ['controls',   { ko: '제어/AI',   en: 'Controls' }],
  ];

  const COMP_GROUPS = {
    system:     ['system'],
    components: ['compressor', 'condenser', 'exv', 'evaporator', 'refrigerant', 'fourway', 'heater', 'blower', 'humidifier', 'purifier'],
    sensors:    ['trh_sensor', 'co2_sensor', 'power_meter'],
    controls:   ['plc', 'ai'],
  };

  const filtered = window.CURRICULUM.filter(c => {
    if (filter === 'all') return true;
    return (COMP_GROUPS[filter] || []).includes(c.comp);
  });

  const totalH = window.CURRICULUM.reduce((a, c) => a + parseInt(c.duration), 0);

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr)', gap: 10, height: '100%', overflow: 'hidden' }}>

      {/* ── Header card ── */}
      <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 12, padding: 12 }}>
        <div>
          <div style={{ fontSize: 10.5, color: 'var(--ink-4)', fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>
            {lang === 'ko' ? '교육 커리큘럼' : 'Training Curriculum'}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.3px' }}>
            {lang === 'ko' ? '16차수 HVAC 실습 과정' : '16-Session HVAC Practical Course'}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.5 }}>
            {lang === 'ko'
              ? `총 ${totalH}시간 · 냉동 사이클·부품·센서·AI 제어 전 영역을 실습으로 학습합니다`
              : `Total ${totalH} h · Covers refrigeration cycle, components, sensors, and AI control through hands-on labs`}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          {/* progress bar */}
          <div style={{ display: 'flex', gap: 2 }}>
            {window.CURRICULUM.map(c => {
              const cat = COMP_CAT[c.comp] || { color: '#8A93A4', bg: '#F4F6F9' };
              return (
                <div key={c.n} title={`차수 ${c.n}`}
                     style={{ width: 14, height: 6, borderRadius: 3, background: cat.color, opacity: .75 }} />
              );
            })}
          </div>
          {/* filter buttons */}
          <div className="seg">
            {CAT_FILTERS.map(([id, lbl]) => (
              <button key={id} className={filter === id ? 'active' : ''}
                      onClick={() => setFilter(id)}>{lbl[lang]}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Session cards grid ── */}
      <div style={{ overflow: 'auto', display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10, alignContent: 'start', minHeight: 0 }}>
        {filtered.map(c => {
          const cat = COMP_CAT[c.comp] || { color: '#8A93A4', bg: '#F4F6F9', label: { ko: '기타', en: 'Other' } };
          return (
            <button key={c.n} onClick={() => openLesson(c.n)}
                    style={{
                      background: '#fff',
                      border: `1.5px solid ${cat.color}30`,
                      borderTop: `3px solid ${cat.color}`,
                      borderRadius: 14, padding: '10px 12px', textAlign: 'left',
                      display: 'grid', gap: 7,
                      boxShadow: '0 1px 4px rgba(0,0,0,.04)',
                      transition: 'box-shadow .15s, transform .15s',
                    }}>
              {/* week + duration */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 11,
                  background: cat.color, color: '#fff',
                  padding: '2px 9px', borderRadius: 999,
                }}>
                  {lang === 'ko' ? `차수 ${String(c.n).padStart(2, '0')}` : `WK ${String(c.n).padStart(2, '0')}`}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '.05em',
                    padding: '2px 7px', borderRadius: 4,
                    background: cat.bg, color: cat.color,
                  }}>{cat.label[lang]}</span>
                  <span style={{ fontSize: 10, color: 'var(--ink-4)', fontFamily: 'JetBrains Mono' }}>{c.duration}</span>
                </div>
              </div>

              {/* title + component name */}
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3, color: 'var(--ink)' }}>{c.title[lang]}</div>
                <div style={{ fontSize: 10.5, color: cat.color, marginTop: 2, fontWeight: 600 }}>
                  {window.COMPONENTS[c.comp]?.name[lang]}
                </div>
              </div>

              {/* first objective, 2-line clamp */}
              <div style={{
                fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5,
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>
                {c.obj[lang][0]}
              </div>

              {/* output signal tags */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {c.outputs.slice(0, 3).map(k => (
                  <span key={k} style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: '.04em',
                    padding: '2px 6px', borderRadius: 4,
                    background: (SIGNAL_META[k]?.color || '#888') + '18',
                    color: SIGNAL_META[k]?.color || '#888',
                    textTransform: 'uppercase',
                  }}>{SIGNAL_META[k]?.[lang] || k}</span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── LESSON DETAIL VIEW ──────────────────────────────────────────────────
function LessonScreen({ s, set, L, lang, lessonN, closeLesson }) {
  const c = window.CURRICULUM.find(x => x.n === lessonN);
  if (!c) return null;
  const comp = window.COMPONENTS[c.comp];
  const cat  = COMP_CAT[c.comp] || { color: '#8A93A4', bg: '#F4F6F9', label: { ko: '기타', en: 'Other' } };
  const formulas = LESSON_FORMULAS[c.n] || [];
  const theory = window.LESSON_THEORY?.[c.n];
  const assessment = window.LESSON_ASSESSMENTS?.[c.n];
  const lessonCardPad = '18px 20px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: 770, overflow: 'hidden' }}>

      {/* ── Header ── */}
      <div className="card" style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center', gap: 14,
        borderTop: `4px solid ${cat.color}`,
        padding: 12,
        flexShrink: 0,
      }}>
        <button className="btn ghost" onClick={() => closeLesson(null)} style={{ paddingLeft: 0 }}>
          <Icon name="chev" size={16} style={{ transform: 'rotate(180deg)' }} />
          {lang === 'ko' ? '← 커리큘럼' : '← Curriculum'}
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 11,
              background: cat.color, color: '#fff',
              padding: '3px 11px', borderRadius: 999,
            }}>
              {lang === 'ko' ? `차수 ${String(c.n).padStart(2, '0')}` : `WEEK ${String(c.n).padStart(2, '0')}`}
            </span>
            <span style={{ fontSize: 9.5, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                           background: cat.bg, color: cat.color }}>{cat.label[lang]}</span>
            <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-.2px' }}>
              {c.title[lang]}
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 3, fontFamily: 'JetBrains Mono' }}>
            {comp?.name[lang]} · {comp?.spec} · {c.duration}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {window.CURRICULUM.find(x => x.n === c.n - 1) && (
            <button className="btn" onClick={() => closeLesson(c.n - 1)}>← {lang === 'ko' ? '이전' : 'Prev'}</button>
          )}
          {window.CURRICULUM.find(x => x.n === c.n + 1) && (
            <button className="btn primary" onClick={() => closeLesson(c.n + 1)}>{lang === 'ko' ? '다음' : 'Next'} →</button>
          )}
        </div>
      </div>

      {/* ── Body: single scroll document with full-width theory sections ── */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 4 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, alignContent: 'start' }}>

          <div style={{
            background: SEC.input.bg, borderRadius: 12,
            border: `1px solid ${SEC.input.border}`, padding: '14px 16px',
          }}>
            <SectionHeader sec={SEC.input} extra={lang === 'ko' ? '보조 실습 패널' : 'practice controls'} />
            <InputPanel s={s} set={set} keys={c.inputs} lang={lang} L={L} />
          </div>

          <div style={{
            background: SEC.obs.bg, borderRadius: 12,
            border: `1px solid ${SEC.obs.border}`, padding: '14px 16px',
          }}>
            <SectionHeader sec={{ ...SEC.obs, label: { ko: '현재 출력값', en: 'Live Outputs' } }}
                           extra={lang === 'ko' ? '관찰용 요약' : 'observation summary'} />
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(c.outputs.length, 3)}, minmax(0, 1fr))`, gap: 8 }}>
              {c.outputs.map(k => {
                const meta = SIGNAL_META[k];
                const val  = meta?.fmt(s[k] ?? 0);
                return (
                  <div key={k} style={{
                    background: '#fff', borderRadius: 10, padding: '10px 12px',
                    border: `1px solid ${meta?.color || '#ccc'}30`,
                    boxShadow: `inset 0 0 0 2px ${meta?.color || '#ccc'}18`,
                  }}>
                    <div style={{ fontSize: 9.5, color: 'var(--ink-3)', fontWeight: 700,
                                  letterSpacing: '.05em', textTransform: 'uppercase' }}>
                      {meta?.[lang] || k}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 18, fontWeight: 700, marginTop: 4,
                                  color: meta?.color || 'var(--ink)' }}>
                      {val}
                      <span style={{ fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'Pretendard',
                                     marginLeft: 3, fontWeight: 400 }}>{meta?.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            gridColumn: '1 / -1',
            background: SEC.obs.bg, borderRadius: 12,
            border: `1px solid ${SEC.obs.border}`, padding: '14px 16px',
            display: 'grid', gridTemplateRows: 'auto 220px',
          }}>
            <SectionHeader sec={SEC.obs} extra="−60s · live" />
            <ObservationChart s={s} outputs={c.outputs} lang={lang} />
          </div>

          <div style={{
            gridColumn: '1 / -1',
            background: SEC.obj.bg, borderRadius: 12,
            border: `1px solid ${SEC.obj.border}`, padding: lessonCardPad,
          }}>
            <SectionHeader sec={SEC.obj} />
            <ol style={{ margin: 0, padding: '0 0 0 24px', fontSize: 14, color: '#1a2d5a', lineHeight: 1.78 }}>
              {c.obj[lang].map((o, i) => (
                <li key={i} style={{ marginBottom: 7, fontWeight: i === 0 ? 600 : 400 }}>{o}</li>
              ))}
            </ol>
          </div>

          <div style={{
            gridColumn: '1 / -1',
            background: SEC.prin.bg, borderRadius: 12,
            border: `1px solid ${SEC.prin.border}`, padding: lessonCardPad,
          }}>
            <SectionHeader sec={SEC.prin} extra={comp?.spec} />
            <p style={{ margin: 0, fontSize: 14, color: '#2e1e6e', lineHeight: 1.84 }}>
              {comp?.principle[lang]}
            </p>
            <FormulaBox formulas={formulas} lang={lang} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <DeepTheoryBox theory={theory} lang={lang} />
          </div>

          <div style={{
            gridColumn: '1 / -1',
            background: SEC.proc.bg, borderRadius: 12,
            border: `1px solid ${SEC.proc.border}`, padding: lessonCardPad,
          }}>
            <SectionHeader sec={SEC.proc} extra={`${c.proc[lang].length}단계`} />
            <ol style={{ margin: 0, padding: '0 0 0 0', listStyle: 'none', fontSize: 13.75, color: '#143d28', lineHeight: 1.76 }}>
              {c.proc[lang].map((p, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <span style={{
                    minWidth: 26, height: 26, borderRadius: 999,
                    background: SEC.proc.main, color: '#fff',
                    fontFamily: 'JetBrains Mono', fontSize: 11, fontWeight: 700,
                    display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1,
                  }}>{i + 1}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <AssessmentBox
              sec={SEC.check}
              items={assessment?.check?.[lang] || assessment?.check?.ko || []}
              lang={lang}
              extra={lang === 'ko' ? '서술형 권장' : 'descriptive'}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <AssessmentBox
              sec={SEC.eval}
              items={assessment?.eval?.[lang] || assessment?.eval?.ko || []}
              lang={lang}
              extra={lang === 'ko' ? '실습 보고서 기준' : 'lab report basis'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── INPUT PANEL ─────────────────────────────────────────────────────────
function InputPanel({ s, set, keys, lang, L }) {
  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {keys.map(k => {
        const meta = INPUT_META[k];
        if (!meta) return null;
        if (meta.kind === 'slider') return (
          <SliderRow key={k} label={meta.label[lang]} unit={meta.unit}
                     min={meta.min} max={meta.max} step={meta.step}
                     value={s[k]} onChange={v => set({ [k]: v })} />
        );
        if (meta.kind === 'toggle') return (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 600 }}>{meta.label[lang]}</span>
            <Toggle on={s[k]} onChange={v => set({ [k]: v })} />
          </div>
        );
        if (meta.kind === 'mode') {
          const isKorea = s.version === 'korea';
          return (
            <div key={k}>
              <div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 700, marginBottom: 6,
                            letterSpacing: '.04em', textTransform: 'uppercase' }}>
                {lang === 'ko' ? '운전 모드' : 'Mode'}
              </div>
              <div className="seg" style={{ width: '100%' }}>
                {['cool', 'auto', 'heat', 'dry', 'fan', 'off']
                  .filter(m => !(!isKorea && m === 'heat'))
                  .map(m => (
                    <button key={m} className={s.mode === m ? 'active' : ''}
                            onClick={() => set({ mode: m })}
                            style={{ flex: 1, fontSize: 11 }}>
                      {L('mode_' + m)}
                    </button>
                  ))}
              </div>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ── OBSERVATION CHART (live multi-series) ────────────────────────────────
function ObservationChart({ s, outputs, lang }) {
  const w = 800, h = 200, padL = 48, padR = 48, padT = 14, padB = 26;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const N = 60;

  const minMax = arr => {
    if (!arr.length) return [0, 1];
    const mn = Math.min(...arr), mx = Math.max(...arr);
    const pad = (mx - mn) * 0.15 + 0.5;
    return [mn - pad, mx + pad];
  };

  const series = outputs.map((k, idx) => {
    const arr = (s.hist[k] || []).slice(-N);
    const [mn, mx] = minMax(arr);
    return { key: k, color: SIGNAL_META[k]?.color || '#888', data: arr, mn, mx, side: idx % 2 === 0 ? 'L' : 'R' };
  });

  const xAt = (i, n) => padL + (i / Math.max(1, n - 1)) * plotW;
  const yAt = (v, mn, mx) => padT + plotH - ((v - mn) / (mx - mn || 1)) * plotH;

  const pathFor = (arr, mn, mx) => {
    if (arr.length < 2) return '';
    const n = arr.length;
    let p = `M ${xAt(0, n)} ${yAt(arr[0], mn, mx)}`;
    for (let i = 1; i < n; i++) {
      const xp = xAt(i - 1, n), yp = yAt(arr[i - 1], mn, mx);
      const x  = xAt(i, n),    y  = yAt(arr[i], mn, mx);
      const cx = (xp + x) / 2;
      p += ` C ${cx} ${yp}, ${cx} ${y}, ${x} ${y}`;
    }
    return p;
  };

  const xTicks = [];
  for (let i = 0; i <= 5; i++) {
    const idx = Math.round((i / 5) * (N - 1));
    xTicks.push({ x: xAt(idx, N), label: idx === N - 1 ? (lang === 'ko' ? '현재' : 'now') : `−${N - 1 - idx}s` });
  }

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <line x1={padL} x2={w - padR} y1={padT + plotH} y2={padT + plotH} stroke="#FAD0B8" />
      {xTicks.map((t, i) => (
        <g key={i}>
          <line x1={t.x} x2={t.x} y1={padT} y2={padT + plotH} stroke="rgba(217,119,87,.15)" />
          <text x={t.x} y={h - 8} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono" fill="#8A93A4">{t.label}</text>
        </g>
      ))}

      {series.map((sr, i) => {
        const meta = SIGNAL_META[sr.key];
        const x = sr.side === 'L' ? padL - 6 : w - padR + 6;
        const anchor = sr.side === 'L' ? 'end' : 'start';
        return (
          <g key={i}>
            {[sr.mn, (sr.mn + sr.mx) / 2, sr.mx].map((v, j) => (
              <text key={j} x={x} y={yAt(v, sr.mn, sr.mx) + 4}
                    textAnchor={anchor} fontSize="9" fontFamily="JetBrains Mono"
                    fill={sr.color} opacity="0.85">
                {meta?.fmt(v)}
              </text>
            ))}
          </g>
        );
      })}

      {series.map((sr, i) => (
        <g key={i}>
          <path d={pathFor(sr.data, sr.mn, sr.mx)} fill="none" stroke={sr.color} strokeWidth="2.5" strokeLinejoin="round" />
          {sr.data.length > 0 && (
            <circle cx={xAt(sr.data.length - 1, sr.data.length)} cy={yAt(sr.data[sr.data.length - 1], sr.mn, sr.mx)}
                    r="3.5" fill={sr.color} />
          )}
        </g>
      ))}

      {/* legend */}
      <g transform={`translate(${padL + 4}, ${padT + 3})`}>
        {series.map((sr, i) => {
          const meta = SIGNAL_META[sr.key];
          return (
            <g key={i} transform={`translate(${i * 130}, 0)`}>
              <rect x="0" y="0" width="10" height="10" rx="2" fill={sr.color} />
              <text x="14" y="9" fontSize="10" fontFamily="Pretendard" fill="#0F1A2E" fontWeight="600">
                {meta?.[lang] || sr.key}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// ── COMPONENT DETAIL OVERLAY ─────────────────────────────────────────────
function ComponentDetailOverlay({ s, set, L, lang, compKey, onClose }) {
  if (!compKey) return null;
  const comp = window.COMPONENTS[compKey];
  if (!comp) return null;

  const lesson  = window.CURRICULUM.find(c => c.comp === compKey);
  const cat     = COMP_CAT[compKey] || { color: '#8A93A4', bg: '#F4F6F9', label: { ko: '기타', en: 'Other' } };
  const inputs  = lesson?.inputs  || ['mode', 'targetTemp', 'fanSpeed'];
  const outputs = lesson?.outputs || ['indoorTemp', 'powerKW'];
  const formulas = LESSON_FORMULAS[lesson?.n] || [];
  const theory = lesson ? window.LESSON_THEORY?.[lesson.n] : null;
  const assessment = lesson ? window.LESSON_ASSESSMENTS?.[lesson.n] : null;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(15,26,46,.44)',
      backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
      display: 'grid', placeItems: 'center',
      zIndex: 50, padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
           style={{
             width: '94%', maxWidth: 1000, maxHeight: '94%',
             background: '#fff', borderRadius: 20,
             border: '1px solid var(--line)',
             borderTop: `4px solid ${cat.color}`,
             boxShadow: '0 32px 90px rgba(0,0,0,.38)',
             display: 'grid', gridTemplateRows: 'auto 1fr', overflow: 'hidden',
           }}>

        {/* Header */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-soft)',
                      display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10,
                        background: cat.bg, color: cat.color,
                        display: 'grid', placeItems: 'center' }}>
            <Icon name={lesson?.icon || 'settings'} size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--ink)' }}>{comp.name[lang]}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', fontFamily: 'JetBrains Mono' }}>{comp.spec}</div>
          </div>
          {lesson && (
            <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 10,
                           background: cat.bg, color: cat.color,
                           padding: '5px 12px', borderRadius: 999 }}>
              {lang === 'ko' ? `차수 ${String(lesson.n).padStart(2, '0')}` : `WEEK ${String(lesson.n).padStart(2, '0')}`}
            </span>
          )}
          <button className="btn ghost" onClick={onClose} style={{ width: 32, padding: 0, justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(300px, 0.85fr)', gap: 18, padding: 20, overflow: 'auto' }}>

          {/* Left — principle + formulas + objectives */}
          <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
            <div style={{
              background: SEC.prin.bg, borderRadius: 12,
              border: `1px solid ${SEC.prin.border}`, padding: '14px 16px',
            }}>
              <SectionHeader sec={SEC.prin} />
              <p style={{ margin: 0, fontSize: 12.5, color: '#2e1e6e', lineHeight: 1.7 }}>
                {comp.principle[lang]}
              </p>
              <FormulaBox formulas={formulas} lang={lang} />
            </div>

            <DeepTheoryBox theory={theory} lang={lang} compact={true} />

            <AssessmentBox
              sec={SEC.check}
              items={assessment?.check?.[lang] || assessment?.check?.ko || []}
              lang={lang}
              compact={true}
            />

            {lesson && (
              <div style={{
                background: SEC.obj.bg, borderRadius: 12,
                border: `1px solid ${SEC.obj.border}`, padding: '14px 16px',
              }}>
                <SectionHeader sec={{ ...SEC.obj, label: { ko: '학습 포인트', en: 'Key Learning Points' } }} />
                <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 12, color: '#1a2d5a', lineHeight: 1.55 }}>
                  {lesson.obj[lang].map((o, i) => <li key={i} style={{ marginBottom: 4 }}>{o}</li>)}
                </ul>
              </div>
            )}
          </div>

          {/* Right — live I/O */}
          <div style={{ display: 'grid', gap: 12, alignContent: 'start' }}>
            <div style={{
              background: SEC.input.bg, borderRadius: 12,
              border: `1px solid ${SEC.input.border}`, padding: '14px 16px',
            }}>
              <SectionHeader sec={SEC.input} />
              <InputPanel s={s} set={set} keys={inputs} lang={lang} L={L} />
            </div>

            <div style={{
              background: SEC.obs.bg, borderRadius: 12,
              border: `1px solid ${SEC.obs.border}`, padding: '14px 16px',
            }}>
              <SectionHeader sec={{ ...SEC.obs, label: { ko: '출력 (실시간)', en: 'Outputs (live)' } }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {outputs.map(k => {
                  const meta = SIGNAL_META[k];
                  return (
                    <div key={k} style={{
                      background: '#fff', borderRadius: 10, padding: '10px 12px',
                      border: `1px solid ${meta?.color || '#ccc'}30`,
                    }}>
                      <div style={{ fontSize: 10, color: 'var(--ink-3)', fontWeight: 600 }}>{meta?.[lang] || k}</div>
                      <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 18, color: meta?.color, marginTop: 3 }}>
                        {meta?.fmt(s[k] ?? 0)}
                        <span style={{ fontSize: 10, color: 'var(--ink-3)', fontFamily: 'Pretendard', marginLeft: 3 }}>{meta?.unit}</span>
                      </div>
                      <Spark data={(s.hist[k] || []).slice(-50)} color={meta?.color} height={26} padY={3} />
                    </div>
                  );
                })}
              </div>
            </div>

            {lesson && (
              <button className="btn primary lg"
                      style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => { onClose(); window.__openLesson?.(lesson.n); }}>
                {lang === 'ko'
                  ? `차수 ${String(lesson.n).padStart(2, '0')} 전체 수업 열기  →`
                  : `Open Full Lesson · Week ${String(lesson.n).padStart(2, '0')}  →`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CurriculumScreen, LessonScreen, ComponentDetailOverlay, SIGNAL_META, INPUT_META });
