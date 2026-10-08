import { PDFDocument } from 'pdf-lib';

const pdfFormsAdapter = {
  id: 'pdf-forms',
  name: 'PDF Forms',
  description: 'Flatten interactive form fields into static vector elements or inspect fillable AcroForm properties.',
  badge: 'Edit',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return { valid: false, reason: 'Please upload at least 1 PDF file.' };
    }
    const target = files[0];
    if (target.isEncrypted) {
      return { valid: false, reason: `Target "${target.name}" is password-protected. Unlock it first.` };
    }
    return { valid: true };
  },

  options: [
    {
      id: 'formAction',
      label: 'Form Action',
      type: 'select',
      default: 'flatten',
      options: [
        { value: 'flatten', label: 'Flatten Form (Convert Inputs into Permanent Text & Graphics)' },
        { value: 'readOnly', label: 'Make Read-Only (Preserve Form Structure, Lock Inputs)' },
      ],
      hint: 'Flattening converts interactive text inputs, checkboxes, and signatures into permanent vector graphics.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. document_flattened.pdf',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetFile = files[0];
    onProgress(10, `Loading form structures from: ${targetFile.name}...`);

    let arrayBuffer = targetFile.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetFile.file && typeof targetFile.file.arrayBuffer === 'function') {
        arrayBuffer = await targetFile.file.arrayBuffer();
      }
    }

    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    onProgress(40, `Detected ${fields.length} form field(s). Processing form elements...`);

    const action = options.formAction || 'flatten';
    if (action === 'flatten') {
      try {
        form.flatten();
      } catch (err) {
        console.warn('Form flattening notice:', err.message);
      }
    } else {
      // Make read-only
      fields.forEach((field) => {
        try {
          field.enableReadOnly();
        } catch {
          // Continue if unsupported field type
        }
      });
    }

    onProgress(85, 'Packaging finalized PDF...');
    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    const rawName = targetFile.name || 'document.pdf';
    const baseName = rawName.replace(/\.pdf$/i, '');
    let finalName = (options.outputFilename || '').trim() || `${baseName}_forms_flattened.pdf`;
    if (!finalName.toLowerCase().endsWith('.pdf')) finalName += '.pdf';

    onProgress(100, `Processed ${fields.length} form field(s) successfully!`);

    return {
      success: true,
      blob,
      downloadUrl: URL.createObjectURL(blob),
      filename: finalName,
      fileSize: pdfBytes.length,
      totalPages: pdfDoc.getPageCount(),
      isPdf: true,
      files: [{ name: finalName, blob, type: 'application/pdf' }],
      message: `Processed ${fields.length} interactive fields (${action === 'flatten' ? 'flattened' : 'read-only'})`,
    };
  },
};

export default pdfFormsAdapter;
