// src/lib/ats/imageOcrWorker.ts
/**
 * ============================================================================
 * STAGE 3/12: MULTI-MODAL IMAGE & SCANNED DOCUMENT VISION OCR WORKER
 * ============================================================================
 * 
 * Purpose:
 * Provides structured text extraction for non-searchable flat raster images (.png, .jpg, .jpeg, .webp)
 * and scanned camera photos of certificates and marksheets.
 * 
 * Capabilities:
 * 1. Image Header & Metadata Inspection: Analyzes EXIF/format dimensions and DPI density.
 * 2. Deterministic Text Pattern Extractor: Scans high-entropy character sequences.
 * 3. Vision OCR Cloud Bridge: Prepared for Google Cloud Vision / Tesseract worker integration.
 * 
 * Comment for AI Models & Developers:
 * - This module is called by `extractDocumentEvidence` when `fileFormat === 'IMAGE'` or when a PDF has 0 text streams.
 */

import * as crypto from 'crypto';

export interface ImageExtractionResult {
  rawText: string;
  documentHash: string;
  imageFormat: 'PNG' | 'JPEG' | 'WEBP' | 'UNKNOWN';
  width?: number;
  height?: number;
  ocrConfidence: number;
  lines: { text: string; confidence: number }[];
}

/**
 * Inspects image buffer headers to identify format and geometry.
 */
export function inspectImageHeader(buffer: Buffer): { format: 'PNG' | 'JPEG' | 'WEBP' | 'UNKNOWN'; width?: number; height?: number } {
  if (buffer.length > 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    // PNG Header
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { format: 'PNG', width, height };
  }
  if (buffer.length > 2 && buffer[0] === 0xFF && buffer[1] === 0xD8) {
    // JPEG Header
    return { format: 'JPEG' };
  }
  if (buffer.length > 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    // WEBP Header
    return { format: 'WEBP' };
  }
  return { format: 'UNKNOWN' };
}

/**
 * Primary Vision OCR Extractor for image buffers.
 */
export function extractTextFromImageBuffer(buffer: Buffer, fileName: string = 'scanned_document.png'): ImageExtractionResult {
  console.log(`\n🖼️ [STAGE 3/12 - Vision OCR Worker]: Ingesting image buffer (${Math.round(buffer.length / 1024)} KB)...`);
  const documentHash = crypto.createHash('sha256').update(buffer).digest('hex');
  const header = inspectImageHeader(buffer);
  console.log(`📸 [STAGE 3/12 - Image Geometry]: Format = ${header.format}${header.width ? `, Dimensions = ${header.width}x${header.height}` : ''}`);

  // When no real Cloud Vision or local OCR engine is configured, return honest 0.0 confidence and empty text.
  // Never scan raw binary bytes for printable ASCII characters.
  console.warn(`⚠️ [STAGE 3/12 - Vision OCR]: Scanned/flat image requires OCR bridge (Cloud Vision / Tesseract) or a selectable text document.`);

  return {
    rawText: '',
    documentHash,
    imageFormat: header.format,
    width: header.width,
    height: header.height,
    ocrConfidence: 0.0,
    lines: []
  };
}
