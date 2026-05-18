# Theme Toggle Button Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the gold pill theme toggle with a subtle gray pill + circular accent-color icon indicator that blends into the sidebar design system.

**Architecture:** Three files change — `styles.css` gets new `.theme-toggle` rules matching the adjacent `.sidebar-toggle` visual weight, `nav.js` swaps the button HTML template (label before icon) and adjusts the setTheme SVG assignment, `sw.js` bumps cache for deployment. No logic or mobile changes.

**Tech Stack:** Pure HTML/CSS/JS, no build tools.

---

### Task 1: Update styles.css — Replace .theme-toggle CSS

**Files:**
- Modify: `styles.css:250-277`

Replace the gold pill `.theme-toggle` block and its hover/svg/label sub-rules with the new gray-pill + circle-indicator design.

- [ ] **Step 1: Replace CSS block**

Replace the content from `/* ── Theme toggle ── */` comment down to `.theme-toggle-mobile { display: none; }` line (lines 250-278) with:

```css
/* ── Theme toggle ─────────────────────────────────────── */
.theme-toggle {
  position: absolute;
  top: 10px;
  right: 40px;
  display: flex;
  align-items: center;
  gap: 5px;
  height: 28px;
  padding: 0 5px 0 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 14px;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  font-family: var(--font-sans);
  transition: all var(--duration-fast) var(--ease-out);
  z-index: 1;
}
.theme-toggle:hover {
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.18);
  color: #cbd5e1;
}
.theme-toggle-icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fbbf24;
  flex-shrink: 0;
}
.theme-toggle-icon-circle svg {
  width: 12px;
  height: 12px;
  stroke: #0f172a;
}
.theme-toggle-label { flex-shrink: 0; }

/* Light theme overrides */
[data-theme="light"] .theme-toggle {
  background: rgba(0,0,0,0.03);
  border-color: rgba(0,0,0,0.08);
  color: #475569;
}
[data-theme="light"] .theme-toggle:hover {
  background: rgba(0,0,0,0.06);
  border-color: rgba(0,0,0,0.12);
  color: #334155;
}
[data-theme="light"] .theme-toggle-icon-circle {
  background: #6366f1;
}
[data-theme="light"] .theme-toggle-icon-circle svg {
  stroke: #e0e7ff;
}
.theme-toggle-mobile { display: none; }
```

- [ ] **Step 2: Commit**

```bash
git add styles.css
git commit -m "style: replace gold pill theme-toggle with gray pill + circle indicator"
```

---

### Task 2: Update nav.js — Adjust button HTML template and setTheme SVG

**Files:**
- Modify: `nav.js:66-69` (HTML template)
- Modify: `nav.js:181-182` (moonSVG / sunSVG variables, optional cleanup)

Changes:
1. Wrap the icon SVG in a `<span class="theme-toggle-icon-circle">` wrapper
2. Move the `<span class="theme-toggle-label">` before the icon circle

- [ ] **Step 1: Update the HTML template (lines 66-69)**

Replace:
```javascript
html += '<button class="theme-toggle" id="theme-toggle" title="切换亮色/暗色主题" aria-label="切换主题">';
html += '<svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
html += '<span class="theme-toggle-label">亮色</span>';
html += '</button>';
```

With:
```javascript
html += '<button class="theme-toggle" id="theme-toggle" title="切换亮色/暗色主题" aria-label="切换主题">';
html += '<span class="theme-toggle-label">亮色</span>';
html += '<span class="theme-toggle-icon-circle"><svg id="theme-icon" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></span>';
html += '</button>';
```

Key changes:
- `<span class="theme-toggle-label">` moved before the icon
- Icon SVG now wrapped in `<span class="theme-toggle-icon-circle">`
- `stroke="currentColor"` removed from SVG since we control stroke via CSS on the circle wrapper

- [ ] **Step 2: Commit**

```bash
git add nav.js
git commit -m "refactor: reorder theme toggle label before icon, wrap icon in circle span"
```

---

### Task 3: Bump SW cache version

**Files:**
- Modify: `sw.js:1`

- [ ] **Step 1: Bump cache version**

Replace:
```javascript
const CACHE = 'bank-baguwen-v8';
```

With:
```javascript
const CACHE = 'bank-baguwen-v9';
```

- [ ] **Step 2: Commit**

```bash
git add sw.js
git commit -m "chore: bump SW cache to v9 for theme toggle redesign"
```

---

### Verification

After all tasks, verify:
1. Open `index.html` in browser — button should show gray pill with gold circle indicator
2. Click toggle — switches to light theme, circle turns indigo (#6366f1)
3. Hover both states — background and text subtly brighten
4. Mobile view (< 960px) — mobile toggle unchanged (48×48 icon-only, top-right)
5. localStorage persists choice across page reloads
