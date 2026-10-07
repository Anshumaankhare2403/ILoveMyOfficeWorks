# 04 — UI & Design System

The visual design of **ILoveMyOfficeWorks** follows a **Luxury Sage & Modern Editorial** aesthetic, inspired by high-end modern SaaS tools like Linear, Raycast, and Apple product landing pages.

---

## 1. Color Palette Tokens

The interface avoids generic colors in favor of tailored, harmonious natural tones:

| Token Name | Hex Value | Role | Usage |
| :--- | :--- | :--- | :--- |
| **Sage Primary** | `#5B7147` | Primary Accent | Main action buttons, active tab gradients, progress bars |
| **Forest Deep** | `#435433` | Dark Gradient Stop | End-stop for primary gradients, deep hover accents |
| **Deep Forest Text** | `#262D20` / `#1E2619` | High-Contrast Typography | Main headings, bold titles, primary labels |
| **Muted Sage Text** | `#6B785E` / `#586548` | Secondary Typography | Descriptions, subheadings, helper text |
| **Canvas Cream** | `#FAF8F4` | App Background | Clean, warm, paper-inspired base background |
| **Warm Sand Light** | `#EDE7DC` | Surface / Card | Island containers, navbar surfaces, card fills |
| **Border Soft** | `#E8E1D5` / `#DDD3C2` | Neutral Borders | Subtly defining cards, pills, and dividers |
| **Badge Accent** | `#5B7147`/10 | Chip Background | Tool capability chips, file counts, format tags |

---

## 2. Typography

The application uses two distinct typefaces imported via Google Fonts in [`client/index.html`](file:///d:/ILoveMyOfficeWorks/client/index.html):

1. **Plus Jakarta Sans**:
   - Primary sans-serif font for all headings, body text, buttons, and navigation.
   - Clean, geometric, editorial proportions with high legibility at all scales.
2. **JetBrains Mono**:
   - Monospace font used for file sizes (`3.4 MB`), page numbers (`#1`), version chips (`v1.2`), and format extensions (`.PDF`, `.DOCX`).

---

## 3. The Zero Line-Wrap Rule (`whitespace-nowrap`)

### Why It Matters:
In earlier iterations, tool navigation tabs (like `Merge PDFs` and `PDF to Word`) wrapped into two lines (e.g. `Merge\nPDFs`), creating an awkward, unpolished layout.

### Standard Rule:
- All navigation buttons, tab titles, action badges, and filter pills **MUST** include `whitespace-nowrap`.
- Containers must allow horizontal scrolling or flexible shrinking rather than breaking words across lines:
  ```jsx
  {/* Correct navbar container pattern */}
  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
    <button className="whitespace-nowrap px-4 py-2 text-sm font-semibold">
      PDF to Word
    </button>
  </div>
  ```

---

## 4. Glassmorphism & Floating Navigation

The top navigation bar is implemented as a floating island rather than an edge-to-edge box:
- **Surface**: `bg-[#EDE7DC]/80 backdrop-blur-md`
- **Border**: `border border-[#DDD3C2]`
- **Active Tab Pill**: Uses Framer Motion's `layoutId="activeNavIndicator"` to glide smoothly between tabs with spring physics:
  ```jsx
  <motion.div
    layoutId="activeNavIndicator"
    className="absolute inset-0 bg-gradient-to-r from-[#5B7147] to-[#435433] rounded-xl shadow-md shadow-[#5B7147]/20"
    transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
  />
  ```

---

## 5. Ambient 3D Canvas (`ThreeCanvas.jsx`)

Underneath the UI sits an interactive 3D particle canvas built with **Three.js**:
- Renders an ambient wireframe geometric sphere and floating particle field.
- Slowly rotates on the Y axis with damping.
- Subtly tracks mouse movement to create depth without distracting the user from document tasks.
- Positioned with `pointer-events-none fixed inset-0 z-0 opacity-40`.

---

## 6. Micro-Interactions & Framer Motion Guidelines

- **Buttons & Cards**:
  - `whileHover={{ scale: 1.01 }}`
  - `whileTap={{ scale: 0.985 }}`
  - Transition duration: `0.15s` to `0.25s` for crisp responsiveness.
- **Document Queue**:
  - `AnimatePresence` with `layout` transitions so when items are reordered or removed, neighbor cards glide smoothly into place.
- **Dropzone States**:
  - Subtle pulsing glow and border highlight when a file is dragged over the browser window.
