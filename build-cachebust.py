#!/usr/bin/env python3
"""Stamp local CSS/JS references with a content hash so browsers can never
serve a stale mix of old and new files. Run after editing styles or scripts:

    python3 build-cachebust.py
"""
import re, hashlib, pathlib

ROOT = pathlib.Path(__file__).parent / "public"

def digest(rel: str) -> str | None:
    p = ROOT / rel.split("?")[0]
    if not p.is_file():
        return None
    return hashlib.md5(p.read_bytes()).hexdigest()[:8]

def strip(text: str) -> str:
    """Remove any existing ?v= stamps so hashing is stable."""
    return re.sub(r'(\.(?:css|js))\?v=[0-9a-f]{8}', r'\1', text)

changed = []

# 1. Inner ES-module imports:  from "./motion.js"  ->  from "./motion.js?v=hash"
for js in sorted((ROOT / "scripts").glob("*.js")):
    src = original = strip(js.read_text(encoding="utf-8"))
    def fix(m):
        quote, spec = m.group(1), m.group(2)
        d = digest(f"scripts/{spec.lstrip('./')}")
        return m.group(0) if d is None else f'from {quote}{spec}?v={d}{quote}'
    src = re.sub(r'from\s+(["\'])(\./[A-Za-z0-9_-]+\.js)\1', fix, src)
    if src != original:
        js.write_text(src, encoding="utf-8")
        changed.append(js.name)

# 2. @import inside CSS:  @import url("./tokens.css")
for css in sorted((ROOT / "styles").glob("*.css")):
    src = original = strip(css.read_text(encoding="utf-8"))
    def fixc(m):
        quote, spec = m.group(1), m.group(2)
        d = digest(f"styles/{spec.lstrip('./')}")
        return m.group(0) if d is None else f'@import url({quote}{spec}?v={d}{quote})'
    src = re.sub(r'@import\s+url\((["\'])(\./[A-Za-z0-9_-]+\.css)\1\)', fixc, src)
    if src != original:
        css.write_text(src, encoding="utf-8")
        changed.append(css.name)

# 3. Top-level references in EVERY page (hash them LAST, once contents settled)
def fixh(m):
    attr, path = m.group(1), m.group(2)
    d = digest(path)
    return m.group(0) if d is None else f'{attr}="{path}?v={d}"'

print("stamped modules:", ", ".join(changed) if changed else "(none changed)")
for html_path in sorted(ROOT.glob("*.html")):
    html = strip(html_path.read_text(encoding="utf-8"))
    html = re.sub(r'(href)="(styles/[^"?]+\.css)"', fixh, html)
    html = re.sub(r'(src)="(scripts/[^"?]+\.js)"', fixh, html)
    html_path.write_text(html, encoding="utf-8")
    print(f"  {html_path.name}:")
    for line in html.split("\n"):
        if "?v=" in line:
            print("     ", line.strip())
