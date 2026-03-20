import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastEventDetail {
  message: string;
  type: ToastType;
}

export const toast = {
  success: (message: string) => window.dispatchEvent(new CustomEvent<ToastEventDetail>('show-toast', { detail: { message, type: 'success' } })),
  error: (message: string) => window.dispatchEvent(new CustomEvent<ToastEventDetail>('show-toast', { detail: { message, type: 'error' } })),
  info: (message: string) => window.dispatchEvent(new CustomEvent<ToastEventDetail>('show-toast', { detail: { message, type: 'info' } })),
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<(ToastEventDetail & { id: number })[]>([]);

  useEffect(() => {
    const handleToast = (e: CustomEvent<ToastEventDetail>) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { ...e.detail, id }]);
      
      const duration = e.detail.type === 'error' ? 5000 : 3500;
      
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    };

    window.addEventListener('show-toast', handleToast as EventListener);
    return () => window.removeEventListener('show-toast', handleToast as EventListener);
  }, []);

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 sm:top-24 sm:right-6 sm:left-auto sm:translate-x-0 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`pointer-events-auto flex items-start gap-3 w-[90vw] sm:w-96 p-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] animate-scale-in border ${
          t.type === 'success' ? 'bg-white border-green-100 text-gray-800' :
          t.type === 'error' ? 'bg-white border-red-100 text-gray-800' :
          'bg-white border-blue-100 text-gray-800'
        }`}>
          <div className={`p-2 rounded-xl flex-shrink-0 ${
            t.type === 'success' ? 'bg-green-50 text-green-500' :
            t.type === 'error' ? 'bg-red-50 text-red-500' :
            'bg-blue-50 text-blue-500'
          }`}>
             {t.type === 'success' && <CheckCircle size={24} />}
             {t.type === 'error' && <AlertCircle size={24} />}
             {t.type === 'info' && <Info size={24} />}
          </div>
          <p className="font-bold text-sm leading-snug flex-1 pt-1">{t.message}</p>
          <button 
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} 
            className="text-gray-300 hover:text-gray-600 transition-colors p-1"
          >
             <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
