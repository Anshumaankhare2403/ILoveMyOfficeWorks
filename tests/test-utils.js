import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '..');
export const TEST_FILES_DIR = path.resolve(ROOT_DIR, 'test_files');

// Polyfill DOMParser for Node.js if not present
if (typeof globalThis.DOMParser === 'undefined') {
  class SimpleElement {
    constructor(tagName, textContent = '', attributes = {}) {
      this.tagName = tagName;
      this.nodeName = tagName;
      this.textContent = textContent;
      this.attributes = attributes;
      this.childNodes = [];
      this.nodeType = 1;
    }
    getAttribute(name) {
      return this.attributes[name] || null;
    }
    getElementsByTagName(name) {
      const results = [];
      const lower = name.toLowerCase();
      const traverse = (node) => {
        if (node.tagName && (node.tagName.toLowerCase() === lower || node.tagName.toLowerCase().endsWith(':' + lower.split(':').pop()))) {
          results.push(node);
        }
        for (const child of node.childNodes) {
          traverse(child);
        }
      };
      for (const child of this.childNodes) {
        traverse(child);
      }
      return results;
    }
  }

  class SimpleDocument {
    constructor(bodyText) {
      this.body = new SimpleElement('body', bodyText);
      this._parse(bodyText);
    }
    _parse(xml) {
      // Basic recursive tag parser for XML/HTML used in test extraction
      const tagRegex = /<([a-zA-Z0-9_\-:]+)([^>]*)>([\s\S]*?)<\/\1>|<([a-zA-Z0-9_\-:]+)([^>]*)\/>/g;
      const parseNodes = (text, parent) => {
        let match;
        let lastIdx = 0;
        while ((match = tagRegex.exec(text)) !== null) {
          const tagName = match[1] || match[4];
          const rawAttrs = match[2] || match[5] || '';
          const innerContent = match[3] || '';

          const attrs = {};
          const attrRegex = /([a-zA-Z0-9_\-:]+)="([^"]*)"/g;
          let aMatch;
          while ((aMatch = attrRegex.exec(rawAttrs)) !== null) {
            attrs[aMatch[1]] = aMatch[2];
          }

          const elem = new SimpleElement(tagName, innerContent.replace(/<[^>]+>/g, ''), attrs);
          parent.childNodes.push(elem);
          if (innerContent.includes('<')) {
            parseNodes(innerContent, elem);
          }
        }
      };
      parseNodes(xml, this.body);
    }
    getElementsByTagName(name) {
      return this.body.getElementsByTagName(name);
    }
  }

  globalThis.DOMParser = class DOMParser {
    parseFromString(str, type) {
      return new SimpleDocument(str);
    }
  };
}

// Ensure URL.createObjectURL exists in test environment
if (typeof URL.createObjectURL !== 'function') {
  URL.createObjectURL = (blob) => `blob:mock-url-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}
if (typeof URL.revokeObjectURL !== 'function') {
  URL.revokeObjectURL = () => {};
}

/**
 * Creates a mock File-like object with ArrayBuffer
 */
export function createMockFileItem({ name, content, type = 'application/pdf', isPdf = true, isEncrypted = false, pageCount = 1 }) {
  const buffer = content instanceof Uint8Array ? content.buffer : Buffer.from(content || '%PDF-1.4\n%mock\n');
  const uint8 = new Uint8Array(buffer);
  const blob = new Blob([uint8], { type });
  const file = new File([uint8], name, { type });

  return {
    id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    file,
    size: uint8.length,
    formattedSize: `${uint8.length} B`,
    pageCount,
    isPdf,
    isImage: type.startsWith('image/'),
    isEncrypted,
    error: isEncrypted ? 'PDF is encrypted' : null,
    arrayBuffer: buffer,
  };
}

/**
 * Load a real test PDF file from test_files/
 */
export function loadTestPdf(filename = 'sample_report.pdf') {
  const filePath = path.join(TEST_FILES_DIR, filename);
  const fileBuffer = fs.readFileSync(filePath);
  const uint8 = new Uint8Array(fileBuffer);

  return {
    id: `test-${filename}-${Date.now()}`,
    name: filename,
    file: new File([uint8], filename, { type: 'application/pdf' }),
    size: uint8.length,
    formattedSize: `${(uint8.length / 1024).toFixed(1)} KB`,
    pageCount: 3,
    isPdf: true,
    isEncrypted: false,
    error: null,
    arrayBuffer: uint8.buffer,
  };
}
