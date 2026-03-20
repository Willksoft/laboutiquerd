import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trash2, Edit3, ShoppingBag, Ticket, 
  Scissors, Gift, Palette, Plus, Minus, Package
} from 'lucide-react';
import { CartItem } from '../types';
import TShirtMockup2D from './TShirtMockup2D';

interface CartPageProps {
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onEditItem: (item: CartItem) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ cart, onRemoveItem, onEditItem, onUpdateQuantity }) => {
  const navigate = useNavigate();

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getItemIcon = (item: CartItem) => {
    if (item.type === 'service') return <Scissors className="w-5 h-5 text-pink-500" />;
    if (item.type === 'gift-card') return <Gift className="w-5 h-5 text-yellow-500" />;
    return <Palette className="w-5 h-5 text-blue-500" />;
  };

  const renderProductPreview = (item: CartItem) => {
    // If it's a T-shirt with design details, render 2D mockup
    if (item.details?.logoStyle && item.details?.designs) {
      return (
        <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          <TShirtMockup2D
            color={item.details.color === 'Negro' ? '#1a1a1a' : item.details.color === 'Blanco' ? '#ffffff' : '#374151'}
            logoStyle={item.details.logoStyle}
            logoColor={item.details.logoColor || '#DAA520'}
            designs={item.details.designs}
            view="front"
            className="w-full h-full"
          />
        </div>
      );
    }
    // Generic icon
    return (
      <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center">
        {getItemIcon(item)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeft size={20} className="text-gray-600"/>
            </button>
            <div>
              <h1 className="text-3xl font-serif font-black text-brand-primary flex items-center gap-3">
                <ShoppingBag className="text-brand-accent" size={28}/> Tu Carrito
              </h1>
              <p className="text-gray-500 text-sm font-medium mt-1">
                {itemCount === 0 ? 'No tienes artículos' : `${itemCount} artículo${itemCount !== 1 ? 's' : ''} en tu carrito`}
              </p>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Explora nuestros productos personalizables, reserva una cita de trenzas, o navega nuestras boutiques.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button onClick={() => navigate('/custom')} className="px-6 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-primary/90 transition-colors flex items-center gap-2">
                <Palette size={18}/> Personalizar
              </button>
              <button onClick={() => navigate('/braids')} className="px-6 py-3 bg-white border-2 border-brand-primary text-brand-primary font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Scissors size={18}/> Trenzas
              </button>
              <button onClick={() => navigate('/')} className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2">
                <Package size={18}/> Boutique
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Items List */}
            <div className="flex-1 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-brand-accent/30 transition-colors group">
                  <div className="flex gap-4">
                    {/* Preview */}
                    {renderProductPreview(item)}

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg leading-tight">{item.name}</h3>
                          {item.details?.customName && (
                            <p className="text-sm font-bold text-brand-accent mt-0.5">"{item.details.customName}"</p>
                          )}
                        </div>
                        <button 
                          onClick={() => onRemoveItem(item.id)} 
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 size={16}/>
                        </button>
                      </div>

                      {/* Details */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.details?.size && (
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg uppercase">
                            Talla: {item.details.size}
                          </span>
                        )}
                        {item.details?.color && (
                          <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg uppercase">
                            {item.details.color}
                          </span>
                        )}
                        {item.details?.logoStyle && (
                          <span className="text-[10px] font-bold bg-brand-accent/20 text-brand-primary px-2 py-1 rounded-lg uppercase">
                            {item.details.logoStyle === 'dominican' ? 'Dominicano' : 'Clásico'}
                          </span>
                        )}
                        {item.details?.date && (
                          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">
                            Cita: {item.details.date} {item.details.time}
                          </span>
                        )}
                      </div>

                      {/* Zones text */}
                      {item.details?.designs && (
                        <div className="mt-2 space-y-0.5">
                          {Object.entries(item.details.designs).map(([zone, design]: [string, any]) => {
                            if (!design?.enabled || !design?.text?.trim()) return null;
                            const zoneLabel = zone === 'front' ? 'Frente' : zone === 'back' ? 'Espalda' : zone === 'left' ? 'Izq' : 'Der';
                            return (
                              <p key={zone} className="text-[11px] text-gray-500">
                                <span className="font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded text-[9px] mr-1.5 uppercase">{zoneLabel}</span>
                                {design.text}
                              </p>
                            );
                          })}
                        </div>
                      )}

                      {/* Delivery */}
                      {item.details?.deliveryDate && (
                        <p className="text-[10px] text-green-600 font-bold mt-2">
                          Entrega estimada: {item.details.deliveryDate}
                        </p>
                      )}

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-gray-100 rounded-xl p-1">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} 
                              className="p-1.5 hover:bg-white rounded-lg transition-colors"
                            >
                              <Minus size={14} className="text-gray-500"/>
                            </button>
                            <span className="w-8 text-center font-bold text-sm select-none">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                              className="p-1.5 hover:bg-white rounded-lg transition-colors"
                            >
                              <Plus size={14} className="text-gray-500"/>
                            </button>
                          </div>
                          {item.type === 'product' && (
                            <button 
                              onClick={() => onEditItem(item)}
                              className="text-xs text-brand-primary font-bold flex items-center gap-1 hover:underline"
                            >
                              <Edit3 size={12}/> Editar
                            </button>
                          )}
                        </div>
                        <p className="text-xl font-black text-brand-primary">
                          RD${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-gray-800 text-lg mb-4">Resumen del Pedido</h3>
                
                <div className="space-y-3 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">{item.name} x{item.quantity}</span>
                      <span className="font-bold text-gray-800 flex-shrink-0">RD${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-black text-brand-primary">
                    <span>Total</span>
                    <span>RD${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-brand-primary text-white py-4 rounded-xl font-black text-base hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20"
                >
                  <Ticket size={20}/> Ir al Checkout
                </button>

                <button 
                  onClick={() => navigate(-1)}
                  className="w-full mt-3 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Seguir Comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
