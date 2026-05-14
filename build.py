#!/usr/bin/env python3
"""Build IEG-HVAC standalone HTML from src/ files."""
import os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(ROOT, 'src')

def read(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

css  = read(os.path.join(SRC, 'css', 'styles.css'))
i18n = read(os.path.join(SRC, 'js', 'i18n.js'))
curr = read(os.path.join(SRC, 'js', 'curriculum-data.js'))
sim  = read(os.path.join(SRC, 'js', 'sim.jsx'))
ui   = read(os.path.join(SRC, 'js', 'ui.jsx'))
sa   = read(os.path.join(SRC, 'js', 'screens-a.jsx'))
sb   = read(os.path.join(SRC, 'js', 'screens-b.jsx'))
sc   = read(os.path.join(SRC, 'js', 'screens-c.jsx'))
sd   = read(os.path.join(SRC, 'js', 'screens-d.jsx'))
app  = read(os.path.join(SRC, 'js', 'app.jsx'))

html = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>IEG-HVAC AI Control System</title>
  <style>
{css}
  </style>
  <!-- React 18 + Babel Standalone (CDN) -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
</head>
<body>
  <div id="root"></div>

  <script>
{i18n}
  </script>

  <script>
{curr}
  </script>

  <script type="text/babel">
{sim}
  </script>

  <script type="text/babel">
{ui}
  </script>

  <script type="text/babel">
{sa}
  </script>

  <script type="text/babel">
{sb}
  </script>

  <script type="text/babel">
{sc}
  </script>

  <script type="text/babel">
{sd}
  </script>

  <script type="text/babel">
{app}
  </script>
</body>
</html>"""

out = os.path.join(ROOT, 'index.html')
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Built → {out}")
print(f"Size : {len(html):,} bytes  ({len(html.splitlines())} lines)")
