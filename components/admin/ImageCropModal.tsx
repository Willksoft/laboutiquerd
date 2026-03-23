/**
 * ImageCropModal
 * Fixed-size crop window — the user PANS and ZOOMS the image inside it.
 * On confirm, renders the visible crop area to a canvas and returns a Blob.
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Check, X } from 'lucide-react';

interface ImageCropModalProps {
  src: string;               // data URL of the selected image
  aspectRatio?: number;      // w / h, default 1 (square)
  cropSize?: number;         // px of the crop window on screen, default 380
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

const CROP_PX = 380; // Fixed crop window size shown on screen

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  src,
  aspectRatio = 1,
  cropSize = CROP_PX,
  onConfirm,
  onCancel,
}) => {
  const cropW = cropSize;
  const cropH = cropSize / aspectRatio;

  // Image natural dimensions
  const [imgNatW, setImgNatW] = useState(1);
  const [imgNatH, setImgNatH] = useState(1);

  // State: where is the top-left of the image relative to the crop window
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [scale, setScale] = useState(1);

  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute initial scale to cover the crop area
  const computeMinScale = useCallback((nw: number, nh: number) => {
    return Math.max(cropW / nw, cropH / nh);
  }, [cropW, cropH]);

  // Load image and set natural size + initial centering
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      setImgNatW(nw);
      setImgNatH(nh);
      const minS = computeMinScale(nw, nh);
      const initScale = minS * 1.05; // slight zoom so entire crop window fills
      setScale(initScale);
      // Center image in crop window
      setOffsetX((cropW - nw * initScale) / 2);
      setOffsetY((cropH - nh * initScale) / 2);
    };
    img.src = src;
  }, [src, cropW, cropH, computeMinScale]);

  // Clamp offset so image always covers the crop window
  const clamp = useCallback((ox: number, oy: number, s: number) => {
    const imgW = imgNatW * s;
    const imgH = imgNatH * s;
    const minOx = cropW - imgW;
    const minOy = cropH - imgH;
    return {
      x: Math.min(0, Math.max(minOx, ox)),
      y: Math.min(0, Math.max(minOy, oy)),
    };
  }, [imgNatW, imgNatH, cropW, cropH]);

  // --- Mouse drag ---
  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffsetX(ox => {
      setOffsetY(oy => {
        const c = clamp(ox + dx, oy + dy, scale);
        setOffsetX(c.x);
        setOffsetY(c.y);
        return c.y;
      });
      return ox; // will be overridden by nested set
    });
  }, [clamp, scale]);
  const onMouseUp = () => { dragging.current = false; };

  // --- Touch drag ---
  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!dragging.current) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - lastPos.current.x;
    const dy = e.touches[0].clientY - lastPos.current.y;
    lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setOffsetX(ox => clamp(ox + dx, offsetY + dy, scale).x);
    setOffsetY(oy => clamp(offsetX + dx, oy + dy, scale).y);
  }, [clamp, scale, offsetX, offsetY]);
  const onTouchEnd = () => { dragging.current = false; };

  // --- Scroll to zoom ---
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.93;
    setScale(s => {
      const minS = computeMinScale(imgNatW, imgNatH);
      const newS = Math.min(Math.max(s * factor, minS), minS * 5);
      // Zoom toward cursor
      const rect = containerRef.current?.getBoundingClientRect();
      const mx = rect ? e.clientX - rect.left : cropW / 2;
      const my = rect ? e.clientY - rect.top : cropH / 2;
      setOffsetX(ox => {
        setOffsetY(oy => {
          const nx = mx - (mx - ox) * (newS / s);
          const ny = my - (my - oy) * (newS / s);
          const c = clamp(nx, ny, newS);
          setOffsetX(c.x);
          setOffsetY(c.y);
          return c.y;
        });
        return ox;
      });
      return newS;
    });
  }, [computeMinScale, imgNatW, imgNatH, clamp, cropW, cropH]);

  // Register global listeners
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', onWheel, { passive: false });
      el.addEventListener('touchmove', onTouchMove, { passive: false });
      el.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (el) {
        el.removeEventListener('wheel', onWheel);
        el.removeEventListener('touchmove', onTouchMove);
        el.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [onMouseMove, onWheel, onTouchMove]);

  // --- Zoom buttons ---
  const zoom = (dir: 1 | -1) => {
    const factor = dir > 0 ? 1.15 : 0.87;
    setScale(s => {
      const minS = computeMinScale(imgNatW, imgNatH);
      const newS = Math.min(Math.max(s * factor, minS), minS * 5);
      const c = clamp(offsetX + (imgNatW * s - imgNatW * newS) / 2,
                      offsetY + (imgNatH * s - imgNatH * newS) / 2, newS);
      setOffsetX(c.x);
      setOffsetY(c.y);
      return newS;
    });
  };

  // --- Reset ---
  const reset = () => {
    const minS = computeMinScale(imgNatW, imgNatH);
    const s = minS * 1.05;
    setScale(s);
    setOffsetX((cropW - imgNatW * s) / 2);
    setOffsetY((cropH - imgNatH * s) / 2);
  };

  // --- Confirm: draw to canvas and return Blob ---
  const confirm = () => {
    // Output at 2x for sharpness
    const OUT = 1200;
    const outH = Math.round(OUT / aspectRatio);
    const canvas = document.createElement('canvas');
    canvas.width = OUT;
    canvas.height = outH;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      // What part of the natural image is visible in the crop window?
      // crop window top-left in image-pixel coords:
      const srcX = -offsetX / scale;
      const srcY = -offsetY / scale;
      const srcW = cropW / scale;
      const srcH = cropH / scale;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUT, outH);
      canvas.toBlob(blob => {
        if (blob) onConfirm(blob);
      }, 'image/jpeg', 0.92);
    };
    img.src = src;
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Recortar imagen</h3>
            <p className="text-xs text-gray-400 mt-0.5">Arrastra para reposicionar · Scroll o botones para zoom</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Crop area */}
        <div className="flex justify-center p-6">
          <div
            ref={containerRef}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className="relative overflow-hidden rounded-2xl ring-2 ring-brand-primary/30 shadow-inner bg-gray-900 select-none cursor-grab active:cursor-grabbing"
            style={{ width: cropW, height: cropH, maxWidth: '100%' }}
          >
            {/* The image */}
            <img
              src={src}
              alt="crop"
              draggable={false}
              style={{
                position: 'absolute',
                left: offsetX,
                top: offsetY,
                width: imgNatW * scale,
                height: imgNatH * scale,
                maxWidth: 'none',
                userSelect: 'none',
              }}
            />
            {/* Corner guides */}
            {['top-0 left-0','top-0 right-0','bottom-0 left-0','bottom-0 right-0'].map(pos => (
              <div key={pos} className={`absolute ${pos} w-6 h-6 pointer-events-none`}>
                <div className={`absolute ${pos.includes('left') ? 'left-0' : 'right-0'} ${pos.includes('top') ? 'top-0' : 'bottom-0'} w-5 h-[3px] bg-white/90 rounded-full`} />
                <div className={`absolute ${pos.includes('left') ? 'left-0' : 'right-0'} ${pos.includes('top') ? 'top-0' : 'bottom-0'} h-5 w-[3px] bg-white/90 rounded-full`} />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => zoom(-1)}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              title="Alejar"
            >
              <ZoomOut size={18} />
            </button>
            <button
              type="button"
              onClick={() => zoom(1)}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
              title="Acercar"
            >
              <ZoomIn size={18} />
            </button>
            <button
              type="button"
              onClick={reset}
              className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors"
              title="Restablecer"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirm}
              className="px-5 py-2 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-primary/90 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Check size={16} /> Aplicar recorte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
