---
trigger: always_on
---

# Agent Guidelines & Engineering Rules for ILoveMyOfficeWorks

When contributing or refactoring code in this repository, follow these rules strictly:

## 1. 100% Client-Side Privacy Constraint
- **No external network requests for processing**: Do NOT send user document bytes, canvas pixels, or text streams to external servers or cloud APIs.
- All file inspections and modifications must execute on the user's browser using `pdf-lib`, `pdfjs-dist`, `docx`, and standard Web APIs (`Canvas`, `Blob`, `FileReader`, `URL.createObjectURL`).
- The backend (`server/server.js`) must strictly remain an optional localhost-only helper (`http://localhost:3001`) with graceful fallback to pure browser execution if the server is offline.

## 2. Pluggable Adapter Pattern
- Any new document transformation or PDF tool **MUST** be implemented as an adapter under `client/src/registry/adapters/<tool-id>.js`.
- It must implement the standard contract:
  - `id`: unique string identifier
  - `name`: user-facing tool title
  - `description`: concise explanation
  - `accepts(files)`: returns `{ valid: boolean, reason?: string }`
  - `options`: configurable options array (`select`, `text`, `number`, etc.)
  - `execute(files, options, onProgress)`: returns `{ success: boolean, files: [{ name, blob, type, previewUrl? }] }`
- Register all new adapters in `client/src/registry/registry.js`.

## 3. UI & Design System Consistency
- **Luxury Sage Aesthetic**: Use the unified palette tokens:
  - Deep Sage Primary: `#5B7147`
  - Forest Dark: `#435433`
  - Deep Text: `#262D20` / `#1E2619`
  - Cream Background: `#FAF8F4`
  - Border Accents: `#E8E1D5` / `#DDD3C2`
- **Zero Line-Wrap Rule**: All navigation items, tool tabs, and action badges must include `whitespace-nowrap` to prevent awkward multi-line breaking.
- **Typography**: Inter / Plus Jakarta Sans for UI text, JetBrains Mono for metrics and file tags.
- **Motion**: Use `framer-motion` for transitions with smooth micro-animations.

## 4. Verification & Build Integrity
- Always run `npm run build --prefix client` after making frontend changes to ensure 100% clean production compilation.
