import React, { useState, useCallback } from 'react';
import { AlertCircle, X, CheckCircle } from 'lucide-react';

interface ConfirmOptions {
  title?: string;
  confirmLabel?: string;
  danger?: boolean;
}

interface ConfirmState {
  isOpen: boolean;
  message: string;
  type: 'confirm' | 'alert';
  options?: ConfirmOptions;
  resolve: (value: boolean) => void;
}

export const useConfirm = () => {
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);

  const showConfirm = useCallback((message: string, options?: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ isOpen: true, message, type: 'confirm', options, resolve });
    });
  }, []);

  const showAlert = useCallback((message: string, options?: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmState({ isOpen: true, message, type: 'alert', options, resolve });
    });
  }, []);

  const handleClose = (result: boolean) => {
    if (confirmState) {
      confirmState.resolve(result);
      setConfirmState(null);
    }
  };

  const ConfirmDialog: React.FC = () => {
    if (!confirmState || !confirmState.isOpen) return null;

    const opts = confirmState.options;
    const isDanger = opts?.danger ?? (confirmState.type === 'confirm');
    const title = opts?.title ?? (confirmState.type === 'alert' ? 'Aviso' : 'Atención');
    const confirmLabel = opts?.confirmLabel ?? (confirmState.type === 'alert' ? 'Entendido' : 'Confirmar');

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => handleClose(false)} />
        <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl animate-fade-in-up border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDanger ? 'bg-red-50 text-red-500' : 'bg-orange-100 text-orange-500'}`}>
              <AlertCircle size={24} />
            </div>
            <h3 className="text-xl font-bold font-serif text-gray-800 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-sm">{confirmState.message}</p>
          </div>
          
          <div className="flex bg-gray-50/80 p-4 gap-3 border-t border-gray-100">
            {confirmState.type === 'confirm' && (
              <button
                onClick={() => handleClose(false)}
                className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-sm"
              >
                Cancelar
              </button>
            )}
            <button
              onClick={() => handleClose(true)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-white transition-all text-sm shadow-md flex justify-center items-center gap-2 ${
                confirmState.type === 'alert'
                  ? 'bg-brand-primary hover:bg-brand-accent hover:text-brand-primary'
                  : isDanger
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-brand-primary hover:bg-brand-accent hover:text-brand-primary'
              }`}
            >
              <CheckCircle size={16} /> {confirmLabel}
            </button>
          </div>
          
          <button
            onClick={() => handleClose(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    );
  };

  return { showConfirm, showAlert, ConfirmDialog };
};
