# ILoveMyOfficeWorks — Project Knowledge Base

Welcome to the **ILoveMyOfficeWorks** knowledge base. This documentation is written for software engineers, future AI agents, and contributors who want to understand every facet of this project.

---

## 📚 Table of Contents

1. [**01. Architecture & Philosophy**](./01-architecture-and-philosophy.md)
   - 100% Client-Side Privacy Guarantee
   - High-Level System Architecture & Component Tree
   - Technology Stack & Library Ecosystem
   - Localhost Server Role (Optional Ghostscript)

2. [**02. Tools & Processing Engines**](./02-tools-and-engines.md)
   - PDF Merger (`merge-pdf.js` & `pdf-lib`)
   - PDF Splitter (`split-pdf.js`)
   - PDF Compressor (`pdf-compressor-engine.js`: 4 compression tiers, canvas downsampling, object stream rewriting)
   - PDF to Word DOCX Converter (`pdf-to-docx-engine.js`: text extraction, OpenXML hierarchy, font metrics)
   - Document Inspection & Encryption Handling (`pdf-magic.js`)

3. [**03. Adapter Registry Specification**](./03-adapter-specification.md)
   - The Pluggable Adapter Pattern
   - Adapter API Contract (`id`, `accepts`, `options`, `execute`)
   - Progress Emission & Execution Lifecycle
   - Step-by-Step Guide: Adding a New Tool

4. [**04. UI & Design System**](./04-ui-and-design-system.md)
   - Luxury Sage Color Tokens (`#5B7147` / `#435433` / `#FAF8F4`)
   - Google Fonts Typography (Plus Jakarta Sans & JetBrains Mono)
   - Glassmorphic Floating Navigation (Zero Line-Wrap Guarantee)
   - Ambient 3D Three.js Background
   - Micro-Interactions & Framer Motion Guidelines

---

## ⚡ Quick Orientation for AI Agents

- **Where is the entry point?** [`client/src/App.jsx`](file:///d:/ILoveMyOfficeWorks/client/src/App.jsx)
- **Where are all tools registered?** [`client/src/registry/registry.js`](file:///d:/ILoveMyOfficeWorks/client/src/registry/registry.js)
- **Where are the core PDF algorithms?** [`client/src/utils/`](file:///d:/ILoveMyOfficeWorks/client/src/utils/)
- **How to verify compilation?** Run `npm run build --prefix client`
