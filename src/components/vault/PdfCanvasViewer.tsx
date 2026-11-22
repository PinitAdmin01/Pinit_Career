'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PdfCanvasViewerProps {
  data: Uint8Array;
  fileName: string;
  signedUrl?: string | null;
  blobUrl?: string | null;
}

interface PdfJsModule {
  getDocument: (src: {
    data: Uint8Array;
    useSystemFonts?: boolean;
    isEvalSupported?: boolean;
  }) => { promise: Promise<any>; destroy?: () => Promise<void> | void };
}

let cachedPdfJsPromise: Promise<PdfJsModule> | null = null;

async function loadLocalPdfJs(): Promise<PdfJsModule> {
  if (!cachedPdfJsPromise) {
    cachedPdfJsPromise = new Promise<PdfJsModule>((resolve, reject) => {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        reject(new Error('PDF viewer requires a browser environment.'));
        return;
      }
      const globalKey = '__PINIT_PDFJS_RUNTIME__';
      const existing = (window as any)[globalKey];
      if (existing && typeof existing.getDocument === 'function') {
        resolve(existing);
        return;
      }

      const eventName = `pinit-pdfjs-ready-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const script = document.createElement('script');
      script.type = 'module';

      const timer = window.setTimeout(() => {
        window.removeEventListener(eventName, onReady);
        script.remove();
        cachedPdfJsPromise = null;
        reject(new Error('Timed out loading local PDF.js engine (/pdfjs/pdfjs.mjs).'));
      }, 15000);

      const onReady = (ev: Event) => {
        window.clearTimeout(timer);
        window.removeEventListener(eventName, onReady);
        script.remove();
        const detail = (ev as CustomEvent)?.detail;
        const mod = (window as any)[globalKey];
        if (detail?.ok && mod && typeof mod.getDocument === 'function') {
          resolve(mod);
        } else {
          cachedPdfJsPromise = null;
          reject(new Error(detail?.error || 'Failed to initialize Mozilla PDF.js runtime.'));
        }
      };

      window.addEventListener(eventName, onReady, { once: true });
      script.textContent = `
        import('/pdfjs/pdfjs.mjs')
          .then((mod) => {
            window['${globalKey}'] = mod;
            window.dispatchEvent(new CustomEvent('${eventName}', { detail: { ok: true } }));
          })
          .catch((err) => {
            window.dispatchEvent(new CustomEvent('${eventName}', { detail: { ok: false, error: String(err && err.message || err) } }));
          });
      `;
      document.head.appendChild(script);
    });
  }
  return cachedPdfJsPromise;
}

function hasPdfMagicHeader(bytes: Uint8Array): boolean {
  const limit = Math.min(bytes.length, 1024);
  for (let i = 0; i <= limit - 5; i++) {
    if (
      bytes[i] === 0x25 && // %
      bytes[i + 1] === 0x50 && // P
      bytes[i + 2] === 0x44 && // D
      bytes[i + 3] === 0x46 && // F
      bytes[i + 4] === 0x2d // -
    ) {
      return true;
    }
  }
  return false;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  data,
  fileName,
  signedUrl,
  blobUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1.0);
  const [numPages, setNumPages] = useState<number>(0);
  const [rendering, setRendering] = useState<boolean>(true);
  const [renderError, setRenderError] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    let loadingTask: any = null;
    let pdfDoc: any = null;

    async function renderPdf() {
      setRendering(true);
      setRenderError('');

      if (!data || data.byteLength === 0) {
        setRenderError('Received empty PDF file (0 bytes).');
        setRendering(false);
        return;
      }

      if (!hasPdfMagicHeader(data)) {
        const previewSnippet = new TextDecoder('utf-8', { fatal: false })
          .decode(data.subarray(0, 80))
          .replace(/\s+/g, ' ')
          .trim();
        setRenderError(
          `Stored file (${data.byteLength} bytes) does not have a valid %PDF- header${
            previewSnippet ? ` (starts with "${previewSnippet.slice(0, 40)}")` : ''
          }.`
        );
        setRendering(false);
        return;
      }

      try {
        const pdfjs = await loadLocalPdfJs();
        if (cancelled) return;

        // Pass a cloned Uint8Array so PDF.js buffer ownership never detaches parent state
        loadingTask = pdfjs.getDocument({
          data: data.slice(),
          useSystemFonts: true,
          isEvalSupported: false,
        });
        pdfDoc = await loadingTask.promise;
        if (cancelled) return;

        const pageCount = Math.min(Number(pdfDoc.numPages) || 1, 20);
        setNumPages(pageCount);

        const host = containerRef.current;
        if (!host) return;
        host.innerHTML = '';

        const availableWidth = Math.max(280, (host.clientWidth || 560) - 28);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
          if (cancelled) return;
          const page = await pdfDoc.getPage(pageNum);
          if (cancelled) return;

          const baseViewport = page.getViewport({ scale: 1 });
          const fitScale = availableWidth / Math.max(1, baseViewport.width);
          const cssScale = Math.max(0.4, Math.min(3.0, fitScale * zoom));
          const displayViewport = page.getViewport({ scale: cssScale });
          const renderViewport = page.getViewport({ scale: cssScale * dpr });

          const pageWrapper = document.createElement('div');
          pageWrapper.style.cssText =
            'position:relative;margin:0 auto 14px;background:#ffffff;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.35);overflow:hidden;flex-shrink:0;';
          pageWrapper.style.width = `${Math.floor(displayViewport.width)}px`;
          pageWrapper.style.height = `${Math.floor(displayViewport.height)}px`;

          const canvas = document.createElement('canvas');
          canvas.width = Math.floor(renderViewport.width);
          canvas.height = Math.floor(renderViewport.height);
          canvas.style.width = `${Math.floor(displayViewport.width)}px`;
          canvas.style.height = `${Math.floor(displayViewport.height)}px`;
          canvas.style.display = 'block';
          canvas.setAttribute('data-pdf-page', String(pageNum));

          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          pageWrapper.appendChild(canvas);
          host.appendChild(pageWrapper);

          await page.render({
            canvas,
            canvasContext: ctx,
            viewport: renderViewport,
          }).promise;
        }

        if (!cancelled) setRendering(false);
      } catch (err: any) {
        if (!cancelled) {
          console.error('[PdfCanvasViewer] Render failed:', err);
          setRenderError(err?.message || 'Unable to render PDF pages.');
          setRendering(false);
        }
      }
    }

    void renderPdf();

    return () => {
      cancelled = true;
      try {
        pdfDoc?.destroy?.();
      } catch {}
      try {
        loadingTask?.destroy?.();
      } catch {}
    };
  }, [data, zoom]);

  return (
    <div
      data-testid="pdf-canvas-viewer"
      style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}
    >
      {/* Compact PDF Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '7px 12px',
          borderBottom: '1px solid var(--border)',
          background: 'rgba(2, 6, 23, 0.55)',
          fontSize: 11.5,
          color: 'var(--t2)',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
          {rendering ? '⏳ Rendering PDF…' : numPages > 0 ? `📄 ${numPages} ${numPages === 1 ? 'Page' : 'Pages'}` : fileName}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, Math.round((z - 0.15) * 100) / 100))}
            className="btn-ghost btn-sm"
            style={{ padding: '2px 7px', fontSize: 11.5 }}
            title="Zoom out"
          >
            −
          </button>
          <span style={{ minWidth: 42, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.0, Math.round((z + 0.15) * 100) / 100))}
            className="btn-ghost btn-sm"
            style={{ padding: '2px 7px', fontSize: 11.5 }}
            title="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      {/* Scrollable Rendered PDF Canvas Stage */}
      {renderError ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 28 }}>📄</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--t1)' }}>Could Not Render Inline PDF</div>
          <div style={{ fontSize: 12, color: 'var(--t3)', maxWidth: 380, lineHeight: 1.5 }}>{renderError}</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
            {signedUrl && (
              <a
                href={signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary btn-sm"
                style={{ textDecoration: 'none' }}
              >
                ↗ Open Original PDF
              </a>
            )}
            {(blobUrl || signedUrl) && (
              <a
                href={blobUrl || signedUrl || undefined}
                download={fileName}
                className="btn-ghost btn-sm"
                style={{ textDecoration: 'none' }}
              >
                ⬇ Download PDF
              </a>
            )}
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            padding: 14,
            background: '#0b1120',
          }}
        />
      )}
    </div>
  );
};
