import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, Move, Rotate3D, Type, Palette, Monitor, Plus, Tag, AlertCircle, LayoutTemplate, ToggleLeft, ToggleRight, LayoutGrid, Clock, CalendarCheck, Save, LogOut, XCircle } from 'lucide-react';
import { Product, CartItem, DesignConfig, LogoStyle } from '../types';
import { useTranslation } from 'react-i18next';
import TShirtMockup, { TShirtView } from './TShirtMockup';
import { toast } from './Toast';
import { usePresets } from '../hooks/usePresets';
import { MODEL_STYLES } from '../constants';

interface CustomizerProps {
  product: Product;
  initialItem?: CartItem;
  initialLogoStyle?: LogoStyle; 
  initialColor?: { name: string; value: string };
  initialLogoColor?: string;
  initialGuestName?: string;
  initialGuestRoom?: string;
  onBack: () => void; 
  onAddToCart: (item: CartItem, finish?: boolean) => void;
}

const COLORS = [
  { name: 'Blanco', value: '#ffffff', class: 'bg-white border-gray-200' },
  { name: 'Negro', value: '#1a1a1a', class: 'bg-black' },
  { name: 'Carbón', value: '#374151', class: 'bg-gray-700' },
  { name: 'Gris', value: '#9ca3af', class: 'bg-gray-400' },
  { name: 'Gris Claro', value: '#e5e7eb', class: 'bg-gray-200' },
  { name: 'Gris Oscuro', value: '#374151', class: 'bg-gray-700' },
  { name: 'Arena', value: '#d6d3d1', class: 'bg-stone-300' },
  { name: 'Azul Marino', value: '#1e3a8a', class: 'bg-blue-900' },
  { name: 'Azul Oscuro', value: '#172554', class: 'bg-blue-950' },
  { name: 'Azul Royal', value: '#2563eb', class: 'bg-blue-600' },
  { name: 'Celeste', value: '#7dd3fc', class: 'bg-sky-300' },
  { name: 'Azul Cielo', value: '#bae6fd', class: 'bg-sky-200' },
  { name: 'Turquesa', value: '#06b6d4', class: 'bg-cyan-500' },
  { name: 'Turquesa Oscuro', value: '#0e7490', class: 'bg-cyan-700' },
  { name: 'Menta', value: '#6ee7b7', class: 'bg-emerald-300' },
  { name: 'Oliva', value: '#556b2f', class: 'bg-[#556b2f]' },
  { name: 'Vino', value: '#7f1d1d', class: 'bg-red-900' },
  { name: 'Rojo', value: '#ef4444', class: 'bg-red-500' },
  { name: 'Coral', value: '#fb7185', class: 'bg-rose-400' },
  { name: 'Rosa', value: '#ec4899', class: 'bg-pink-500' },
  { name: 'Lila', value: '#d8b4fe', class: 'bg-purple-300' },
  { name: 'Naranja', value: '#f97316', class: 'bg-orange-500' },
  { name: 'Amarillo', value: '#facc15', class: 'bg-yellow-400' },
  { name: 'Mostaza', value: '#eab308', class: 'bg-yellow-600' },
  { name: 'Verde Neón', value: '#a3e635', class: 'bg-lime-400' },
  { name: 'Verde', value: '#16a34a', class: 'bg-green-600' },
];

const TEXT_COLORS = [
  { name: 'Negro', value: '#000000', style: { backgroundColor: '#000000' } },
  { name: 'Blanco', value: '#ffffff', style: { backgroundColor: '#ffffff', border: '1px solid #ddd' } },
  { name: 'Dorado', value: 'linear-gradient(to bottom, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)', style: { background: 'linear-gradient(135deg, #BF953F, #FCF6BA, #B38728)' } },
  { name: 'Plateado', value: 'linear-gradient(to bottom, #bcc6cc, #eee, #bcc6cc)', style: { background: 'linear-gradient(135deg, #bcc6cc, #eee, #9ea7ad)' } },
  { name: 'Holográfico', value: 'linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)', style: { background: 'linear-gradient(45deg, #FF0000, #FFFB00, #00FFD5, #FF00C8)' } },
  { name: 'Glitter Rosa', value: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 99%, #feada6 100%)', style: { background: 'linear-gradient(45deg, #ff9a9e, #fecfef)' } },
  { name: 'Verde Neón', value: '#a3e635', style: { backgroundColor: '#a3e635' } },
  { name: 'Naranja Neón', value: '#f97316', style: { backgroundColor: '#f97316' } },
  { name: 'Rosa', value: '#ec4899', style: { backgroundColor: '#ec4899' } },
  { name: 'Turquesa', value: '#06b6d4', style: { backgroundColor: '#06b6d4' } },
  { name: 'Turquesa Oscuro', value: '#0e7490', style: { backgroundColor: '#0e7490' } },
  { name: 'Mostaza', value: '#eab308', style: { backgroundColor: '#eab308' } },
  { name: 'Amarillo', value: '#facc15', style: { backgroundColor: '#facc15' } },
  { name: 'Rojo', value: '#DC2626', style: { backgroundColor: '#DC2626' } },
  { name: 'Vino', value: '#7f1d1d', style: { backgroundColor: '#7f1d1d' } },
  { name: 'Coral', value: '#fb7185', style: { backgroundColor: '#fb7185' } },
  { name: 'Azul Royal', value: '#2563EB', style: { backgroundColor: '#2563EB' } },
  { name: 'Azul Marino', value: '#1e3a8a', style: { backgroundColor: '#1e3a8a' } },
  { name: 'Azul Oscuro', value: '#172554', style: { backgroundColor: '#172554' } },
  { name: 'Azul Cielo', value: '#bae6fd', style: { backgroundColor: '#bae6fd' } },
  { name: 'Verde', value: '#16a34a', style: { backgroundColor: '#16a34a' } },
  { name: 'Gris', value: '#9ca3af', style: { backgroundColor: '#9ca3af' } },
  { name: 'Gris Plata', value: '#94a3b8', style: { backgroundColor: '#94a3b8' } },
  { name: 'Dorado Sólido', value: '#ca8a04', style: { backgroundColor: '#ca8a04' } },
];

const FONTS = [
  { id: 'arial', label: 'Arial Bold', css: 'Arial, sans-serif' },
  { id: 'montserrat', label: 'Montserrat', css: "'Montserrat Alternates', sans-serif" },
  { id: 'dmsans', label: 'DM Sans', css: "'DM Sans', sans-serif" },
  { id: 'sheryl', label: 'Sheryl', css: "'Sheryl', cursive" }, 
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const ZONES: { id: TShirtView; label: string }[] = [
  { id: 'front', label: 'Frente' },
  { id: 'back', label: 'Espalda' },
  { id: 'left', label: 'Manga Izq' },
  { id: 'right', label: 'Manga Der' },
];

const Customizer: React.FC<CustomizerProps> = ({ 
  product, 
  initialItem, 
  initialLogoStyle = 'classic', 
  initialColor,
  initialLogoColor,
  initialGuestName,
  initialGuestRoom,
  onBack, 
  onAddToCart 
}) => {
  const { t, i18n } = useTranslation();
  const { presets } = usePresets();

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

  const visiblePresets = presets.filter(p => p.isVisible !== false);

  const [customName, setCustomName] = useState(() => initialItem?.details?.customName || '');
  
  const [selectedColor, setSelectedColor] = useState(() => {
    if (initialItem?.details?.color) {
      return COLORS.find(c => c.name === initialItem.details?.color) || COLORS[0];
    }
    if (initialColor) {
        const match = COLORS.find(c => c.value === initialColor.value);
        return match || { ...initialColor, class: 'border-gray-200' };
    }
    return COLORS[0];
  });

  const [logoStyle, setLogoStyle] = useState<LogoStyle>(() => initialItem?.details?.logoStyle || initialLogoStyle);
  const [logoColor, setLogoColor] = useState<string | undefined>(() => initialItem?.details?.logoColor || initialLogoColor);
  const [selectedSize, setSelectedSize] = useState(() => initialItem?.details?.size || 'M');
  const [quantity, setQuantity] = useState(() => initialItem?.quantity || 1);
  const [currentView, setCurrentView] = useState<TShirtView>('front');
  const [error, setError] = useState<string | null>(null);
  const [showExitModal, setShowExitModal] = useState(false);

  // Detect if user made any changes
  const hasChanges = () => {
    if (customName.trim()) return true;
    if (selectedColor.name !== COLORS[0].name && !initialColor) return true;
    if (logoColor) return true;
    const hasAnyText = Object.values(designs).some((d: DesignConfig) => d.text?.trim());
    if (hasAnyText) return true;
    const hasExtraZones = Object.entries(designs).some(([key, d]) => key !== 'front' && (d as DesignConfig).enabled);
    if (hasExtraZones) return true;
    return false;
  };

  const handleBack = () => {
    if (hasChanges()) {
      setShowExitModal(true);
    } else {
      onBack();
    }
  };

  const handleSaveDraft = () => {
    // Save current state to localStorage as draft
    const draft = {
      productId: product.id,
      customName,
      color: selectedColor,
      logoStyle,
      logoColor,
      size: selectedSize,
      quantity,
      designs,
      timestamp: Date.now()
    };
    const drafts = JSON.parse(localStorage.getItem('customizer_drafts') || '[]');
    drafts.push(draft);
    localStorage.setItem('customizer_drafts', JSON.stringify(drafts));
    setShowExitModal(false);
    onBack();
  };
  
  const defaultDesign: DesignConfig = { 
      text: '', 
      fontFamily: FONTS[0].css, 
      textColor: TEXT_COLORS[0].value, 
      textColorName: TEXT_COLORS[0].name, 
      textTransform: 'none', 
      enabled: false 
  };
  
  const [designs, setDesigns] = useState<Record<string, DesignConfig>>(() => {
    if (initialItem?.details?.designs) {
      return initialItem.details.designs;
    }
    return {
      front: { ...defaultDesign, enabled: true },
      back: { ...defaultDesign },
      left: { ...defaultDesign },
      right: { ...defaultDesign }
    };
  });

  // Calculate Active Zones and Dynamic Price
  const activeZonesCount = Object.values(designs).filter((d: DesignConfig) => d.enabled).length;
  const currentPrice = activeZonesCount > 2 ? product.price * 2 : product.price;

  const updateDesign = <K extends keyof DesignConfig>(field: K, value: DesignConfig[K]) => {
    setDesigns(prev => ({
      ...prev,
      [currentView]: {
        ...prev[currentView],
        [field]: value
      }
    }));
    if (error) setError(null);
  };

  const currentDesign = designs[currentView] || defaultDesign;
  
  const getViewLabel = (view: string) => {
      switch(view) {
          case 'front': return 'Frente';
          case 'back': return 'Espalda';
          case 'left': return 'Manga Izq';
          case 'right': return 'Manga Der';
          default: return view;
      }
  };

  const handleManualViewChange = (view: TShirtView) => {
    setCurrentView(view);
  };

  const validateForm = (): boolean => {
    if (!customName.trim()) {
      setError("Por favor, asigna un nombre a este diseño (ej: 'Camiseta Papá') para identificarlo.");
      return false;
    }
    const hasActiveContent = Object.values(designs).some((d: DesignConfig) => d.enabled && d.text.trim().length > 0);
    if (!hasActiveContent) {
      setError("No has añadido texto en ninguna zona activada. Activa una zona y escribe algo.");
      return false;
    }
    setError(null);
    return true;
  };

  // --- LOGICA DE FECHA DE ENTREGA ---
  const calculateDeliveryDate = (): Date => {
    const date = new Date();
    date.setHours(date.getHours() + 1); // 1. Regla: 1 hora después

    // Helper para verificar si es Lunes(1), Miercoles(3), Viernes(5)
    const isWorkingDay = (d: Date) => [1, 3, 5].includes(d.getDay());
    
    // Helper para verificar horario (9:00 - 19:30)
    const isWorkingHours = (d: Date) => {
       const h = d.getHours();
       const m = d.getMinutes();
       // Antes de las 9am?
       if (h < 9) return false;
       // Despues de las 7:30pm (19:30)?
       if (h > 19 || (h === 19 && m > 30)) return false;
       return true;
    };

    let safeGuard = 0;
    while(safeGuard < 100) { // Evitar loop infinito
        safeGuard++;
        
        // Si no es dia laborable O no es hora laborable
        if (!isWorkingDay(date) || !isWorkingHours(date)) {
            // Si es tarde (>= 19:30), pasar al dia siguiente a las 9am
            const h = date.getHours();
            const m = date.getMinutes();
            if (h > 19 || (h === 19 && m > 30)) {
                date.setDate(date.getDate() + 1);
                date.setHours(9, 0, 0, 0);
            } 
            // Si es muy temprano (< 9am), poner a las 9am del mismo dia
            else if (h < 9) {
                date.setHours(9, 0, 0, 0);
            }
            // Si es un dia no laborable (ej: martes), pasar al dia siguiente 9am
            else if (!isWorkingDay(date)) {
                date.setDate(date.getDate() + 1);
                date.setHours(9, 0, 0, 0);
            }
        } else {
            break; // Fecha valida encontrada
        }
    }
    return date;
  };

  const createCartItem = (existingId?: string): CartItem => {
    const zones = Object.values(designs).filter((d: DesignConfig) => d.enabled).length;
    const finalItemPrice = zones > 2 ? product.price * 2 : product.price;

    // Calcular fecha
    const deliveryDateObj = calculateDeliveryDate();
    const formattedDate = deliveryDateObj.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long' });
    const formattedTime = deliveryDateObj.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit', hour12: true });

    return {
      id: existingId || `${product.id}-${Date.now()}`,
      name: `Custom: ${product.name}`,
      price: finalItemPrice,
      quantity,
      type: 'product',
      details: {
        customName: customName,
        color: selectedColor.name,
        size: selectedSize,
        logoStyle: logoStyle,
        logoColor: logoColor,
        designs: designs,
        deliveryDate: `${formattedDate}, ${formattedTime}`,
        clientName: initialGuestName || '',
        room: initialGuestRoom || ''
      }
    };
  };

  const resetState = () => {
    setCustomName('');
    setDesigns({
      front: { ...defaultDesign, enabled: true },
      back: { ...defaultDesign },
      left: { ...defaultDesign },
      right: { ...defaultDesign }
    });
    setQuantity(1);
    setCurrentView('front');
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
    resetState();
    toast.success("¡Diseño guardado en el carrito! Ahora puedes crear el siguiente.");
  };

  return (
    <div className="fixed inset-0 top-[64px] bg-[#f5f5f7] flex overflow-hidden z-30">
        
        {/* ═══════════════ CANVAS / PREVIEW AREA ═══════════════ */}
        <div className="flex-grow h-full flex flex-col relative">
          
          {/* Top bar over canvas */}
          <div className="flex-none flex items-center justify-between px-5 py-2 bg-white/80 backdrop-blur-sm border-b border-gray-200/60 z-10">
             <button onClick={handleBack} className="flex items-center gap-1.5 text-gray-500 hover:text-brand-primary font-medium transition-colors text-sm">
                <ArrowLeft size={16} />
                {t('Volver a la Galería')}
             </button>
             <div className="flex items-center gap-3">
                <span className="text-sm font-serif font-bold text-brand-primary">{product.name}</span>
                <span className="text-[10px] font-bold bg-brand-accent/20 px-2 py-0.5 rounded text-brand-primary uppercase">
                   {logoStyle === 'classic' ? t('Clásico') : t('Dominicano')}
                </span>
             </div>
          </div>

          {/* T-Shirt Preview */}
          <div className="flex-grow flex items-center justify-center p-4 md:p-6 relative">
             <div className="relative w-full h-full flex items-center justify-center" style={{ maxWidth: '700px', maxHeight: '700px' }}>
               <TShirtMockup 
                 color={selectedColor.value} 
                 view={currentView}
                 designs={designs} 
                 logoStyle={logoStyle}
                 logoColor={logoColor}
                 className="w-full h-full object-contain drop-shadow-2xl filter transition-all duration-500" 
               />
             </div>
          </div>

          {/* Zone tabs at bottom of canvas */}
          <div className="flex-none flex items-center justify-center gap-1 pb-3">
            {ZONES.map((zone) => {
              const isEnabled = designs[zone.id].enabled;
              const isSelected = currentView === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => handleManualViewChange(zone.id)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-brand-primary text-white shadow-md' 
                      : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {isEnabled && <Check size={10} className={isSelected ? 'text-brand-accent' : 'text-green-500'} strokeWidth={3} />}
                  {zone.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════════════ RIGHT SIDEBAR ═══════════════ */}
        <div className="w-[320px] min-w-[320px] h-full flex flex-col bg-white border-l border-gray-200 shadow-[-4px_0_20px_-5px_rgba(0,0,0,0.08)]">
          
          {/* Scrollable sidebar content */}
          <div className="flex-grow overflow-y-auto custom-scrollbar min-h-0">
            <div className="p-4 space-y-3">

              {error && (
                <div className="bg-red-50 text-red-600 p-2 rounded-lg text-xs flex items-start gap-2 border border-red-100">
                  <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Price Rule */}
              <div className={`p-2 rounded-lg text-[10px] leading-snug border ${activeZonesCount > 2 ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-blue-50/60 border-blue-100 text-blue-700'}`}>
                  <span className="font-bold">{t('Regla de Precio')}:</span>{' '}
                  ≤2 zonas = <span className="font-bold">RD${product.price}</span> | {'>'}2 = <span className="font-bold">RD${product.price * 2}</span>
                  <span className="ml-1 font-bold">[{activeZonesCount}]</span>
                  {activeZonesCount > 2 && <span className="ml-1 bg-yellow-200 px-1 rounded text-[9px] uppercase font-bold">{t('Precio Doble')}</span>}
              </div>

              {/* Template Models */}
              {visiblePresets.length > 0 && (
                 <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wide">{t('Plantilla Base')}</label>
                    <div className="grid grid-cols-2 gap-2">
                       {visiblePresets.map(preset => (
                          <button
                             key={preset.id}
                             onClick={() => {
                                 if (preset.isSoldOut) return;
                                 setLogoStyle(preset.logoStyle);
                                 setSelectedColor({
                                    name: preset.baseColorName,
                                    value: preset.baseColorValue,
                                    class: 'border-gray-200'
                                 });
                                 setLogoColor(preset.defaultLogoColor);
                                 if (error) setError(null);
                             }}
                             className={`w-full flex flex-col items-center gap-1 p-2 rounded-lg border transition-all ${
                                preset.isSoldOut ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-brand-accent'
                             } ${
                                selectedColor.name === preset.baseColorName && logoStyle === preset.logoStyle ? 'border-brand-primary bg-brand-background/30 ring-1 ring-brand-primary' : 'border-gray-100'
                             }`}
                          >
                             <div className="w-8 h-8 rounded-full shadow-sm mb-1" style={{ backgroundColor: preset.baseColorValue }}></div>
                             <span className="text-[9px] font-bold text-gray-600 text-center leading-tight line-clamp-2">{getTranslatedText(preset, 'name')}</span>
                             {preset.isSoldOut && <span className="text-[8px] uppercase font-black text-red-500">{t('Agotado')}</span>}
                          </button>
                       ))}
                    </div>
                 </div>
              )}

              {/* Logo Style */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wide">{t('Estilo de Logo')}</label>
                <div className="space-y-1">
                   {MODEL_STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => {
                            setLogoStyle(style.id);
                            if (style.id === 'dominican') setLogoColor(undefined);
                        }}
                        className={`w-full flex items-center gap-2 p-1.5 rounded-lg border transition-all ${
                          logoStyle === style.id 
                          ? 'border-brand-primary bg-brand-background/30 ring-1 ring-brand-primary' 
                          : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                         <img src={style.img} alt={style.label} className="h-5 w-auto object-contain" style={style.id === 'classic' ? { filter: 'brightness(0)' } : undefined} />
                         <span className={`text-xs font-bold ${logoStyle === style.id ? 'text-brand-primary' : 'text-gray-600'}`}>{style.label}</span>
                      </button>
                   ))}
                </div>
              </div>

              {/* Design Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">
                   {t('Nombre del Diseño')} <span className="text-red-500">*</span>
                </label>
                <input 
                   type="text" 
                   value={customName}
                   onChange={(e) => {
                     setCustomName(e.target.value);
                     if (error) setError(null);
                   }}
                   placeholder={t('Ej: Camiseta Cumpleaños Papá')}
                   className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none bg-gray-50"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wide">{t('Color de Base')}</label>
                <div className="flex flex-wrap gap-1">
                  {COLORS.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full border transition-all relative ${color.class} ${
                        selectedColor.name === color.name ? 'ring-2 ring-offset-1 ring-brand-primary border-transparent scale-110' : 'border-gray-200 hover:scale-105'
                      }`}
                      title={color.name}
                    >
                      {selectedColor.name === color.name && <Check size={10} className={`absolute inset-0 m-auto ${color.value === '#ffffff' ? 'text-brand-primary' : 'text-white'}`}/>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo Color */}
              {logoStyle === 'classic' && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-wide">{t('Color del Logo')}</label>
                  <div className="flex flex-wrap gap-1 items-center">
                    <button
                      onClick={() => setLogoColor(undefined)}
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full border transition-all ${
                        !logoColor 
                          ? 'border-brand-primary bg-brand-primary text-white' 
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {t('Auto')}
                    </button>
                    {[
                      { name: 'Dorado', value: '#DAA520' },
                      { name: 'Blanco', value: '#FFFFFF' },
                      { name: 'Negro', value: '#1a1a2e' },
                      { name: 'Rojo', value: '#DC2626' },
                      { name: 'Azul', value: '#2563EB' },
                      { name: 'Verde', value: '#16A34A' },
                      { name: 'Plata', value: '#C0C0C0' },
                      { name: 'Rosa', value: '#EC4899' },
                      { name: 'Naranja', value: '#EA580C' },
                    ].map((lc) => (
                      <button
                        key={lc.name}
                        onClick={() => setLogoColor(lc.value)}
                        className={`w-5 h-5 rounded-full border transition-all ${
                          logoColor === lc.value 
                            ? 'ring-2 ring-offset-1 ring-brand-primary border-transparent scale-110' 
                            : 'border-gray-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: lc.value }}
                        title={lc.name}
                      >
                        {logoColor === lc.value && (
                          <Check size={8} className={`m-auto ${lc.value === '#FFFFFF' || lc.value === '#C0C0C0' ? 'text-brand-primary' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <hr className="border-gray-100" />

              {/* Zone Toggle */}
              <div 
                 onClick={() => updateDesign('enabled', !currentDesign.enabled)}
                 className={`flex items-center justify-between p-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                     currentDesign.enabled 
                     ? 'border-brand-accent bg-brand-background/20' 
                     : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                 }`}
              >
                  <div>
                      <span className="font-bold text-brand-primary text-sm">{t('Personalizar')} {getViewLabel(currentView)}</span>
                      <span className="block text-[10px] text-gray-500">
                          {currentDesign.enabled ? t('Zona activa para diseño.') : t('Toca para activar esta zona.')}
                      </span>
                  </div>
                  {currentDesign.enabled ? <ToggleRight size={28} className="text-brand-primary fill-brand-accent" /> : <ToggleLeft size={28} className="text-gray-300" />}
              </div>

              {/* Zone Design Controls */}
              {currentDesign.enabled ? (
                  <div className="space-y-3">
                      <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">{t('Texto')}</label>
                          <input 
                              type="text" 
                              value={currentDesign.text}
                              onChange={(e) => updateDesign('text', e.target.value)}
                              placeholder={t(`Texto para ${getViewLabel(currentView)}...`)}
                              maxLength={currentView === 'front' || currentView === 'back' ? 15 : 10}
                              className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none"
                              autoFocus
                          />
                          <div className="flex flex-wrap items-center gap-1 mt-1.5">
                             <button onClick={() => updateDesign('textTransform', 'uppercase')} className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${currentDesign.textTransform === 'uppercase' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{t('Todo Mayúscula')}</button>
                             <button onClick={() => updateDesign('textTransform', 'lowercase')} className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${currentDesign.textTransform === 'lowercase' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{t('Todo Minúscula')}</button>
                             <button onClick={() => updateDesign('textTransform', 'none')} className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${currentDesign.textTransform === 'none' ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{t('Inicial Mayúscula')}</button>
                             <span className="text-[9px] text-gray-400 ml-auto">{t('Máx 15 caracteres.')}</span>
                          </div>
                      </div>

                      {currentDesign.text && (
                        <>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">{t('Tipografía')}</label>
                            <div className="grid grid-cols-2 gap-1">
                              {FONTS.map(font => (
                                <button
                                    key={font.id}
                                    onClick={() => updateDesign('fontFamily', font.css)}
                                    className={`py-1.5 px-2 text-xs border rounded-lg transition-all ${
                                        currentDesign.fontFamily === font.css
                                        ? 'bg-brand-primary text-white border-brand-primary'
                                        : 'bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                    style={{ fontFamily: font.css }}
                                >
                                    {font.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">{t('Color / Efecto')}</label>
                            <div className="flex flex-wrap gap-1">
                              {TEXT_COLORS.map((color) => (
                                <button
                                  key={color.name}
                                  onClick={() => {
                                      updateDesign('textColor', color.value);
                                      updateDesign('textColorName', color.name);
                                  }}
                                  className={`w-5 h-5 rounded-full shadow-sm transition-all ${
                                      currentDesign.textColor === color.value ? 'ring-2 ring-offset-1 ring-brand-primary scale-110' : 'hover:scale-105'
                                  }`}
                                  style={color.style}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                  </div>
              ) : (
                  <div className="text-center py-3 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                      <Monitor size={24} className="mx-auto mb-1 opacity-20" />
                      <p className="text-[10px]">{t('Zona desactivada.')}</p>
                  </div>
              )}

              <hr className="border-gray-100" />

              {/* Talla + Cantidad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">{t('Talla')}</label>
                  <div className="grid grid-cols-3 gap-0.5">
                    {SIZES.map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)} className={`py-1 text-[11px] rounded border transition-colors ${selectedSize === size ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-primary'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">{t('Cantidad')}</label>
                  <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-lg py-2">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-brand-primary font-bold text-sm border border-gray-200">-</button>
                      <span className="font-mono text-lg w-6 text-center font-bold">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)} className="w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm text-brand-primary font-bold text-sm border border-gray-200">+</button>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-gray-50 p-2 rounded-lg text-[10px] text-gray-500 flex gap-1.5 items-center border border-gray-100">
                 <CalendarCheck size={11} className="text-brand-primary flex-shrink-0" />
                 <p>{t('Entrega estimada: 1 hora laborable. (Lun, Mié, Vie hasta 7:30 PM).')}</p>
              </div>

            </div>
          </div>

          {/* Footer */}
          <div className="flex-none p-3 border-t border-gray-200 bg-white">
             <div className="flex justify-between items-center mb-2">
                 <span className="text-gray-500 text-[11px]">{t('Total estimado')} ({quantity} {t('items')})</span>
                 <span className="text-lg font-bold text-brand-primary">RD${(currentPrice * quantity).toFixed(2)}</span>
             </div>
             {activeZonesCount > 2 && <p className="text-[9px] text-yellow-600 font-bold mb-1">{t('Incluye cargo extra por zonas')}</p>}
             <div className="flex gap-1.5">
               <button onClick={handleAddAnother} className="flex-1 py-2 bg-gray-100 text-brand-primary rounded-lg font-bold text-[11px] hover:bg-gray-200 transition-all flex items-center justify-center gap-1">
                   <Plus size={12} />
                   {t('Guardar y Crear Otro')}
               </button>
               <button onClick={handleSave} className="flex-[2] py-2 bg-brand-primary text-white rounded-lg font-bold text-sm hover:bg-brand-accent hover:text-brand-primary transition-all flex items-center justify-center gap-1.5 shadow-md">
                   <Check size={14} />
                   {initialItem ? t('Actualizar') : t('Finalizar')}
               </button>
             </div>
          </div>
        </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-5 text-center">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle size={28} className="text-yellow-600" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-primary mb-1">{t('¿Salir del diseñador?')}</h3>
              <p className="text-gray-500 text-sm">{t('Tienes cambios sin guardar. ¿Qué deseas hacer?')}</p>
            </div>
            <div className="p-3 space-y-2 bg-gray-50 border-t border-gray-100">
              <button onClick={handleSaveDraft} className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-accent hover:text-brand-primary transition-all">
                <Save size={16} /> {t('Guardar como Borrador')}
              </button>
              <button onClick={() => { setShowExitModal(false); onBack(); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-all border border-red-200">
                <LogOut size={16} /> {t('Descartar y Salir')}
              </button>
              <button onClick={() => setShowExitModal(false)} className="w-full flex items-center justify-center gap-2 py-2 text-gray-500 font-medium text-sm hover:text-gray-700 transition-colors">
                <XCircle size={14} /> {t('Cancelar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customizer;
