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
    title: { ko: 'HVAC 시스템 개요 및 안전 교육', en: 'HVAC System Overview & Safety Induction' },
    icon: 'dashboard',
    duration: '3h',
    obj: {
      ko: [
        '냉동 사이클(압축→응축→팽창→증발) 4단계의 열역학적 의미와 역할을 설명할 수 있다',
        '본 트레이닝 시스템의 17개 주요 부품 위치·명칭·기능을 도면과 대조하여 식별한다',
        '실내 환경 4대 제어 요소(온도·상대습도·CO₂·입자 오염도)의 쾌적 기준값(ASHRAE 62.1)을 인용한다',
        'HMI 대시보드에서 6개 핵심 지표(실내 T·RH·CO₂·소비전력·EER·외기 T)를 실시간으로 읽고 의미를 해석한다',
        '고전압(3Φ 380V) 환경에서의 안전 작업 수칙(LOTO, PPE 착용)을 열거하고 비상 정지 버튼 위치를 확인한다',
        '냉매 R410A 취급 주의사항(누설 시 환기, GWP 2088의 환경 영향)을 설명한다',
      ],
      en: [
        'Explain the thermodynamic role of each stage in the refrigeration cycle (compress → condense → expand → evaporate)',
        'Identify the location, name, and function of all 17 major components on the training rig by matching them to a labeled diagram',
        'Cite ASHRAE 62.1 comfort benchmarks for the 4 indoor-environment control parameters (T, RH, CO₂, particulate)',
        'Read and interpret the 6 key KPIs on the HMI dashboard (Indoor T · RH · CO₂ · Power · EER · Outdoor T) in real time',
        'List high-voltage (3Φ 380V) safety rules (LOTO, PPE) and locate the emergency-stop button',
        'Describe R410A handling precautions (ventilate on leak; GWP 2088 environmental impact)',
      ],
    },
    proc: {
      ko: [
        '안전 브리핑: LOTO 절차 시연, PPE(절연 장갑·안전화) 착용, 비상 정지 버튼 위치 및 동작 확인',
        '도면(P&ID)을 보며 17개 부품 라벨을 실물과 1:1 대조 — 각 부품의 역할을 구두로 설명',
        '전원 ON → 자가 진단(Self-Test) 시퀀스 관찰: PLC 통신 확인 → 센서 초기화 → 알람 클리어 순서 기록',
        'Cool / Auto / Heat 모드 순서로 전환하며 각 전환 후 응답 시간(설정 → 압축기 기동까지) 측정 및 기록',
        '대시보드의 6개 지표를 10분 간격으로 3회 수동 기록하여 기준선(Baseline) 데이터 시트 완성',
        '1시간 연속 자동 운전 중 EER이 가장 높은 시점과 낮은 시점의 조건(외기 T, 부하) 비교 분석',
        '냉매 누설 가상 시나리오: 환기 절차 시연, 냉매 감지기(선택 장비) 위치 확인',
        '학습 내용 정리: 7가지 핵심 용어(COP, EER, 인버터, 과열도, 슈퍼히트, P-h선도, LOTO) 화이트보드 작성',
      ],
      en: [
        'Safety brief: demonstrate LOTO procedure, don PPE (insulated gloves, safety shoes), locate and test emergency-stop button',
        'Match all 17 component labels on the P&ID to physical hardware; verbally explain each component\'s role',
        'Power ON → observe self-diagnostic sequence: PLC comm check → sensor init → alarm clear — record the order',
        'Switch Cool / Auto / Heat in sequence; for each transition measure and record response time (command → compressor start)',
        'Manually log all 6 dashboard KPIs every 10 min (3 readings) to build a baseline data sheet',
        'During 1 h auto-run, identify the conditions (outdoor T, load) at the highest and lowest EER points',
        'Walk through a simulated refrigerant-leak scenario: execute ventilation procedure, locate leak-detector equipment',
        'Wrap-up: collaboratively write 7 key terms (COP, EER, Inverter, Superheat, P-h diagram, LOTO, ASHRAE) on the whiteboard',
      ],
    },
    inputs:  ['mode', 'targetTemp', 'fanSpeed'],
    outputs: ['indoorTemp', 'indoorRH', 'co2', 'powerKW'],
  },

  // ── Session 2 ───────────────────────────────────────────────────────
  {
    n: 2, comp: 'system',
    title: { ko: '냉동 사이클 4요소와 P-h 선도 분석', en: 'Refrigeration Cycle Four Elements & P-h Diagram Analysis' },
    icon: 'schematic',
    duration: '3h',
    obj: {
      ko: [
        '압축·응축·팽창·증발 4단계를 P-h(압력-엔탈피) 선도 위에 정확히 작도하고 각 지점의 상태(포화 증기, 과열 증기, 포화 액)를 구분한다',
        '각 단계에서의 입출구 압력(P)·온도(T)·엔탈피(h) 변화를 정량적으로 비교하고, 부호(흡열/방열)를 설명한다',
        '카르노 효율(COP_Carnot)과 실제 시스템 COP를 계산하여 이론 한계 대비 손실 요인을 분석한다',
        '응축 압력(고압)과 외기 온도의 선형 상관관계를 실측 데이터로 도시화하고 기울기를 추출한다',
        '냉방 부하 변화에 따른 EER 변화 추이를 관찰하고, 부분 부하 운전(PLR)에서 인버터 기여 효과를 정량화한다',
        '이상 냉동 사이클과 실제 사이클의 차이(압축기 과열도, 배관 압력 손실, 열교환기 단말 온도차)를 열거한다',
      ],
      en: [
        'Plot all 4 refrigeration-cycle stages accurately on a P-h diagram and classify each state point (saturated vapor, superheated vapor, saturated liquid)',
        'Quantitatively compare inlet/outlet P, T, and h at each stage and explain the sign (heat absorbed vs rejected)',
        'Calculate Carnot COP and actual system COP, then analyze the loss contributors relative to the theoretical limit',
        'Plot condensing pressure vs outdoor temperature from measured data and extract the linear slope',
        'Observe EER variation as cooling load changes; quantify inverter contribution at partial-load ratios (PLR)',
        'List differences between the ideal and actual refrigeration cycle (compressor superheat, pipe pressure drop, LMTD terminal temperature difference)',
      ],
    },
    proc: {
      ko: [
        '빈 P-h 선도 작업지 배포 → 포화 곡선, 임계점, 포화 액선·증기선 위치 직접 작도',
        '압축기 기동 후 4개 지점(①저압 증기 ②고압 과열 증기 ③고압 액체 ④팽창 후 저압)의 온도를 동시 측정, 기록',
        '측정값을 P-h 선도에 매핑하여 실제 사이클 면적(냉동 효과·압축 일량)을 추정',
        '냉방 부하를 약 30%, 60%, 100% 3단계로 변화(설정 온도 조정) 후 각 단계에서 EER·압축기 주파수 기록',
        'EER vs 부하(%) 그래프 작성 → 최고 EER 발생 부하율 식별',
        '외기 온도를 시뮬레이션 내에서 25°C → 35°C → 40°C로 변경, 응축 측 추정 온도 변화 기록',
        '응축 온도 vs 외기 온도 산점도 작성 후 선형 회귀선 추가, 기울기(ΔT_cond / ΔT_outdoor) 계산',
        '이상 사이클 COP와 실측 COP를 비교하여 효율 손실(%)을 표로 정리 및 발표',
      ],
      en: [
        'Distribute blank P-h worksheets → students hand-draw saturation curve, critical point, saturated-liquid and vapor lines',
        'With compressor running, simultaneously measure T at 4 state points (① low-P vapor ② high-P superheated ③ high-P liquid ④ post-expansion low-P); record',
        'Map measured values onto P-h diagram and estimate cycle areas (refrigerating effect, compression work)',
        'Step cooling load to ~30%, 60%, 100% (via setpoint adjustment) and record EER and compressor frequency at each step',
        'Plot EER vs Load (%) → identify the partial-load ratio at peak EER',
        'Change outdoor temperature in simulation: 25°C → 35°C → 40°C; record estimated condensing temperature shift',
        'Build a scatter plot of condensing T vs outdoor T; add linear regression line and calculate slope (ΔT_cond / ΔT_outdoor)',
        'Compare ideal-cycle COP vs measured COP; tabulate efficiency losses (%) and present findings to the group',
      ],
    },
    inputs:  ['mode', 'targetTemp'],
    outputs: ['indoorTemp', 'outdoorTemp', 'compFreqHz', 'eer'],
  },

  // ── Session 3 ───────────────────────────────────────────────────────
  {
    n: 3, comp: 'compressor',
    title: { ko: '인버터 스크롤 압축기 특성 분석', en: 'Inverter Scroll Compressor Characterization' },
    icon: 'mode',
    duration: '3h',
    obj: {
      ko: [
        '스크롤 압축기의 기하학적 구조(고정 스크롤·선회 스크롤)와 압축 원리를 도해로 설명한다',
        '인버터 주파수(35~110 Hz)와 냉방 능력(kW)의 관계식을 실험 데이터로 도출하고 선형성을 검증한다',
        '인버터 압축기와 정속형 On/Off 압축기의 부분 부하 효율을 수치로 비교하여 에너지 절감량(%)을 산출한다',
        '압축기 기동 시 전류 서지(In-Rush Current)와 인버터 소프트 스타트의 차이를 파형으로 비교한다',
        '압축기 운전 데이터(주파수·전류·진동)를 분석하여 비정상 운전 징후(이상 소음, 과전류)를 판별한다',
        '압축기 보호 장치(고압 스위치·과전류 릴레이·온도 보호)의 동작 조건과 복귀 방법을 설명한다',
      ],
      en: [
        'Explain scroll compressor geometry (fixed scroll, orbiting scroll) and compression mechanism with a diagram',
        'Derive the relationship between inverter frequency (35–110 Hz) and cooling capacity (kW) from experimental data and verify linearity',
        'Compare partial-load efficiency of inverter vs fixed-speed On/Off compressor numerically and calculate energy savings (%)',
        'Compare inrush-current waveform of direct-on-line start vs inverter soft-start',
        'Analyze compressor operating data (frequency, current, vibration) to identify signs of abnormal operation (noise, overcurrent)',
        'Describe the activation conditions and reset procedure for compressor protection devices (high-pressure switch, overcurrent relay, thermal protection)',
      ],
    },
    proc: {
      ko: [
        '압축기 구조 분해도 대조: 고정 스크롤·선회 스크롤·크랭크 편심축·오일 분리기 위치 식별',
        '설정 온도를 실내보다 1°C → 3°C → 5°C → 7°C → 9°C 낮게 설정하여 5단계 ΔT 조건 생성',
        '각 ΔT 조건 안정 후 압축기 주파수(Hz), 소비전력(kW), 실내온도 기록 (각 조건 5분 안정 대기)',
        '주파수-능력 그래프(Hz vs kW) 작성 → Excel 선형 회귀로 기울기 및 R² 산출',
        '인버터 vs 정속형 시뮬레이션 비교: 동일 부하 조건에서 30분 누적 kWh 비교 및 절감률 계산',
        '고압 스위치 트립 조건 확인: 냉방 모드에서 팬을 OFF하여 응축압 상승 유도, 알람 발생 시점 기록',
        '알람 발생 → 원인 진단(팬 정지) → 복구(팬 재기동) → 정상 운전 복귀 절차 실습',
        '운전 중 진동·소음 체크리스트 작성 후 정상·이상 기준값 비교 토의',
      ],
      en: [
        'Cross-reference compressor exploded view: identify fixed scroll, orbiting scroll, eccentric crankshaft, oil separator',
        'Create 5 load steps by setting indoor setpoint 1°C → 3°C → 5°C → 7°C → 9°C below current indoor temperature',
        'After each step stabilizes, record compressor frequency (Hz), power (kW), and indoor T (wait 5 min per condition)',
        'Plot frequency vs capacity (Hz vs kW) → run linear regression in Excel and compute slope and R²',
        'Simulate inverter vs fixed-speed comparison: log cumulative kWh over 30 min at identical load and calculate savings (%)',
        'Verify high-pressure switch trip: disable outdoor fan in cool mode to raise condensing pressure; note alarm trigger point',
        'Practice full recovery cycle: alarm triggered → diagnose (fan off) → corrective action (restart fan) → return to normal operation',
        'Create an operating data checklist (vibration, noise, current) and discuss normal vs abnormal thresholds',
      ],
    },
    inputs:  ['targetTemp', 'mode'],
    outputs: ['compFreqHz', 'powerKW', 'indoorTemp'],
  },

  // ── Session 4 ───────────────────────────────────────────────────────
  {
    n: 4, comp: 'condenser',
    title: { ko: '공랭식 응축기 열교환 성능 분석', en: 'Air-Cooled Condenser Heat-Exchange Performance Analysis' },
    icon: 'sun',
    duration: '3h',
    obj: {
      ko: [
        '핀-튜브(Fin & Tube) 열교환기의 열저항 구성(핀 효율, 대류 저항, 전도 저항)을 분석하고, 주요 저항 요소를 순위화한다',
        '외기 온도 변화에 따른 응축 압력·응축 온도의 정량적 관계를 실험적으로 도출한다',
        '응축기 팬 풍량 감소가 응축 성능에 미치는 영향을 LMTD(대수 평균 온도차) 개념으로 분석한다',
        '핀 표면 오염(Fouling) 시 열전달 계수(U) 저하 메커니즘을 설명하고 청소 주기 기준을 제시한다',
        '응축기 측 과냉각도(Subcooling)의 의미와 이것이 팽창 전 냉매 상태에 미치는 영향을 설명한다',
        '응축기 공기측 입출구 온도차(ΔT_air)로부터 방열량(Q_cond)을 추정하는 방법을 실습한다',
      ],
      en: [
        'Analyze the thermal-resistance breakdown of a fin-tube heat exchanger (fin efficiency, convective and conductive resistances) and rank the dominant terms',
        'Experimentally derive the quantitative relationship between outdoor temperature and condensing pressure/temperature',
        'Analyze the effect of reduced condenser-fan airflow on condensing performance using LMTD (log-mean temperature difference)',
        'Explain the mechanism of heat-transfer coefficient (U) degradation due to fin fouling and propose a cleaning-interval criterion',
        'Explain the meaning of condenser subcooling and its effect on the refrigerant state before expansion',
        'Practice estimating heat rejection (Q_cond) from the air-side inlet/outlet temperature difference (ΔT_air)',
      ],
    },
    proc: {
      ko: [
        '응축기 핀-튜브 구조 사진/도면으로 핀 피치, 튜브 배열(다열), 팬 위치 식별',
        '냉방 모드 안정 운전 상태에서 응축기 공기 입구 온도(외기 T)와 추정 출구 온도 기록',
        '팬 속도를 100% → 75% → 50% 3단계로 시뮬레이션 변경, 각 조건에서 압축기 주파수·EER 기록',
        'LMTD = (ΔT₁ − ΔT₂) / ln(ΔT₁/ΔT₂) 공식으로 각 팬 조건의 LMTD 계산 및 비교표 작성',
        '외기 온도 25°C → 30°C → 35°C → 40°C 시뮬레이션, 각 조건에서 EER 측정 후 외기온-EER 그래프 작성',
        '핀 오염 가상 시나리오(풍량 20% 감소 가정) 적용 후 EER 변화량과 추가 소비전력 계산',
        '과냉각도 개념 확인: 응축기 출구 추정 온도가 포화 온도보다 낮은 이유 토의, 과냉각 부족 시 문제점 발표',
        '방열량 추정 실습: Q_cond = ṁ_air × cp_air × ΔT_air, 팬 풍량(CMM)으로 ṁ_air 계산',
      ],
      en: [
        'Use photos/drawings to identify fin pitch, multi-row tube arrangement, and fan position on the condenser',
        'In stable cooling operation, record condenser air inlet T (outdoor T) and estimated outlet T',
        'Simulate fan speed at 100% → 75% → 50%; at each condition record compressor frequency and EER',
        'Calculate LMTD = (ΔT₁ − ΔT₂) / ln(ΔT₁/ΔT₂) for each fan condition and compile a comparison table',
        'Simulate outdoor T: 25°C → 30°C → 35°C → 40°C; measure EER at each point and plot an outdoor-T vs EER graph',
        'Apply simulated fouling scenario (assume 20% airflow reduction); calculate EER drop and additional power draw',
        'Discuss subcooling: why condenser-outlet T can be below saturation T; present problems caused by insufficient subcooling',
        'Estimate heat rejection: Q_cond = ṁ_air × cp_air × ΔT_air — calculate ṁ_air from fan airflow (CMM)',
      ],
    },
    inputs:  ['mode', 'fanSpeed'],
    outputs: ['outdoorTemp', 'compFreqHz', 'eer'],
  },

  // ── Session 5 ───────────────────────────────────────────────────────
  {
    n: 5, comp: 'exv',
    title: { ko: '전자식 팽창변(EXV)과 과열도 제어', en: 'Electronic Expansion Valve & Superheat Control' },
    icon: 'mode',
    duration: '3h',
    obj: {
      ko: [
        'EXV의 480-step 스텝 모터 구조와 분해능(개도 분해능 ≈ 0.21%/step)을 이해하고 유량 특성(Kv)과의 관계를 설명한다',
        '과열도(SH = T_out_evap − T_sat)의 정의와 측정 방법을 설명하고 목표 SH(5~8°C) 범위를 이해한다',
        '부하 변동 step 응답에서 EXV 개도 변화 → 압축기 주파수 변화의 시간 지연(Time Lag)을 측정한다',
        '과열도 과소(SH<3°C, 액 백)와 과대(SH>15°C, 능력 저하) 상황의 증상과 대처법을 비교 설명한다',
        '캐필러리(Capillary Tube)와 EXV의 제어 특성 차이를 정상·비정상 조건 양측에서 비교 분석한다',
        'EXV 고장 모드(완전 열림·완전 닫힘·Step 누락)별 시스템 증상과 진단 방법을 기술한다',
      ],
      en: [
        'Understand the 480-step stepper motor in the EXV, its angular resolution (≈0.21%/step), and the relationship with flow coefficient (Kv)',
        'Define superheat (SH = T_out_evap − T_sat), explain how it is measured, and understand the target SH range (5–8°C)',
        'Measure the time lag between EXV opening change and compressor frequency response during a load step',
        'Compare symptoms and remedies for under-superheat (SH<3°C → liquid slugging) and over-superheat (SH>15°C → capacity loss)',
        'Contrast control characteristics of capillary tube vs EXV under both normal and abnormal conditions',
        'Describe system symptoms and diagnostic methods for each EXV failure mode (fully open, fully closed, step loss)',
      ],
    },
    proc: {
      ko: [
        'EXV 구조 도해 학습: 스텝 모터, 리드 스크류, 니들 밸브 어셈블리의 위치와 역할 확인',
        '냉방 안정 운전에서 증발기 출구 추정 온도(T_out_evap = 실내 T - 8°C 추정)와 포화 온도 비교 → 현재 SH 계산',
        '설정 온도를 26°C → 22°C로 step 변경하여 부하 증가 유발, 이후 매 30초마다 압축기 주파수 및 EER 기록(5분간)',
        '부하 증가→ 안정까지의 SH 회복 시간(Time to Settle) 측정 및 기록',
        '반대 방향 step(22°C → 28°C): 부하 감소 시 EXV 닫힘 응답 관찰, 오버슈트 여부 확인',
        '가상 SH 과소 시나리오: EXV 개도 과대(80% 이상) 조건 시뮬레이션 → 압축기 전류 증가·소음 증상 토의',
        '가상 SH 과대 시나리오: EXV 개도 과소(10%) → 냉방 능력 저하(EER 감소) 관찰 및 정량적 비교',
        '캐필러리 vs EXV 비교표 작성: 외기 온도 변화 대응, 부분 부하 적응성, 고장 대응 관점에서 분석',
      ],
      en: [
        'Study EXV structure diagram: locate and describe stepper motor, lead screw, and needle-valve assembly',
        'In stable cooling, estimate evaporator outlet T (T_out_evap ≈ indoor T − 8°C) and compare with saturation T → calculate current SH',
        'Step setpoint 26°C → 22°C to increase load; log compressor frequency and EER every 30 s for 5 min',
        'Measure and record SH settling time after the load step',
        'Reverse step (22°C → 28°C): observe EXV closing response for decreasing load; check for overshoot',
        'Simulate low-SH scenario: EXV opening >80% → discuss compressor current rise and noise symptoms',
        'Simulate high-SH scenario: EXV opening <10% → observe and quantify capacity loss (EER drop)',
        'Build a comparison table: capillary vs EXV across outdoor-temp variation, part-load adaptability, and fault response',
      ],
    },
    inputs:  ['targetTemp', 'mode'],
    outputs: ['compFreqHz', 'indoorTemp', 'powerKW'],
  },

  // ── Session 6 ───────────────────────────────────────────────────────
  {
    n: 6, comp: 'evaporator',
    title: { ko: '실내 증발기 — 현열·잠열 부하 분리 분석', en: 'Indoor Evaporator — Sensible vs Latent Load Separation' },
    icon: 'snow',
    duration: '3h',
    obj: {
      ko: [
        '현열 부하(Q_s)와 잠열 부하(Q_l)의 정의를 이해하고, 총 냉방 부하에서 각각의 비율(SHR = Sensible Heat Ratio)을 계산한다',
        '팬 속도 증가에 따른 현열 부하 처리량 증가와 잠열(제습) 능력 감소 간의 상충 관계를 실험으로 확인한다',
        '증발기 코일 표면 온도와 이슬점(Dew Point) 온도의 관계에서 응축수(condensate) 발생 조건을 도출한다',
        '코일 동결(Freeze-up) 발생 조건(증발 온도 ≤ 0°C)과 방지를 위한 최소 풍량 기준을 실험으로 결정한다',
        '증발기 핀 오염이 코일 압력 강하와 열전달 성능에 미치는 영향을 분석한다',
        '흡입 공기 상태(온도, 습도)의 변화에 따른 증발 온도·압력의 자동 조절 메커니즘을 설명한다',
      ],
      en: [
        'Define sensible (Q_s) and latent (Q_l) load; calculate the sensible heat ratio (SHR) for the total cooling load',
        'Experimentally confirm the trade-off: higher fan speed increases sensible-load capacity but reduces latent (dehumidification) capacity',
        'Derive the condensate-formation condition from the relationship between evaporator coil-surface T and air dew-point T',
        'Experimentally determine the minimum airflow to prevent coil freeze-up (evaporating T ≤ 0°C)',
        'Analyze the effect of evaporator fin fouling on coil pressure drop and heat-transfer performance',
        'Explain the automatic adjustment of evaporating temperature/pressure in response to changes in entering air state (T, RH)',
      ],
    },
    proc: {
      ko: [
        '팬 L1 → L3 → L5 세 조건에서 각각 10분 안정 후 실내 T·RH 동시 측정, SHR 계산 시트 작성',
        '각 팬 단계의 추정 응축수량 비교: RH 변화율 × 공간 체적 × 공기 밀도로 잠열 부하 추정',
        '코일 표면 추정 온도(증발 T + ΔT ≈ 실내 T − 12°C)와 이슬점(Magnus 공식)을 비교 → 결로 여부 판단',
        '팬 L0(정지) 조건에서 5분 운전 후 증발 온도 하강 속도 관찰 → 동결 위험 시간 추정',
        '팬 L1 → L2 → L3 단계에서 압축기 주파수 변화 관찰 → 풍량-부하 연동 특성 확인',
        '핀 오염 시나리오: 풍량 30% 감소 가정, 코일 표면 온도 하강 및 압축기 주파수 증가 추정',
        '실내 T를 25°C 고정, RH를 50% → 65%로 변경 → 압축기 주파수 변화로 잠열 부하 증가 효과 확인',
        '결과 정리: SHR vs 팬 단계 그래프 작성, 팬 선택이 쾌적성·에너지 효율에 미치는 영향 발표',
      ],
      en: [
        'At fan L1 → L3 → L5, allow 10 min stabilization at each step; simultaneously measure indoor T and RH; complete SHR calculation sheet',
        'Estimate condensate yield at each fan step: latent load ≈ RH-change rate × room volume × air density',
        'Compare estimated coil-surface T (≈ indoor T − 12°C) with dew point (Magnus formula) → determine whether condensation occurs',
        'Run fan L0 (off) for 5 min and observe evaporating-T drop rate → estimate time to freeze-up risk',
        'At fan L1 → L2 → L3, observe compressor frequency response → confirm airflow-load coupling behavior',
        'Simulate fouling: assume 30% airflow reduction; estimate coil-T drop and resulting compressor frequency increase',
        'Fix indoor T at 25°C; change RH 50% → 65% → observe compressor frequency rise from increased latent load',
        'Compile results: plot SHR vs fan step; present impact of fan selection on comfort vs energy efficiency',
      ],
    },
    inputs:  ['fanSpeed', 'mode'],
    outputs: ['indoorTemp', 'indoorRH', 'compFreqHz'],
  },

  // ── Session 7 ───────────────────────────────────────────────────────
  {
    n: 7, comp: 'refrigerant',
    title: { ko: '냉매 R410A 물성과 환경 영향', en: 'R410A Refrigerant Properties & Environmental Impact' },
    icon: 'drop',
    duration: '3h',
    obj: {
      ko: [
        'R410A의 성분(R32 50% + R125 50%), 비등점(-51.5°C), 임계 온도(72.1°C), GWP(2088), ODP(0)를 인용하고 R22와 수치 비교한다',
        '운전 데이터(온도·압력)를 R410A P-h 선도에 4개 상태점으로 매핑하고, 냉동 효과·압축 일량·COP를 그래프에서 직접 읽는다',
        'R410A 고압 운전 특성(≈ R22의 1.6배)이 배관·기기 설계에 미치는 영향을 분석한다',
        'R410A가 혼합 냉매이므로 냉매 충전 시 반드시 액상으로 충전해야 하는 이유를 성분 분리 관점에서 설명한다',
        '차세대 냉매(R32, R454B, R1234yf)의 GWP·ODP·안전 등급·효율을 R410A와 비교하여 장단점을 분석한다',
        '냉매 누설 감지 방법(전자식 탐지기, 형광 염료, 비눗물 테스트)과 보고·회수 절차를 실습한다',
      ],
      en: [
        'Cite R410A composition (R32 50% + R125 50%), boiling point (−51.5°C), critical T (72.1°C), GWP (2088), ODP (0) and compare numerically with R22',
        'Map operating data (T and P) as 4 state points on a R410A P-h diagram; directly read refrigerating effect, compression work, and COP from the chart',
        'Analyze how R410A\'s high-pressure operation (≈1.6× R22) impacts piping and equipment design',
        'Explain why R410A (being a zeotropic blend) must always be charged as liquid, from a composition-separation perspective',
        'Compare next-gen refrigerants (R32, R454B, R1234yf) vs R410A on GWP, ODP, safety class, and efficiency',
        'Practice refrigerant-leak detection methods (electronic sniffer, UV dye, soap-bubble test) and reporting/recovery procedure',
      ],
    },
    proc: {
      ko: [
        'R410A와 R22 물성 비교표 작성: 비등점, 임계점, GWP, ODP, 운전 압력(고압/저압), 오일 종류(POE vs Mineral)',
        '시스템 5분 운전 데이터(4지점 온도) 수집 → R410A P-h 선도 위에 상태점 작도',
        'P-h 선도에서 냉동 효과(h1-h4), 압축 일량(h2-h1), 방열량(h2-h3) 직접 측정 → COP 계산',
        '이상 사이클과 실제 사이클 P-h 비교: 과열(Superheat), 과냉각(Subcooling), 압력 손실 구간 표시',
        '고압 운전 관련 토의: R410A 적용 배관 두께 기준(JIS B 8607) vs R22 대비 이유 설명',
        '혼합 냉매 분리 실험(개념): 기상 vs 액상 충전 시 성분 비율 변화 시뮬레이션 토의',
        '차세대 냉매 비교 발표: 모둠별로 R32, R454B, R1234yf 중 하나를 조사하여 5분 발표',
        '비눗물 테스트 시연: 접합부 및 플레어 이음부에 도포, 기포 발생 확인 절차 실습',
      ],
      en: [
        'Build a comparison table: R410A vs R22 — boiling point, critical point, GWP, ODP, operating pressures (high/low), oil type (POE vs Mineral)',
        'Collect 5-min operating data (4-point T) → plot state points on R410A P-h diagram',
        'Read refrigerating effect (h1−h4), compression work (h2−h1), heat rejection (h2−h3) directly from P-h diagram → calculate COP',
        'Overlay ideal vs actual cycle on P-h: mark superheat, subcooling, and pressure-drop zones',
        'Discuss high-pressure design: explain required pipe wall thickness (JIS B 8607) for R410A vs R22',
        'Conceptual blend-separation exercise: discuss how vapor vs liquid charging changes component ratios in a zeotropic mixture',
        'Next-gen refrigerant team presentations: groups research R32 / R454B / R1234yf and present for 5 min each',
        'Soap-bubble leak test demonstration: apply to fittings and flare joints; observe and interpret bubble formation',
      ],
    },
    inputs:  ['mode', 'targetTemp'],
    outputs: ['outdoorTemp', 'indoorTemp', 'compFreqHz', 'powerKW'],
  },

  // ── Session 8 ───────────────────────────────────────────────────────
  {
    n: 8, comp: 'fourway',
    title: { ko: '4방향 밸브 · 히트펌프 전환 및 제상 사이클', en: '4-Way Valve · Heat Pump Switchover & Defrost Cycle' },
    icon: 'schematic',
    duration: '3h',
    obj: {
      ko: [
        '4방향 밸브의 4개 포트 구조(S·D·E·C)와 솔레노이드 작동에 의한 냉매 흐름 전환 메커니즘을 도해로 설명한다',
        '냉방→난방 전환 시 압력 균등화(Pressure Equalization) 구간의 시간(10~30초)과 그 이유를 설명한다',
        '히트펌프 난방 모드의 COP_HP = COP_cool + 1 관계식을 검증하고, 저외기 온도 시 난방 능력 하락 이유를 분석한다',
        '제상(Defrost) 사이클 트리거 조건(코일 온도 ≤ -3°C, 또는 운전 시간 기준)과 제상 방법(역사이클·전열 제상)을 비교한다',
        '난방 모드에서 실내·실외 코일 역할 반전(실외=증발기, 실내=응축기)을 P-h 선도로 설명한다',
        '4방향 밸브 고장 모드(부분 전환, 솔레노이드 단선)와 진단 방법(배관 온도 패턴 확인)을 기술한다',
      ],
      en: [
        'Explain the 4-port structure of the 4-way valve (S·D·E·C) and the refrigerant-flow reversal mechanism via solenoid actuation, using a diagram',
        'Explain the pressure-equalization interval (10–30 s) during Cool→Heat switchover and the reason for this delay',
        'Verify the heat-pump COP relationship COP_HP = COP_cool + 1 and analyze why heating capacity drops at low outdoor temperatures',
        'Compare defrost-cycle trigger conditions (coil T ≤ −3°C or run-time based) and defrost methods (reverse-cycle vs electric)',
        'Explain on a P-h diagram how indoor and outdoor coil roles are reversed in heating mode (outdoor=evaporator, indoor=condenser)',
        'Describe 4-way valve failure modes (partial switching, solenoid open circuit) and diagnosis by pipe-temperature pattern',
      ],
    },
    proc: {
      ko: [
        '4방향 밸브 구조 모형/단면도 학습: S(흡입), D(토출), E·C(실내·실외 코일 연결) 포트 역할 확인',
        '냉방 모드에서 주요 4개 배관 온도(고압 토출, 응축기 출구, 증발기 입구, 저압 흡입) 기록',
        '냉방→난방 전환 명령 입력 → 밸브 전환 후 30초간 매 5초마다 실내·실외 온도 변화 기록',
        '압력 균등화 구간 식별: 압축기 주파수가 일시적으로 감소하는 시점 확인',
        '난방 모드 안정 후 4개 배관 온도 재측정 → 냉방 모드와 비교하여 역할 반전 확인',
        '외기 온도 시뮬레이션: 5°C → 0°C → -5°C 변화 시 압축기 주파수 증가량 및 EER 변화 기록',
        '제상 사이클 시뮬레이션: 코일 온도 임계값 조건 설정 → 제상 모드 진입 후 실내 온도 일시 하강 관찰',
        '4방향 밸브 고장 시나리오 토의: 부분 전환 시 냉난방 혼재 증상, 진단용 배관 온도 패턴 설명 발표',
      ],
      en: [
        'Study 4-way valve cross-section/model: confirm roles of S (suction), D (discharge), E and C (indoor/outdoor coil connections)',
        'In cooling mode, record temperatures at 4 key pipe points (high-P discharge, condenser outlet, evaporator inlet, low-P suction)',
        'Command Cool → Heat switchover; for 30 s after valve actuation, log indoor and outdoor temperature every 5 s',
        'Identify the pressure-equalization interval by noting the point where compressor frequency temporarily dips',
        'After heating mode stabilizes, re-measure 4 pipe temperatures → compare with cooling data to confirm role reversal',
        'Simulate outdoor T: 5°C → 0°C → −5°C; record compressor frequency increase and EER change at each step',
        'Simulate defrost cycle: set coil-T threshold condition → observe mode entry and temporary indoor T drop during defrost',
        'Discuss 4-way valve failure modes: describe mixed cooling/heating symptoms during partial switching; present pipe-temp diagnostic pattern',
      ],
    },
    inputs:  ['mode', 'targetTemp'],
    outputs: ['indoorTemp', 'outdoorTemp', 'compFreqHz', 'powerKW'],
  },

  // ── Session 9 ───────────────────────────────────────────────────────
  {
    n: 9, comp: 'heater',
    title: { ko: 'PTC 전기 히터 — 보조 난방 전략 및 통합 효율', en: 'PTC Electric Heater — Auxiliary Heating Strategy & Combined Efficiency' },
    icon: 'sun',
    duration: '2h',
    obj: {
      ko: [
        'PTC 소자의 Positive Temperature Coefficient 특성 곡선(R-T 관계)을 설명하고 자기 전류 제한 원리를 전기 회로적으로 해석한다',
        '외기 온도 강하에 따른 히트펌프 난방 능력 곡선(Q_HP vs T_outdoor)과 보조 히터 투입 임계점(Bivalent Point)을 결정한다',
        '히트펌프 단독 난방 vs 히트펌프 + PTC 보조 가열의 통합 COP(Integrated COP)를 계산하고 경제성을 분석한다',
        '보조 히터 3 kW가 실내 온도 상승 속도(°C/min)에 미치는 기여도를 전력 투입량과 함께 측정한다',
        '제어 전략(히터 단독, HP 단독, 직렬 운전)별 전력 소비 패턴을 비교하고 최적 전환 시점을 제안한다',
      ],
      en: [
        'Explain the PTC element\'s R-T characteristic curve and interpret the self-current-limiting principle from a circuit perspective',
        'Determine the heating capacity curve of the heat pump (Q_HP vs T_outdoor) and the bivalent point at which auxiliary heat is needed',
        'Calculate the Integrated COP for heat-pump-only vs heat-pump + PTC combined heating and analyze economics',
        'Measure the contribution of the 3 kW auxiliary heater to the indoor temperature rise rate (°C/min) alongside power draw',
        'Compare power consumption patterns for each control strategy (heater only, HP only, series operation) and propose the optimal switchover point',
      ],
    },
    proc: {
      ko: [
        'PTC 소자 특성 자료(R-T 곡선) 배포 → 80°C 기준 저항 급증 구간 식별, 자기 제한 전류 계산 실습',
        '난방 모드 + 외기 온도 10°C 설정 → 히터 OFF 상태에서 5분 운전 후 실내 T 상승률 기록',
        '히터 ON 후 추가 상승률 측정 및 히터의 기여 온도 상승분(ΔT_heater/min) 계산',
        '외기를 5°C → 0°C → -5°C로 변화시키며 히트펌프 단독 난방 능력 변화 기록(주파수 한계 도달 시점 확인)',
        '외기 0°C 조건에서 HP 단독(W₁), 히터 단독(W₂=3kW), 통합 운전(W₁+W₂) 각각의 실내 T 상승률 비교',
        '통합 COP = Q_heating_total / (W_HP + W_heater) 계산 → HP 단독 COP와 비교',
        '결론 발표: 어느 외기 온도 이하에서 보조 히터를 투입하는 것이 경제적인지 근거와 함께 발표',
      ],
      en: [
        'Distribute PTC R-T characteristic data → identify the resistance-rise zone above 80°C; calculate self-limiting current',
        'Heat mode + outdoor T 10°C → run 5 min with heater OFF; record indoor T rise rate',
        'Turn heater ON; measure additional rise rate and calculate heater\'s temperature-rise contribution (ΔT_heater/min)',
        'Step outdoor T: 5°C → 0°C → −5°C; record heat-pump-only capacity degradation (note point where compressor frequency maxes out)',
        'At outdoor T = 0°C, compare indoor T rise rate for HP-only (W₁), heater-only (W₂=3kW), and combined (W₁+W₂)',
        'Calculate Integrated COP = Q_heating_total / (W_HP + W_heater) → compare with HP-only COP',
        'Present conclusions: state and justify the outdoor temperature threshold below which auxiliary heat becomes economically justified',
      ],
    },
    inputs:  ['mode', 'targetTemp'],
    outputs: ['indoorTemp', 'powerKW', 'outdoorTemp'],
  },

  // ── Session 10 ──────────────────────────────────────────────────────
  {
    n: 10, comp: 'blower',
    title: { ko: '송풍팬 법칙 실험 및 소음·효율 최적화', en: 'Blower Fan-Law Experiments & Noise–Efficiency Optimization' },
    icon: 'fan',
    duration: '2h',
    obj: {
      ko: [
        '팬 법칙(CMM∝N, 정압∝N², 동력∝N³)을 실험 데이터로 검증하고 이론치와의 오차를 분석한다',
        '각 팬 단계(L0~L5)에서 추정 CMM, 추정 동력, 측정 소비전력을 기록하고 N³ 모델과 비교한다',
        '정압(External Static Pressure) 상승 조건(필터 오염 가정)에서 풍량 감소량과 소비전력 변화를 분석한다',
        '소음 레벨(dBA)과 팬 단계의 관계를 분석하여 소음·효율·냉방 능력의 3중 균형 최적화 지점을 결정한다',
        '팬 역회전(팬 블레이드 각도 역방향) 또는 팬 고장 시 시스템 응급 대응 절차를 설명한다',
      ],
      en: [
        'Verify fan laws (CMM∝N, static pressure∝N², power∝N³) with experimental data and analyze deviations from theory',
        'At each fan step (L0–L5), record estimated CMM, estimated power, and measured power draw; compare with N³ model',
        'Analyze airflow reduction and power change under increased static pressure (assume filter loading)',
        'Analyze the noise level (dBA) vs fan step relationship; determine the optimum point balancing noise, efficiency, and cooling capacity',
        'Describe emergency response procedures for fan failure (reverse rotation or motor fault) during system operation',
      ],
    },
    proc: {
      ko: [
        '팬 단계 L0(정지) → L1 → L2 → L3 → L4 → L5 순서로 각 30초 운전, 소비전력(kW) 기록',
        '추정 CMM = 단계 × 280 CMM 가정 → 실측 전력과 N³ 법칙(W ∝ N³) 비교 그래프 작성',
        '전력 비율(L5 기준 정규화) vs 팬 단계 비율³ 산점도 작성 → 이론 vs 실제 선형 비교',
        '필터 오염 가상 시나리오: 정압을 20% 증가로 가정하여 각 단계에서 CMM 감소량 추정',
        '팬 단계별 소음 레벨 추정표(dBA 참고값) 배포 → 냉방 능력(압축기 주파수) vs 소음 산점도 작성',
        '최적 팬 단계 결정 토의: 야간 취침(저소음 우선) vs 빠른 냉방(고속 우선) 시나리오별 권장 단계 제시',
        '팬 고장 시나리오: 팬 L0 강제 설정 후 압축기 과부하 알람 발생까지 시간 측정 및 대응 절차 실습',
      ],
      en: [
        'Step fan L0 (off) → L1 → L2 → L3 → L4 → L5, running 30 s at each step; record power draw (kW)',
        'Assume estimated CMM = step × 280 → plot measured power vs N³ law (W ∝ N³)',
        'Build a scatter plot of power ratio (normalized to L5) vs (fan-step ratio)³ → compare actual vs theoretical linearity',
        'Simulate filter loading: assume 20% static-pressure increase; estimate CMM reduction at each fan step',
        'Distribute reference noise-level table (dBA estimates) by fan step → plot cooling capacity (compressor freq) vs noise level',
        'Discuss optimal fan-step selection: recommend steps for night-sleep (low noise) vs rapid cool-down (high speed) scenarios',
        'Fan-failure scenario: force fan to L0; measure time until compressor overload alarm triggers; practice corrective response',
      ],
    },
    inputs:  ['fanSpeed'],
    outputs: ['indoorTemp', 'powerKW', 'co2'],
  },

  // ── Session 11 ──────────────────────────────────────────────────────
  {
    n: 11, comp: 'humidifier',
    title: { ko: '초음파 가습기 — 가습량·응답·결로 방지 제어', en: 'Ultrasonic Humidifier — Capacity, Response & Condensation Prevention' },
    icon: 'drop',
    duration: '2h',
    obj: {
      ko: [
        '1.7 MHz 압전 진동자의 초음파 무화(霧化) 원리와 1~5 μm 액적 생성 메커니즘을 설명한다',
        '가습기 최대 출력(12 L/h)에서 실내 공간 체적 대비 시간당 RH 상승률(ΔRH/h)을 계산하고 실측과 비교한다',
        '목표 RH 도달 시간(Time to Setpoint)에 영향을 미치는 인자(가습량, 공간 체적, 환기량, 냉방 코일의 제습)를 분석한다',
        '결로(과가습) 방지를 위한 RH 상한 설정(통상 60~65%) 근거와 히스테리시스 밴드(±3%) 설정 방법을 이해한다',
        '냉방 코일 가동 시 동시 가습의 에너지 충돌(냉방=제습↓ vs 가습=RH↑) 관계를 분석하고 제어 우선순위를 결정한다',
      ],
      en: [
        'Explain the 1.7 MHz piezoelectric atomization principle and the 1–5 μm droplet-generation mechanism',
        'Calculate the expected RH rise rate (ΔRH/h) from maximum humidifier output (12 L/h) relative to room volume; compare with measurement',
        'Analyze factors affecting time-to-setpoint (humidification rate, room volume, ventilation rate, dehumidification by cooling coil)',
        'Understand the basis for an RH upper-limit setting (typically 60–65%) to prevent condensation and how to configure a hysteresis band (±3%)',
        'Analyze the energy conflict of simultaneous cooling (dehumidification ↓) and humidification (RH ↑); determine control priority',
      ],
    },
    proc: {
      ko: [
        '초음파 가습기 동작 원리 영상/도해 학습: 압전 진동자, 수면 진동, 안개 분출 경로 확인',
        '목표 RH를 50% → 60% → 65%로 3단계 변경, 각 목표치 도달 시간 측정 및 기록',
        '목표 RH 도달 시간 vs 목표 RH 그래프 작성 → 선형 vs 비선형 여부 분석',
        '냉방 모드 동시 운전: 가습기 ON + 냉방 압축기 ON → RH 정착 시간과 압축기 주파수 변화 관찰',
        '냉방 OFF + 가습기만 운전 vs 냉방 ON + 가습기 동시 운전 → RH 도달 속도 비교 (에너지 충돌 시각화)',
        '과가습 방지 실험: RH 목표 70%(고의 과설정) → 결로 발생 가능 조건 추정 후 상한 재설정 실습',
        '히스테리시스 밴드 설정 토의: ±1% vs ±3% vs ±5% 설정 시 ON/OFF 빈도 비교 및 에너지 관점 평가',
      ],
      en: [
        'Review ultrasonic humidifier operating principle via video/diagram: locate piezoelectric transducer, water-surface vibration, mist outlet path',
        'Step target RH: 50% → 60% → 65%; measure and record time to reach each setpoint',
        'Plot time-to-setpoint vs target RH → analyze whether the relationship is linear or non-linear',
        'Simultaneous cooling mode: humidifier ON + cooling compressor ON → observe RH settling time and compressor-frequency behavior',
        'Compare RH rise speed: cooling OFF + humidifier only vs cooling ON + simultaneous humidifier (visualize energy conflict)',
        'Over-humidification experiment: intentionally set RH target to 70% → estimate condensation-risk conditions; practice resetting the upper limit',
        'Discuss hysteresis band settings: compare ON/OFF cycling frequency for ±1% vs ±3% vs ±5%; evaluate from an energy perspective',
      ],
    },
    inputs:  ['targetRH', 'humidifierOn', 'fanSpeed'],
    outputs: ['indoorRH', 'indoorTemp'],
  },

  // ── Session 12 ──────────────────────────────────────────────────────
  {
    n: 12, comp: 'purifier',
    title: { ko: 'HEPA + 활성탄 공기 청정 — 필터 성능·수명 예측', en: 'HEPA + Activated-Carbon Air Purification — Filter Performance & Lifetime Prediction' },
    icon: 'purifier',
    duration: '2h',
    obj: {
      ko: [
        'HEPA H13 필터의 3가지 포집 메커니즘(관성 충돌, 차단, 확산)과 0.3 μm 최소 포집 입경(MPPS)에서 99.95% 효율의 근거를 설명한다',
        '활성탄의 다공성 구조와 물리적 흡착(Van der Waals력)에 의한 VOC·포름알데히드 제거 메커니즘을 설명한다',
        'PM2.5 1차 지수 감쇠 모델(PM(t) = PM₀·e^(-t/τ))에서 시상수 τ = V_room / CADR을 실험으로 검증한다',
        'CADR(Clean Air Delivery Rate)의 의미와 풍량(CMM)에 따른 CADR 변화를 분석한다',
        '필터 차압(ΔP) 누적 증가 데이터를 이용해 잔여 수명(예상 교체 시점)을 예측하는 방법을 실습한다',
        '고효율 필터 사용 시 팬 동력 증가(차압 상승)와 청정 효율의 균형을 분석한다',
      ],
      en: [
        'Explain the three HEPA capture mechanisms (inertial impaction, interception, diffusion) and the basis for 99.95% efficiency at the MPPS of 0.3 μm',
        'Explain activated-carbon\'s porous structure and the physical adsorption (Van der Waals) mechanism for removing VOCs and formaldehyde',
        'Experimentally verify the PM2.5 first-order decay model PM(t) = PM₀·e^(−t/τ) and the time constant τ = V_room / CADR',
        'Define CADR (Clean Air Delivery Rate) and analyze how CADR changes with airflow (CMM)',
        'Practice predicting remaining filter lifetime (expected replacement date) from cumulative filter pressure-drop (ΔP) data',
        'Analyze the trade-off between fan power increase (rising ΔP with high-efficiency filter) and air-cleaning effectiveness',
      ],
    },
    proc: {
      ko: [
        'HEPA H13 필터 단면 사진으로 섬유 배열 관찰 → 관성 충돌·차단·확산 포집 메커니즘 도해로 정리',
        '공기 청정기 OFF 상태에서 PM2.5 기준값(PM₀) 기록',
        '공기 청정기 ON (팬 L3) → 30초 간격으로 PM2.5 변화 기록 (5분간)',
        'PM(t) = PM₀·e^(-t/τ) 모델로 τ 역산, 공간 체적 가정(예: 30 m³)으로 CADR 계산',
        '팬 L5로 변경 후 동일 실험 반복 → τ 비교 및 CADR 비율 확인(팬 속도 비례 여부)',
        '필터 차압 데이터 제공(가상 운전 기록) → 차압-시간 그래프 작성, 교체 기준(예: ΔP ≥ 100 Pa) 도달 예상 시점 계산',
        '활성탄 흡착 포화 토의: VOC 흡착 용량(예: 80 mg/g) 기준으로 일일 VOC 부하 가정 시 포화 시점 추정',
        '고효율 필터 vs 표준 필터 비교 정리: CADR, 차압, 팬 전력, 교체 비용 관점에서 총소유비용(TCO) 분석',
      ],
      en: [
        'Examine HEPA H13 filter cross-section photo to observe fiber arrangement → diagram the three capture mechanisms',
        'With air purifier OFF, record baseline PM2.5 (PM₀)',
        'Switch purifier ON (fan L3) → log PM2.5 every 30 s for 5 min',
        'Back-calculate τ from PM(t) = PM₀·e^(−t/τ); assume room volume (e.g., 30 m³) to compute CADR',
        'Switch to fan L5 and repeat experiment → compare τ values and confirm whether CADR scales with fan speed',
        'Provide simulated filter ΔP history data → plot ΔP vs time; calculate expected date to reach replacement threshold (e.g., ΔP ≥ 100 Pa)',
        'Discuss activated-carbon saturation: estimate time to saturation based on assumed daily VOC load and adsorption capacity (e.g., 80 mg/g)',
        'Compare high-efficiency vs standard filter: total cost of ownership (TCO) analysis across CADR, ΔP, fan power, and replacement cost',
      ],
    },
    inputs:  ['airPurifierOn', 'fanSpeed'],
    outputs: ['indoorTemp', 'co2'],
  },

  // ── Session 13 ──────────────────────────────────────────────────────
  {
    n: 13, comp: 'trh_sensor',
    title: { ko: '온·습도 센서 — 교정·응답·오차 분석', en: 'T/RH Sensors — Calibration, Response & Error Analysis' },
    icon: 'thermo',
    duration: '2h',
    obj: {
      ko: [
        'NTC 서미스터의 β(베타) 모델(R = R₀·exp(B·(1/T − 1/T₀)))을 이용하여 2점 교정 계수를 산출한다',
        '정전용량형 습도 센서의 전기용량(C)과 RH의 관계(C ∝ ε(RH))를 이해하고 캘리브레이션 LUT를 구성한다',
        '센서 응답 시간(T63 = 1차 시간 상수)을 step 입력으로 측정하고, 제어 루프 샘플링 간격과의 관계를 분석한다',
        '자기 발열(Self-Heating) 오차의 원인과 측정 전류 최소화 방법(간헐 구동, 전류 제한)을 설명한다',
        '습도 센서의 히스테리시스 오차와 더러움(오염) 오차를 구별하고, 현장 점검 방법을 기술한다',
        '4-20mA 전류 루프 신호의 단선·단락 진단 방법과 I²C/Modbus 디지털 통신 오류 처리를 설명한다',
      ],
      en: [
        'Use the NTC thermistor β-model (R = R₀·exp(B·(1/T − 1/T₀))) to calculate 2-point calibration coefficients',
        'Understand the capacitive RH sensor relationship (C ∝ ε(RH)) and build a calibration lookup table (LUT)',
        'Measure sensor response time (T63, first-order time constant) from a step input and analyze its relation to control-loop sampling interval',
        'Explain self-heating error sources and methods to minimize measurement current (intermittent drive, current limiting)',
        'Distinguish humidity-sensor hysteresis error from contamination error and describe field inspection methods',
        'Explain 4-20 mA loop open/short diagnostics and I²C/Modbus digital communication error handling',
      ],
    },
    proc: {
      ko: [
        'NTC 서미스터 특성 자료 배포(β=3950, R₀=10kΩ @25°C) → 3개 온도 지점에서 이론 저항값 계산 실습',
        '시스템 온도 센서 출력과 교사 기준 온도계 값 비교 → 오차(±0.3°C) 범위 내 여부 확인',
        '2점 교정 실습: T_low=20°C, T_high=30°C 기준 → 교정 계수(오프셋, 기울기) 계산 후 보정값 적용',
        '설정 온도를 25°C → 28°C로 step 변경 후 센서 출력이 63% 변화에 도달하는 시간(T63) 측정',
        '습도 step 실험: 가습기 ON/OFF 전환 후 RH 센서 T63 측정 및 온도 T63과 비교',
        '자기 발열 오차 토의: 센서 동작 전류(보통 1mA 이하) 크기와 발열량(P = I²R) 계산',
        '4-20 mA 단선 시나리오: 전류 0mA → PLC에서 어떤 알람 발생? 단락 시나리오: 전류 > 20mA 처리 방식 확인',
        '센서 오염 체크리스트 작성: 정기 점검 항목(먼지, 결로 흔적, 핀 부식) 및 교체 기준 제시',
      ],
      en: [
        'Distribute NTC thermistor data (β=3950, R₀=10kΩ @25°C) → calculate theoretical resistance at 3 temperature points',
        'Compare system T-sensor output vs reference thermometer → verify offset is within ±0.3°C',
        '2-point calibration exercise: reference points T_low=20°C, T_high=30°C → calculate offset and gain; apply corrections',
        'Step setpoint 25°C → 28°C; measure time for sensor output to reach 63% of final change (T63)',
        'RH step experiment: cycle humidifier ON/OFF; measure RH sensor T63 and compare with temperature T63',
        'Self-heating error discussion: calculate measurement current (typically <1 mA) and heat dissipation (P = I²R)',
        '4-20 mA fault scenarios: current = 0 mA (open circuit) → what PLC alarm triggers? current > 20 mA (short) → handling method',
        'Build a sensor contamination checklist: regular inspection items (dust, condensation traces, pin corrosion) and replacement criteria',
      ],
    },
    inputs:  ['mode', 'targetRH'],
    outputs: ['indoorTemp', 'indoorRH', 'outdoorTemp'],
  },

  // ── Session 14 ──────────────────────────────────────────────────────
  {
    n: 14, comp: 'co2_sensor',
    title: { ko: 'NDIR CO₂ 센서 — 측정 원리·환기 제어·영점 보정', en: 'NDIR CO₂ Sensor — Measurement Principle, Ventilation Control & Baseline Correction' },
    icon: 'co2',
    duration: '2h',
    obj: {
      ko: [
        'NDIR(비분산 적외선) 방식의 Beer-Lambert 법칙(I = I₀·exp(−ε·c·L))을 이용한 CO₂ 농도 계산 원리를 설명한다',
        '인체 CO₂ 배출량과 환기량의 관계에서 실내 CO₂ 정상 상태 농도 공식(C_eq = C_outdoor + N_people × gen_rate / Q_vent)을 도출한다',
        '환기 OFF 상태의 CO₂ 상승 속도에서 재실 인원을 역산하고, 환기 ON 후 감쇠 시간 상수 τ를 측정한다',
        'ABC(Automatic Baseline Correction) 알고리즘의 원리(7일 이동 최솟값 기반 영점 보정)와 적용 조건의 한계를 이해한다',
        '이중 빔(Dual-Beam) NDIR 구조가 광원 열화 및 진동에 의한 오차를 어떻게 상쇄하는지 설명한다',
        'CO₂ 농도 기반 수요 제어 환기(DCV: Demand-Controlled Ventilation) 로직을 설계하고 ASHRAE 62.1 기준과 비교한다',
      ],
      en: [
        'Explain CO₂ concentration calculation using Beer-Lambert law (I = I₀·exp(−ε·c·L)) in an NDIR sensor',
        'Derive the steady-state indoor CO₂ formula (C_eq = C_outdoor + N_people × gen_rate / Q_vent) from occupant generation and ventilation flow',
        'Back-calculate occupancy from CO₂ rise rate (ventilation OFF) and measure the decay time constant τ after ventilation ON',
        'Understand the ABC (Automatic Baseline Correction) algorithm principle (7-day rolling minimum baseline) and its application limits',
        'Explain how a dual-beam NDIR design cancels errors from source aging and vibration',
        'Design a CO₂-based demand-controlled ventilation (DCV) logic and compare with ASHRAE 62.1 requirements',
      ],
    },
    proc: {
      ko: [
        'NDIR 센서 구조 단면도 학습: 광원(IR LED), 측정 셀, 비교 채널(기준 가스), 검출기 위치 확인',
        '환기 OFF + 시스템 정상 운전 → CO₂ 상승 속도(ppm/min) 10분간 기록',
        '상승 기울기(ppm/min)로부터 인원 역산: gen_rate = 0.3 L/min/인, 공간 30 m³ 가정',
        '목표 CO₂(예: 1000 ppm)로 환기 ON → CO₂ 감소 지수 감쇠 곡선 기록(10분간)',
        '감쇠 곡선에서 τ = V_room / Q_vent 역산 → 환기량(CMM) 추정 및 설계값과 비교',
        'ABC 알고리즘 시뮬레이션: 7일치 가상 CO₂ 데이터 제공 → 이동 최솟값 영점 추출 실습',
        'DCV 제어 로직 설계: CO₂ 600 ppm 이하→ 환기 최소, 600~800 ppm → 비례, 800 ppm 초과 → 최대 환기 로직 작성',
        '설계한 DCV 로직과 ASHRAE 62.1 요구 환기량(예: 8.5 L/s/인) 비교, 에너지 절감 효과 추정',
      ],
      en: [
        'Study NDIR sensor cross-section: locate IR source, measurement cell, reference channel, and detector',
        'Ventilation OFF + system running normally → log CO₂ rise rate (ppm/min) for 10 min',
        'Back-calculate occupancy from rise slope (assume gen_rate = 0.3 L/min/person, room 30 m³)',
        'Turn ventilation ON at target CO₂ (e.g., 1000 ppm) → log exponential CO₂ decay for 10 min',
        'Back-calculate τ = V_room / Q_vent from decay curve → estimate ventilation flow (CMM) and compare with design value',
        'ABC algorithm simulation: provide 7-day virtual CO₂ dataset → practice extracting rolling-minimum baseline',
        'Design DCV control logic: CO₂ <600 ppm → min ventilation; 600–800 ppm → proportional; >800 ppm → max ventilation',
        'Compare designed DCV logic with ASHRAE 62.1 required ventilation rate (e.g., 8.5 L/s/person); estimate energy savings',
      ],
    },
    inputs:  ['ventilationOn', 'fanSpeed', 'targetCO2'],
    outputs: ['co2', 'powerKW'],
  },

  // ── Session 15 ──────────────────────────────────────────────────────
  {
    n: 15, comp: 'plc',
    title: { ko: 'PLC 통합 제어 — 래더 로직·인터록·PID 튜닝', en: 'PLC Integrated Control — Ladder Logic, Interlocks & PID Tuning' },
    icon: 'settings',
    duration: '3h',
    obj: {
      ko: [
        'LS PLC의 래더 로직 기본 요소(접점 NO/NC, 코일, 타이머 TON/TOF, 카운터 CTU)를 도해로 설명한다',
        '모드 전환 시퀀스(Cool→Heat)의 DI → 래더 로직 → DO 경로를 추적하고 각 인터록 조건을 열거한다',
        '압축기 기동 지연(Off Delay) 인터록(3분 타이머)의 필요성과 래더 로직 구현 방법을 설명한다',
        'P, PI, PID 제어기의 파라미터 변화(Kp, Ki, Kd)가 실내 온도 제어 응답(오버슈트, 정착 시간, 정상 상태 오차)에 미치는 영향을 비교한다',
        'Modbus RTU 통신 프레임 구조(장치 주소, 기능 코드, 데이터, CRC16)를 해석하고 인버터 주파수 명령을 전송하는 방법을 설명한다',
        '비상 정지(Emergency Stop) 회로의 하드웨어 인터록(2중 채널 STO 회로)과 소프트웨어 인터록의 차이 및 안전 레벨(SIL)을 설명한다',
      ],
      en: [
        'Explain the basic ladder-logic elements of the LS PLC (NO/NC contacts, coils, TON/TOF timers, CTU counter) with diagrams',
        'Trace the mode-switch sequence (Cool→Heat) along the DI → ladder logic → DO path and list each interlock condition',
        'Explain the need for and ladder-logic implementation of the compressor restart delay interlock (3-min off-delay timer)',
        'Compare the effect of P, PI, and PID parameter changes (Kp, Ki, Kd) on indoor temperature control response (overshoot, settling time, steady-state error)',
        'Interpret a Modbus RTU communication frame (device address, function code, data, CRC16) and explain how to send an inverter frequency command',
        'Describe the difference between hardware interlock (dual-channel STO circuit) and software interlock in an emergency-stop circuit, and explain the safety-integrity level (SIL)',
      ],
    },
    proc: {
      ko: [
        '래더 로직 예제 프린트물 배포: 5개 기본 회로(자기 유지, 인터록, TON 지연, CTU 카운터, 아날로그 스케일) 분석',
        '모드 전환 시퀀스 트레이스: Cool 모드 DI → 4방향 밸브 코일 → 압축기 기동 인터록 → 팬 속도 DO 경로 추적 및 표로 정리',
        '압축기 기동 지연 타이머(3분) 동작 확인: 난방 → 냉방 전환 후 타이머 완료 전 압축기 재기동 시도 → 인터록 동작 확인',
        'P 제어(Kp=2.0, Ki=0, Kd=0) 적용: 설정 온도 step 응답 기록 (오버슈트, 정착 시간, 잔류 오차)',
        'PI 제어(Kp=1.5, Ki=0.3) 적용: 동일 step 응답 비교 → 잔류 오차 제거 확인',
        'PID 제어(Kp=1.5, Ki=0.3, Kd=0.5) 적용: 응답 속도 vs 오버슈트 트레이드오프 관찰 및 최적 파라미터 선택',
        'Modbus RTU 프레임 분석: 인버터 주파수 명령 바이트열 해석 실습 (16진수 → 주파수 환산)',
        '비상 정지 회로 동작 확인: 비상 정지 버튼 → 하드웨어 STO 회로 → PLC 인터록 순서 추적 및 복귀 절차 실습',
      ],
      en: [
        'Distribute ladder-logic example printouts: analyze 5 basic circuits (self-hold, interlock, TON delay, CTU counter, analog scaling)',
        'Trace mode-switch sequence: Cool mode DI → 4-way valve coil → compressor-start interlock → fan-speed DO path; tabulate findings',
        'Verify compressor restart delay timer (3 min): after Heat→Cool switchover, attempt restart before timer expires → confirm interlock activation',
        'Apply P control (Kp=2.0, Ki=0, Kd=0): record setpoint step response (overshoot, settling time, steady-state error)',
        'Apply PI control (Kp=1.5, Ki=0.3): compare step response → confirm elimination of steady-state error',
        'Apply PID control (Kp=1.5, Ki=0.3, Kd=0.5): observe response-speed vs overshoot trade-off; select optimal parameters',
        'Modbus RTU frame analysis: decode inverter-frequency command byte string (hex → frequency conversion)',
        'Verify emergency-stop circuit: E-stop button → hardware STO → PLC interlock sequence trace; practice reset procedure',
      ],
    },
    inputs:  ['mode', 'targetTemp', 'fanSpeed', 'power'],
    outputs: ['indoorTemp', 'compFreqHz', 'powerKW'],
  },

  // ── Session 16 ──────────────────────────────────────────────────────
  {
    n: 16, comp: 'ai',
    title: { ko: 'AI 자동 제어 · 에너지 최적화 종합 실습', en: 'AI Auto-Control · Energy Optimisation Comprehensive Lab' },
    icon: 'ai',
    duration: '4h',
    obj: {
      ko: [
        'IEG-AI 엔진의 입력 특성(센서 시계열: T·RH·CO₂·PM2.5·전력)과 출력(압축기 주파수·팬 속도·EXV 개도 명령)의 데이터 흐름을 설명한다',
        '강화학습(Reinforcement Learning) 기반 에너지 최적화의 State·Action·Reward 구조를 HVAC 시스템에 대입하여 설명한다',
        '수동 제어(고정 온도·팬 설정)와 AI Auto 제어를 동일 부하 조건 1시간 운전 비교 → kWh·EER·실내 쾌적도 지표를 정량 비교한다',
        'AI 제어 엔진의 이상 진단 기능(압축기 주파수 이상, 냉매 부족 예측, 필터 수명 예측)을 평가하고 알람 정확도를 검토한다',
        '전 과정(차수 1~15)에서 학습한 부품·제어·센서 지식을 통합하여 시스템 전체의 에너지 절감 시나리오를 설계하고 발표한다',
        '에너지 성적서(EER·ESEER·소비전력·CO₂ 배출량)를 작성하고, 개선안을 제시하는 최종 보고서를 완성한다',
      ],
      en: [
        'Describe the data flow of the IEG-AI engine: inputs (sensor time-series: T·RH·CO₂·PM2.5·power) and outputs (compressor frequency, fan speed, EXV opening commands)',
        'Map the State·Action·Reward structure of reinforcement-learning energy optimization onto the HVAC system context',
        'Compare 1 h of manual control (fixed setpoint/fan) vs 1 h of AI Auto control under identical load → quantify kWh, EER, and comfort metrics',
        'Evaluate the AI engine\'s fault-diagnosis functions (compressor frequency anomaly, low-charge prediction, filter-life forecast) and review alarm accuracy',
        'Integrate knowledge from Sessions 1–15 (components, controls, sensors) to design and present a whole-system energy-saving scenario',
        'Complete a final energy-performance report (EER, ESEER, power consumption, CO₂ emissions) with proposed improvements',
      ],
    },
    proc: {
      ko: [
        '[0~20분] AI 엔진 아키텍처 강의: 엣지 AI, 센서 데이터 전처리(이동 평균, 이상 감지), 강화학습 에이전트 설명',
        '[20~40분] 수동 제어 조건 설정: 목표 T=25°C, 팬=L3 고정, 가습기·청정기 OFF → 1시간 운전 시작',
        '[40~60분] 수동 제어 1시간 운전 중 10분 간격으로 T·RH·CO₂·소비전력(kW) 수동 기록, kWh 누적 계산',
        '[60~80분] 동일 초기 조건에서 AI Auto 모드로 전환 → AI가 어떻게 설정값을 변경하는지 관찰·기록',
        '[80~100분] AI Auto 1시간 운전 완료 → 수동 vs AI kWh·EER·RH 편차·CO₂ 편차 비교표 작성',
        '[100~120분] AI 이상 진단 평가: 인위적 알람 조건(팬 정지, 설정 온도 극단값) 생성 후 AI 알람 정확도·응답 시간 기록',
        '[120~180분] 팀별 에너지 절감 시나리오 설계: 스케줄 제어(야간 온도 완화), 수요 제어 환기(DCV), 예측 냉방(AI 예열) 중 하나 선택, 절감 효과 수치화',
        '[180~240분] 최종 보고서 작성(에너지 성적서 양식 사용) 및 팀별 10분 발표, 강사 종합 피드백',
      ],
      en: [
        '[0–20 min] AI engine architecture lecture: edge AI, sensor data pre-processing (moving average, anomaly detection), RL-agent explanation',
        '[20–40 min] Set up manual control conditions: target T=25°C, fan=L3 fixed, humidifier and purifier OFF → start 1 h run',
        '[40–60 min] During manual 1 h run, manually log T, RH, CO₂, and power (kW) every 10 min; accumulate kWh',
        '[60–80 min] Switch to AI Auto mode under identical starting conditions → observe and record how AI adjusts setpoints',
        '[80–100 min] AI Auto 1 h run complete → build comparison table: manual vs AI kWh, EER, RH deviation, CO₂ deviation',
        '[100–120 min] Evaluate AI fault diagnosis: create artificial alarm conditions (fan stop, extreme setpoints) → log alarm accuracy and response time',
        '[120–180 min] Team energy-saving scenario design: choose one strategy (schedule control / night setback, DCV, predictive pre-cooling) and quantify expected savings',
        '[180–240 min] Complete final energy-performance report (using scorecard template) → 10-min team presentation each; instructor gives consolidated feedback',
      ],
    },
    inputs:  ['mode', 'targetTemp', 'fanSpeed', 'humidifierOn', 'airPurifierOn'],
    outputs: ['indoorTemp', 'co2', 'powerKW', 'eer'],
  },
];
