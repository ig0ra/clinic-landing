# Design System — Сімейна клініка Св. Пантелеймона

> Версія 1.0 | Квітень 2026
> Дизайн-система для лендінгу та всіх цифрових продуктів клініки

---

## 1. Brand Foundation

### Позиціювання
- **Тон:** Теплий, професійний, доступний
- **Аудиторія:** Сім'ї з дітьми, люди 25-60 років, м. Калуш
- **Настрій:** "Ваш сімейний лікар, якому можна довіряти"
- **Не:** Корпоративний холод, агресивний маркетинг, надмірна "технологічність"

### Brand voice
| Так | Ні |
|-----|-----|
| "Ми подбаємо про ваше здоров'я" | "Інноваційні рішення для вашого здоров'я" |
| "Запишіться на прийом" | "Скористайтесь нашою послугою" |
| "Ваша дитина в надійних руках" | "Ми надаємо широкий спектр педіатричних послуг" |
| Проста українська мова | Канцеляризми, англіцизми |

---

## 2. Color System

### Primary Palette

```
┌──────────────────────────────────────────────────────────┐
│  PRIMARY — Teal (Довіра, здоров'я, спокій)               │
│                                                          │
│  ■ primary-900   #134E48   dark text on teal bg          │
│  ■ primary-800   #115E56   active states, pressed        │
│  ■ primary-700   #0F766E   primary-dark, footer links    │
│  ■ primary-600   #0D9488   ← BASE — nav, links, icons   │
│  ■ primary-500   #14B8A6   primary-light, hover states   │
│  ■ primary-400   #2DD4BF   badges, light accents         │
│  ■ primary-100   #CCFBF1   card hover bg                 │
│  ■ primary-50    #F0FDFA   surface bg (cards, sections)  │
│                                                          │
│  CSS Variable:  --color-primary: #0D9488                 │
│  Tailwind:      primary / primary-light / primary-dark   │
└──────────────────────────────────────────────────────────┘
```

### Accent — Gold (CTA, дія)

```
┌──────────────────────────────────────────────────────────┐
│  ACCENT — Gold (Теплота, запрошення до дії)              │
│                                                          │
│  ■ gold-700      #A67C3D   text on gold bg               │
│  ■ gold-600      #C9983F   hover state                   │
│  ■ gold-500      #D4A853   ← BASE — CTA buttons         │
│  ■ gold-400      #E0BB6E   disabled / light              │
│  ■ gold-100      #FDF4E0   badge bg                      │
│                                                          │
│  CSS Variable:  --color-accent: #D4A853                  │
│  Tailwind:      accent-gold / accent-gold-hover          │
└──────────────────────────────────────────────────────────┘
```

### Neutral Palette

```
┌──────────────────────────────────────────────────────────┐
│  NEUTRALS                                                │
│                                                          │
│  ■ charcoal      #1E293B   headings, primary text        │
│  ■ slate-600     #475569   body text                     │
│  ■ slate-500     #64748B   secondary text, captions      │
│  ■ slate-400     #94A3B8   muted text, placeholders      │
│  ■ slate-200     #E2E8F0   borders, dividers             │
│  ■ slate-100     #F1F5F9   card borders                  │
│  ■ warm-white    #FAFAF9   page background               │
│  ■ white         #FFFFFF   cards, inputs                 │
└──────────────────────────────────────────────────────────┘
```

### Semantic Colors

```
┌──────────────────────────────────────────────────────────┐
│  SEMANTIC                                                │
│                                                          │
│  ■ success-bg    #F0FDF4   green-50                      │
│  ■ success       #16A34A   green-600                     │
│  ■ error-bg      #FEF2F2   red-50                        │
│  ■ error         #DC2626   red-600                       │
│  ■ warning-bg    #FFFBEB   amber-50                      │
│  ■ warning       #D97706   amber-600                     │
│  ■ info-bg       #F0FDFA   primary-50                    │
│  ■ info          #0D9488   primary                       │
│  ■ telegram      #0088CC   Telegram brand                │
└──────────────────────────────────────────────────────────┘
```

### Contrast Requirements

| Комбінація | Ratio | WCAG |
|-----------|-------|------|
| charcoal on white | 12.63:1 | AAA |
| charcoal on warm-white | 12.25:1 | AAA |
| primary on white | 4.53:1 | AA |
| white on primary | 4.53:1 | AA |
| white on charcoal | 12.63:1 | AAA |
| gold on white | 2.84:1 | Fail — use only for large text / decorative |
| white on gold | 2.84:1 | Fail — OK for buttons (large text) |
| slate-600 on white | 7.01:1 | AAA |
| white/70 on primary | ~3.2:1 | Fail — use white/90 minimum |

---

## 3. Typography

### Font Stack

```css
/* Display — headings, hero, section titles */
font-family: 'DM Serif Display', Georgia, 'Times New Roman', serif;

/* Body — paragraphs, labels, buttons, UI */
font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale

| Token | Desktop | Mobile | Weight | Line-height | Use |
|-------|---------|--------|--------|-------------|-----|
| `display-xl` | 72px (4.5rem) | 40px (2.5rem) | 400 | 1.1 | Hero heading |
| `display-lg` | 56px (3.5rem) | 32px (2rem) | 400 | 1.15 | Section headings |
| `display-md` | 40px (2.5rem) | 28px (1.75rem) | 400 | 1.2 | Sub-section headings |
| `heading-lg` | 24px (1.5rem) | 22px (1.375rem) | 400 | 1.3 | Card titles, names |
| `heading-md` | 20px (1.25rem) | 18px (1.125rem) | 400 | 1.3 | Small headings |
| `body-lg` | 18px (1.125rem) | 16px (1rem) | 400 | 1.7 | Lead paragraphs |
| `body-md` | 16px (1rem) | 16px (1rem) | 400 | 1.6 | Body text |
| `body-sm` | 14px (0.875rem) | 14px (0.875rem) | 400 | 1.5 | Captions, meta |
| `label` | 14px (0.875rem) | 14px (0.875rem) | 500 | 1.4 | Form labels |
| `button` | 16px (1rem) | 16px (1rem) | 600 | 1 | Button text |
| `button-sm` | 14px (0.875rem) | 14px (0.875rem) | 600 | 1 | Small buttons |
| `overline` | 14px (0.875rem) | 12px (0.75rem) | 500 | 1.4 | Badges, categories |

### Typography Rules

1. **Headings:** DM Serif Display, завжди `charcoal` (#1E293B)
2. **Body text:** DM Sans 400, `slate-600` (#475569)
3. **Links in body:** `primary` (#0D9488), underline on hover
4. **Max line width:** 65-75 characters (~600px) для читабельності
5. **Мінімум 16px** для будь-якого тексту на мобільних (запобігає zoom на iOS)

---

## 4. Spacing System

### Base Grid: 4px

```
4px   — micro gaps (dot indicators, icon spacing)
8px   — small gaps (between badge dot and text)
12px  — compact padding (tags, small buttons)
16px  — default gap (card padding mobile, form gaps)
20px  — comfortable gap
24px  — section inner spacing
32px  — card padding desktop
40px  — between content blocks
48px  — between sections (mobile)
64px  — section padding (mobile: py-16)
80px  — between major sections
96px  — section padding (desktop: py-24)
128px — hero section padding (desktop: py-32)
```

### Container

```
max-width: 1280px (max-w-7xl)
padding-x: 16px (mobile) → 24px (sm) → 32px (lg)
```

---

## 5. Components

### 5.1 Buttons

```
┌─────────────────────────────────────────────────────────┐
│  PRIMARY (Gold CTA)                                     │
│  bg: accent-gold → hover: accent-gold-hover             │
│  text: white, font-semibold                             │
│  padding: 12px 32px (py-3 px-8)                         │
│  border-radius: 9999px (rounded-full)                   │
│  hover: translateY(-2px), shadow                        │
│  active: translateY(0)                                  │
│                                                         │
│  Variants:                                              │
│  - Large:  py-4 px-8 text-lg (hero, section CTA)       │
│  - Medium: py-3 px-6 text-base (nav, cards)             │
│  - Small:  py-2 px-5 text-sm (inline actions)           │
│  - Full:   w-full (form submit, mobile CTA)             │
│                                                         │
│  ┌─────────────────────┐                                │
│  │  Записатися →        │  ← icon optional, right side  │
│  └─────────────────────┘                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  SECONDARY (Outline)                                    │
│  bg: transparent → hover: white/10                      │
│  border: 2px white/30 → hover: white/50                 │
│  text: white                                            │
│  Same sizing as primary                                 │
│                                                         │
│  ┌─────────────────────┐                                │
│  │  Дізнатися більше    │                               │
│  └─────────────────────┘                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TEXT LINK                                              │
│  color: primary, font-semibold, text-sm                 │
│  hover: gap increases (gap-2 → gap-3)                   │
│  Icon: chevron-right 16px                               │
│                                                         │
│  Записатися >                                           │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Cards

**Service Card:**
```
┌────────────────────────────────────────┐
│  bg: white                             │
│  border: 1px slate-100                 │
│  border-radius: 16px (rounded-2xl)     │
│  padding: 32px                         │
│  hover: translateY(-6px), shadow       │
│                                        │
│  ┌──────┐                              │
│  │ Icon │  56x56px, bg-surface         │
│  └──────┘  border-radius: 16px         │
│                                        │
│  Service Name       ← heading-lg       │
│  Description text   ← body-md, slate-6 │
│                                        │
│  Записатися >       ← text link        │
└────────────────────────────────────────┘
```

**Review Card:**
```
┌────────────────────────────────────────┐
│  bg: white                             │
│  border: 1px slate-100                 │
│  border-radius: 16px                   │
│  padding: 24-32px                      │
│  width: snap-scroll based              │
│  hover: translateY(-4px)               │
│                                        │
│  ★★★★★                ← amber-400     │
│                                        │
│  "Review text..."     ← body-sm/md     │
│                                        │
│  ┌──┐ Name            ← charcoal, sm   │
│  │OK│ 2 тижні тому    ← slate-500, xs  │
│  └──┘                  ← avatar: 40px  │
└────────────────────────────────────────┘
```

**Team Card:**
```
┌────────────────────────────────────────┐
│  ┌──────────────────────────────┐      │
│  │                              │      │
│  │         Photo                │      │
│  │         aspect-ratio: 4/5    │      │
│  │         object-cover         │      │
│  │         hover: scale(1.05)   │      │
│  │                              │      │
│  └──────────────────────────────┘      │
│  border-radius: 16px on image          │
│                                        │
│  Dr. Name              ← heading-lg    │
│  Specialty             ← primary, 500  │
│  Short bio (2-3 lines) ← body-sm      │
│  Записатися >          ← text link     │
└────────────────────────────────────────┘
```

### 5.3 Badges / Tags

```
┌──────────────────────────────────────────┐
│  Section Badge (above h2)                │
│  ┌───────────────────────────────┐       │
│  │ ● Наші послуги                │       │
│  └───────────────────────────────┘       │
│                                          │
│  bg: surface (#F0FDFA) or white          │
│  text: primary, overline weight          │
│  padding: 8px 16px (py-2 px-4)           │
│  border-radius: 9999px                   │
│  dot: 8px, primary, rounded-full         │
│  gap: 8px between dot and text           │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  Status Badge                            │
│  ┌──────────────┐  ┌──────────────┐      │
│  │ ● Відчинено  │  │ ● Зачинено   │      │
│  └──────────────┘  └──────────────┘      │
│  Open:  bg-green-50, text-green-600      │
│  Closed: bg-red-50, text-red-600         │
│  padding: 4px 8px, rounded-full          │
│  dot: 8px, matching color                │
└──────────────────────────────────────────┘
```

### 5.4 Form Inputs

```
┌──────────────────────────────────────────┐
│  Input / Select / Textarea               │
│                                          │
│  Label: body-sm, weight 500, charcoal    │
│  margin-bottom: 8px                      │
│                                          │
│  ┌────────────────────────────────┐      │
│  │ Placeholder text               │      │
│  └────────────────────────────────┘      │
│  bg: white                               │
│  border: 1px slate-200                   │
│  border-radius: 12px (rounded-xl)        │
│  padding: 12px 16px (py-3 px-4)          │
│  font-size: 16px (prevents iOS zoom)     │
│                                          │
│  Focus:                                  │
│  border: primary                         │
│  ring: 2px primary/20                    │
│                                          │
│  Error:                                  │
│  border: red-500                         │
│  ring: 2px red/20                        │
└──────────────────────────────────────────┘
```

### 5.5 Navigation

```
Header: fixed, bg-white/80, backdrop-blur-md
Height: 72px (mobile) / 80px (desktop)
Border-bottom: 1px slate-100
Shadow: shadow-md when scrolled > 50px

Desktop nav links:
  text: slate-600, hover: primary, font-medium
  transition: color 0.2s

Mobile menu:
  Slide from right, 85vw max 320px
  Overlay: bg-black/60
  Nav items: rounded-2xl, py-4 px-4
  Icon: 40px circle, bg-primary/10
```

### 5.6 FAQ Accordion

```
Container: bg-white, rounded-2xl, border slate-100
Trigger: px-6 py-5, flex between
  Question: font-semibold, charcoal
  Icon: chevron-down, primary, 20px
  Rotate: 180deg when open
Content: hidden → visible
  max-height: 0 → auto (use 500px as max)
  padding: px-6 pb-5
  text: slate-600
```

---

## 6. Iconography

### Style
- **Stroke icons** (Heroicons outline style)
- **Stroke width:** 1.5-2px
- **Size tokens:** 16px (sm), 20px (md), 24px (lg), 32px (xl)
- **Color:** Inherit from parent (currentColor)

### Service Icons — рекомендація замінити emoji на SVG

| Послуга | Зараз | Рекомендовано |
|---------|-------|---------------|
| Огляд і консультація | 🩺 | SVG stethoscope, `primary` |
| Профогляди | 📋 | SVG clipboard-check |
| УЗД-діагностика | 🔬 | SVG medical-imaging / ultrasound |
| Лабораторна діагностика | 🧪 | SVG flask / test-tube |
| Вакцинація | 💉 | SVG syringe |
| Дитячий масаж | 💆 | SVG child / hands |

Emoji рендеряться по-різному на різних пристроях. SVG дає контрольований, брендований вигляд.

---

## 7. Photography Guidelines

### Стиль
- **Теплий**, природне освітлення (не лабораторно-холодне)
- **Люди в кадрі** — лікарі з пацієнтами, усміхнені обличчя
- **Реальні фото** клініки, не стокові
- **Кольори одягу:** білі халати, teal акценти (якщо можливо)

### Обробка
- Warm white balance (+10-15K від нейтрального)
- Легке підвищення контрасту
- Без агресивних фільтрів
- Aspect ratios: 16:9 (hero), 4:3 (about), 4:5 (team portraits)

### Overlay
- Hero: gradient `from-charcoal/85 via-charcoal/60 to-charcoal/30`
- Cards: не використовувати overlay на фото команди

---

## 8. Animation & Motion

### Principles
1. **Subtle** — анімації підтримують, а не відволікають
2. **Purposeful** — кожна анімація має мету (привернути увагу, показати зв'язок)
3. **Fast** — max 0.5s для UI transitions, 0.8s для reveal
4. **Accessible** — `prefers-reduced-motion: reduce` вимикає все

### Timing Functions

| Token | Value | Use |
|-------|-------|-----|
| `ease-default` | `ease` | Hover states, toggles |
| `ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Mobile menu, slide-in |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Button press, bouncy |

### Duration Tokens

| Token | Value | Use |
|-------|-------|-----|
| `fast` | 200ms | Hover, focus, color change |
| `normal` | 300ms | Button, card hover, toggle |
| `slow` | 500ms | Reveal, fade-in |
| `slowest` | 800ms | Hero fade-up, page load |

### Animation Catalog

```css
/* Page load — staggered fade up */
.animate-fade-up { 
  animation: fadeUp 0.6s ease forwards; 
}

/* Scroll reveal */
.reveal { 
  opacity: 0; transform: translateY(20px);
  transition: 0.5s ease; 
}
.reveal.visible { 
  opacity: 1; transform: translateY(0); 
}

/* Card hover */
.card:hover { 
  transform: translateY(-6px); 
  box-shadow: 0 16px 32px rgba(13,148,136,0.12); 
}

/* Button hover */
.btn:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 10px 25px rgba(212,168,83,0.4); 
}

/* Ken Burns (hero slides) */
@keyframes kenburns { 
  0% { transform: scale(1); } 
  100% { transform: scale(1.08); } 
}
```

---

## 9. Responsive Breakpoints

```
Mobile first approach

sm:  640px   — small tablets, landscape phones
md:  768px   — tablets
lg:  1024px  — laptops, desktop nav appears
xl:  1280px  — large screens
2xl: 1536px  — extra large

Key layout shifts:
- < 640px: single column, floating CTA, mobile menu
- 640-767px: 2-column forms, stacked cards
- 768-1023px: 2-column grids (services, team)
- 1024+: full desktop nav, 3-column grids, sidebar layouts
```

### Mobile-specific rules
- Touch targets: minimum 44x44px
- Input font-size: always 16px+ (prevent iOS zoom)
- Floating CTA: visible below hero, hidden near form
- Back-to-top: bottom-24 (above floating CTA)
- Telegram button: bottom-24 left (above floating CTA)
- Safe area padding for notched phones

---

## 10. Accessibility (a11y)

### Standards
- WCAG 2.1 AA compliance target
- Semantic HTML (`<main>`, `<nav>`, `<section>`, `<header>`, `<footer>`)
- Skip-to-content link
- `aria-label` on icon-only buttons
- `alt` on all images (descriptive, not decorative)
- `role` where semantic HTML is insufficient

### Focus States
```css
:focus-visible {
  outline: 2px solid #0D9488;
  outline-offset: 2px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 11. Layout Patterns

### Section Template
```
┌─────────────────────────────────────────────────┐
│                                                 │
│  padding-y: 64px (mobile) / 96px / 128px        │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 │   │
│  │                                          │   │
│  │  ┌────────────────────────────────────┐  │   │
│  │  │  Section Header (centered)         │  │   │
│  │  │  max-w-3xl mx-auto text-center     │  │   │
│  │  │                                    │  │   │
│  │  │  [Badge]                           │  │   │
│  │  │  H2 Title                          │  │   │
│  │  │  Subtitle paragraph                │  │   │
│  │  └────────────────────────────────────┘  │   │
│  │                                          │   │
│  │  mb-16 (between header and content)      │   │
│  │                                          │   │
│  │  ┌───┐ ┌───┐ ┌───┐                      │   │
│  │  │   │ │   │ │   │  Content grid         │   │
│  │  └───┘ └───┘ └───┘                      │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Background Alternation
```
Section 1 (Hero):    gradient overlay on image
Section 2 (About):   warm-white (#FAFAF9)
Section 3 (Adv.):    primary (#0D9488) — full bleed
Section 4 (Services): surface (#F0FDFA)
Section 5 (Team):    warm-white (#FAFAF9)
Section 6 (Reviews): surface (#F0FDFA)
Section 7 (FAQ):     warm-white (#FAFAF9)
Section 8 (Contacts): surface (#F0FDFA)
Section 9 (Form):    warm-white (#FAFAF9)
Footer:              charcoal (#1E293B)
```

---

## 12. Z-index Scale

| Token | Value | Element |
|-------|-------|---------|
| `z-base` | 0 | Default content |
| `z-hero-overlay` | 10-20-30 | Hero gradient, pattern, content |
| `z-floating` | 40 | Floating CTA, back-to-top, Telegram |
| `z-header` | 50 | Fixed header |
| `z-overlay` | 60 | Mobile menu overlay |
| `z-menu` | 70 | Mobile menu panel |
| `z-toast` | 9999 | Toast notifications |

---

## 13. Shadow Scale

```css
--shadow-sm:   0 1px 3px rgba(0,0,0,0.08);       /* cards at rest */
--shadow-md:   0 4px 12px rgba(0,0,0,0.1);        /* header on scroll */
--shadow-lg:   0 10px 25px rgba(13,148,136,0.12);  /* card hover */
--shadow-xl:   0 16px 32px rgba(13,148,136,0.15);  /* elevated cards */
--shadow-gold: 0 10px 25px rgba(212,168,83,0.4);   /* gold button */
--shadow-2xl:  0 20px 60px rgba(0,0,0,0.15);       /* modals, mobile menu */
```

---

## 14. Border Radius Scale

| Token | Value | Use |
|-------|-------|-----|
| `rounded-md` | 8px | Small elements |
| `rounded-lg` | 12px | Inputs, small cards |
| `rounded-xl` | 16px | Cards, sections, images |
| `rounded-2xl` | 24px | Large cards, FAQ items |
| `rounded-full` | 9999px | Buttons, badges, avatars |

---

## 15. Implementation Checklist

### Before Launch
- [ ] Replace all Unsplash stock photos with real clinic photos
- [ ] Replace placeholder team data with real doctors
- [ ] Replace placeholder reviews with real patient reviews
- [ ] Set up form submission backend (Telegram Bot / email)
- [ ] Replace Telegram bot placeholder URL
- [ ] Add real social media links or remove icons
- [ ] Use corporate email instead of Gmail
- [ ] Add FAQPage schema.org markup
- [ ] Switch from Tailwind CDN to production build
- [ ] Add WebP images with JPEG fallback
- [ ] Dynamic copyright year
- [ ] Register Google Business profile
- [ ] Add declaration signing CTA section
- [ ] Add prices / tariffs section
