import {
  Layers,
  Scissors,
  Minimize2,
  FileText,
  Image,
  Table,
  Presentation,
  Globe,
  Archive,
  RotateCw,
  Hash,
  Stamp,
  Crop,
  PenTool,
  FileSpreadsheet,
  Unlock,
  Shield,
  CheckSquare,
  EyeOff,
  GitCompare,
  FileDown,
  ArrowUpDown,
  Camera,
  Wrench,
  FileSearch,
  Maximize2,
  Images,
  Trash2,
} from 'lucide-react';

/**
 * Single source of truth for total tool count across the entire application
 */
export const TOTAL_TOOL_COUNT = 35;

/**
 * Standard file acceptance presets for drop zones and validations
 */
export const ACCEPTED_TYPE_PRESETS = {
  pdf: {
    acceptedExtensions: ['.pdf'],
    acceptedTypes: { 'application/pdf': ['.pdf'] },
    acceptedLabel: 'PDF',
  },
  image: {
    acceptedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'],
    acceptedTypes: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'] },
    acceptedLabel: 'JPG • PNG • WebP',
  },
  word: {
    acceptedExtensions: ['.docx'],
    acceptedTypes: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    acceptedLabel: 'DOCX',
  },
  powerpoint: {
    acceptedExtensions: ['.pptx'],
    acceptedTypes: {
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
    acceptedLabel: 'PPTX',
  },
  excel: {
    acceptedExtensions: ['.xlsx', '.xls', '.csv'],
    acceptedTypes: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    acceptedLabel: 'XLSX • CSV',
  },
  html: {
    acceptedExtensions: ['.html', '.htm', '.txt'],
    acceptedTypes: {
      'text/html': ['.html', '.htm'],
      'text/plain': ['.txt'],
    },
    acceptedLabel: 'HTML • TXT',
  },
  all: {
    acceptedExtensions: [
      '.pdf',
      '.jpg',
      '.jpeg',
      '.png',
      '.webp',
      '.docx',
      '.pptx',
      '.xlsx',
      '.csv',
      '.html',
      '.txt',
    ],
    acceptedTypes: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/html': ['.html', '.htm'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
    },
    acceptedLabel: 'PDF • JPG • PNG • DOCX',
  },
};

export const TOOL_CONFIGS = {
  // 1. Organize PDF
  merge: { id: 'merge-pdf', name: 'Merge PDF', icon: Layers, badge: 'Organize', desc: 'Combine multiple PDF documents sequentially with custom page ordering', hint: 'Upload 2 or more PDF documents to merge them into a single file.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'merge-pdf': { id: 'merge-pdf', name: 'Merge PDF', icon: Layers, badge: 'Organize', desc: 'Combine multiple PDF documents sequentially with custom page ordering', hint: 'Upload 2 or more PDF documents to merge them into a single file.', ...ACCEPTED_TYPE_PRESETS.pdf },
  split: { id: 'split-pdf', name: 'Split PDF', icon: Scissors, badge: 'Organize', desc: 'Break PDFs into separate files by page range or every N pages', hint: 'Upload a PDF document to split it into multiple parts.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'split-pdf': { id: 'split-pdf', name: 'Split PDF', icon: Scissors, badge: 'Organize', desc: 'Break PDFs into separate files by page range or every N pages', hint: 'Upload a PDF document to split it into multiple parts.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'remove-pages': { id: 'remove-pages', name: 'Remove Pages', icon: Trash2, badge: 'Organize', desc: 'Delete unwanted or blank pages from your PDF document and download a clean file', hint: 'Upload a PDF document to remove specific pages or ranges.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'extract-pages': { id: 'extract-pages', name: 'Extract Pages', icon: FileDown, badge: 'Organize', desc: 'Select specific pages or ranges from a PDF and extract them into a brand-new PDF', hint: 'Upload a PDF document to extract selected pages.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'organize-pdf': { id: 'organize-pdf', name: 'Organize PDF', icon: ArrowUpDown, badge: 'Organize', desc: 'Reorder, reverse, rearrange, or duplicate pages in your PDF document into a custom sequence', hint: 'Upload a PDF document to rearrange or reverse page ordering.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'scan-to-pdf': { id: 'scan-to-pdf', name: 'Scan to PDF', icon: Camera, badge: 'Organize', desc: 'Convert captured camera photos and document scans into high-contrast clean PDF files', hint: 'Upload photo scans or photos to convert into enhanced document PDFs.', ...ACCEPTED_TYPE_PRESETS.image },

  // 2. Optimize PDF
  compress: { id: 'compress-pdf', name: 'Compress PDF', icon: Minimize2, badge: 'Optimize', desc: 'Shrink PDF file size with stream compression, metadata stripping, and quality presets', hint: 'Upload a PDF document to compress and optimize its file size.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'compress-pdf': { id: 'compress-pdf', name: 'Compress PDF', icon: Minimize2, badge: 'Optimize', desc: 'Shrink PDF file size with stream compression, metadata stripping, and quality presets', hint: 'Upload a PDF document to compress and optimize its file size.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'repair-pdf': { id: 'repair-pdf', name: 'Repair PDF', icon: Wrench, badge: 'Optimize', desc: 'Analyze corrupted, unreadable, or malformed PDF structures and rebuild intact object streams', hint: 'Upload a damaged or unreadable PDF document to attempt structure recovery.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'ocr-pdf': { id: 'ocr-pdf', name: 'OCR PDF', icon: FileSearch, badge: 'Optimize', desc: 'Convert scanned PDF documents into searchable files with selectable text and OCR transcript export', hint: 'Upload a scanned PDF document to recognize text and generate searchable overlay.', ...ACCEPTED_TYPE_PRESETS.pdf },

  // 3. Convert to PDF
  'jpg-to-pdf': { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: Image, badge: 'Convert to PDF', desc: 'Convert JPG, PNG, and WebP images into a single PDF document with custom margins', hint: 'Upload 1 or more images (JPG, PNG, WebP) to combine into a PDF.', ...ACCEPTED_TYPE_PRESETS.image },
  'word-to-pdf': { id: 'word-to-pdf', name: 'WORD to PDF', icon: FileText, badge: 'Convert to PDF', desc: 'Convert Microsoft Word documents (.docx) into clean vector PDF files', hint: 'Upload a Microsoft Word (.docx) file to convert to PDF.', ...ACCEPTED_TYPE_PRESETS.word },
  'powerpoint-to-pdf': { id: 'powerpoint-to-pdf', name: 'POWERPOINT to PDF', icon: Presentation, badge: 'Convert to PDF', desc: 'Convert PowerPoint (.pptx) presentations into landscape PDF slides', hint: 'Upload a PowerPoint (.pptx) presentation to convert to PDF.', ...ACCEPTED_TYPE_PRESETS.powerpoint },
  'excel-to-pdf': { id: 'excel-to-pdf', name: 'EXCEL to PDF', icon: Table, badge: 'Convert to PDF', desc: 'Convert Excel spreadsheets and CSV tables into vector PDF documents', hint: 'Upload a spreadsheet or CSV table to convert to PDF.', ...ACCEPTED_TYPE_PRESETS.excel },
  'html-to-pdf': { id: 'html-to-pdf', name: 'HTML to PDF', icon: Globe, badge: 'Convert to PDF', desc: 'Convert HTML files, webpages, and code into clean PDF documents', hint: 'Upload an HTML or text file to convert to PDF.', ...ACCEPTED_TYPE_PRESETS.html },

  // 4. Convert from PDF
  'pdf-to-jpg': { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: Image, badge: 'Convert from PDF', desc: 'Convert PDF pages into high-resolution JPG or PNG images and ZIP archive', hint: 'Upload a PDF document to extract pages as images.', ...ACCEPTED_TYPE_PRESETS.pdf },
  docx: { id: 'pdf-to-docx', name: 'PDF to WORD', icon: FileText, badge: 'Convert from PDF', desc: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with typography', hint: 'Upload a PDF document to convert into an editable Word (.docx) file.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'pdf-to-docx': { id: 'pdf-to-docx', name: 'PDF to WORD', icon: FileText, badge: 'Convert from PDF', desc: 'Convert PDF documents into fully editable Microsoft Word (.docx) files with typography', hint: 'Upload a PDF document to convert into an editable Word (.docx) file.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'pdf-to-powerpoint': { id: 'pdf-to-powerpoint', name: 'PDF to POWERPOINT', icon: Presentation, badge: 'Convert from PDF', desc: 'Convert PDF document pages into PowerPoint presentation slides (.pptx)', hint: 'Upload a PDF document to convert to PowerPoint (.pptx).', ...ACCEPTED_TYPE_PRESETS.pdf },
  'pdf-to-excel': { id: 'pdf-to-excel', name: 'PDF to EXCEL', icon: Table, badge: 'Convert from PDF', desc: 'Extract tables, rows, invoices, and structured data into Excel CSV format', hint: 'Upload a PDF document with tables to extract to Excel.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'pdf-to-pdfa': { id: 'pdf-to-pdfa', name: 'PDF to PDF/A', icon: Archive, badge: 'Convert from PDF', desc: 'Convert PDF documents into ISO-compliant archival PDF/A standard', hint: 'Upload a PDF document to convert to PDF/A archival format.', ...ACCEPTED_TYPE_PRESETS.pdf },

  // 5. Edit PDF
  'rotate-pdf': { id: 'rotate-pdf', name: 'Rotate PDF', icon: RotateCw, badge: 'Edit', desc: 'Rotate all or specific pages of your PDF document clockwise by 90, 180, or 270 degrees', hint: 'Upload a PDF document to rotate pages.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'add-page-numbers': { id: 'add-page-numbers', name: 'Add Page Numbers', icon: Hash, badge: 'Edit', desc: 'Insert customizable page numbering, headers, and footers into your PDF document', hint: 'Upload a PDF document to add page numbering.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'add-watermark': { id: 'add-watermark', name: 'Add Watermark', icon: Stamp, badge: 'Edit', desc: 'Stamp custom text or security watermarks across PDF pages with rotation and opacity control', hint: 'Upload a PDF document to apply watermarks.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'crop-pdf': { id: 'crop-pdf', name: 'Crop PDF', icon: Crop, badge: 'Edit', desc: 'Trim margins, crop page dimensions, and remove unwanted white borders from PDF pages', hint: 'Upload a PDF document to crop margins.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'edit-pdf': { id: 'edit-pdf', name: 'Edit PDF', icon: PenTool, badge: 'Edit', desc: 'Add custom text annotations, headers, stamps, and notes directly onto pages of your PDF', hint: 'Upload a PDF document to add text notes and annotations.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'pdf-forms': { id: 'pdf-forms', name: 'PDF Forms', icon: FileSpreadsheet, badge: 'Edit', desc: 'Flatten interactive form fields into static vector elements or lock inputs to read-only', hint: 'Upload a PDF document with form fields to flatten or lock.', ...ACCEPTED_TYPE_PRESETS.pdf },

  // 6. PDF Security
  'unlock-pdf': { id: 'unlock-pdf', name: 'Unlock PDF', icon: Unlock, badge: 'Security', desc: 'Remove password protection, unlock printing & copying permissions, and save an unrestricted PDF', hint: 'Upload a password-protected PDF document to unlock.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'protect-pdf': { id: 'protect-pdf', name: 'Protect PDF', icon: Shield, badge: 'Security', desc: 'Encrypt your PDF with AES password protection to prevent unauthorized opening, editing, or copying', hint: 'Upload a PDF document to encrypt with a password.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'sign-pdf': { id: 'sign-pdf', name: 'Sign PDF', icon: CheckSquare, badge: 'Security', desc: 'Apply an electronic signature badge, verified signing certificate block, and date onto your PDF', hint: 'Upload a PDF document to add a verified signature block.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'redact-pdf': { id: 'redact-pdf', name: 'Redact PDF', icon: EyeOff, badge: 'Security', desc: 'Permanently blackout sensitive information, confidential phrases, or page areas to prevent inspection', hint: 'Upload a PDF document to redact confidential data.', ...ACCEPTED_TYPE_PRESETS.pdf },
  'compare-pdf': { id: 'compare-pdf', name: 'Compare PDF', icon: GitCompare, badge: 'Security', desc: 'Compare two PDF documents side-by-side, analyze text and page differences, and generate audit report', hint: 'Upload 2 PDF documents to compare differences.', ...ACCEPTED_TYPE_PRESETS.pdf },

  // 7. Image Tools
  'merge-images': { id: 'merge-images', name: 'Merge Images', icon: Images, badge: 'Image Merger', desc: 'Combine unlimited images (1,000+ supported) into a single PDF document or stitched continuous photo', hint: 'Upload 2 or more images (JPG, PNG, WebP) to merge without limits.', ...ACCEPTED_TYPE_PRESETS.image },
  'compress-image': { id: 'compress-image', name: 'Compress Image', icon: Minimize2, badge: 'Image', desc: 'Shrink image file size with smart Canvas re-encoding and quality downsampling', hint: 'Upload 1 or more images (JPG, PNG, WebP) to compress.', ...ACCEPTED_TYPE_PRESETS.image },
  'resize-image': { id: 'resize-image', name: 'Resize Image', icon: Maximize2, badge: 'Image', desc: 'Change image dimensions by percentage scale or exact pixel width and height', hint: 'Upload 1 or more images to resize.', ...ACCEPTED_TYPE_PRESETS.image },
  'crop-image': { id: 'crop-image', name: 'Crop Image', icon: Crop, badge: 'Image', desc: 'Crop photos and images with preset aspect ratios or custom pixel bounding boxes', hint: 'Upload 1 or more images to crop.', ...ACCEPTED_TYPE_PRESETS.image },
  'convert-to-jpg': { id: 'convert-to-jpg', name: 'Convert to JPG', icon: Image, badge: 'Image', desc: 'Convert PNG, WebP, GIF, SVG, or BMP images into clean standard JPEG files', hint: 'Upload images (PNG, WebP, GIF) to convert to standard JPG format.', ...ACCEPTED_TYPE_PRESETS.image },
};

/**
 * Returns tool config by id with fallback to merge-pdf
 */
export function getToolConfig(toolId) {
  return TOOL_CONFIGS[toolId] || TOOL_CONFIGS['merge-pdf'];
}
