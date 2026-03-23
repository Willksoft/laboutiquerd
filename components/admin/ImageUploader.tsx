import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadFile } from '../../lib/appwrite';

interface ImageUploaderProps {
  currentUrl: string;
  onImageChange: (url: string) => void;
  className?: string;
  compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentUrl, onImageChange, className = '', compact = false }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/') && !file.type.includes('svg')) {
      setError('Solo se permiten imágenes (JPG, PNG, SVG, WebP)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Máximo 10MB por imagen');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await uploadFile(file);
      const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
      const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
      const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_ID;
      const url = `${endpoint}/storage/buckets/${bucketId}/files/${response.$id}/view?project=${projectId}`;
      onImageChange(url);
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
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
    // Reset input so the same file can be selected again
    e.target.value = '';
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {currentUrl ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
            <img src={currentUrl} alt="preview" className="w-full h-full object-cover" />
            <button
              onClick={() => onImageChange('')}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
            <ImageIcon size={20} className="text-gray-400" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors disabled:opacity-50 text-left"
          >
            {uploading ? (
              <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Subiendo...</span>
            ) : currentUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
      </div>
    );
  }

  return (
    <div className={className}>
      {currentUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
          <img src={currentUrl} alt="preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-brand-primary px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:bg-gray-50"
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
  );
};

export default ImageUploader;
