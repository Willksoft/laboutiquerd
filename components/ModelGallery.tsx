import React, { useState } from 'react';
import { ArrowLeft, Filter, MousePointerClick, User, MapPin, X, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TShirtPreset } from '../types';
import TShirtMockup2D from './TShirtMockup2D';
import { usePresets } from '../hooks/usePresets';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

interface ModelGalleryProps {
  onBack: () => void;
  onSelect: (preset: TShirtPreset, guestName?: string, guestRoom?: string) => void;
}

// Subcomponente para manejar el estado de hover individualmente
const GalleryCard: React.FC<{ preset: TShirtPreset; onSelect: (p: TShirtPreset) => void }> = ({ preset, onSelect }) => {
  const { t, i18n } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

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

  // Determinar color de fondo para la camiseta: si es blanca, usar fondo oscuro
  const isWhite = preset.baseColorValue.toLowerCase() === '#ffffff';
  const cardBg = isWhite ? 'bg-gray-200' : 'bg-gray-50';

  return (
    <div 
      onClick={() => { if (!preset.isSoldOut) onSelect(preset) }}
      onMouseEnter={() => !preset.isSoldOut && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full transform ${preset.isSoldOut ? 'opacity-80 grayscale cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer'}`}
    >
        {/* Preview Area */}
        <div className={`${cardBg} p-8 relative flex items-center justify-center aspect-[4/5] overflow-hidden transition-colors`}>
          
          {/* Hover Overlay - Indicador sutil */}
          <div className="absolute inset-0 bg-brand-primary/0 group-hover:bg-brand-primary/10 transition-colors z-20 flex items-center justify-center pointer-events-none">
              <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-brand-primary px-4 py-2 rounded-full font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-all flex items-center gap-2">
                <MousePointerClick size={16} /> {t('Editar')}
              </span>
          </div>

          {/* Agotado Overlay */}
          {preset.isSoldOut && (
              <div className="absolute inset-0 bg-white/60 z-30 flex items-center justify-center backdrop-blur-[2px]">
                 <span className="bg-red-500 text-white font-black px-4 py-2 uppercase tracking-widest rounded-xl shadow-lg border-2 border-white -rotate-12">
                     Agotado
                 </span>
              </div>
          )}

          {/* Tags */}
          {preset.tags && !preset.isSoldOut && (
            <div className="absolute top-3 left-3 flex gap-1 z-10">
                {preset.tags.map(tag => (
                  <span key={tag} className="bg-brand-accent text-brand-primary text-[10px] font-bold px-2 py-1 rounded-sm uppercase shadow-sm">
                    {t(tag)}
                  </span>
                ))}
            </div>
          )}
          
          {/* The Mockup */}
          <div className="w-full h-full transform group-hover:scale-105 transition-transform duration-500 flex items-center justify-center pointer-events-none">
              <TShirtMockup2D 
                color={preset.baseColorValue}
                logoStyle={preset.logoStyle}
                logoColor={preset.defaultLogoColor}
                className="w-4/5 h-4/5 transition-all duration-300 pointer-events-none drop-shadow-lg"
              />
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-grow bg-white border-t border-gray-50">
          <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-brand-primary leading-tight">{getTranslatedText(preset, 'name')}</h3>
              {preset.logoStyle === 'dominican' && (
                <span title={t('Edición Dominicana')} className="text-2xl">🇩🇴</span>
              )}
          </div>
          <p className="text-sm text-gray-500 line-clamp-2">{getTranslatedText(preset, 'description')}</p>
        </div>
    </div>
  );
};

const ModelGallery: React.FC<ModelGalleryProps> = ({ onBack, onSelect }) => {
  const { t } = useTranslation();
  const [activeColorFilter, setActiveColorFilter] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<TShirtPreset | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestRoom, setGuestRoom] = useState('');
  const [nameError, setNameError] = useState(false);

  useBodyScrollLock(!!selectedPreset);

  const { presets } = usePresets();

  // Extract unique colors for the filter (only from visible presets)
  const visiblePresets = presets.filter(p => p.isVisible !== false);
  
  const uniqueColors = Array.from(new Set(visiblePresets.map(p => p.baseColorName)))
    .map(name => {
      const preset = visiblePresets.find(p => p.baseColorName === name);
      return { name, value: preset?.baseColorValue || '#000' };
    });

  const filteredPresets = activeColorFilter 
    ? visiblePresets.filter(p => p.baseColorName === activeColorFilter)
    : visiblePresets;

  const handleCardSelect = (preset: TShirtPreset) => {
    setSelectedPreset(preset);
    setGuestName('');
    setGuestRoom('');
    setNameError(false);
  };

  const handleConfirm = () => {
    if (!guestName.trim()) {
      setNameError(true);
      return;
    }
    if (selectedPreset) {
      onSelect(selectedPreset, guestName.trim(), guestRoom.trim());
      setSelectedPreset(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedPreset(null);
    setNameError(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto">
       <button 
         onClick={onBack}
         className="mb-6 flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors"
       >
         <ArrowLeft size={20} /> {t('Volver a Productos')}
       </button>
       
       <div className="text-center mb-10">
         <h1 className="text-4xl font-serif font-bold text-brand-primary mb-2">{t('Galería de Estilos')}</h1>
         <p className="text-lg text-gray-600 max-w-2xl mx-auto">
           {t('Pasa el cursor para ver la espalda. Toca para editar.')}
         </p>
       </div>

       {/* Filter Bar */}
       <div className="flex flex-col items-center mb-12 space-y-3">
         <span className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <Filter size={14} /> {t('Filtrar por color')}
         </span>
         <div className="flex flex-wrap justify-center gap-3">
            <button 
               onClick={() => setActiveColorFilter(null)}
               className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                 activeColorFilter === null 
                 ? 'bg-brand-primary text-white shadow-lg' 
                 : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
               }`}
            >
              {t('Todos')}
            </button>
            {uniqueColors.map(c => (
              <button
                key={c.name}
                onClick={() => setActiveColorFilter(activeColorFilter === c.name ? null : c.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${
                    activeColorFilter === c.name 
                    ? 'ring-2 ring-brand-primary ring-offset-1 border-transparent bg-white shadow-md' 
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <span 
                  className="w-4 h-4 rounded-full border border-gray-100 shadow-sm" 
                  style={{ backgroundColor: c.value }}
                ></span>
                <span className="text-xs font-medium text-gray-700">{t(c.name)}</span>
              </button>
            ))}
         </div>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPresets.map((preset) => (
             <GalleryCard key={preset.id} preset={preset} onSelect={handleCardSelect} />
          ))}
       </div>

       {/* Guest Info Modal */}
       {selectedPreset && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
           <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
           <div 
             className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in"
             onClick={(e) => e.stopPropagation()}
           >
             {/* Modal Header */}
             <div className="bg-gradient-to-r from-brand-primary to-brand-primary/90 p-5 text-white relative">
               <button onClick={handleCloseModal} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
                 <X size={20} />
               </button>
               <h3 className="text-xl font-serif font-bold">{t('Bienvenido')}</h3>
               <p className="text-white/80 text-sm mt-1">{t('Ingresa tus datos para personalizar tu camiseta')}</p>
             </div>

             {/* Selected Model Preview */}
             <div className="flex items-center gap-4 px-5 py-4 bg-gray-50 border-b border-gray-100">
               <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                 <TShirtMockup2D 
                   color={selectedPreset.baseColorValue}
                   logoStyle={selectedPreset.logoStyle}
                   logoColor={selectedPreset.defaultLogoColor}
                   className="w-12 h-12"
                 />
               </div>
               <div>
                 <p className="font-bold text-brand-primary text-sm">{selectedPreset.name}</p>
                 <p className="text-xs text-gray-500">{t('Modelo seleccionado')}</p>
               </div>
             </div>

             {/* Form */}
             <div className="p-5 space-y-4">
               <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5 tracking-wide flex items-center gap-1.5">
                   <User size={12} /> {t('Nombre')} <span className="text-red-500">*</span>
                 </label>
                 <input
                   type="text"
                   value={guestName}
                   onChange={(e) => { setGuestName(e.target.value); setNameError(false); }}
                   placeholder={t('Nombre del huésped...')}
                   className={`w-full p-3 text-sm border rounded-xl focus:ring-2 focus:ring-brand-accent focus:outline-none bg-gray-50 transition-colors ${
                     nameError ? 'border-red-400 bg-red-50' : 'border-gray-200'
                   }`}
                   autoFocus
                 />
                 {nameError && (
                   <p className="text-red-500 text-[11px] mt-1 font-medium">* {t('Ingresa tu nombre para continuar')}</p>
                 )}
               </div>

               <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1.5 tracking-wide flex items-center gap-1.5">
                   <MapPin size={12} /> {t('Habitación')}
                 </label>
                 <input
                   type="text"
                   value={guestRoom}
                   onChange={(e) => setGuestRoom(e.target.value)}
                   placeholder={t('Ej: Room 4210')}
                   className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:outline-none bg-gray-50"
                   onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                 />
               </div>
             </div>

             {/* Action */}
             <div className="px-5 pb-5">
               <button
                 onClick={handleConfirm}
                 className="w-full py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
               >
                 {t('Comenzar Diseño')} <ArrowRight size={18} />
               </button>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default ModelGallery;