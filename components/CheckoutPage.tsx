import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, Check, Trash2, Edit3, ShoppingBag, 
  User, Clock, Package,
  Palette, Type, Shirt, Ruler, Hash, Tag, ChevronDown, ChevronUp,
  Ticket
} from 'lucide-react';
import { CartItem, DesignConfig } from '../types';
import TShirtMockup, { TShirtView } from './TShirtMockup';
import { useVendors } from '../hooks/useVendors';
import CustomSelect from './ui/CustomSelect';

interface CheckoutPageProps {
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onEditItem: (item: CartItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cart, onRemoveItem, onEditItem, onUpdateQuantity }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { vendors } = useVendors();

  // Pre-fill client info from cart item details (if available)
  const firstItemDetails = cart.find(i => i.details?.clientName || i.details?.room)?.details;
  const [clientName, setClientName] = useState(firstItemDetails?.clientName || '');
  const [clientPhone, setClientPhone] = useState('');
  const [clientRoom, setClientRoom] = useState(firstItemDetails?.room || '');
  const [vendorId, setVendorId] = useState(firstItemDetails?.vendorId || '');
  const [notes, setNotes] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);


  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getReadableFontName = (cssFont: string) => {
    if (cssFont.includes('Sheryl')) return 'Sheryl (Cursiva)';
    if (cssFont.includes('Arial')) return 'Arial Bold';
    if (cssFont.includes('Montserrat')) return 'Montserrat';
    if (cssFont.includes('DM Sans')) return 'DM Sans';
    return 'Estándar';
  };

  const getTransformLabel = (transform: string | undefined) => {
    if (transform === 'uppercase') return t('Todo Mayúscula');
    if (transform === 'lowercase') return t('Todo Minúscula');
    if (transform === 'none') return t('Inicial Mayúscula');
    return '';
  };

  const getLogoColorName = (hex: string) => {
    const map: Record<string, string> = {
      '#DAA520': 'Dorado', '#FFFFFF': 'Blanco', '#1a1a2e': 'Negro',
      '#DC2626': 'Rojo', '#2563EB': 'Azul', '#16A34A': 'Verde',
      '#C0C0C0': 'Plata', '#EC4899': 'Rosa', '#EA580C': 'Naranja',
    };
    return map[hex] || hex;
  };

  const getZoneLabel = (zoneId: string) => {
    const labels: Record<string, string> = {
      'front': t('Frente'), 'back': t('Espalda'),
      'left': t('Manga Izq'), 'right': t('Manga Der'),
    };
    return labels[zoneId] || zoneId;
  };

  const colorNameToHex = (name: string | undefined): string => {
    if (!name) return '#1a1a1a';
    const map: Record<string, string> = {
      'Blanco': '#ffffff', 'Negro': '#1a1a1a', 'Carbón': '#374151', 'Gris': '#9ca3af',
      'Gris Claro': '#e5e7eb', 'Gris Oscuro': '#374151', 'Arena': '#d6d3d1',
      'Azul Marino': '#1e3a8a', 'Azul Oscuro': '#172554', 'Azul Royal': '#2563eb',
      'Celeste': '#7dd3fc', 'Azul Cielo': '#bae6fd', 'Turquesa': '#06b6d4',
      'Turquesa Oscuro': '#0e7490', 'Menta': '#6ee7b7', 'Oliva': '#556b2f',
      'Vino': '#7f1d1d', 'Rojo': '#ef4444', 'Coral': '#fb7185', 'Rosa': '#ec4899',
      'Lila': '#d8b4fe', 'Naranja': '#f97316', 'Amarillo': '#facc15',
      'Mostaza': '#eab308', 'Verde Neón': '#a3e635', 'Verde': '#16a34a',
    };
    return map[name] || '#1a1a1a';
  };



  const renderDesignSummary = (item: CartItem) => {
    if (!item.details?.designs) return null;
    const activeZones = Object.entries(item.details.designs as Record<string, any>).filter(([_, d]) => d.enabled);
    if (activeZones.length === 0) return null;

    return (
      <div className="space-y-2 mt-3">
        {activeZones.map(([zoneId, design]) => (
          <div key={zoneId} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase bg-brand-primary text-white px-2 py-0.5 rounded-full">
                {getZoneLabel(zoneId)}
              </span>
              {design.text && (
                <span className="text-sm font-bold text-gray-800" style={{ fontFamily: design.fontFamily }}>
                  "{design.text}"
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <Type size={10} /> {getReadableFontName(design.fontFamily)}
              </span>
              <span className="flex items-center gap-1">
                <Palette size={10} /> {design.textColorName}
              </span>
              {design.textTransform !== 'none' && (
                <span className="flex items-center gap-1">
                  <Hash size={10} /> {getTransformLabel(design.textTransform)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center p-12">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-serif font-bold text-brand-primary mb-2">{t('Tu carrito está vacío')}</h2>
          <p className="text-gray-500 mb-6">{t('Agrega productos personalizados para continuar.')}</p>
          <button 
            onClick={() => navigate('/custom')} 
            className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-accent hover:text-brand-primary transition-all"
          >
            {t('Empezar a Crear')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-[64px] z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-brand-primary transition-colors font-medium text-sm">
            <ArrowLeft size={18} />
            {t('Seguir Comprando')}
          </button>
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-primary" />
            <span className="font-bold text-brand-primary text-lg">{t('Checkout')}</span>
            <span className="bg-brand-accent text-brand-primary text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ═══════ LEFT: Order Items ═══════ */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-serif font-bold text-brand-primary flex items-center gap-2">
              <Package size={20} />
              {t('Resumen del Pedido')} ({cart.length} {cart.length === 1 ? t('diseño') : t('diseños')})
            </h2>

            {cart.map((item) => {
              const isExpanded = expandedItem === item.id;
              const activeZones = item.details?.designs 
                ? Object.entries(item.details.designs as Record<string, any>).filter(([_, d]) => d.enabled)
                : [];

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Item Header */}
                  <div className="p-4 flex gap-4">
                    {/* T-shirt Preview Thumbnail */}
                    <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                      {item.details?.designs ? (
                        <TShirtMockup
                          color={colorNameToHex(item.details.color)}
                          view="front"
                          designs={item.details.designs as Record<TShirtView, DesignConfig>}
                          logoStyle={item.details.logoStyle || 'classic'}
                          logoColor={item.details.logoColor}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <Shirt size={40} className="text-gray-300" />
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-brand-primary text-base leading-tight">
                            {item.details?.customName || item.name}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">{item.name}</p>
                        </div>
                        <span className="text-lg font-bold text-brand-primary whitespace-nowrap">
                          RD${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Quick Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {item.details?.size && (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Ruler size={9} /> {item.details.size}
                          </span>
                        )}
                        {item.details?.color && (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <span className="w-2.5 h-2.5 rounded-full border border-gray-300" style={{ backgroundColor: colorNameToHex(item.details.color) }}></span>
                            {item.details.color}
                          </span>
                        )}
                        {item.details?.logoStyle && (
                          <span className="inline-flex items-center gap-1 bg-brand-accent/20 text-brand-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {item.details.logoStyle === 'classic' ? '45 Clásico' : '45 Dominicano'}
                          </span>
                        )}
                        {activeZones.length > 0 && (
                          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <Tag size={9} /> {activeZones.length} {activeZones.length === 1 ? 'zona' : 'zonas'}
                          </span>
                        )}
                      </div>

                      {/* Actions Row */}
                      <div className="flex items-center gap-3 mt-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200">
                          <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-brand-primary text-sm font-bold">-</button>
                          <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-brand-primary text-sm font-bold">+</button>
                        </div>
                        
                        <button onClick={() => onEditItem(item)} className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-bold transition-colors">
                          <Edit3 size={12} /> {t('Editar')}
                        </button>
                        <button onClick={() => onRemoveItem(item.id)} className="flex items-center gap-1 text-[11px] text-red-500 hover:text-red-700 font-bold transition-colors">
                          <Trash2 size={12} /> {t('Eliminar')}
                        </button>
                        
                        {activeZones.length > 0 && (
                          <button 
                            onClick={() => setExpandedItem(isExpanded ? null : item.id)} 
                            className="ml-auto flex items-center gap-1 text-[11px] text-gray-500 hover:text-brand-primary font-bold transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {isExpanded ? t('Ocultar Detalles') : t('Ver Detalles')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Design Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 bg-gray-50/50">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">{t('Detalle de Personalización')}</p>
                      {renderDesignSummary(item)}
                      
                      {item.details?.logoColor && (
                        <div className="mt-2 text-[11px] text-gray-500 flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: item.details.logoColor }}></span>
                          {t('Color del Logo')}: {getLogoColorName(item.details.logoColor)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add More */}
            <button 
              onClick={() => navigate('/custom')} 
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-brand-primary hover:text-brand-primary font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} /> {t('Agregar más productos')}
            </button>
          </div>

          {/* ═══════ RIGHT: Checkout Sidebar ═══════ */}
          <div className="space-y-4">
            {/* Client Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-brand-primary text-base flex items-center gap-2 mb-4">
                <User size={18} /> {t('Datos del Cliente')}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">
                    {t('Nombre')} <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={t('Nombre del huésped...')}
                    maxLength={100}
                    autoComplete="name"
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">
                    {t('Teléfono / WhatsApp')}
                  </label>
                  <input 
                    type="tel" 
                    value={clientPhone} 
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+1 (809) 555-0123"
                    maxLength={20}
                    autoComplete="tel"
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">
                    {t('Habitación')}
                  </label>
                  <input 
                    type="text" 
                    value={clientRoom} 
                    onChange={(e) => setClientRoom(e.target.value)}
                    placeholder={t('Ej: Room 4210')}
                    maxLength={20}
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">
                    {t('Vendedor/a')}
                  </label>
                  <CustomSelect 
                    value={vendorId}
                    onChange={setVendorId}
                    options={[
                      { label: t('Seleccionar Vendedor...'), value: '' },
                      ...vendors.map(v => ({ label: `${v.name} (${v.role})`, value: v.id }))
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wide">
                    {t('Notas adicionales')}
                  </label>
                  <textarea 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('Instrucciones especiales...')}
                    rows={2}
                    maxLength={500}
                    className="w-full p-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-accent focus:outline-none bg-gray-50 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Clock size={16} />
                <span className="font-bold text-sm">{t('Entrega Estimada')}</span>
              </div>
              <p className="text-blue-600 text-xs leading-relaxed">
                {t('Entrega estimada: 1 hora laborable. (Lun, Mié, Vie hasta 7:30 PM).')}
              </p>
            </div>

            {/* Price Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-brand-primary text-base mb-4">{t('Resumen')}</h3>
              
              <div className="space-y-2 text-sm">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-gray-600">
                    <span className="truncate mr-2">
                      {item.details?.customName || item.name} {item.quantity > 1 ? `×${item.quantity}` : ''}
                    </span>
                    <span className="font-bold whitespace-nowrap">RD${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <hr className="my-3 border-gray-100" />
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-600">{t('Total')}</span>
                <span className="text-2xl font-bold text-brand-primary">RD${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Generate Ticket CTA */}
            <button
              onClick={() => {
                // Inject client info into cart items before navigating
                const enrichedCart = cart.map(item => ({
                  ...item,
                  details: {
                    ...item.details,
                    clientName: clientName.trim(),
                    room: clientRoom.trim(),
                    vendorId: vendorId.trim(),
                  }
                }));
                navigate('/ticket', {
                  state: {
                    cart: enrichedCart,
                    total,
                    clientName: clientName.trim(),
                    clientPhone: clientPhone.trim(),
                    clientRoom: clientRoom.trim(),
                    vendorId: vendorId.trim(),
                    notes: notes.trim(),
                  }
                });
              }}
              disabled={!clientName.trim()}
              className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-lg ${
                clientName.trim() && vendorId.trim() 
                  ? 'bg-brand-primary hover:bg-brand-primary/90 text-white shadow-brand-primary/20' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Ticket size={20} />
              {t('Generar Comprobante')}
            </button>


            {!clientName.trim() && (
              <p className="text-[11px] text-red-500 text-center font-medium">
                * {t('Ingresa el nombre del cliente')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
