import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { Product } from '../types';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { t, i18n } = useTranslation();
  useBodyScrollLock();

  const getTranslatedText = (obj: any, field: string) => {
      if (i18n.language.startsWith('en')) {
         const enField = field === 'name' ? 'nameEn' : 'descEn';
         if (obj[enField]) return obj[enField];
      } else if (i18n.language.startsWith('fr')) {
         const frField = field === 'name' ? 'nameFr' : 'descFr';
         if (obj[frField]) return obj[frField];
      }
      return t(obj[field] || '');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-glass-lg w-full max-w-4xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] relative animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full text-gray-400 hover:text-brand-primary transition-all z-20 shadow-sm"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-50 relative">
          <img 
            src={product.image} 
            alt={getTranslatedText(product, 'name')} 
            className="w-full h-full object-cover"
          />
          {product.tags && (
             <div className="absolute top-4 left-4 flex gap-2">
                {product.tags.map(tag => (
                  <span key={tag} className="badge badge-gold backdrop-blur-sm px-3 py-1">
                    {t(tag)}
                  </span>
                ))}
             </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white flex flex-col">
          <div className="mb-auto">
             <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.15em] border border-gray-200 px-2.5 py-1 rounded-full">
                   {t(product.category === 'fashion' ? 'Moda' : product.category === 'jewelry' ? 'Joyería' : 'Artesanía')}
                </span>
             </div>
             
             <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-4 tracking-tight">{getTranslatedText(product, 'name')}</h2>
             
             <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
                <span className="text-3xl font-display font-bold text-brand-primary tracking-tight">RD${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-brand-muted line-through mb-0.5">RD${product.originalPrice.toFixed(2)}</span>
                )}
             </div>

             <h3 className="font-display font-semibold text-brand-primary mb-2 text-sm">{t('Descripción')}</h3>
             <p className="text-brand-muted text-sm leading-relaxed mb-6">
               {getTranslatedText(product, 'description')}
               <br/><br/>
               {t('Este artículo es parte de nuestra colección exclusiva. Disponible únicamente para visualización en el catálogo digital.')}
             </p>
          </div>

          <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100 text-center">
             <p className="text-sm text-brand-primary font-semibold">
               {t('¿Te interesa este producto?')}
             </p>
             <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
               {t('Visítanos en nuestra tienda física o contáctanos para consultar disponibilidad.')}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
