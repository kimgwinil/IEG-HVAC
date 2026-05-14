// IEG-HVAC Educational Curriculum — 16-session bilingual training data.
// Each session focuses on one component or system aspect, with:
//   - learning objectives
//   - theory (key concepts, formulas, characteristics)
//   - specs of the actual hardware
//   - lab procedure
//   - inputs the learner can change in simulation
//   - outputs to observe (state.hist keys for live sparkline)

window.COMPONENTS = {
  system: {
    name: { ko: '전체 시스템',           en: 'Whole System' },
    spec: '3Φ 380V · 60Hz · max 10 kW · R410A',
    principle: {
      ko: '냉동 사이클(압축→응축→팽창→증발) 위에 가습·공기청정·환기·난방 모듈을 결합해 실내 환경을 종합 제어한다. AI 엔진이 센서값을 실시간 분석하여 압축기 주파수·팬 속도·밸브 개도를 최적화한다.',
      en: 'A refrigeration cycle (compress → condense → expand → evaporate) combined with humidification, air purification, ventilation, and heating modules — coordinated in real time by the AI engine which tunes compressor frequency, fan speed, and valve opening.'
    },
  },
  compressor: {
    name: { ko: '인버터 압축기', en: 'Inverter Compressor' },
    spec: '3.0 kW Inverter Scroll · R410A · 35–110 Hz',
    principle: {
      ko: '회전 스크롤이 저압 냉매 가스를 흡입해 고압·고온으로 압축한다. 인버터 제어는 부하에 따라 주파수를 35~110 Hz로 변조해 정확한 용량 제어와 에너지 절감을 가능하게 한다.',
      en: 'Orbiting scroll compresses low-pressure refrigerant gas into a high-pressure, high-temperature state. Inverter control modulates frequency 35–110 Hz to match load — enabling precise capacity control and energy savings.'
    },
  },
  condenser: {
    name: { ko: '응축기', en: 'Condenser' },
    spec: 'Air-Cooled, Fin & Tube · 1500 CMM 팬',
    principle: {
      ko: '고온 고압 가스가 외기와 열교환하여 응축(상변화)된다. 외기 온도가 낮을수록 응축 압력이 낮아져 효율이 상승한다. 핀의 면적과 팬 풍량이 열교환 성능을 결정한다.',
      en: 'High-pressure gas releases heat to outdoor air and condenses (phase change). Lower outdoor temperature → lower condensing pressure → higher efficiency. Fin area and fan airflow govern heat-exchange capacity.'
    },
  },
  exv: {
    name: { ko: '전자식 팽창변 (EXV)', en: 'Electronic Expansion Valve' },
    spec: 'Danfoss ETS 6 · 480 step',
    principle: {
      ko: '고압 액체 냉매를 좁은 통로로 통과시켜 압력·온도를 급격히 낮춘다. 스텝 모터가 480 분해능으로 개도를 조절하며 증발기 출구의 과열도(Superheat)를 목표값으로 유지한다.',
      en: 'Throttles high-pressure liquid through a narrow orifice, causing rapid pressure & temperature drop. A 480-step motor adjusts opening to maintain target superheat at the evaporator outlet.'
    },
  },
  evaporator: {
    name: { ko: '증발기', en: 'Evaporator' },
    spec: 'Aluminum Fin & Tube · 1500 CMM 송풍',
    principle: {
      ko: '저압 액냉매가 실내 공기로부터 열을 흡수하며 증발한다. 흡수 열량 Q = ṁ·hfg. 송풍량이 클수록 현열 부하 처리량이 증가하지만, 잠열(습기 제거)은 감소한다.',
      en: 'Low-pressure liquid refrigerant absorbs heat from indoor air and evaporates. Heat absorbed Q = ṁ·hfg. Higher airflow increases sensible-load handling, but reduces latent (dehumidification) effect.'
    },
  },
  refrigerant: {
    name: { ko: '냉매 R410A', en: 'Refrigerant R410A' },
    spec: 'R32 50% + R125 50% · GWP 2,088',
    principle: {
      ko: 'R22 대체 혼합 냉매로 오존층 파괴지수가 0이다. 고압 운전이 특징(작동 압력 ≈ R22의 1.6배)이며, 응축·증발 압력의 P-h 다이어그램으로 사이클 효율을 해석한다.',
      en: 'R22-replacement blend with ODP = 0. Operates at high pressure (≈ 1.6× R22). Cycle efficiency is analyzed on the pressure–enthalpy (P-h) diagram.'
    },
  },
  fourway: {
    name: { ko: '4방향 밸브', en: '4-Way Reversing Valve' },
    spec: 'Danfoss SV · 솔레노이드 작동',
    principle: {
      ko: '솔레노이드 신호로 냉매 흐름을 반전시켜 동일 시스템을 냉방·난방 양방향으로 사용한다(히트펌프). 난방 모드에서는 실외 코일이 증발기, 실내 코일이 응축기로 작동한다.',
      en: 'Solenoid reverses refrigerant flow so the same system runs as either cooling or heating (heat pump). In heat mode, the outdoor coil acts as evaporator and the indoor coil as condenser.'
    },
  },
  heater: {
    name: { ko: 'PTC 전기 히터', en: 'PTC Electric Heater' },
    spec: '3 kW · 380V · self-regulating PTC',
    principle: {
      ko: 'PTC(Positive Temperature Coefficient) 소자는 온도가 오르면 저항이 증가해 자체적으로 전류를 제한한다. 외기가 낮아 히트펌프 능력이 부족할 때 보조 가열로 즉시 응답한다.',
      en: 'A PTC element\'s resistance rises with temperature, so it self-limits current. Provides instant auxiliary heat when the heat pump\'s capacity drops at low outdoor temperatures.'
    },
  },
  blower: {
    name: { ko: '송풍팬', en: 'Blower Fan' },
    spec: 'AC Fan · 0 ~ 1500 CMM',
    principle: {
      ko: '회전수에 비례하여 풍량을 만들어 실내 공기를 코일로 순환시킨다. CMM ∝ RPM, 풍압 ∝ RPM², 동력 ∝ RPM³ (팬 법칙). 단계별(L0~L5) 제어로 소음과 효율의 균형을 잡는다.',
      en: 'Speed-proportional airflow circulates indoor air across the coil. CMM ∝ RPM, pressure ∝ RPM², power ∝ RPM³ (fan laws). Step control (L0–L5) balances noise vs efficiency.'
    },
  },
  humidifier: {
    name: { ko: '초음파 가습기', en: 'Ultrasonic Humidifier' },
    spec: 'Ultrasonic Type · 12 L/h · 1.7 MHz',
    principle: {
      ko: '1.7 MHz 압전 진동자가 수면에 강한 진동을 가해 1~5 μm 크기의 미세 물 입자를 만들어 공기 중으로 분산시킨다. 송풍기와 함께 균일한 습도 분포를 형성한다.',
      en: 'A 1.7 MHz piezo-electric vibrator creates 1–5 μm water droplets at the water surface, then disperses them with airflow for uniform humidity distribution.'
    },
  },
  purifier: {
    name: { ko: '공기 청정 모듈', en: 'Air Purification Module' },
    spec: 'HEPA H13 + Activated Carbon',
    principle: {
      ko: 'HEPA H13 필터가 0.3 μm 입자를 99.95% 포집하고, 활성탄층이 VOC·악취·포름알데히드를 흡착 제거한다. 필터 차압 상승을 모니터링해 잔여 수명을 예측한다.',
      en: 'HEPA H13 captures 99.95% of 0.3 μm particles; an activated-carbon bed adsorbs VOCs, odors, formaldehyde. Pressure drop is monitored to predict remaining filter life.'
    },
  },
  trh_sensor: {
    name: { ko: '온/습도 센서', en: 'Temperature & RH Sensor' },
    spec: '-20 ~ 60°C, 0 ~ 100 %RH · ±0.3°C / ±2%RH',
    principle: {
      ko: '온도는 NTC 서미스터의 저항-온도 특성을 측정하고, 습도는 정전용량형 폴리머 박막의 유전율 변화를 통해 측정한다. 측정 신호는 4-20 mA 또는 디지털(I²C/Modbus)로 PLC에 전송된다.',
      en: 'Temperature via NTC thermistor R-T curve. Humidity via capacitive polymer film whose dielectric constant changes with adsorbed water. Output as 4-20 mA or digital (I²C/Modbus) to the PLC.'
    },
  },
  co2_sensor: {
    name: { ko: 'CO₂ 센서 (NDIR)', en: 'CO₂ Sensor (NDIR)' },
    spec: '0 ~ 2000 ppm · NDIR 방식',
    principle: {
      ko: 'NDIR(Non-Dispersive Infrared)은 4.26 μm 파장의 적외선이 CO₂ 분자에 의해 흡수되는 양을 측정해 농도를 산출한다. 자동영점 보정(ABC) 알고리즘으로 장기 안정성을 유지한다.',
      en: 'NDIR measures absorption of 4.26 μm IR light by CO₂ molecules. An automatic baseline-correction (ABC) algorithm preserves long-term stability.'
    },
  },
  plc: {
    name: { ko: 'PLC + I/O', en: 'PLC + I/O Module' },
    spec: 'LS PLC · SMPS 24V 10A',
    principle: {
      ko: '래더 로직으로 디지털·아날로그 I/O를 스캔(보통 10~50 ms)하면서 인터록·시퀀스·PID 제어를 수행한다. SMPS는 산업용 24V DC 전원을 안정 공급한다.',
      en: 'Scans digital/analog I/O (10–50 ms) under ladder logic — handles interlocks, sequencing, and PID loops. SMPS provides regulated 24 V DC industrial power.'
    },
  },
  power_meter: {
    name: { ko: '전력 측정 모듈', en: 'Power Measurement Module' },
    spec: '3Φ · 380V · 5A 변류기',
    principle: {
      ko: '3상 전압과 변류기(CT) 전류를 동기 샘플링해 유효전력 P=VI·cosφ, 역률, 고조파(THD)를 산출한다. 누적값(kWh)으로 에너지 분석·요금 계산에 사용된다.',
      en: 'Synchronously samples 3-phase voltage and CT current to compute real power P = VI·cosφ, power factor, and harmonics (THD). Accumulated kWh feeds energy analysis and tariff calculation.'
    },
  },
  ai: {
    name: { ko: 'AI 제어 엔진', en: 'AI Control Engine' },
    spec: 'IEG-AI core 1.6 · edge inference',
    principle: {
      ko: '센서 시계열을 입력으로 받아 (1) 부하 예측, (2) 최적 압축기 주파수·팬·EXV 개도 설정, (3) 이상 진단을 수행한다. 강화학습으로 누적 에너지 사용량을 최소화한다.',
      en: 'Takes sensor time-series in, then (1) forecasts load, (2) sets optimal compressor freq / fan / EXV opening, and (3) flags faults. Reinforcement learning minimizes cumulative energy use.'
    },
  },
};

window.CURRICULUM = [
  // ── Session 1 ───────────────────────────────────────────────────────
  {
    n: 1, comp: 'system',
    title: { ko: 'HVAC 시스템 개요',        en: 'HVAC System Overview' },
    icon: 'dashboard',
    duration: '3h',
    obj: {
      ko: [
        '냉동 사이클의 기본 구성과 원리를 이해한다',
        '본 트레이닝 시스템의 17개 부품 위치와 기능을 식별한다',
        '실내 환경 제어의 4대 요소(온도·습도·CO₂·청정)를 설명한다',
      ],
      en: [
        'Understand the basic refrigeration cycle and its principles',
        'Identify location & function of the 17 components on this training system',
        'Explain the 4 elements of indoor environment control (T · RH · CO₂ · cleanliness)',
      ],
    },
    proc: {
      ko: ['전원 ON → 시스템 자가 진단 관찰', '모드를 Auto/Cool/Heat로 전환하며 응답 시간 측정', '6개 핵심 지표(실내 T·RH·CO₂·전력·EER·외기 T)의 1시간 변화 기록'],
      en: ['Power ON → observe self-diagnostic sequence', 'Switch modes Auto/Cool/Heat — measure response time', 'Log 6 key signals (Indoor T·RH·CO₂·Power·EER·Outdoor T) over 1 hour'],
    },
    inputs:  ['mode', 'targetTemp', 'fanSpeed'],
    outputs: ['indoorTemp', 'indoorRH', 'co2', 'powerKW'],
  },

  // ── Session 2 ───────────────────────────────────────────────────────
  {
    n: 2, comp: 'system',
    title: { ko: '냉동 사이클의 4대 요소',  en: 'Four Elements of the Refrigeration Cycle' },
    icon: 'schematic',
    duration: '3h',
    obj: {
      ko: ['압축·응축·팽창·증발 4단계를 P-h 선도 상에 표시한다', '각 단계의 입출구 상태(P, T, h)를 정성적으로 비교한다', '카르노 효율과 실제 효율(COP)의 차이를 토론한다'],
      en: ['Mark the 4 stages (compress · condense · expand · evaporate) on a P-h diagram', 'Qualitatively compare inlet/outlet state (P, T, h) at each stage', 'Discuss the gap between Carnot and actual COP'],
    },
    proc: {
      ko: ['압축기 RUN 후 4개 지점(1·2·3·4) 온도를 동시 측정', '냉방 부하 변경 시 EER 변화 관찰', '응축 압력과 외기 온도의 상관관계 도시화'],
      en: ['With compressor running, simultaneously measure T at points 1·2·3·4', 'Observe EER change when cooling load is varied', 'Plot condensing pressure vs outdoor temperature'],
    },
    inputs:  ['mode', 'targetTemp'],
    outputs: ['indoorTemp', 'outdoorTemp', 'compFreqHz', 'eer'],
  },

  // ── Session 3 ───────────────────────────────────────────────────────
  {
    n: 3, comp: 'compressor',
    title: { ko: '인버터 스크롤 압축기',     en: 'Inverter Scroll Compressor' },
    icon: 'mode',
    duration: '3h',
    obj: {
      ko: ['스크롤 구조와 회전 원리를 설명한다', '인버터 주파수(35~110 Hz)와 냉방 능력의 관계를 도출한다', '인버터 vs 정속형 효율을 비교한다'],
      en: ['Explain scroll geometry and orbiting mechanism', 'Derive the relation between inverter frequency (35–110 Hz) and cooling capacity', 'Compare inverter vs fixed-speed efficiency'],
    },
    proc: {
      ko: ['설정 온도와 실내 온도의 차이(ΔT)를 5단계로 변화', '각 ΔT에서 압축기 주파수와 전력 측정', 'P/Hz 그래프로 비례성 확인'],
      en: ['Vary setpoint–indoor ΔT in 5 steps', 'Record compressor frequency & power at each ΔT', 'Plot P/Hz to verify proportionality'],
    },
    inputs:  ['targetTemp', 'mode'],
    outputs: ['compFreqHz', 'powerKW', 'indoorTemp'],
  },

  // ── Session 4 ───────────────────────────────────────────────────────
  {
    n: 4, comp: 'condenser',
    title: { ko: '공랭식 응축기',           en: 'Air-Cooled Condenser' },
    icon: 'sun',
    duration: '3h',
    obj: {
      ko: ['핀-튜브 열교환기의 열저항 구성을 분석한다', '외기 온도와 응축 압력의 관계를 이해한다', '팬 풍량 감소가 응축 효율에 미치는 영향을 측정한다'],
      en: ['Analyze the thermal-resistance breakdown of a fin-tube heat exchanger', 'Understand the link between outdoor temperature and condensing pressure', 'Measure how reduced fan airflow degrades condensing efficiency'],
    },
    proc: {
      ko: ['실외 팬 회전수를 임의 변경 (시뮬레이션상 외기 변화)', '응축측 추정 온도(외기+ΔT) 기록', '필름 막힘을 가정한 효율 저하 실험'],
      en: ['Vary outdoor-fan speed (or ambient via simulation)', 'Record estimated condensing T (= outdoor + ΔT)', 'Simulate fouling and observe efficiency drop'],
    },
    inputs:  ['mode', 'fanSpeed'],
    outputs: ['outdoorTemp', 'compFreqHz', 'eer'],
  },

  // ── Session 5 ───────────────────────────────────────────────────────
  {
    n: 5, comp: 'exv',
    title: { ko: '전자식 팽창변 (EXV)',     en: 'Electronic Expansion Valve' },
    icon: 'mode',
    duration: '3h',
    obj: {
      ko: ['EXV의 480-step 분해능과 과열도 제어를 이해한다', '슈퍼히트(SH) 변화에 따른 EXV 개도 변화를 관찰한다', '캐필러리(고정 오리피스) 방식과의 차이를 토론한다'],
      en: ['Understand 480-step EXV resolution and superheat control', 'Observe EXV opening change as superheat (SH) varies', 'Contrast with capillary (fixed-orifice) systems'],
    },
    proc: {
      ko: ['시뮬레이션에서 부하 변동(설정 온도 step 응답)', 'EXV 개도(%)와 압축기 주파수의 동기 관찰', 'SH 안정 시간 측정'],
      en: ['Apply load disturbance (step setpoint change)', 'Observe EXV opening (%) and compressor freq in sync', 'Measure SH settling time'],
    },
    inputs:  ['targetTemp', 'mode'],
    outputs: ['compFreqHz', 'indoorTemp', 'powerKW'],
  },

  // ── Session 6 ───────────────────────────────────────────────────────
  {
    n: 6, comp: 'evaporator',
    title: { ko: '실내 증발기 (실내기)',    en: 'Indoor Evaporator (Indoor Unit)' },
    icon: 'snow',
    duration: '3h',
    obj: {
      ko: ['현열·잠열 부하의 분배를 이해한다', '송풍량 변화에 따른 코일 표면 온도와 응축수량 관계를 관찰한다', '코일 동결을 방지하기 위한 최소 풍량 기준을 도출한다'],
      en: ['Understand sensible vs latent heat partitioning', 'Observe coil surface T vs condensate yield as airflow changes', 'Derive minimum airflow to prevent coil freeze-up'],
    },
    proc: {
      ko: ['팬 속도를 L1 → L5로 단계 변경', '실내 RH 변화와 응축수 양 추정', '코일 표면 온도(증발 온도 +ΔT)와 압축기 부하의 비교'],
      en: ['Step fan from L1 → L5', 'Track indoor RH change and estimated condensate', 'Compare coil-surface T (evap T + ΔT) vs compressor load'],
    },
    inputs:  ['fanSpeed', 'mode'],
    outputs: ['indoorTemp', 'indoorRH', 'compFreqHz'],
  },

  // ── Session 7 ───────────────────────────────────────────────────────
  {
    n: 7, comp: 'refrigerant',
    title: { ko: '냉매 R410A 와 P-h 선도',  en: 'Refrigerant R410A and the P-h Diagram' },
    icon: 'drop',
    duration: '3h',
    obj: {
      ko: ['R410A의 물성과 R22 대비 특징을 설명한다', '운전 데이터를 P-h 선도에 매핑한다', 'GWP·ODP 환경 영향과 차세대 냉매(R32, HFO) 비교'],
      en: ['Describe R410A properties vs R22', 'Map operating data onto a P-h diagram', 'Compare GWP/ODP and next-gen refrigerants (R32, HFO)'],
    },
    proc: {
      ko: ['압축기 ON 후 5분간의 압력·온도 데이터 수집', 'P-h 선도 위에 4개 지점 작도', '이상 사이클 vs 실제 사이클 차이 토의'],
      en: ['Capture 5 min of pressure & temperature data after compressor start', 'Plot the 4 cycle points on a P-h chart', 'Compare ideal vs actual cycle losses'],
    },
    inputs:  ['mode', 'targetTemp'],
    outputs: ['outdoorTemp', 'indoorTemp', 'compFreqHz', 'powerKW'],
  },

  // ── Session 8 ───────────────────────────────────────────────────────
  {
    n: 8, comp: 'fourway',
    title: { ko: '4방향 밸브와 히트펌프',   en: '4-Way Valve & Heat Pump Operation' },
    icon: 'schematic',
    duration: '3h',
    obj: {
      ko: ['4-way 밸브 동작 시 냉매 흐름 변화를 설명한다', '냉방-난방 전환 시 응답 시간과 압력 균등화를 관찰한다', '제상(Defrost) 사이클의 트리거 조건을 이해한다'],
      en: ['Explain refrigerant-flow change when the 4-way valve switches', 'Observe transition time and pressure-equalization when changing cool↔heat', 'Understand the trigger conditions for the defrost cycle'],
    },
    proc: {
      ko: ['Cooling → Heating 모드 전환 명령', '밸브 솔레노이드 ON 후 30초간 압력 평형 관찰', '실내·실외 코일 역할 반전 확인'],
      en: ['Command Cooling → Heating mode change', 'Observe pressure equalization for 30 s after solenoid actuation', 'Confirm role swap of indoor/outdoor coils'],
    },
    inputs:  ['mode', 'targetTemp'],
    outputs: ['indoorTemp', 'outdoorTemp', 'compFreqHz', 'powerKW'],
  },

  // ── Session 9 ───────────────────────────────────────────────────────
  {
    n: 9, comp: 'heater',
    title: { ko: 'PTC 전기 히터 (보조 가열)', en: 'PTC Electric Heater (Auxiliary)' },
    icon: 'sun',
    duration: '2h',
    obj: {
      ko: ['PTC 소자의 자가 전류 제한 특성을 설명한다', '저외기 조건에서 보조 히터 투입 시점을 결정한다', '히트펌프 + 보조 히터의 통합 효율을 평가한다'],
      en: ['Explain PTC self-limiting current behavior', 'Decide when to engage auxiliary heat at low outdoor temperatures', 'Evaluate combined efficiency of heat pump + auxiliary heat'],
    },
    proc: {
      ko: ['난방 모드 + 외기 강제 저온 설정', '히터 ON/OFF 전환 시 실내 온도 상승율 비교', '전력 소비의 단계적 증가 관찰'],
      en: ['Heat mode + force-low outdoor T', 'Compare indoor T rise-rate with heater ON vs OFF', 'Observe stepped power-consumption increase'],
    },
    inputs:  ['mode', 'targetTemp'],
    outputs: ['indoorTemp', 'powerKW', 'outdoorTemp'],
  },

  // ── Session 10 ──────────────────────────────────────────────────────
  {
    n: 10, comp: 'blower',
    title: { ko: '송풍팬과 팬 법칙',         en: 'Blower Fan & Fan Laws' },
    icon: 'fan',
    duration: '2h',
    obj: {
      ko: ['팬 법칙(풍량∝N, 압력∝N², 동력∝N³) 검증', '단계별 풍량(CMM)과 소비 전력 측정', '필터 막힘(정압 상승)이 풍량에 미치는 영향'],
      en: ['Verify fan laws (Q ∝ N, ΔP ∝ N², W ∝ N³)', 'Measure CMM and power at each fan step', 'Effect of filter loading (rising static pressure) on airflow'],
    },
    proc: {
      ko: ['팬 L0 → L5 단계별 30초 운전', '추정 CMM = 단계 × 280', '전력 측정값과 N³ 모델 비교'],
      en: ['Run fan L0 → L5 for 30 s each', 'Estimated CMM = level × 280', 'Compare measured W against the N³ model'],
    },
    inputs:  ['fanSpeed'],
    outputs: ['indoorTemp', 'powerKW', 'co2'],
  },

  // ── Session 11 ──────────────────────────────────────────────────────
  {
    n: 11, comp: 'humidifier',
    title: { ko: '초음파 가습기',           en: 'Ultrasonic Humidifier' },
    icon: 'drop',
    duration: '2h',
    obj: {
      ko: ['초음파 분무의 원리와 입자 크기를 이해한다', '가습량과 실내 RH 상승률 관계를 도출한다', '결로(과가습) 방지를 위한 상한선 설정'],
      en: ['Understand ultrasonic atomization principle and droplet size', 'Derive the relation between humidification rate and indoor-RH rise', 'Set an upper bound to prevent condensation (over-humidification)'],
    },
    proc: {
      ko: ['목표 RH를 50% → 65%로 변경', '가습기 ON 후 도달 시간 측정', '냉방 코일 가동시 RH 변화 비교'],
      en: ['Change target RH 50% → 65%', 'Measure time to reach setpoint after humidifier ON', 'Compare RH behavior with cooling coil engaged'],
    },
    inputs:  ['targetRH', 'humidifierOn', 'fanSpeed'],
    outputs: ['indoorRH', 'indoorTemp'],
  },

  // ── Session 12 ──────────────────────────────────────────────────────
  {
    n: 12, comp: 'purifier',
    title: { ko: 'HEPA + 활성탄 공기 청정', en: 'HEPA + Activated-Carbon Air Purification' },
    icon: 'purifier',
    duration: '2h',
    obj: {
      ko: ['HEPA H13 등급의 포집 효율과 차압 특성을 이해한다', '활성탄의 VOC 흡착 메커니즘을 설명한다', '필터 수명 예측 알고리즘(누적 차압 기반)'],
      en: ['Understand HEPA H13 capture efficiency and pressure-drop curve', 'Explain VOC adsorption on activated carbon', 'Filter-life prediction algorithm based on cumulative ΔP'],
    },
    proc: {
      ko: ['공기 청정기 ON', 'PM2.5 농도 변화의 1차 지수 감쇠 곡선 확인', '시간 상수 τ 와 풍량의 관계 도출'],
      en: ['Switch purifier ON', 'Observe 1st-order exponential decay of PM2.5', 'Derive relation between time constant τ and airflow'],
    },
    inputs:  ['airPurifierOn', 'fanSpeed'],
    outputs: ['indoorTemp', 'co2'],
  },

  // ── Session 13 ──────────────────────────────────────────────────────
  {
    n: 13, comp: 'trh_sensor',
    title: { ko: '온/습도 센서',            en: 'Temperature / RH Sensors' },
    icon: 'thermo',
    duration: '2h',
    obj: {
      ko: ['NTC 서미스터의 R-T 곡선과 캘리브레이션', '정전용량 습도 센서의 응답 시간 측정', '하이스테리시스와 자기발열 오차 보정'],
      en: ['NTC thermistor R-T curve and calibration', 'Capacitive-RH sensor response time', 'Hysteresis & self-heating error correction'],
    },
    proc: {
      ko: ['알려진 온도 환경에서 센서 출력 vs 기준값 비교', '습도 챔버 step 시험 후 응답 시간 측정', '오차 보정 LUT 구성 실습'],
      en: ['Compare sensor output vs reference at known temperatures', 'Measure response time after a humidity-chamber step', 'Build an error-compensation lookup table'],
    },
    inputs:  ['mode', 'targetRH'],
    outputs: ['indoorTemp', 'indoorRH', 'outdoorTemp'],
  },

  // ── Session 14 ──────────────────────────────────────────────────────
  {
    n: 14, comp: 'co2_sensor',
    title: { ko: 'NDIR CO₂ 센서',           en: 'NDIR CO₂ Sensor' },
    icon: 'co2',
    duration: '2h',
    obj: {
      ko: ['NDIR 방식의 광-가스 상호작용 원리 이해', '환기량과 CO₂ 농도 평형의 관계 도출', 'ABC 자동 영점 보정 알고리즘 분석'],
      en: ['Understand the IR-gas interaction principle of NDIR', 'Derive ventilation flow vs equilibrium CO₂ concentration', 'Analyze the ABC automatic-baseline-correction algorithm'],
    },
    proc: {
      ko: ['환기 OFF 상태에서 CO₂ 상승 속도 측정', '환기 ON 후 감쇠 곡선 기록', '점유 인원 추정 모델과 비교'],
      en: ['Log CO₂ rise rate with ventilation OFF', 'Record decay curve after ventilation ON', 'Compare against an occupancy-estimation model'],
    },
    inputs:  ['ventilationOn', 'fanSpeed', 'targetCO2'],
    outputs: ['co2', 'powerKW'],
  },

  // ── Session 15 ──────────────────────────────────────────────────────
  {
    n: 15, comp: 'plc',
    title: { ko: 'PLC 통합 제어 & 인버터',   en: 'PLC Integrated Control & Inverter' },
    icon: 'settings',
    duration: '3h',
    obj: {
      ko: ['래더 로직과 인터록 시퀀스를 이해한다', '인버터 ↔ PLC 통신(Modbus RTU) 구성', 'PID 파라미터 튜닝의 응답 특성 비교'],
      en: ['Understand ladder logic and interlock sequences', 'Configure Inverter ↔ PLC communication (Modbus RTU)', 'Compare response characteristics under different PID tunings'],
    },
    proc: {
      ko: ['모드 전환 시퀀스 트레이스 (DI → 로직 → DO)', 'P, PI, PID 게인 변경 후 정착 시간 비교', '비상 정지 인터록 동작 확인'],
      en: ['Trace mode-switch sequence (DI → logic → DO)', 'Compare settling time under P, PI, PID gains', 'Verify emergency-stop interlock behavior'],
    },
    inputs:  ['mode', 'targetTemp', 'fanSpeed', 'power'],
    outputs: ['indoorTemp', 'compFreqHz', 'powerKW'],
  },

  // ── Session 16 ──────────────────────────────────────────────────────
  {
    n: 16, comp: 'ai',
    title: { ko: 'AI 자동 제어 · 종합 실습', en: 'AI Auto-Control · Integrated Lab' },
    icon: 'ai',
    duration: '4h',
    obj: {
      ko: ['AI 엔진의 입력 특성(센서 시계열)을 이해한다', '강화학습 기반 에너지 최적화 결과를 평가한다', '수동 제어 vs AI 제어의 에너지 사용량을 비교한다'],
      en: ['Understand the AI engine\'s input features (sensor time-series)', 'Evaluate reinforcement-learning energy-optimization outcomes', 'Compare energy use under manual vs AI control'],
    },
    proc: {
      ko: ['수동 모드로 1시간 운전 → kWh 기록', 'AI Auto 모드로 동일 조건 1시간 → kWh 기록', '두 결과의 EER·실내 쾌적도 평가'],
      en: ['Run 1 h in manual mode → log kWh', 'Run 1 h in AI Auto mode under same conditions → log kWh', 'Evaluate EER and comfort across both runs'],
    },
    inputs:  ['mode', 'targetTemp', 'fanSpeed', 'humidifierOn', 'airPurifierOn'],
    outputs: ['indoorTemp', 'co2', 'powerKW', 'eer'],
  },
];
