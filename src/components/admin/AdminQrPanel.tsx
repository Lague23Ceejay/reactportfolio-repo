import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';


type Props = {
  /** The URL or text to encode in the QR. If you use expiring tokens, pass the token URL here. */
  value?: string;
  /** Optional label shown under the QR */
  label?: string;
};

export default function AdminQrPanel({ value = 'https://yourapp.example/', label = 'Scan to open' }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [loadingPng, setLoadingPng] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadSvg = () => {
    const svg = svgRef.current;
    if (!svg) {
      setError('SVG not found');
      return;
    }
    try {
      const svgData = new XMLSerializer().serializeToString(svg);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-branding-qr.svg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError('SVG download failed');
    }
  };

  const downloadPng = async () => {
    const svg = svgRef.current;
    if (!svg) {
      setError('SVG not found');
      return;
    }
    setLoadingPng(true);
    setError(null);

    try {
      // Serialize SVG and create object URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      // Load into image then draw to canvas
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
      });

      // Choose canvas size (2x for higher DPI)
      const size = Math.max(svg.clientWidth || 120, svg.clientHeight || 120);
      const canvas = document.createElement('canvas');
      canvas.width = size * 2;
      canvas.height = size * 2;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      // White background for QR readability
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw image scaled to canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Export PNG
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png', 0.95));
      if (!blob) throw new Error('PNG generation failed');

      const pngUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = 'portfolio-branding-qr.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(pngUrl);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PNG export failed', err);
      setError('PNG export failed (see console)');
    } finally {
      setLoadingPng(false);
    }
  };

  const handlePrint = () => {
    const svg = svgRef.current;
    if (!svg) {
      setError('SVG not found');
      return;
    }
    const svgData = new XMLSerializer().serializeToString(svg);
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Print QR</title>
      <style>body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;background:#fff}</style>
      </head><body>${svgData}</body></html>`;
    const w = window.open('', '_blank', 'noopener,noreferrer');
    if (!w) {
      setError('Unable to open print window (popup blocked)');
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
    setTimeout(() => w.print(), 250);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Actions column */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={downloadSvg}
          className="w-full py-2.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 font-mono font-semibold border border-emerald-500/20 rounded-xl text-xs transition-all duration-300 cursor-pointer cursor-target"
          data-cursor-color="#B069DB"
          aria-label="Download shareable QR as SVG"
        >
          ↓ Download Shareable QR Asset (.SVG)
        </button>

        <button
          type="button"
          onClick={downloadPng}
          disabled={loadingPng}
          className="w-full py-2.5 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-100 font-mono font-semibold border border-zinc-700 rounded-xl text-xs transition-all duration-300 cursor-pointer cursor-target disabled:opacity-60"
          data-cursor-color="#34d399"
          aria-label="Download shareable QR as PNG"
        >
          {loadingPng ? 'Preparing PNG…' : '↓ Download Shareable QR Asset (.PNG)'}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="w-full py-2.5 bg-zinc-700/40 hover:bg-zinc-700 text-zinc-100 font-mono font-semibold border border-zinc-700/30 rounded-xl text-xs transition-all duration-300 cursor-pointer cursor-target"
          data-cursor-color="#60a5fa"
          aria-label="Print QR"
        >
          🖨 Print QR
        </button>

        {error && <div className="text-xs text-rose-400 font-mono">{error}</div>}
      </div>

      {/* Preview column */}
      <div className="space-y-4">
        <div className="p-4 bg-zinc-900/30 border border-zinc-800/60 rounded-xl flex flex-col items-center justify-center gap-3 text-center">
          <div className="p-3 bg-white rounded-xl inline-block shadow-lg">
            {/* Programmatic QR as SVG (keeps same id for compatibility) */}
            <QRCodeSVG
              id="settingsExportableQRCodeSVG"
              value={value}
              size={120}
              viewBox={`0 0 120 120`}
              className="block"
              ref={svgRef as any}
              role="img"
              aria-label={`Exportable QR code for ${label}`}
            />
          </div>

          <p className="text-[10px] font-mono text-zinc-500 leading-normal max-w-45">
            Dynamic scale asset grid hook. Click download to extract the crisp master file.
          </p>
        </div>
      </div>
    </div>
  );
}
