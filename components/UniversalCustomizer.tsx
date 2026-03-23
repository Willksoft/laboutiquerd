import React, { useState } from 'react';
import { ArrowLeft, Type, Palette, Check, Plus, Tag, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Product, CartItem, DesignConfig } from '../types';
import { toast } from './Toast';

interface UniversalCustomizerProps {
  product: Product;
  initialItem?: CartItem;
  onBack: () => void;
  onAddToCart: (item: CartItem, finish?: boolean) => void;
}

// Configuración de la zona de impresión según el ID del producto
// Esto simula que cada producto tiene su propia lógica de posición
const PRODUCT_ZONES: Record<string, { top: string; left: string; width: string; fontSize: string; label: string; maxChars: number; darkTextDefault: boolean }> = {
  'p1': { top: '45%', left: '50%', width: '60%', fontSize: '1.5rem', label: 'Centro de la Taza', maxChars: 20, darkTextDefault: true }, // Taza
  'p6': { top: '35%', left: '50%', width: '40%', fontSize: '1.2rem', label: 'Frente de la Gorra', maxChars: 12, darkTextDefault: false }, // Gorra
  'p7': { top: '60%', left: '50%', width: '50%', fontSize: '1.8rem', label: 'Bolsillo Frontal', maxChars: 15, darkTextDefault: false }, // Mochila
  'p8': { top: '50%', left: '50%', width: '30%', fontSize: '2rem', label: 'Cuerpo del Termo', maxChars: 10, darkTextDefault: true }, // Termo
  'default': { top: '50%', left: '50%', width: '50%', fontSize: '1.5rem', label: 'Zona Personalizable', maxChars: 20, darkTextDefault: true }
};

const FONTS = [
  { id: 'arial', label: 'Arial Bold', css: 'Arial, sans-serif' },
  { id: 'montserrat', label: 'Montserrat', css: "'Montserrat Alternates', sans-serif" },
  { id: 'dmsans', label: 'DM Sans', css: "'DM Sans', sans-serif" },
  { id: 'sheryl', label: 'Sheryl (Cursiva)', css: "'Sheryl', cursive" }, 
];

const TEXT_COLORS = [
  { name: 'Negro', value: '#000000', style: { backgroundColor: '#000000' } },
  { name: 'Blanco', value: '#ffffff', style: { backgroundColor: '#ffffff', border: '1px solid #ddd' } },
  { name: 'Dorado', value: '#ca8a04', style: { backgroundColor: '#ca8a04' } },
  { name: 'Plateado', value: '#94a3b8', style: { backgroundColor: '#94a3b8' } },
  { name: 'Rosa Neón', value: '#ec4899', style: { backgroundColor: '#ec4899' } },
  { name: 'Azul', value: '#2563EB', style: { backgroundColor: '#2563EB' } },
  { name: 'Rojo', value: '#DC2626', style: { backgroundColor: '#DC2626' } },
];

const UniversalCustomizer: React.FC<UniversalCustomizerProps> = ({ 
  product, 
  initialItem, 
  onBack, 
  onAddToCart 
}) => {
  const { t, i18n } = useTranslation();

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
  // Configuración específica para este producto
  const zoneConfig = PRODUCT_ZONES[product.id] || PRODUCT_ZONES['default'];

  const [customName, setCustomName] = useState(() => initialItem?.details?.customName || '');
  const [text, setText] = useState(() => initialItem?.details?.designs?.front?.text || '');
  const [textColor, setTextColor] = useState(() => initialItem?.details?.designs?.front?.textColor || (zoneConfig.darkTextDefault ? '#000000' : '#ffffff'));
  const [textColorName, setTextColorName] = useState(() => initialItem?.details?.designs?.front?.textColorName || (zoneConfig.darkTextDefault ? 'Negro' : 'Blanco'));
  const [fontFamily, setFontFamily] = useState(() => initialItem?.details?.designs?.front?.fontFamily || FONTS[0].css);
  const [quantity, setQuantity] = useState(() => initialItem?.quantity || 1);
  const [error, setError] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!customName.trim()) {
      setError("Por favor, asigna un nombre a tu diseño.");
      return false;
    }
    if (!text.trim()) {
      setError("El campo de texto no puede estar vacío.");
      return false;
    }
    setError(null);
    return true;
  };

  const createCartItem = (existingId?: string): CartItem => {
    // Simulamos la estructura de DesignConfig para mantener compatibilidad con el carrito
    const design: DesignConfig = {
      text,
      fontFamily,
      textColor,
      textColorName,
      textTransform: 'none',
      enabled: true
    };

    // Fecha entrega estimada simple
    const date = new Date();
    date.setDate(date.getDate() + 2); // 2 días para productos físicos
    const formattedDate = date.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' });

    return {
      id: existingId || `${product.id}-${Date.now()}`,
      name: `Custom: ${getTranslatedText(product, 'name')}`,
      price: product.price, // Precio base, sin lógica compleja de zonas por ahora
      quantity,
      type: 'product',
      details: {
        customName,
        designs: { front: design }, // Usamos 'front' como contenedor genérico
        deliveryDate: `${formattedDate}, 5:00 PM`
      }
    };
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const item = createCartItem(initialItem?.id);
    onAddToCart(item, true); 
  };

  const handleAddAnother = () => {
    if (!validateForm()) return;
    const item = createCartItem(undefined); 
    onAddToCart(item, false);
    setCustomName('');
    setText('');
    toast.success("¡Agregado! Puedes diseñar otro.");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col pt-16 md:pt-20">
      <div className="flex-grow flex flex-col md:flex-row md:h-[calc(100vh-80px)] md:overflow-hidden relative">
        
        {/* PREVIEW AREA (Left) */}
        <div className="w-full md:w-1/2 h-[45vh] min-h-[300px] md:h-full sticky top-16 md:static z-20 bg-gray-100 relative overflow-hidden flex items-center justify-center">
           <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-white/80 rounded-full hover:bg-white md:hidden z-20 shadow-sm">
             <ArrowLeft size={24} />
           </button>

           <div className="relative w-full h-full max-w-2xl max-h-2xl flex items-center justify-center">
              {/* Product Image */}
              <img 
                src={product.image} 
                alt={getTranslatedText(product, 'name')} 
                className="w-full h-full object-cover md:object-contain"
              />
              
              {/* Overlay Text Zone */}
              <div 
                className="absolute flex items-center justify-center text-center pointer-events-none p-2 border-2 border-dashed border-white/30 rounded"
                style={{
                  top: zoneConfig.top,
                  left: zoneConfig.left,
                  width: zoneConfig.width,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                 {text ? (
                   <span style={{ 
                     color: textColor, 
                     fontFamily: fontFamily, 
                     fontSize: zoneConfig.fontSize,
                     textShadow: '0px 2px 4px rgba(0,0,0,0.3)', // Sombra para legibilidad en foto
                     lineHeight: 1.2,
                     wordWrap: 'break-word',
                     fontWeight: fontFamily.includes('Arial') ? 'bold' : 'normal'
                   }}>
                     {text}
                   </span>
                 ) : (
                   <span className="text-white/50 text-sm font-bold uppercase tracking-widest bg-black/20 px-2 py-1 rounded">
                     {zoneConfig.label}
                   </span>
                 )}
              </div>
           </div>
        </div>

        {/* CONTROLS AREA (Right) */}
        <div className="w-full md:w-1/2 flex flex-col bg-white border-l border-gray-200">
           
           <div className="flex-none p-6 border-b border-gray-100 flex justify-between items-center z-10 bg-white">
              <div>
                 <h1 className="text-2xl font-black text-gray-800">{getTranslatedText(product, 'name')}</h1>
                 <p className="text-sm text-gray-500 line-clamp-2">{getTranslatedText(product, 'description')}</p>
              </div>
              <button onClick={onBack} className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg text-gray-500 font-medium transition-colors">
                <ArrowLeft size={20} /> {t('Cancelar')}
              </button>
           </div>

           <div className="flex-grow md:overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
              
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2 border border-red-100 animate-pulse">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Input Nombre */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                   <Tag size={16} /> Nombre del Diseño <span className="text-red-500">*</span>
                </label>
                <input 
                   type="text" 
                   value={customName}
                   onChange={(e) => { setCustomName(e.target.value); setError(null); }}
                   placeholder={`Ej: Mi ${product.name}`}
                   className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none bg-gray-50 font-medium"
                />
              </div>

              {/* Input Texto */}
              <div className="bg-brand-background/30 p-4 rounded-xl border border-brand-primary/10">
                 <label className="block text-sm font-bold text-brand-primary mb-3 flex items-center gap-2">
                    <Type size={16} /> Texto a Personalizar
                 </label>
                 <input 
                    type="text"
                    value={text}
                    onChange={(e) => { setText(e.target.value); setError(null); }}
                    placeholder={zoneConfig.label}
                    maxLength={zoneConfig.maxChars}
                    className="w-full p-4 text-lg border-2 border-brand-accent rounded-xl focus:outline-none focus:border-brand-primary transition-colors text-center font-bold"
                 />
                 <div className="flex justify-between mt-2 text-xs text-gray-400">
                    <span>Aparecerá en: {zoneConfig.label}</span>
                    <span>{text.length}/{zoneConfig.maxChars} caracteres</span>
                 </div>
              </div>

              {/* Fuente */}
              <div>
                <span className="text-sm font-bold text-gray-700 mb-2 block">Tipografía</span>
                <div className="grid grid-cols-2 gap-2">
                   {FONTS.map(font => (
                      <button
                        key={font.id}
                        onClick={() => setFontFamily(font.css)}
                        className={`py-3 px-3 text-sm border rounded-lg transition-all ${
                            fontFamily === font.css
                            ? 'bg-brand-primary text-white border-brand-primary shadow-md'
                            : 'bg-white text-gray-700 hover:border-gray-300'
                        }`}
                        style={{ fontFamily: font.css }}
                      >
                        {font.label}
                      </button>
                   ))}
                </div>
              </div>

              {/* Color Texto */}
              <div>
                <span className="text-sm font-bold text-gray-700 mb-2 block flex items-center gap-2">
                   <Palette size={16} /> Color del Texto
                </span>
                <div className="flex flex-wrap gap-3">
                   {TEXT_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => { setTextColor(color.value); setTextColorName(color.name); }}
                        className={`w-10 h-10 rounded-full shadow-sm transition-all flex items-center justify-center ${
                            textColor === color.value ? 'ring-2 ring-offset-2 ring-brand-primary scale-110' : 'hover:scale-105'
                        }`}
                        style={color.style}
                        title={color.name}
                      >
                        {textColor === color.value && <Check size={16} className={color.name === 'Blanco' || color.name === 'Amarillo' ? 'text-black' : 'text-white'} />}
                      </button>
                   ))}
                </div>
              </div>

              {/* Cantidad */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-bold text-gray-700 text-sm">Cantidad</span>
                  <div className="flex items-center gap-4">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow text-gray-600 font-bold hover:bg-gray-100">-</button>
                      <span className="font-mono text-lg w-6 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow text-gray-600 font-bold hover:bg-gray-100">+</button>
                  </div>
              </div>

           </div>

           {/* Footer Action */}
         <div className="flex-none p-6 border-t border-gray-100 flex justify-between items-center z-20 bg-white sticky bottom-0 md:static shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)] md:shadow-none">
            <div className="flex flex-col">
               <span className="text-gray-500 text-sm">Total ({quantity} items)</span>
               <span className="text-3xl font-bold text-brand-primary">RD${(product.price * quantity).toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddAnother} className="px-4 py-3 bg-gray-100 text-brand-primary rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                 <Plus size={20} /> <span className="hidden sm:inline">Guardar y Otro</span>
              </button>
              <button onClick={handleSave} className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2 shadow-lg">
                 <Check size={20} /> {initialItem ? 'Actualizar' : 'Finalizar'}
              </button>
            </div>
         </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalCustomizer;