# ILoveMyOfficeWorks — Personal PDF Toolkit 📄✨

A personal, private, client-first PDF toolkit web application built with **React (Vite)**, **Tailwind CSS**, **Framer Motion**, and **Three.js**, with a lightweight local **Node.js backend**, designed with a tranquil, elegant warm cream and sage green (`#8B9A6E`) palette.

> **100% Local & Private**: All document operations run directly in your browser using WebAssembly and memory buffers. No files are uploaded to external servers or cloud services.

---

## 🚀 Features Implemented

### 1. Multi-PDF Merger (`merge-pdf.js`)
- **No Limit on File Count**: Merge 2, 5, 20, or 100+ PDF documents simultaneously.
- **Drag & Reorder Sequence**: Move files up or down to configure the exact merge order before generation.
- **Real-Time Progress Tracking**: Step-by-step progress percentage as pages are assembled.
- **Customizable Output Name**: Specify your preferred merged file name.
- **One-Click Download**: Instant download with celebratory confetti.

### 2. PDF Splitter (`split-pdf.js`)
- **Custom Page Ranges**: Split by exact ranges (e.g., `1-3, 4-6, 7`).
- **Fixed Page Chunks**: Automatically slice large documents into chunks of *N* pages (e.g., every 1 page or every 5 pages).
- **Dual Export Modes**:
  - Download all split segments bundled into a single `.zip` archive via `JSZip`.
  - Download individual split parts directly from the results card.

### 3. Navigation & Home Dashboard
- **Animated Splash Screen**: Boot sequence on startup with memory initialization progress, security check, and smooth fade-out.
- **Dedicated Navigation Bar**: Separate desktop and mobile tab navigation with active pill transitions:
  - **Home**: Overview command center with quick launch cards and batch upload zone.
  - **Merge PDFs**: Dedicated sequential merging workspace with up/down ordering.
  - **Split PDF**: Dedicated range and fixed-chunk splitting workspace with individual & ZIP downloads.
- **Home Command Center**: Interactive tool catalog showing active tools (`Phase 1` and `Phase 2`) alongside previews of upcoming modules (`Phase 3` & `Phase 5`).

### 4. File Security & Validation Pipeline
- **Magic Bytes Verification**: Inspects leading file header bytes (`%PDF-`) to reject fake or corrupt files.
- **200MB Size Limit**: Guards against memory overflow with friendly warnings.
- **Encryption & Password Detection**: Detects password-locked files and shows security badges.
- **Page Counting & Metadata**: Displays file size and total page counts automatically.

### 5. Modern Glassmorphic Dark UI & 3D Visuals
- **Interactive Three.js 3D Background**: Floating crystalline polyhedron wireframe and particle constellation that gently drifts and responds to mouse parallax.
- **Framer Motion**: Smooth enter/exit transitions, layout animations for reordering cards, and dynamic progress bar.
- **Fully Responsive**: Optimized for mobile phones, tablets, laptops, and ultra-wide displays.

---

## 🏛️ Architecture: Adapter Registry Pattern

Tools are modularized using the **Adapter Registry Pattern**. The UI does not contain tool-specific logic; instead, it reads from `client/src/registry/registry.js`.

### Adapter Specification
Each operation is a self-contained module in `src/registry/adapters/`:
```javascript
export default {
  id: 'tool-id',
  name: 'Tool Name',
  description: 'What this tool does...',
  badge: 'Phase Tag',
  accepts: (files) => ({ valid: Boolean, reason?: String }),
  options: [
    { id: 'optName', label: 'Option Label', type: 'text' | 'select' | 'number', default: '...' }
  ],
  execute: async (files, options, onProgress) => {
    // pdf-lib execution logic
    return { downloadUrl, filename, ... };
  }
};
```

---

## 📂 Project Structure

```text
ILoveMyOfficeWorks/
├── README.md                    # Project documentation & roadmap
├── package.json                 # Monorepo root script runner (concurrently)
├── client/                      # React (Vite) Frontend
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── ThreeCanvas.jsx  # Interactive Three.js 3D background
│   │   │   ├── Uploader.jsx     # Drag-and-drop zone (react-dropzone)
│   │   │   ├── FileCard.jsx     # Document card with page count & reorder
│   │   │   └── OperationBar.jsx # Dynamic adapter executor & options panel
│   │   ├── registry/
│   │   │   ├── registry.js      # Central tool registry
│   │   │   └── adapters/
│   │   │       ├── merge-pdf.js # Unlimited PDF merger
│   │   │       └── split-pdf.js # Range & chunk PDF splitter
│   │   └── utils/
│   │       └── pdf-magic.js     # Magic byte validator & page counter
└── server/                      # Lightweight Node.js Backend (Phase 5)
    ├── package.json
    └── server.js
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Start Development Server
```bash
# Starts both frontend (port 5173) and backend (port 3001)
npm run dev

# Or run frontend only:
npm run dev:client
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗺️ Roadmap & Phases

- [x] **Phase 1: Foundation + First Tool**
  - [x] Drag & drop uploader with magic byte validation
  - [x] FileCard with page count, file size, and encryption detection
  - [x] Adapter Registry architecture
  - [x] Unlimited PDF Merger (`merge-pdf.js`)
  - [x] Modern 3D Canvas (Three.js) & animations (Framer Motion)
- [ ] **Phase 2: Page Operations**
  - [x] Split PDF by range & every N pages (`split-pdf.js`)
  - [ ] Remove pages
  - [ ] Extract pages
  - [ ] Rotate pages
  - [ ] Reorder pages with thumbnail preview
- [ ] **Phase 3: Annotations & Marks**
  - [ ] Add watermark (text/image)
  - [ ] Page numbering & header/footer
  - [ ] Insert blank page
- [ ] **Phase 4: Preview & Multi-file Queue**
  - [ ] Page thumbnails & PDF canvas preview
  - [ ] Multi-file batch processing
- [ ] **Phase 5: Local Node Backend**
  - [ ] Ghostscript compression
  - [ ] PDF to JPG / JPG to PDF
  - [ ] Password protect / unlock (qpdf)
