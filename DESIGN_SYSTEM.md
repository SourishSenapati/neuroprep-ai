# 🎨 NeuroPrep AI Design System

## Premium Dark Mode Implementation

---


## 1️⃣ THE HIERARCHY OF DARKNESS


### **Background Layers**


```css
/* Layer 1: The Canvas (Main Background) */
.page-background {
  background: #050505; /* Void Black */
  /* This recedes, allowing content to pop forward */
}

/* Layer 2: The Stage (Cards/Sections) */
.glass-card {
  background: rgba(18, 18, 18, 0.8); /* Glass Charcoal @ 80% */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Glass Edge */
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5); /* Soft dark shadow */
}

/* Layer 3: Depth via Gradients */
.radial-highlight {
  background: radial-gradient(
    circle at center,
    rgba(18, 18, 18, 0.4) 0%,
    rgba(5, 5, 5, 0) 70%
  );
}

```text

---


## 2️⃣ TYPOGRAPHY STRATEGY


### **The Contrast Rule**

| Element | Color | Hex | Font | Usage | 
| --------- | ------- | ----- | ------ | ------- | 
| **Headlines** | Crisp White | `#FFFFFF` | Playfair Display / Merriweather | H1, H2, H3 only | 
| **Body Text** | Muted Silver | `#A3A3A3` | Inter / Manrope | Paragraphs, lists, nav | 
| **Labels** | Muted Silver | `#A3A3A3` | Inter / Manrope | Form labels, metadata | 


### **Why Not Pure White Everywhere?**
Pure white (#FFFFFF) on pure black (#050505) causes **halation** (text appears to vibrate). Use Muted Silver (#A3A3A3) for body text to reduce eye strain.


### **Hover States**

```css
.nav-link {
  color: #A3A3A3; /* Muted Silver */
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #FFFFFF; /* Crisp White */
}

```text

---


## 3️⃣ THE ACCENT LOGIC


### **Color-Coded Functions**


#### 🔵 **Electric Blue (#3B82F6) = ACTION**
**Rule:** If it's blue, it MUST be clickable.


```tsx
// ✅ CORRECT USAGE
<button className="bg-electric-blue text-crisp-white">
  Submit Insight
</button>

<a href="/dashboard" className="text-electric-blue hover:underline">
  View Dashboard →
</a>

// ❌ INCORRECT USAGE
<p className="text-electric-blue">This is just text</p> // NO! Not an action

```text


#### 🟢 **Terminal Green (#4ADE80) = DATA & TECH**
**Rule:** Visual indicators, not interactive elements.


```tsx
// ✅ CORRECT USAGE
<span className="text-terminal-green">✓</span> Success
<code className="text-terminal-green">npm install</code>
<li className="text-terminal-green">React</li>

// ❌ INCORRECT USAGE
<button className="bg-terminal-green">Click Me</button> // Use Blue for actions!

```text


#### 🟡 **Iconic Gold (#EAB308) = IDENTITY**
**Rule:** Less than 5% of the page. Reserved for branding.


```tsx
// ✅ CORRECT USAGE
<span className="text-iconic-gold font-serif text-4xl">S.</span> // Logo
<span className="text-iconic-gold">★ Featured</span> // Top achievement

// ❌ INCORRECT USAGE
<p className="text-iconic-gold">Regular paragraph</p> // Too common!

```text

---


## 4️⃣ IMPLEMENTATION CHECKLIST


### ✅ **DO THIS**


#### **Shadows**

```css
.floating-card {
  /* Large, soft, DARK shadows */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

```text


#### **Borders**

```css
.card-edge {
  /* Thin, low-opacity white borders */
  border: 1px solid rgba(255, 255, 255, 0.1);
}

```text


#### **Buttons**

```css
.cta-button {
  /* Pill-shaped (fully rounded) */
  border-radius: 9999px; /* or rounded-full in Tailwind */
  background: #3B82F6; /* Electric Blue */
  color: #FFFFFF; /* Crisp White */
  padding: 0.75rem 2rem;
  transition: all 0.3s ease;
}

.cta-button:hover {
  background: #2563EB; /* Darker blue */
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); /* Blue glow */
}

```text


#### **Spacing**

```css
/* Generous "darkspace" */
.section {
  padding: 6rem 2rem; /* Lots of vertical breathing room */
}

.card-grid {
  gap: 2rem; /* Space between cards */
}

```text

---


### ❌ **AVOID THIS**

| Don't | Why | 
| ------- | ----- | 
| Light/white shadows | Creates a "dirty" glow effect | 
| Thick solid borders | Ruins sleek modern feel | 
| Square buttons | Aesthetic relies on smooth curves | 
| Crowded elements | Destroys luxury dark mode feel | 
| Blue text on black | Hard to read; use blue for button backgrounds | 

---


## 5️⃣ ACCESSIBILITY


### **Contrast Ratios**

| Combo | Ratio | WCAG | Safe? | 
| ------- | ------- | ------ | ------- | 
| Muted Silver (#A3A3A3) on Void Black (#050505) | **9:1** | AAA | ✅ Excellent | 
| Crisp White (#FFFFFF) on Void Black (#050505) | **21:1** | AAA | ✅ Perfect | 
| Electric Blue (#3B82F6) on Void Black (#050505) | **6.5:1** | AA | ✅ Good for large text/buttons | 


### **Blue Text Warning**
❌ **Don't use Electric Blue (#3B82F6) for small body text on black.**  
✅ **Use it for button backgrounds or large clickable links only.**

If you need blue text, lighten it to `#60A5FA` for better readability.

---


## 6️⃣ COMPONENT PATTERNS


### **Card Component**

```tsx
<div className="
  bg-glass-charcoal/80 
  border border-white/10 
  backdrop-blur-xl 
  rounded-2xl 
  p-6 
  shadow-[0_8px_32px_rgba(0,0,0,0.5)]
  hover:border-white/20
  transition-all duration-300
">
  <h3 className="font-serif text-crisp-white text-2xl mb-3">
    Card Title
  </h3>
  <p className="text-muted-silver text-base leading-relaxed">
    Body text uses Muted Silver for comfortable reading.
  </p>
  <button className="
    mt-4 
    bg-electric-blue 
    text-crisp-white 
    px-6 py-3 
    rounded-full 
    hover:bg-blue-600 
    transition-colors
  ">
    Take Action
  </button>
</div>

```text


### **Badge Component**

```tsx
<span className="
  inline-flex 
  items-center 
  gap-2 
  px-3 py-1.5 
  rounded-full 
  bg-glass-charcoal 
  border border-white/10 
  text-muted-silver 
  font-mono 
  text-sm
">
  <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
  Status Indicator
</span>

```text


### **Hero Section**

```tsx
<section className="
  min-h-screen 
  bg-void-black 
  relative 
  overflow-hidden
">
  {/* Radial gradient background */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(18,18,18,0.4)_0%,rgba(5,5,5,0)_70%)]" />
  
  {/* Content */}
  <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
    <h1 className="font-serif text-crisp-white text-6xl mb-4">
      Your Personal
      <span className="block text-terminal-green mt-2">AI Tutor</span>
    </h1>
    <p className="text-muted-silver text-xl leading-relaxed">
      Adaptive AI-driven preparation that focuses on your weak areas.
    </p>
  </div>
</section>

```text

---


## 7️⃣ TAILWIND CONFIG


```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'void-black': '#050505',
        'glass-charcoal': '#121212',
        'crisp-white': '#FFFFFF',
        'muted-silver': '#A3A3A3',
        'terminal-green': '#4ADE80',
        'electric-blue': '#3B82F6',
        'iconic-gold': '#EAB308',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        sans: ['Inter', 'Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
}

```text

---


## 8️⃣ GLOBAL CSS


```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-void-black text-muted-silver font-sans antialiased;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-serif text-crisp-white;
  }
  
  ::selection {
    @apply bg-terminal-green/20 text-crisp-white;
  }
}

@layer utilities {
  .glass-card {
    @apply bg-glass-charcoal/80 border border-white/10 backdrop-blur-xl;
  }
  
  .shadow-premium {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }
  
  .glow-terminal {
    text-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
  }
  
  .glow-electric {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  }
}

```text

---


## ✅ CURRENT IMPLEMENTATION STATUS

All specifications above are **LIVE** in:

- ✅ `frontend/tailwind.config.js`
- ✅ `frontend/app/globals.css`
- ✅ `frontend/styles/apple-glass.css`
- ✅ `frontend/app/page.tsx`
- ✅ `frontend/app/interview/setup/page.tsx`

**Deployment:** https://neuroprep-ai.vercel.app

---

*Design System v1.0 | NeuroPrep AI | December 2025*
