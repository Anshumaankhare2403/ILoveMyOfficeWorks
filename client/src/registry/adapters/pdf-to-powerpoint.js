import { pdfjsLib } from '../../utils/pdfjs-init.js';
import JSZip from 'jszip';

/**
 * Builds a valid OpenXML .pptx presentation with embedded slide images
 */
async function buildPptxFromImages(slideImages) {
  const zip = new JSZip();

  // 1. [Content_Types].xml
  let contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Default Extension="jpeg" ContentType="image/jpeg"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>`;

  for (let i = 1; i <= slideImages.length; i++) {
    contentTypesXml += `\n  <Override PartName="/ppt/slides/slide${i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`;
  }
  contentTypesXml += `\n</Types>`;
  zip.file('[Content_Types].xml', contentTypesXml);

  // 2. _rels/.rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
  );

  // 3. ppt/_rels/presentation.xml.rels
  let presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">`;
  for (let i = 1; i <= slideImages.length; i++) {
    presRels += `\n  <Relationship Id="rId${i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i}.xml"/>`;
  }
  presRels += `\n</Relationships>`;
  zip.file('ppt/_rels/presentation.xml.rels', presRels);

  // 4. ppt/presentation.xml (16:9 9144000 x 5143500 EMUs)
  let sldIdLst = '';
  for (let i = 1; i <= slideImages.length; i++) {
    sldIdLst += `\n    <p:sldId id="${255 + i}" r:id="rId${i}"/>`;
  }

  const presentationXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst/>
  <p:sldIdLst>${sldIdLst}
  </p:sldIdLst>
  <p:sldSz cx="9144000" cy="5143500" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`;
  zip.file('ppt/presentation.xml', presentationXml);

  // 5. Each slide and media
  for (let i = 1; i <= slideImages.length; i++) {
    const imgData = slideImages[i - 1];
    zip.file(`ppt/media/image${i}.jpeg`, imgData.bytes);

    // ppt/slides/_rels/slideX.xml.rels
    zip.file(
      `ppt/slides/_rels/slide${i}.xml.rels`,
      `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${i}.jpeg"/>
</Relationships>`
    );

    // ppt/slides/slideX.xml
    const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
      <p:pic>
        <p:nvPicPr>
          <p:cNvPr id="2" name="Slide Image ${i}"/>
          <p:cNvPicPr>
            <a:picLocks noChangeAspect="1"/>
          </p:cNvPicPr>
          <p:nvPr/>
        </p:nvPicPr>
        <p:blipFill>
          <a:blip r:embed="rId1"/>
          <a:stretch>
            <a:fillRect/>
          </a:stretch>
        </p:blipFill>
        <p:spPr>
          <a:xfrm>
            <a:off x="0" y="0"/>
            <a:ext cx="9144000" cy="5143500"/>
          </a:xfrm>
          <a:prstGeom prst="rect">
            <a:avLst/>
          </a:prstGeom>
        </p:spPr>
      </p:pic>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr>
    <a:masterClrMapping/>
  </p:clrMapOvr>
</p:sld>`;
    zip.file(`ppt/slides/slide${i}.xml`, slideXml);
  }

  return await zip.generateAsync({ type: 'blob' });
}

const pdfToPowerpointAdapter = {
  id: 'pdf-to-powerpoint',
  name: 'PDF to POWERPOINT',
  description: 'Convert PDF document pages into fully formatted PowerPoint presentation slides (.pptx).',
  badge: 'Active',

  accepts: (files) => {
    if (!files || files.length === 0) {
      return {
        valid: false,
        reason: 'Please upload at least 1 PDF document to convert to PowerPoint.',
      };
    }

    const targetFile = files[0];
    if (targetFile.isEncrypted) {
      return {
        valid: false,
        reason: `Cannot convert locked file "${targetFile.name}". Please unlock it first.`,
      };
    }

    return { valid: true };
  },

  options: [
    {
      id: 'slideResolution',
      label: 'Slide Image Quality',
      type: 'select',
      default: '150',
      options: [
        { value: '150', label: 'High Definition (150 DPI • Crisp Vector Clarity)' },
        { value: '96', label: 'Standard Web (96 DPI • Faster & Lightweight)' },
      ],
      hint: 'Resolution of slide renders inside the generated PowerPoint deck.',
    },
    {
      id: 'outputFilename',
      label: 'Output File Name',
      type: 'text',
      default: 'converted_presentation.pptx',
    },
  ],

  execute: async (files, options = {}, onProgress = () => {}) => {
    const targetItem = files[0];
    onProgress(5, `Loading PDF document: ${targetItem.name}...`);

    let arrayBuffer = targetItem.arrayBuffer;
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      if (targetItem.file && typeof targetItem.file.arrayBuffer === 'function') {
        arrayBuffer = await targetItem.file.arrayBuffer();
      }
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer.slice(0)),
      cMapUrl: '/cmaps/',
      cMapPacked: true,
      standardFontDataUrl: '/standard_fonts/',
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const dpi = parseInt(options.slideResolution || '150', 10);
    const scale = dpi / 72;
    const slideImages = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const percent = Math.round(10 + (pageNum / numPages) * 70);
      onProgress(percent, `Rendering slide ${pageNum} of ${numPages}...`);

      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext('2d', { alpha: false });

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      await page.render({
        canvasContext: ctx,
        viewport,
        intent: 'print',
      }).promise;

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.9)
      );

      canvas.width = 0;
      canvas.height = 0;

      const imgBytes = new Uint8Array(await blob.arrayBuffer());
      slideImages.push({
        bytes: imgBytes,
        width: viewport.width,
        height: viewport.height,
      });
    }

    onProgress(85, 'Building OpenXML PowerPoint package (.pptx)...');
    const pptxBlob = await buildPptxFromImages(slideImages);

    let finalName = options.outputFilename || `${targetItem.name.replace(/\.[^/.]+$/, '')}.pptx`;
    if (!finalName.toLowerCase().endsWith('.pptx')) finalName += '.pptx';

    onProgress(100, 'PowerPoint presentation created successfully!');

    return {
      success: true,
      blob: pptxBlob,
      downloadUrl: URL.createObjectURL(pptxBlob),
      filename: finalName,
      fileSize: pptxBlob.size,
      totalPages: numPages,
      isPptx: true,
      files: [
        {
          name: finalName,
          blob: pptxBlob,
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        },
      ],
      message: `Assembled ${numPages} slides into ${finalName}`,
    };
  },
};

export default pdfToPowerpointAdapter;
