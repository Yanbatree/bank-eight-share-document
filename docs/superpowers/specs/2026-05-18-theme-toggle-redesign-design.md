# Theme Toggle Button Redesign

## Summary

Replace the gold pill theme toggle button with a more refined design that blends into the sidebar's visual system. The new button uses a subtle gray pill container with a circular color-accent icon indicator.

## Current State

- Gold semi-transparent pill (`rgba(251,191,36,0.2)` background, gold border, gold text)
- Icon (moon/sun SVG) + text label ("亮色"/"暗色")
- Stands out aggressively against the dark navy sidebar — the gold clashes with the blue-gray design system

## Target Design (Option B — Pill + Circle Indicator)

### Structure

```
[text label] [● circular icon]
```

- Gray semi-transparent pill container: `border-radius: 14px`, `height: 28px`
- Left side: short text label ("亮色" / "暗色")
- Right side: 20×20px circle containing the sun/moon SVG icon
- Spacing and sizing match the adjacent collapse button for visual consistency

### Colors

| State | Theme | Container bg | Border | Text color | Circle bg |
|-------|-------|-------------|--------|------------|-----------|
| Default | Dark | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.10)` | `#94a3b8` | `#fbbf24` (gold) |
| Hover | Dark | `rgba(255,255,255,0.10)` | `rgba(255,255,255,0.18)` | `#cbd5e1` | `#fbbf24` |
| Default | Light | `rgba(0,0,0,0.03)` | `rgba(0,0,0,0.08)` | `#475569` | `#6366f1` (indigo) |
| Hover | Light | `rgba(0,0,0,0.06)` | `rgba(0,0,0,0.12)` | `#334155` | `#6366f1` |

### Icon

- Dark theme: moon SVG (when in dark mode) with dark stroke on gold circle; sun SVG (when in light mode)
- Light theme: moon SVG with light stroke on indigo circle; sun SVG analogously
- SVG viewBox `0 0 24 24`, stroke-width 2.5, sized to 12×12 inside the 20px circle

### Transitions

- All color/background changes use `transition: all var(--duration-fast) var(--ease-out)` matching existing system

## Files to Change

1. **`styles.css`** — Replace `.theme-toggle` CSS block (~line 250-278). Keep `.theme-toggle-mobile` unchanged.
2. **`nav.js`** — Adjust button HTML template (swap icon/text order). Update `setTheme()` SVG assignment to match new icon style. No logic changes.
3. **`sw.js`** — Bump cache version to force refresh.

## What Stays the Same

- Mobile `.theme-toggle-mobile` (48×48 icon-only, top-right fixed) — not changed
- localStorage persistence logic
- `data-theme` attribute on `<html>`
- Click handler and `setTheme()` flow
- All CSS variables for light/dark themes
