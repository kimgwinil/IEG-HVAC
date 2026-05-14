// HVAC simulation engine — 1Hz tick, drives all sensor values from user controls.
// Single source of truth for the prototype's "live" feel.

const { useEffect, useRef, useState } = React;

// Default state for the simulation. User controls live here too so screens
// share a single store.
function makeInitialState() {
  return {
    // version: 'korea' includes heating, 'malaysia' is cooling-only
    version: 'korea',

    // operating
    power: true,
    mode: 'cool',          // 'cool' | 'heat' | 'auto' | 'dry' | 'fan' | 'off'
    targetTemp: 24,        // °C
    targetRH: 50,          // %
    targetCO2: 900,        // ppm ceiling
    fanSpeed: 3,           // 0..5
    humidifierOn: true,
    airPurifierOn: true,
    ventilationOn: true,

    // sensors (will be updated each tick)
    indoorTemp: 27.4,
    indoorRH: 58,
    outdoorTemp: 31.2,
    outdoorRH: 64,
    co2: 1180,
    pm25: 42,
    powerKW: 0,            // electrical input
    eer: 0,                // cooling output / electrical input
    compFreqHz: 0,         // 0..120

    // derived state
    compressorOn: false,
    heaterOn: false,
    fourWayValve: 'cool',  // 'cool' | 'heat'

    // refrigerant cycle state
    exvOpenPct: 35,   // EXV opening 0–100 %
    superheat:  5.5,  // evaporator outlet superheat °C
    subcooling: 3.0,  // condenser outlet subcooling °C

    // history (for sparklines + trend page)
    hist: {
      indoorTemp: [],
      indoorRH: [],
      co2: [],
      powerKW: [],
      eer: [],
      outdoorTemp: [],
      pm25: [],
    },

    // alarms
    alarms: [
      { id: 'al_filter', sev: 'info', t: '08:14:22', ack: false },
      { id: 'al_defrost', sev: 'info', t: '08:32:05', ack: false },
    ],

    // event log
    events: [],

    // wall clock — simulated time (advances with ticks)
    clockMin: 9 * 60 + 24, // 09:24
  };
}

// ── helpers ───────────────────────────────────────────────────────────────
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp  = (a, b, t) => a + (b - a) * t;

// Push to a ring buffer, capped at MAX entries.
const MAX_HIST = 360; // 6 min @ 1Hz, but we step time faster for visuals
function pushHist(arr, v) {
  arr.push(v);
  if (arr.length > MAX_HIST) arr.shift();
}

// One simulation tick. Returns the next state.
function step(s, dt = 1) {
  const next = { ...s, hist: { ...s.hist } };
  const isKorea = s.version === 'korea';

  // ── POWER OFF: freeze everything, zero electrical, skip history ───────
  if (!s.power) {
    next.powerKW      = 0;
    next.eer          = 0;
    next.compFreqHz   = 0;
    next.compressorOn = false;
    next.heaterOn     = false;
    next.exvOpenPct   = 0;
    next.superheat    = 0;
    next.subcooling   = 0;
    // hist arrays kept by reference — no new data pushed (graphs freeze)
    next.clockMin = (s.clockMin + 1) % (24 * 60);
    // clear active alarms (no monitoring when offline)
    next.alarms = s.alarms.filter(a => a.id !== 'al_high_co2' && a.id !== 'al_comp_hz');
    return next;
  }

  // ── thermal model ────────────────────────────────────────────────────
  const indoor = s.indoorTemp;
  const outdoor = s.outdoorTemp;
  const target = s.targetTemp;
  const fan = s.fanSpeed; // 0..5

  // effective mode (auto chooses based on delta)
  let effMode = s.mode;
  if (effMode === 'auto') {
    effMode = indoor > target + 0.5 ? 'cool' : (isKorea && indoor < target - 0.5 ? 'heat' : 'fan');
  }
  if (!isKorea && effMode === 'heat') effMode = 'cool'; // malaysia no heat
  if (!s.power) effMode = 'off';

  // hysteresis: compressor / heater on/off bands
  const wantCool = effMode === 'cool' || effMode === 'dry';
  const wantHeat = effMode === 'heat' && isKorea;
  const deltaCool = indoor - target; // positive = need cooling
  const deltaHeat = target - indoor;

  let compressorOn = s.compressorOn;
  if (wantCool) {
    if (deltaCool > 0.3) compressorOn = true;
    if (deltaCool < -0.4) compressorOn = false;
  } else {
    compressorOn = false;
  }

  let heaterOn = s.heaterOn;
  if (wantHeat) {
    if (deltaHeat > 0.3) heaterOn = true;
    if (deltaHeat < -0.4) heaterOn = false;
  } else {
    heaterOn = false;
  }

  // compressor inverter frequency — scales with load
  let compFreqHz = 0;
  if (compressorOn) {
    compFreqHz = clamp(35 + Math.abs(deltaCool) * 14 + fan * 2, 35, 110);
  } else if (heaterOn) {
    compFreqHz = 0;
  }

  // 4-way valve position (heat pump)
  const fourWayValve = wantHeat ? 'heat' : 'cool';

  // ── EXV / superheat / subcooling ─────────────────────────────────────
  const SH_TARGET = 6.0;
  let exvOpen = s.exvOpenPct ?? 35;
  if (compressorOn) {
    const shErr = (s.superheat ?? 5.5) - SH_TARGET;
    exvOpen = clamp(exvOpen + shErr * 3.0 * dt, 10, 92);
  } else {
    exvOpen = clamp(exvOpen - 3 * dt, 0, 100);
  }
  const shRef = compressorOn
    ? clamp(3.5 + (1 - exvOpen / 100) * 12 - fan * 0.4, 1.5, 20)
    : 0;
  const nextSH = lerp(s.superheat ?? 5.5, shRef, 0.07 * dt) + (Math.random() - 0.5) * 0.18;
  const scRef = compressorOn ? clamp(2.5 + (outdoor - 25) * 0.12, 1, 10) : 0;
  const nextSC = lerp(s.subcooling ?? 3.0, scRef, 0.05 * dt) + (Math.random() - 0.5) * 0.08;

  // heat-flow rates (°C/s)
  const fanFactor = 0.6 + fan * 0.18; // 0.6..1.5
  const coolRate = compressorOn ? 0.012 * fanFactor * (compFreqHz / 60) : 0;
  const heatRate = heaterOn ? 0.014 * fanFactor : 0;
  const leakRate = (outdoor - indoor) * 0.00045; // envelope leakage

  let nextIndoor = indoor + (-coolRate + heatRate + leakRate) * dt * 6;
  // small noise
  nextIndoor += (Math.random() - 0.5) * 0.02;

  // ── humidity ─────────────────────────────────────────────────────────
  let rh = s.indoorRH;
  const humOn = s.humidifierOn && s.power;
  if (humOn) rh += (s.targetRH - rh) * 0.012 * dt * 4;
  if (wantCool && compressorOn) rh -= 0.06 * dt; // coil condenses water
  rh += (Math.random() - 0.5) * 0.15;
  rh = clamp(rh, 15, 95);

  // ── CO2 ──────────────────────────────────────────────────────────────
  let co2 = s.co2;
  // occupancy adds CO2 over time
  co2 += 0.9 * dt;
  if (s.ventilationOn && fan > 0) {
    co2 -= (co2 - 420) * 0.018 * dt * (fan / 3);
  }
  co2 += (Math.random() - 0.5) * 4;
  co2 = clamp(co2, 380, 2200);

  // ── PM2.5 ────────────────────────────────────────────────────────────
  let pm = s.pm25;
  if (s.airPurifierOn && s.power) {
    pm -= (pm - 8) * 0.025 * dt;
  } else {
    pm += 0.18 * dt;
  }
  pm += (Math.random() - 0.5) * 0.6;
  pm = clamp(pm, 4, 180);

  // ── outdoor drift ────────────────────────────────────────────────────
  // slow diurnal-like drift
  let outdoorT = outdoor + Math.sin(Date.now() / 60000) * 0.01 + (Math.random() - 0.5) * 0.04;
  outdoorT = clamp(outdoorT, 18, 38);

  // ── electrical model ─────────────────────────────────────────────────
  let kw = 0.04; // controller + standby
  if (compressorOn) kw += 0.9 + (compFreqHz / 110) * 2.1; // ~0.9..3.0
  if (heaterOn) kw += 3.0;
  if (s.power && fan > 0) kw += 0.05 + fan * 0.06;
  if (humOn) kw += 0.08;
  if (s.airPurifierOn && s.power) kw += 0.07;
  kw += (Math.random() - 0.5) * 0.02;
  kw = Math.max(0.03, kw);

  // Cooling capacity (kW) — only meaningful in cooling
  const coolingKW = compressorOn ? (1.5 + (compFreqHz / 110) * 2.2) : 0;
  const eer = compressorOn ? coolingKW / kw * 3.412 : (heaterOn ? 0 : (s.eer * 0.9));

  // ── push history ─────────────────────────────────────────────────────
  next.hist.indoorTemp  = [...s.hist.indoorTemp];
  next.hist.indoorRH    = [...s.hist.indoorRH];
  next.hist.co2         = [...s.hist.co2];
  next.hist.powerKW     = [...s.hist.powerKW];
  next.hist.eer         = [...s.hist.eer];
  next.hist.outdoorTemp = [...s.hist.outdoorTemp];
  next.hist.pm25        = [...(s.hist.pm25 || [])];
  pushHist(next.hist.indoorTemp,  nextIndoor);
  pushHist(next.hist.indoorRH,    rh);
  pushHist(next.hist.co2,         co2);
  pushHist(next.hist.powerKW,     kw);
  pushHist(next.hist.eer,         eer);
  pushHist(next.hist.outdoorTemp, outdoorT);
  pushHist(next.hist.pm25,        pm);

  // ── assemble next state ──────────────────────────────────────────────
  next.indoorTemp    = nextIndoor;
  next.indoorRH      = rh;
  next.outdoorTemp   = outdoorT;
  next.co2           = co2;
  next.pm25          = pm;
  next.powerKW       = kw;
  next.eer           = eer;
  next.compFreqHz    = compFreqHz;
  next.compressorOn  = compressorOn;
  next.heaterOn      = heaterOn;
  next.fourWayValve  = fourWayValve;
  next.exvOpenPct    = exvOpen;
  next.superheat     = clamp(nextSH, 0, 25);
  next.subcooling    = clamp(nextSC, 0, 12);
  next.clockMin = (s.clockMin + 1) % (24 * 60); // 1 sim-minute per tick

  // ── alarms ────────────────────────────────────────────────────────────
  // refresh CO2 alarm
  let alarms = s.alarms.filter(a => a.id !== 'al_high_co2');
  if (co2 > s.targetCO2) {
    alarms = [{ id: 'al_high_co2', sev: 'warn', t: fmtClock(next.clockMin), ack: false }, ...alarms];
  }
  if (compFreqHz > 100) {
    if (!alarms.find(a => a.id === 'al_comp_hz')) {
      alarms = [{ id: 'al_comp_hz', sev: 'info', t: fmtClock(next.clockMin), ack: false }, ...alarms];
    }
  } else {
    alarms = alarms.filter(a => a.id !== 'al_comp_hz');
  }
  next.alarms = alarms.slice(0, 8);

  return next;
}

function fmtClock(min) {
  const h = Math.floor(min / 60), m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Pre-populate history with a believable curve so charts aren't empty at load.
function seedHistory(s) {
  let cur = { ...s };
  for (let i = 0; i < 180; i++) cur = step(cur, 1);

  // Guarantee compressor is visibly running when the dashboard first opens.
  // 180 seed ticks often land in the dead band (±0.4°C of target), leaving
  // the compressor idle and giving the impression nothing works.
  const effMode = cur.mode === 'auto'
    ? (cur.indoorTemp > cur.targetTemp + 0.5 ? 'cool' : 'heat')
    : cur.mode;
  if (cur.power && (effMode === 'cool' || effMode === 'dry')) {
    cur.indoorTemp    = cur.targetTemp + 2.0; // just above ON threshold
    cur.compressorOn  = true;
  } else if (cur.power && effMode === 'heat' && cur.version === 'korea') {
    cur.indoorTemp    = cur.targetTemp - 2.5;
    cur.heaterOn      = true;
  }
  return cur;
}

// ── React hook ───────────────────────────────────────────────────────────
function useSimulation() {
  const [state, setState] = useState(() => seedHistory(makeInitialState()));
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const id = setInterval(() => {
      setState(prev => step(prev, 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // setter helper — merge partial updates and reseed derived bits when needed
  const update = (patch) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  return [state, update];
}

window.useSimulation = useSimulation;
window.fmtClock = fmtClock;
