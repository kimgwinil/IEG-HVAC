// Bilingual dictionary — Korean & English
window.I18N = {
  // brand
  brand: { en: "IEG-HVAC AI Control System", ko: "IEG-HVAC AI 제어 시스템" },
  panel: { en: "AI CONTROL PANEL", ko: "AI 제어 패널" },

  // nav
  nav_dashboard: { en: "Dashboard", ko: "대시보드" },
  nav_schematic: { en: "Schematic", ko: "계통도" },
  nav_mode:      { en: "Mode",      ko: "운전" },
  nav_ai:        { en: "AI",        ko: "AI 분석" },
  nav_energy:    { en: "Energy",    ko: "에너지" },
  nav_trend:     { en: "Trend",     ko: "추이" },
  nav_alarm:     { en: "Alarms",    ko: "경보" },
  nav_settings:  { en: "Settings",  ko: "설정" },

  // status
  status_online:  { en: "Online", ko: "온라인" },
  status_offline: { en: "Offline", ko: "오프라인" },

  // metrics
  m_indoorTemp:  { en: "Indoor Temp.",    ko: "실내 온도" },
  m_outdoorTemp: { en: "Outdoor Temp.",   ko: "실외 온도" },
  m_indoorRH:    { en: "Indoor RH",       ko: "실내 습도" },
  m_co2:         { en: "CO₂",             ko: "CO₂" },
  m_power:       { en: "Power",           ko: "전력" },
  m_eer:         { en: "EER",             ko: "EER" },
  m_pm25:        { en: "PM2.5",           ko: "PM2.5" },
  m_compFreq:    { en: "Comp. Hz",        ko: "압축기 Hz" },
  m_fan:         { en: "Fan",             ko: "송풍" },
  m_target:      { en: "Target",          ko: "목표" },
  m_setpoint:    { en: "Setpoint",        ko: "설정값" },

  // modes
  mode_cool: { en: "Cooling", ko: "냉방" },
  mode_heat: { en: "Heating", ko: "난방" },
  mode_auto: { en: "Auto",    ko: "자동" },
  mode_dry:  { en: "Dry",     ko: "제습" },
  mode_fan:  { en: "Fan",     ko: "송풍" },
  mode_off:  { en: "Standby", ko: "대기" },

  // components
  c_compressor: { en: "Compressor",        ko: "압축기" },
  c_condenser:  { en: "Condenser",         ko: "응축기" },
  c_evap:       { en: "Evaporator",        ko: "증발기" },
  c_exv:        { en: "Expansion Valve",   ko: "팽창변" },
  c_4way:       { en: "4-Way Valve",       ko: "4방 밸브" },
  c_heater:     { en: "Electric Heater",   ko: "전기 히터" },
  c_humid:      { en: "Humidifier",        ko: "가습기" },
  c_purif:      { en: "Air Purification",  ko: "공기 청정" },
  c_blower:     { en: "Blower Fan",        ko: "송풍팬" },
  c_co2sensor:  { en: "CO₂ Sensor",        ko: "CO₂ 센서" },
  c_pms:        { en: "Power Meter",       ko: "전력계" },

  // states
  s_on:    { en: "ON",    ko: "ON" },
  s_off:   { en: "OFF",   ko: "OFF" },
  s_idle:  { en: "Idle",  ko: "대기" },
  s_run:   { en: "Run",   ko: "운전" },
  s_fault: { en: "Fault", ko: "고장" },
  s_ok:    { en: "Normal", ko: "정상" },

  // actions
  a_setpoint:  { en: "Setpoint",        ko: "설정값" },
  a_fan:       { en: "Fan Speed",       ko: "팬 속도" },
  a_targetRH:  { en: "Target Humidity", ko: "목표 습도" },
  a_targetCO2: { en: "CO₂ Limit",       ko: "CO₂ 한계" },
  a_apply:     { en: "Apply",           ko: "적용" },

  // alarms list
  al_high_co2:  { en: "CO₂ over limit — increase ventilation",  ko: "CO₂ 한계 초과 — 환기 증가" },
  al_filter:    { en: "HEPA filter at 78% — replace soon",      ko: "HEPA 필터 잔여 78% — 곧 교체 권장" },
  al_defrost:   { en: "Defrost cycle scheduled in 18 min",      ko: "제상 사이클 18분 후 예정" },
  al_humid_low: { en: "Water tank low — humidifier paused",     ko: "물탱크 부족 — 가습 일시 정지" },
  al_comp_hz:   { en: "Compressor running at peak frequency",   ko: "압축기 최대 주파수 운전" },

  // sections / labels
  l_realtime:  { en: "Real-time Monitoring", ko: "실시간 모니터링" },
  l_quickctl:  { en: "Quick Control",        ko: "빠른 제어" },
  l_overview:  { en: "System Overview",      ko: "시스템 개요" },
  l_load:      { en: "Cooling Load",         ko: "냉방 부하" },
  l_loadh:     { en: "Heating Load",         ko: "난방 부하" },
  l_efficiency:{ en: "Efficiency",           ko: "효율" },
  l_24h:       { en: "Last 24 hours",        ko: "최근 24시간" },
  l_7d:        { en: "Last 7 days",          ko: "최근 7일" },
  l_now:       { en: "Now",                  ko: "현재" },
  l_recommend: { en: "AI Recommendations",   ko: "AI 추천" },
  l_diagnose:  { en: "Diagnostics",          ko: "진단" },
  l_acknowledge:{ en: "Acknowledge", ko: "확인" },
  l_clear:     { en: "Clear",        ko: "삭제" },
  l_history:   { en: "Event Log",    ko: "이벤트 로그" },
  l_specs:     { en: "Specifications", ko: "사양" },
  l_version:   { en: "System Version", ko: "시스템 버전" },
  l_units:     { en: "Display Units",  ko: "표시 단위" },

  // AI recommendations
  ai_r1_t: { en: "Raise setpoint by 1°C",
             ko: "설정 온도를 1°C 올리기" },
  ai_r1_d: { en: "Outdoor temp dropping in next 2 hr — projected savings 0.32 kWh",
             ko: "외기 온도가 향후 2시간 내 하강 — 예상 절감 0.32 kWh" },
  ai_r2_t: { en: "Reduce fan to L3 during low occupancy",
             ko: "저점유 시 팬을 L3로 감소" },
  ai_r2_d: { en: "CO₂ trend indicates room is empty — fan can be eased",
             ko: "CO₂ 추이로 보아 무인 — 팬 출력 완화 가능" },
  ai_r3_t: { en: "Pre-cool 14 min before peak rate window",
             ko: "피크 요금 14분 전 예냉" },
  ai_r3_d: { en: "Shift load to off-peak — projected savings ₩340/day",
             ko: "부하를 비피크로 이전 — 예상 절감 ₩340/일" },
  ai_health: { en: "System health", ko: "시스템 건강도" },
  ai_status_normal: { en: "All subsystems nominal", ko: "모든 서브시스템 정상" },

  // settings
  set_temp_unit: { en: "Temperature Unit", ko: "온도 단위" },
  set_language:  { en: "Language",         ko: "언어" },
  set_theme:     { en: "Display Theme",    ko: "화면 테마" },
  set_logging:   { en: "Data Logging",     ko: "데이터 로깅" },
  set_about:     { en: "About",            ko: "정보" },

  // misc
  on:  { en: "ON",  ko: "켜짐" },
  off: { en: "OFF", ko: "꺼짐" },
};

// translate helper
window.t = function (key, lang) {
  const entry = window.I18N[key];
  if (!entry) return key;
  return entry[lang || 'en'] || entry.en;
};
