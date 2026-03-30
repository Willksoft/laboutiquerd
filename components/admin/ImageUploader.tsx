import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadFile } from '../../lib/appwrite';
import ImageCropModal from './ImageCropModal';

interface ImageUploaderProps {
  currentUrl: string;
  onImageChange: (url: string) => void;
  className?: string;
  compact?: boolean;
  /** Aspect ratio w/h for the crop window. Default 1 (square). Use 4/3, 16/9, etc. */
  cropAspect?: number;
  /** Set false to skip crop and upload directly */
  crop?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  onImageChange,
  className = '',
  compact = false,
  cropAspect = 1,
  crop = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  // Crop modal state
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Upload a Blob (after crop) ---
  const uploadBlob = async (blob: Blob, originalName = 'image.jpg') => {
    setUploading(true);
    setError('');
    try {
      const file = new File([blob], originalName, { type: blob.type || 'image/jpeg' });
      const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
      const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
      if (!bucketId) { setError('Error de configuración: VITE_APPWRITE_BUCKET_ID no definido'); return; }
      const response = await uploadFile(file);
      const url = `${endpoint}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${projectId}`;
      onImageChange(url);
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen');
    } finally {
      setUploading(false);
    }
  };

  // --- File selected → either go to crop or upload directly ---
  const handleFile = (file: File) => {
    // Strict MIME whitelist — SVG is intentionally blocked (XSS vector via embedded scripts)
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Solo se permiten imágenes JPG, PNG, WebP o GIF. SVG no está permitido por seguridad.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { setError('Máximo 10MB por imagen'); return; }
    setError('');

    if (!crop) {
      // skip crop — read as blob and upload directly
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // convert data URL back to blob
        fetch(dataUrl).then(r => r.blob()).then(b => uploadBlob(b, file.name));
      };
      reader.readAsDataURL(file);
      return;
    }

    // Open crop modal
    const reader = new FileReader();
    reader.onload = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  // --- Crop confirmed ---
  const handleCropConfirm = (blob: Blob) => {
    setCropSrc(null);
    uploadBlob(blob);
  };

  // --- Crop cancelled ---
  const handleCropCancel = () => setCropSrc(null);

  // ==================== RENDER ====================

  return (
    <>
      {/* Crop modal (portal-like, rendered above everything) */}
      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          aspectRatio={cropAspect}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      {compact ? (
        /* ---- Compact mode ---- */
        <div className={`h-full w-full ${className}`}>
          {currentUrl ? (
            <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
              <img src={currentUrl} alt="preview" className="w-full h-full object-cover" />
              <button
                onClick={() => onImageChange('')}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full h-full rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-brand-primary/50 transition-colors gap-1"
            >
              {uploading
                ? <Loader2 size={20} className="text-brand-accent animate-spin" />
                : <>
                    <ImageIcon size={20} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-medium">Añadir</span>
                  </>
              }
            </button>
          )}
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
        </div>
      ) : (
        /* ---- Full mode ---- */
        <div className={className}>
          {currentUrl ? (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
              <img src={currentUrl} alt="preview" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-brand-primary px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50 flex items-center gap-1.5"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <><Upload size={14} /> Cambiar</>}
                </button>
                <button
                  type="button"
                  onClick={() => onImageChange('')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white px-3 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver ? 'border-brand-accent bg-brand-accent/5' : 'border-gray-300 hover:border-brand-primary/50 bg-gray-50'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={32} className="text-brand-accent animate-spin" />
                  <p className="text-sm text-gray-500 font-bold">Subiendo imagen...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                    <Upload size={24} className="text-gray-400" />
                  </div>
                  <p className="text-sm font-bold text-gray-600">Arrastra una imagen aquí</p>
                  <p className="text-xs text-gray-400">o haz clic para buscar (JPG, PNG, SVG, WebP ≤ 10MB)</p>
                </div>
              )}
            </div>
          )}
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
        </div>
      )}
    </>
  );
};

export default ImageUploader;
