# 03 — Adapter Registry Specification

All PDF and document features in **ILoveMyOfficeWorks** are organized as pluggable adapters. This architectural pattern completely decouples the user interface from the underlying document processing code.

---

## 1. The Adapter Contract

Every adapter is an object conforming to the following JavaScript interface:

```typescript
interface ToolOption {
  id: string;                                   // Unique identifier for option
  label: string;                                // UI label displayed above input
  type: 'select' | 'text' | 'number' | 'range'; // Rendered control type
  default: any;                                 // Default value
  options?: Array<{ value: string; label: string }>; // For 'select' inputs
  hint?: string | ((currentOptions: any) => string); // Helper text shown beneath input
  min?: number;                                 // For 'number' or 'range'
  max?: number;
  step?: number;
}

interface AdapterAcceptance {
  valid: boolean;                               // Whether adapter can execute
  reason?: string;                              // Explanation if invalid
}

interface ToolAdapter {
  id: string;                                   // Slug identifier (e.g., 'merge-pdf')
  name: string;                                 // Friendly display title
  description: string;                          // 1-2 sentence description
  badge?: string;                               // Optional badge (e.g., 'Active', 'Beta')

  // Validation function evaluated against currently selected files
  accepts: (files: Array<InspectedFile>) => AdapterAcceptance;

  // Configuration options rendered dynamically in OperationBar
  options: Array<ToolOption>;

  // Execution function
  execute: (
    files: Array<InspectedFile>,
    options: Record<string, any>,
    onProgress: (percent: number, message: string) => void
  ) => Promise<{
    success: boolean;
    files: Array<{
      name: string;
      blob: Blob;
      type: string;
      previewUrl?: string;
    }>;
    message?: string;
  }>;
}
```

---

## 2. Dynamic Option Rendering (`OperationBar.jsx`)

When a user selects an active tool in the UI, [`OperationBar.jsx`](file:///d:/ILoveMyOfficeWorks/client/src/components/OperationBar.jsx) reads `adapter.options` and automatically builds:
- **`select`**: Styled dropdown with option labels and change handlers.
- **`text`**: Text input with placeholders.
- **`number`**: Numeric input with bounds validation (`min`, `max`).
- **`range`**: Interactive slider displaying current numeric values.
- Dynamic hint text: If `hint` is a function, it is re-evaluated dynamically as option values change.

---

## 3. Progress Emission & Lifecycle

During execution:
1. `onProgress(percent: number, message: string)` is called periodically by the engine.
2. The UI renders an animated progress bar with the current percentage and stage description (e.g., `Downsampling embedded images: page 3 of 10...`).
3. If an error occurs, the adapter throws an `Error`, which `OperationBar` catches, halts the progress spinner, and displays a user-friendly error alert.

---

## 4. Step-by-Step Guide: Adding a New Adapter

Let's walk through creating a **PDF Rotator** adapter:

### Step 1: Create the Adapter File
Create `client/src/registry/adapters/rotate-pdf.js`:

```javascript
import { PDFDocument, degrees } from 'pdf-lib';

const rotatePdfAdapter = {
  id: 'rotate-pdf',
  name: 'Rotate PDF',
  description: 'Rotate all or specific pages of your PDF document by 90, 180, or 270 degrees.',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file.' };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'rotation',
      label: 'Rotation Angle',
      type: 'select',
      default: '90',
      options: [
        { value: '90', label: '90° Clockwise' },
        { value: '180', label: '180° Flip' },
        { value: '270', label: '270° Counter-Clockwise' },
      ],
    },
  ],

  execute: async (files, options, onProgress) => {
    onProgress(10, 'Loading PDF document...');
    const targetFile = files[0];
    const arrayBuffer = await targetFile.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const rot = parseInt(options.rotation || '90', 10);
    const pages = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      onProgress(20 + Math.round((i / pages.length) * 60), `Rotating page ${i + 1} of ${pages.length}...`);
      const currentRotation = pages[i].getRotation().angle;
      pages[i].setRotation(degrees(currentRotation + rot));
    }

    onProgress(90, 'Serializing rotated PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    onProgress(100, 'Complete!');
    return {
      success: true,
      files: [{
        name: `rotated_${targetFile.name}`,
        blob,
        type: 'application/pdf',
      }],
    };
  },
};

export default rotatePdfAdapter;
```

### Step 2: Register in `registry.js`
In `client/src/registry/registry.js`:
```javascript
import rotatePdfAdapter from './adapters/rotate-pdf';

export const ADAPTER_REGISTRY = [
  mergePdfAdapter,
  splitPdfAdapter,
  compressPdfAdapter,
  pdfToDocxAdapter,
  rotatePdfAdapter, // Add here!
];
```

### Step 3: Add to Navigation & App Tabs (Optional)
If you wish to give the tool a top-level tab, add its definition in `Navbar.jsx` and handle its screen in `App.jsx`.
