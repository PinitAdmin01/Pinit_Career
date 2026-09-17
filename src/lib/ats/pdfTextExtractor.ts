// src/lib/ats/pdfTextExtractor.ts
/**
 * ============================================================================
 * STAGE 3 & 4: MULTI-MODAL NATIVE EXTRACTION & SHA-256 FINGERPRINTING
 * ============================================================================
 * 
 * Purpose:
 * Implements deterministic byte-level stream decompression and ToUnicode CMap
 * font translation for binary PDF, DOCX (PKZip/XML), and plain-text files.
 * Provides honest refusal with UNREADABLE_DOCUMENT when files contain insufficient
 * extractable text, eliminating phantom scoring on raw binary or leaked metadata.
 */

import * as zlib from 'zlib';
import * as crypto from 'crypto';
import { extractTextFromImageBuffer } from './imageOcrWorker';

export interface ExtractionResult {
  rawText: string;
  documentHash: string; // SHA-256 fingerprint
  pageCount: number;
  extractionMethod: 'NATIVE_PDF' | 'DOCX_XML' | 'OCR_VISION' | 'PLAIN_TEXT';
  extractionConfidence: number; // 0.0 to 1.0
  textLines: { line: string; pageNumber: number; charOffset: number }[];
  error?: string;
}

export function computeDocumentHash(buffer: Buffer | Uint8Array): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function decodePdfLiteralString(str: string): string {
  return str
    .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\\/g, '\\');
}

/**
 * Parses Adobe ToUnicode CMaps, supporting both beginbfchar and beginbfrange
 * (both 3-argument <start> <end> <destStart> and bracketed list formats).
 */
export function parseCMap(text: string): Map<number, string> {
  const cmap = new Map<number, string>();

  // 1. Parse beginbfchar: <sourceCode> <unicodeHex>
  const bfcharRegex = /(\d+)\s+beginbfchar([\s\S]*?)endbfchar/g;
  let m: RegExpExecArray | null;
  while ((m = bfcharRegex.exec(text)) !== null) {
    const lines = m[2].trim().split(/\r?\n/);
    for (const line of lines) {
      const pair = line.match(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/);
      if (pair) {
        const src = parseInt(pair[1], 16);
        const dst = parseInt(pair[2], 16);
        if (dst > 0) {
          cmap.set(src, String.fromCodePoint(dst));
        }
      }
    }
  }

  // 2. Parse beginbfrange
  const bfrangeRegex = /(\d+)\s+beginbfrange([\s\S]*?)endbfrange/g;
  while ((m = bfrangeRegex.exec(text)) !== null) {
    const lines = m[2].trim().split(/\r?\n/);
    for (const line of lines) {
      // Format A: <start> <end> <destStart>
      const rangeMatch = line.match(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>/);
      if (rangeMatch) {
        const start = parseInt(rangeMatch[1], 16);
        const end = parseInt(rangeMatch[2], 16);
        let dest = parseInt(rangeMatch[3], 16);
        for (let c = start; c <= end; c++) {
          if (dest > 0) {
            cmap.set(c, String.fromCodePoint(dest));
          }
          dest++;
        }
        continue;
      }

      // Format B: <start> <end> [ <dest1> <dest2> ... ]
      const arrayMatch = line.match(/<([0-9a-fA-F]+)>\s*<([0-9a-fA-F]+)>\s*\[\s*([\s\S]*?)\s*\]/);
      if (arrayMatch) {
        const start = parseInt(arrayMatch[1], 16);
        const hexItems = arrayMatch[3].match(/<([0-9a-fA-F]+)>/g) || [];
        hexItems.forEach((item, idx) => {
          const uni = parseInt(item.replace(/[<>]/g, ''), 16);
          if (uni > 0) {
            cmap.set(start + idx, String.fromCodePoint(uni));
          }
        });
      }
    }
  }

  return cmap;
}

function decodeHexWithCMap(hex: string, cmap?: Map<number, string>): string {
  let res = '';
  // Try 4-digit (16-bit) chunking first if applicable
  if (hex.length >= 4 && hex.length % 4 === 0) {
    for (let i = 0; i < hex.length; i += 4) {
      const code = parseInt(hex.substring(i, i + 4), 16);
      const ch = cmap ? cmap.get(code) : (code >= 32 && code <= 126 ? String.fromCharCode(code) : undefined);
      if (ch) res += ch;
    }
    return res;
  }
  // Otherwise 2-digit (8-bit) chunking
  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substring(i, i + 2), 16);
    const ch = cmap ? cmap.get(code) : (code >= 32 && code <= 126 ? String.fromCharCode(code) : undefined);
    if (ch) res += ch;
  }
  return res;
}

export function extractTextFromPdfBuffer(buffer: Buffer): ExtractionResult {
  console.log(`\n📄 [STAGE 3/12 - Native PDF Parser]: Decompressing binary PDF streams...`);
  const documentHash = computeDocumentHash(buffer);
  console.log(`🔑 [STAGE 4/12 - Immutable Evidence]: Computed SHA-256 Hash = ${documentHash}`);

  const bufferStr = buffer.toString('binary');

  // Step 1: Index all objects
  const objRegex = /(?:^|\r?\n)(\d+)\s+0\s+obj([\s\S]*?)endobj/g;
  let m: RegExpExecArray | null;
  const objects = new Map<number, string>();
  while ((m = objRegex.exec(bufferStr)) !== null) {
    objects.set(parseInt(m[1], 10), m[2]);
  }

  function getStream(objNum: number): string | null {
    const body = objects.get(objNum);
    if (!body) return null;
    const streamMatch = body.match(/stream\r?\n([\s\S]*?)\r?\nendstream/);
    if (!streamMatch) return null;
    const rawData = Buffer.from(streamMatch[1], 'binary');

    if (body.includes('/FlateDecode')) {
      try {
        return zlib.inflateSync(rawData).toString('utf-8');
      } catch {
        try {
          return zlib.inflateRawSync(rawData).toString('utf-8');
        } catch {
          return null;
        }
      }
    }

    return rawData.toString('utf-8');
  }

  // Step 2: Map Font Object IDs to ToUnicode CMap objects
  const fontToUnicodeObj = new Map<number, number>();
  for (const [objNum, body] of objects.entries()) {
    if (body.includes('/Type /Font') || body.includes('/Type/Font')) {
      const toUnicodeMatch = body.match(/\/ToUnicode\s+(\d+)\s+0\s+R/);
      if (toUnicodeMatch) fontToUnicodeObj.set(objNum, parseInt(toUnicodeMatch[1], 10));
    }
  }

  const fontNameMap = new Map<string, number>();
  for (const [, body] of objects.entries()) {
    const fontDictMatch = body.match(/\/Font\s*<<([\s\S]*?)>>/);
    if (fontDictMatch) {
      const dict = fontDictMatch[1];
      const entryRegex = /\/([A-Za-z0-9]+)\s+(\d+)\s+0\s+R/g;
      let entry: RegExpExecArray | null;
      while ((entry = entryRegex.exec(dict)) !== null) {
        const fontName = entry[1];
        const fontObjId = parseInt(entry[2], 10);
        const toUnicodeObjId = fontToUnicodeObj.get(fontObjId);
        if (toUnicodeObjId) fontNameMap.set(fontName, toUnicodeObjId);
      }
    }
  }

  const fontCMaps = new Map<string, Map<number, string>>();
  for (const [fontName, toUnicodeObjId] of fontNameMap.entries()) {
    const cmapText = getStream(toUnicodeObjId);
    if (cmapText) fontCMaps.set(fontName, parseCMap(cmapText));
  }

  // Step 3: Identify Page Content Objects (/Contents)
  const contentObjIds = new Set<number>();
  for (const [, body] of objects.entries()) {
    if (body.includes('/Type /Page') || body.includes('/Type/Page')) {
      const singleMatch = body.match(/\/Contents\s+(\d+)\s+0\s+R/);
      if (singleMatch) contentObjIds.add(parseInt(singleMatch[1], 10));

      const arrMatch = body.match(/\/Contents\s*\[([\s\S]*?)\]/);
      if (arrMatch) {
        const nums = arrMatch[1].match(/(\d+)\s+0\s+R/g) || [];
        nums.forEach(n => contentObjIds.add(parseInt(n, 10)));
      }
    }
  }

  // Fallback: If page objects lacked /Contents explicit links, search for streams containing BT/ET
  if (contentObjIds.size === 0) {
    for (const [objNum, body] of objects.entries()) {
      if (body.includes('stream') && (body.includes('BT') || body.includes('Tj') || body.includes('TJ'))) {
        contentObjIds.add(objNum);
      }
    }
  }

  // Step 4: Decode text operations from content objects
  const decodedLines: string[] = [];

  for (const objNum of contentObjIds) {
    const streamText = getStream(objNum);
    if (!streamText) continue;

    let currentFontCMap: Map<number, string> | undefined = undefined;
    let currentLine = '';

    // Regex matching font selection, text operators (Tj, TJ), and positioning (Td, TD, T*, ET)
    const opRegex = /(?:\/([A-Za-z0-9]+)\s+[\d.]+\s+Tf)|(?:<([0-9a-fA-F]+)>\s*Tj)|(?:\(((?:\\.|[^()\\])*)\)\s*Tj)|(?:\[([\s\S]*?)\]\s*TJ)|(?:([-\d.]+)\s+([-\d.]+)\s+T[dD])|(?:T\*)|(?:ET)/g;
    let token: RegExpExecArray | null;

    while ((token = opRegex.exec(streamText)) !== null) {
      if (token[1]) {
        // Font switch: /F4 32 Tf
        currentFontCMap = fontCMaps.get(token[1]) || currentFontCMap;
      } else if (token[2]) {
        // <hex> Tj
        currentLine += decodeHexWithCMap(token[2], currentFontCMap);
      } else if (token[3]) {
        // (literal) Tj
        currentLine += decodePdfLiteralString(token[3]);
      } else if (token[4]) {
        // [ ... ] TJ
        const inner = token[4];
        const itemRegex = /<([0-9a-fA-F]+)>|\(((?:\\.|[^()\\])*)\)/g;
        let item: RegExpExecArray | null;
        while ((item = itemRegex.exec(inner)) !== null) {
          if (item[1]) {
            currentLine += decodeHexWithCMap(item[1], currentFontCMap);
          } else if (item[2]) {
            currentLine += decodePdfLiteralString(item[2]);
          }
        }
      } else if (token[5] && token[6]) {
        // tx ty Td / TD: vertical shift signifies new line
        const ty = parseFloat(token[6]);
        if (Math.abs(ty) > 0.01) {
          if (currentLine.trim()) {
            decodedLines.push(currentLine.trim());
            currentLine = '';
          }
        }
      } else if (token[0] === 'T*' || token[0] === 'ET') {
        if (currentLine.trim()) {
          decodedLines.push(currentLine.trim());
          currentLine = '';
        }
      }
    }

    if (currentLine.trim()) {
      decodedLines.push(currentLine.trim());
    }
  }

  const rawText = decodedLines.join('\n').trim();

  // Honest Refusal: if less than 30 readable characters were extracted,
  // do NOT fall back to scanning raw file binary literals (which leaks user agents and metadata).
  if (rawText.length < 30) {
    console.warn(`⚠️ [STAGE 3/12 - Native PDF]: Extracted fewer than 30 readable characters (${rawText.length}). Refusing unreadable PDF.`);
    return {
      rawText: '',
      documentHash,
      pageCount: 1,
      extractionMethod: 'NATIVE_PDF',
      extractionConfidence: 0.0,
      textLines: [],
      error: 'UNREADABLE_DOCUMENT: Extracted content has fewer than 30 readable characters.'
    };
  }

  const textLines = decodedLines.map((line, idx) => ({
    line,
    pageNumber: 1,
    charOffset: idx * 25
  }));

  const confidence = rawText.length > 100 ? 0.98 : 0.90;
  console.log(`✅ [STAGE 4/12 - Evidence Extracted]: Decoded ${rawText.length} characters (Confidence: ${confidence}).`);

  return {
    rawText,
    documentHash,
    pageCount: Math.max(1, Math.ceil(rawText.length / 2500)),
    extractionMethod: 'NATIVE_PDF',
    extractionConfidence: confidence,
    textLines
  };
}

/**
 * Pure Node.js PKZip reader that locates and decompresses word/document.xml
 * from .docx files using built-in zlib.inflateRawSync.
 */
function extractDocxXml(buffer: Buffer): string | null {
  if (buffer.length < 30 || buffer[0] !== 0x50 || buffer[1] !== 0x4B) {
    return null;
  }

  // 1. Search for End of Central Directory (EOCD)
  let eocdOffset = -1;
  for (let i = buffer.length - 22; i >= Math.max(0, buffer.length - 65557); i--) {
    if (buffer.readUInt32LE(i) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }

  if (eocdOffset !== -1) {
    const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
    const cdOffset = buffer.readUInt32LE(eocdOffset + 16);

    let currentOffset = cdOffset;
    for (let i = 0; i < totalEntries; i++) {
      if (currentOffset + 46 > buffer.length) break;
      const sig = buffer.readUInt32LE(currentOffset);
      if (sig !== 0x02014b50) break;

      const method = buffer.readUInt16LE(currentOffset + 10);
      const compSize = buffer.readUInt32LE(currentOffset + 20);
      const nameLen = buffer.readUInt16LE(currentOffset + 28);
      const extraLen = buffer.readUInt16LE(currentOffset + 30);
      const commentLen = buffer.readUInt16LE(currentOffset + 32);
      const localHeaderOffset = buffer.readUInt32LE(currentOffset + 42);

      const fileName = buffer.toString('utf8', currentOffset + 46, currentOffset + 46 + nameLen);
      currentOffset += 46 + nameLen + extraLen + commentLen;

      if (fileName === 'word/document.xml') {
        if (localHeaderOffset + 30 > buffer.length) break;
        const localNameLen = buffer.readUInt16LE(localHeaderOffset + 26);
        const localExtraLen = buffer.readUInt16LE(localHeaderOffset + 28);
        const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
        const compData = buffer.subarray(dataStart, dataStart + compSize);
        if (method === 8) {
          return zlib.inflateRawSync(compData).toString('utf-8');
        } else if (method === 0) {
          return compData.toString('utf-8');
        }
      }
    }
  }

  // 2. Fallback: Scan local headers directly if EOCD was truncated
  let offset = 0;
  while (offset + 30 < buffer.length) {
    if (buffer.readUInt32LE(offset) !== 0x04034b50) {
      offset++;
      continue;
    }
    const method = buffer.readUInt16LE(offset + 8);
    const compSize = buffer.readUInt32LE(offset + 18);
    const nameLen = buffer.readUInt16LE(offset + 26);
    const extraLen = buffer.readUInt16LE(offset + 28);
    const fileName = buffer.toString('utf8', offset + 30, offset + 30 + nameLen);
    const dataStart = offset + 30 + nameLen + extraLen;

    if (fileName === 'word/document.xml' && compSize > 0 && dataStart + compSize <= buffer.length) {
      const compData = buffer.subarray(dataStart, dataStart + compSize);
      if (method === 8) {
        return zlib.inflateRawSync(compData).toString('utf-8');
      } else if (method === 0) {
        return compData.toString('utf-8');
      }
    }
    offset = dataStart + (compSize > 0 ? compSize : 1);
  }

  return null;
}

export function extractTextFromDocxBuffer(buffer: Buffer): ExtractionResult {
  console.log(`\n📝 [STAGE 3/12 - DOCX Parser]: Decompressing PKZip archive to read word/document.xml...`);
  const documentHash = computeDocumentHash(buffer);

  const xmlStr = extractDocxXml(buffer);
  if (!xmlStr) {
    console.warn(`⚠️ [STAGE 3/12 - DOCX Error]: Failed to extract word/document.xml from PKZip buffer.`);
    return {
      rawText: '',
      documentHash,
      pageCount: 1,
      extractionMethod: 'DOCX_XML',
      extractionConfidence: 0.0,
      textLines: [],
      error: 'UNREADABLE_DOCUMENT: Could not decompress word/document.xml from DOCX file.'
    };
  }

  const decodeXmlEntities = (s: string) =>
    s
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");

  const lines: string[] = [];
  const paragraphs = xmlStr.split(/<\/w:p>/);
  for (const p of paragraphs) {
    const textPieces: string[] = [];
    const wtRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
    let m: RegExpExecArray | null;
    while ((m = wtRegex.exec(p)) !== null) {
      textPieces.push(decodeXmlEntities(m[1]));
    }
    const line = textPieces.join('').trim();
    if (line.length > 0) {
      lines.push(line);
    }
  }

  const rawText = lines.join('\n').trim();
  const textLines = lines.map((line, idx) => ({
    line,
    pageNumber: 1,
    charOffset: idx * 30
  }));

  if (rawText.length < 30) {
    console.warn(`⚠️ [STAGE 3/12 - DOCX Warning]: DOCX extracted fewer than 30 characters (${rawText.length}). Refusing unreadable DOCX.`);
    return {
      rawText: '',
      documentHash,
      pageCount: 1,
      extractionMethod: 'DOCX_XML',
      extractionConfidence: 0.0,
      textLines: [],
      error: 'UNREADABLE_DOCUMENT: DOCX file contains insufficient text.'
    };
  }

  const confidence = rawText.length > 100 ? 0.98 : 0.90;
  console.log(`✅ [STAGE 4/12 - Evidence Extracted]: DOCX Extracted ${rawText.length} chars (Confidence: ${confidence}).`);

  return {
    rawText,
    documentHash,
    pageCount: Math.max(1, Math.ceil(rawText.length / 2500)),
    extractionMethod: 'DOCX_XML',
    extractionConfidence: confidence,
    textLines
  };
}

export function extractDocumentEvidence(
  buffer: Buffer,
  fileFormat: 'PDF' | 'DOCX' | 'IMAGE' | 'TEXT' | 'UNSUPPORTED'
): ExtractionResult {
  console.log(`\n🚀 [STAGE 3/12 - Extraction Router]: Routing format: ${fileFormat}`);
  if (fileFormat === 'PDF') {
    return extractTextFromPdfBuffer(buffer);
  }
  if (fileFormat === 'DOCX') {
    return extractTextFromDocxBuffer(buffer);
  }
  if (fileFormat === 'TEXT') {
    const rawText = buffer.toString('utf-8').trim();
    const documentHash = computeDocumentHash(buffer);
    const lines = rawText.split(/\r?\n/).filter(l => l.trim().length > 0);

    if (rawText.length < 30) {
      return {
        rawText: '',
        documentHash,
        pageCount: 1,
        extractionMethod: 'PLAIN_TEXT',
        extractionConfidence: 0.0,
        textLines: [],
        error: 'UNREADABLE_DOCUMENT: Text file contains fewer than 30 characters.'
      };
    }

    console.log(`✅ [STAGE 4/12 - Text Extracted]: Plain text file read directly (${rawText.length} chars).`);
    return {
      rawText,
      documentHash,
      pageCount: 1,
      extractionMethod: 'PLAIN_TEXT',
      extractionConfidence: 1.0,
      textLines: lines.map((line, idx) => ({ line, pageNumber: 1, charOffset: idx * 30 }))
    };
  }

  if (fileFormat === 'IMAGE') {
    console.log(`🖼️ [STAGE 3/12 - Extraction Router]: Routing flat image to Vision OCR worker...`);
    const ocrResult = extractTextFromImageBuffer(buffer);
    return {
      rawText: ocrResult.rawText,
      documentHash: ocrResult.documentHash,
      pageCount: 1,
      extractionMethod: 'OCR_VISION',
      extractionConfidence: ocrResult.ocrConfidence,
      textLines: ocrResult.lines.map((l, idx) => ({ line: l.text, pageNumber: 1, charOffset: idx * 25 })),
      error: ocrResult.ocrConfidence === 0 ? 'IMAGE_OCR_UNAVAILABLE: Image text extraction requires selectable text or a configured OCR service. Please upload a PDF with selectable text or a DOCX document.' : undefined
    };
  }

  console.warn(`⚠️ [STAGE 3/12 - Fallback]: Unsupported document format.`);
  return {
    rawText: '',
    documentHash: computeDocumentHash(buffer),
    pageCount: 1,
    extractionMethod: 'OCR_VISION',
    extractionConfidence: 0.0,
    textLines: [],
    error: 'UNREADABLE_DOCUMENT: Unsupported document format.'
  };
}
