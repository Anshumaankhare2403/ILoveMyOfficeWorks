# AGENTS.md — Agent Developer Guide for ILoveMyOfficeWorks

Welcome, AI Agent! This file is your entry point to understanding, modifying, and extending the **ILoveMyOfficeWorks** codebase.

---

## 🎯 Project Mission & Core Philosophy

**ILoveMyOfficeWorks** is a **100% private, client-side PDF productivity toolkit** built with React, Vite, Tailwind CSS, `pdf-lib`, `pdfjs-dist`, and `docx`.

### 🛡️ Non-Negotiable Core Principle: Zero Cloud Data Transmission
1. **Never upload user PDFs to third-party or remote cloud APIs.**
2. All PDF manipulation (merging, splitting, compressing, DOCX conversion) runs **directly in the user's browser** using WebAssembly, HTML5 Canvas, and modern JavaScript engines.
3. The optional local Node backend (`server/server.js`) only provides optional localhost Ghostscript optimization if locally installed on the user's machine. The client runs fully standalone even without the server.

---

## 🧭 Repository Structure

```
ILoveMyOfficeWorks/
├── AGENTS.md                          # Primary agent guide (You are here)
├── README.md                          # Human user documentation
├── .agents/                           # Antigravity agent skills & rules
│   ├── rules/
│   │   └── project_guidelines.md      # Strict guidelines for AI agents
│   └── skills/
│       └── ilovemyofficeworks-toolkit/
│           └── SKILL.md               # Reusable Antigravity agent skill
├── docs/
│   └── project-knowledge/             # Comprehensive technical documentation
│       ├── README.md                  # Knowledge index
│       ├── 01-architecture-and-philosophy.md
│       ├── 02-tools-and-engines.md
│       ├── 03-adapter-specification.md
│       └── 04-ui-and-design-system.md
├── client/                            # React + Vite Frontend (Primary application)
│   ├── src/
│   │   ├── components/                # UI components (Navbar, HomeScreen, Uploader, etc.)
│   │   ├── registry/                  # Pluggable Tool Adapter Registry
│   │   │   ├── registry.js            # Central adapter loader & dispatcher
│   │   │   └── adapters/              # Individual tool adapters (merge, split, compress, docx)
│   │   ├── utils/                     # Core PDF & document processing engines
│   │   │   ├── pdf-compressor-engine.js  # Canvas downsampling + Object stream compression
│   │   │   ├── pdf-to-docx-engine.js    # PDF.js + docx OpenXML text & layout converter
│   │   │   └── pdf-magic.js             # Encryption check & metadata inspection
│   │   ├── App.jsx                    # Root app state & tool routing
│   │   └── index.css                  # Tailored tokens, typography, glassmorphism
│   └── package.json
└── server/                            # Optional Localhost Helper (Port 3001)
    └── server.js                      # Localhost Ghostscript bridge (optional)
```

---

## 🚀 Key Commands

- **Start Dev Environment (Client + Server):**
  ```bash
  npm run dev
  ```
- **Build Client for Production:**
  ```bash
  npm run build --prefix client
  ```
  *(Always run this command after making changes to verify 0 syntax or bundling errors).*

---

## 🧠 For In-Depth Agent Training

To learn the deep technical mechanics, consult the knowledge base:
- [01-architecture-and-philosophy.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/01-architecture-and-philosophy.md)
- [02-tools-and-engines.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/02-tools-and-engines.md)
- [03-adapter-specification.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/03-adapter-specification.md)
- [04-ui-and-design-system.md](file:///d:/ILoveMyOfficeWorks/docs/project-knowledge/04-ui-and-design-system.md)
