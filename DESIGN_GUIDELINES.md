# DESIGN_GUIDELINES.md — Вбудовані принципи дизайну

> Цей файл містить витяги з Claude Skills для використання в локальному Claude Code

---

## 1. FRONTEND DESIGN PRINCIPLES

### Design Thinking (перед кодом)

Перед початком кодування визнач:
- **Purpose**: Яку проблему вирішує інтерфейс? Хто користувач?
- **Tone**: Обери BOLD естетичний напрямок (не середнячок)
- **Differentiation**: Що зробить цей сайт НЕЗАБУТНІМ?

### Категорично ЗАБОРОНЕНО (Generic AI Slop)

```
❌ НЕ ВИКОРИСТОВУЙ:
- Шрифти: Inter, Roboto, Arial, Open Sans, system-ui
- Кольори: фіолетові градієнти на білому фоні
- Layouts: типові bootstrap-style картки
- Стиль: все що виглядає "як згенерував AI"
```

### Обов'язкові елементи якісного дизайну

**Typography:**
- Обери distinctive display font для заголовків
- Обери refined body font для тексту
- Unexpected, characterful font choices
- НЕ використовуй generic fonts

**Color & Theme:**
- Commit to cohesive aesthetic
- Dominant colors з sharp accents
- НЕ timid, evenly-distributed palettes
- Використовуй CSS variables для consistency

**Motion & Animation:**
- Staggered reveals (animation-delay) на page load
- Scroll-triggered animations
- Hover states that surprise
- Micro-interactions в ключових місцях
- CSS-only solutions де можливо

**Spatial Composition:**
- Asymmetry замість симетрії
- Overlap елементів
- Grid-breaking elements
- Generous negative space АБО controlled density

**Backgrounds & Visual Details:**
- Gradient meshes
- Noise textures (subtle)
- Geometric patterns
- Layered transparencies
- Dramatic shadows
- Decorative borders

---

## 2. MEDICAL WEBSITE SPECIFIC

### Психологія кольорів для медицини

```
✅ ДОВІРА: teal, blue, green
✅ ЧИСТОТА: white, mint, light grey
✅ ТЕПЛО: warm white, cream, soft gold
❌ УНИКАЙ: aggressive red, neon, dark themes
```

### Принципи медичного UX

1. **Trust First** — кожен елемент має викликати довіру
2. **Clarity** — інформація легко знаходиться
3. **Accessibility** — для всіх вікових груп
4. **Professional** — не занадто casual
5. **Human** — не занадто corporate/cold

### Що роблять найкращі медичні сайти

**Mayo Clinic:**
- Чистий white space
- Clear hierarchy
- Easy navigation
- Trust badges

**One Medical:**
- Modern, warm aesthetic
- Friendly photography
- Simple booking flow
- Mobile-first

**Cleveland Clinic:**
- Professional authority
- Comprehensive but organized
- Strong search function

---

## 3. РЕКОМЕНДОВАНА ПАЛІТРА

### "Medical Serenity" Theme

```css
:root {
  /* Primary - Trust & Health */
  --primary: #0D9488;        /* teal - основний */
  --primary-light: #14B8A6;  /* hover states */
  --primary-dark: #0F766E;   /* active states */

  /* Backgrounds */
  --bg-warm-white: #FAFAF9;  /* main background */
  --bg-surface: #F0FDFA;     /* cards, sections */
  --bg-accent: #E6FFFA;      /* highlighted areas */

  /* Text */
  --text-primary: #1E293B;   /* headings, body */
  --text-secondary: #64748B; /* captions, meta */
  --text-muted: #94A3B8;     /* placeholders */

  /* Accent */
  --accent-gold: #D4A853;    /* CTA buttons */
  --accent-gold-hover: #C9983F;

  /* Utility */
  --border: #E2E8F0;
  --shadow: rgba(13, 148, 136, 0.1);
}
```

### Tailwind Config

```javascript
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'primary': '#0D9488',
        'primary-light': '#14B8A6',
        'primary-dark': '#0F766E',
        'surface': '#F0FDFA',
        'warm-white': '#FAFAF9',
        'charcoal': '#1E293B',
        'accent-gold': '#D4A853',
      },
      fontFamily: {
        'display': ['"DM Serif Display"', 'Georgia', 'serif'],
        'body': ['"DM Sans"', 'system-ui', 'sans-serif'],
      }
    }
  }
}
```

---

## 4. TYPOGRAPHY

### Рекомендовані Google Fonts пари

**Варіант 1 — Elegant Medical:**
```html
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```
- Headers: DM Serif Display (modern classic)
- Body: DM Sans (clean, matching)

**Варіант 2 — Warm Professional:**
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">
```
- Headers: Playfair Display (elegant serif)
- Body: Source Sans 3 (readable, friendly)

**Варіант 3 — Modern Minimal:**
```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
```
- Headers: Outfit 600-700 (geometric, clean)
- Body: Outfit 400-500 (consistent)

### Typography Scale

```css
/* Desktop */
h1 { font-size: 3.5rem; line-height: 1.1; }  /* 56px */
h2 { font-size: 2.5rem; line-height: 1.2; }  /* 40px */
h3 { font-size: 1.5rem; line-height: 1.3; }  /* 24px */
body { font-size: 1.125rem; line-height: 1.7; } /* 18px */

/* Mobile */
h1 { font-size: 2.25rem; }  /* 36px */
h2 { font-size: 1.75rem; }  /* 28px */
h3 { font-size: 1.25rem; }  /* 20px */
body { font-size: 1rem; }   /* 16px */
```

---

## 5. ANIMATIONS & MICRO-INTERACTIONS

### Page Load - Staggered Reveal

```css
.animate-fade-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeUp 0.8s ease forwards;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger delays */
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
```

### Scroll Reveal (Intersection Observer)

```javascript
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Card Hover Effects

```css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

### Button Interactions

```css
.btn-primary {
  background: var(--accent-gold);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary:hover {
  background: var(--accent-gold-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(212, 168, 83, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}
```

### Smooth Scroll

```css
html {
  scroll-behavior: smooth;
}
```

---

## 6. COMPONENT PATTERNS

### Hero Section Pattern

```
┌─────────────────────────────────────────┐
│  [Nav]                    [CTA Button]  │
├─────────────────────────────────────────┤
│                                         │
│     [Badge: "Сімейна медицина"]         │
│                                         │
│     ВЕЛИКИЙ ЗАГОЛОВОК                   │
│     font-display, 48-72px               │
│                                         │
│     Підзаголовок меншим шрифтом         │
│     max-width: 600px                    │
│                                         │
│     [Primary CTA]  [Secondary CTA]      │
│                                         │
│              ↓ scroll indicator         │
└─────────────────────────────────────────┘
```

### Service Card Pattern

```
┌────────────────────┐
│  ┌──────┐          │
│  │ Icon │          │
│  └──────┘          │
│                    │
│  Service Name      │  ← font-display
│                    │
│  Short description │  ← font-body, muted
│  of the service... │
│                    │
│  [Learn More →]    │  ← subtle link
└────────────────────┘
```

### Team Member Card Pattern

```
┌────────────────────┐
│ ┌────────────────┐ │
│ │                │ │
│ │     Photo      │ │  ← aspect-ratio: 4/5
│ │                │ │
│ └────────────────┘ │
│                    │
│  Dr. Name          │  ← font-display
│  Specialty         │  ← primary color
│                    │
│  Short bio text    │  ← font-body, small
└────────────────────┘
```

---

## 7. QUALITY CHECKLIST

### Before каждої commit/стадії

**Visual:**
- [ ] Немає generic AI aesthetics?
- [ ] Достатньо whitespace?
- [ ] Consistent spacing (8px grid)?
- [ ] Hover states на всіх interactive?

**Typography:**
- [ ] Не generic fonts?
- [ ] H1 великий (48-72px desktop)?
- [ ] Body мінімум 16px?
- [ ] Good line-height (1.5-1.7)?

**Mobile:**
- [ ] Tap targets 44x44px мінімум?
- [ ] Немає horizontal scroll?
- [ ] Читабельно без zoom?

**Accessibility:**
- [ ] Alt на images?
- [ ] Labels на form fields?
- [ ] Focus states visible?
- [ ] Contrast ratio 4.5:1+?

**Performance:**
- [ ] Images lazy loaded?
- [ ] Fonts preconnected?
- [ ] Мінімум dependencies?

---

## 8. ANTI-PATTERNS (що НЕ робити)

```
❌ Centered everything — use asymmetry
❌ Same padding everywhere — vary spacing
❌ Boring rectangular cards — add visual interest
❌ Plain white background — add subtle texture/gradient
❌ Generic stock photos — choose authentic imagery
❌ Too many colors — stick to palette
❌ Tiny click targets — think touch-first
❌ No hover feedback — everything interactive needs states
❌ Wall of text — break up with visuals
❌ Cluttered layout — embrace negative space
```
