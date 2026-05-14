# IEG-HVAC AI Control Panel

Interactive HVAC training simulator — browser-based, no install required.

**[▶ Live Demo](https://kimgwinil.github.io/IEG-HVAC/)**

---

## Features

- **Real-time simulation** — 1 Hz tick drives all sensor values (temp, RH, CO₂, PM2.5, power, EER)
- **Refrigerant cycle schematic** — animated pipe flow, compressor Hz, EXV opening, superheat/subcooling
- **Korea / Malaysia versions** — heat pump (4-way valve + PTC heater) vs. cooling-only
- **Interactive controls** — mode, fan speed, setpoints, humidifier, air purifier, ventilation
- **Educational courses** — 9 structured lessons with quizzes
- **HW panel buttons** — POWER, RUN, ALARM, STOP, E-STOP
- **Bilingual** — KO / EN

## Quick Start (local)

```bash
python3 build.py   # generates index.html
open index.html    # or any browser
```

No Node.js or bundler needed. React 18 + Babel are loaded from CDN.

## Project Structure

```
src/
  js/
    sim.jsx            # 1Hz simulation engine
    app.jsx            # root layout, routing, HW buttons
    ui.jsx             # shared components (Icon, StatCard, etc.)
    screens-a.jsx      # Dashboard + Schematic + Mode screens
    screens-b.jsx      # Env & Power screens
    screens-c.jsx      # Alarm & Event screens
    screens-d.jsx      # Curriculum / Lesson screen
    i18n.js            # KO/EN string dictionary
    curriculum-data.js # Course content
  css/
    styles.css
build.py               # standalone HTML builder
index.html             # built output (served by GitHub Pages)
```

## Deployment

Every push to `main` triggers GitHub Actions → builds `index.html` → deploys to GitHub Pages automatically.
