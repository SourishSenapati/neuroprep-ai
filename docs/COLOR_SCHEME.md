# NeuroPrep AI - Dark Green Theme Design System


## Official Color Palette

This is the authoritative color scheme for NeuroPrep AI, applied throughout the entire application.


### Primary Colors

```css
--bg-color: #050505;           /* Deep Void Background */
--text-primary: #F0F0F0;       /* Off-White/Smoke (Primary Text) */
--text-secondary: #A3A3A3;     /* Neutral Gray (Secondary Text) */
--accent-green: #4ADE80;       /* Vibrant Emerald (Accent) */
--border-subtle: #1F1F1F;      /* Subtle Border */
```


### Extended Palette

```css
--ambient-glow: #0f2e20;       /* Dark Forest Green (Gradients) */
--card-bg: #0a0a0a;            /* Card Backgrounds */
```


## Usage Guidelines


### 60-30-10 Rule Applied

- **60% Backgrounds:** `#050505`, `#0a0a0a`
- **30% Text & Structure:** `#F0F0F0`, `#A3A3A3`, `#1F1F1F`
- **10% Accents:** `#4ADE80` (buttons, links, highlights)


### Component Examples


#### Buttons
```tsx
className="bg-[#4ADE80]/10 border border-[#4ADE80] text-[#4ADE80] hover:bg-[#4ADE80] hover:text-black"
```


#### Cards
```tsx
className="bg-[#0a0a0a] border border-[#1F1F1F]"
```


#### Headings
```tsx
className="text-[#F0F0F0]"
```


#### Body Text
```tsx
className="text-[#A3A3A3]"
```


### Ambient Glow (Radial Gradients)
```tsx
style={{ background: 'radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, rgba(5, 5, 5, 0) 70%)' }}
```


## Accessibility

- ✅ WCAG AA compliant contrast ratios
- ✅ Primary text (#F0F0F0 on #050505): 17.38:1
- ✅ Accent green (#4ADE80 on #050505): 11.24:1


## Implementation Status

All components use this theme via:
- `globals.css` (base styles)
- Tailwind utilities (`bg-[#050505]`, `text-[#F0F0F0]`)
- CSS custom properties (`var(--accent-green)`)

**Last Updated:** December 2025
