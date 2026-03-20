import React, { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useReservations } from '../hooks/useReservations';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { Package, Calendar, User, MapPin, Hash, X } from 'lucide-react';
import {
  ClockIcon, CheckCircleIcon, XCircleIcon, CubeIcon,
  PaintBrushIcon, TruckIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Order, Reservation } from '../types';
import TShirtMockup2D from './TShirtMockup2D';

interface OrderTrackingProps {
  onClose: () => void;
}

const STATUS_STEPS = [
  { key: 'Pendiente',          label: 'Pendiente',          icon: ClockIcon,       color: 'yellow' },
  { key: 'Diseñando',          label: 'Diseñando',          icon: PaintBrushIcon,  color: 'blue' },
  { key: 'En Producción',      label: 'En Producción',      icon: CubeIcon,        color: 'purple' },
  { key: 'Listo para Entrega', label: 'Listo p/ Entrega',   icon: TruckIcon,       color: 'orange' },
  { key: 'Entregado',          label: 'Entregado',          icon: CheckCircleIcon, color: 'green' },
];

const colorMap: Record<string, { bg: string; text: string; border: string; ring: string; dot: string }> = {
  yellow: { bg: 'bg-yellow-50',  text: 'text-yellow-600', border: 'border-yellow-300', ring: 'ring-yellow-400', dot: 'bg-yellow-500' },
  blue:   { bg: 'bg-blue-50',    text: 'text-blue-600',   border: 'border-blue-300',   ring: 'ring-blue-400',   dot: 'bg-blue-500' },
  purple: { bg: 'bg-purple-50',  text: 'text-purple-600', border: 'border-purple-300', ring: 'ring-purple-400', dot: 'bg-purple-500' },
  orange: { bg: 'bg-orange-50',  text: 'text-orange-600', border: 'border-orange-300', ring: 'ring-orange-400', dot: 'bg-orange-500' },
  green:  { bg: 'bg-green-50',   text: 'text-green-600',  border: 'border-green-300',  ring: 'ring-green-400',  dot: 'bg-green-500' },
  red:    { bg: 'bg-red-50',     text: 'text-red-600',    border: 'border-red-300',    ring: 'ring-red-400',    dot: 'bg-red-500' },
};

const RESERVATION_STATUSES = [
  { key: 'Pendiente',   label: 'Pendiente',   icon: ClockIcon,       color: 'yellow' },
  { key: 'Confirmada',  label: 'Confirmada',  icon: CheckCircleIcon, color: 'blue' },
  { key: 'Completada',  label: 'Completada',  icon: CheckCircleIcon, color: 'green' },
];

const OrderTracking: React.FC<OrderTrackingProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const { orders } = useOrders();
  const { reservations } = useReservations();

  const [resultOrder, setResultOrder] = useState<Order | null>(null);
  const [resultRes, setResultRes] = useState<Reservation | null>(null);
  const [searched, setSearched] = useState(false);

  // Lock body scroll while modal is open
  useBodyScrollLock();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    // Match by last 4 digits, full ID, or ID without prefix
    const ord = orders.find(o => {
      const idNum = o.id.replace('ORD-', '');
      return o.id.toUpperCase() === q || idNum === q || o.id.toUpperCase() === `ORD-${q}` || idNum.endsWith(q);
    });
    const res = reservations.find(r => {
      const idNum = r.id.replace('BKG-', '');
      return r.id.toUpperCase() === q || idNum === q || r.id.toUpperCase() === `BKG-${q}` || idNum.endsWith(q);
    });

    setResultOrder(ord || null);
    setResultRes(res || null);
    setSearched(true);
  };

  const isCancelled = resultOrder?.status === 'Cancelado';
  const currentStepIndex = resultOrder ? STATUS_STEPS.findIndex(s => s.key === resultOrder.status) : -1;
  const currentStep = currentStepIndex >= 0 ? STATUS_STEPS[currentStepIndex] : null;
  const currentColor = currentStep ? colorMap[currentStep.color] : (isCancelled ? colorMap.red : null);

  const resStep = resultRes ? RESERVATION_STATUSES.find(s => s.key === resultRes.status) : null;
  const resColor = resStep ? colorMap[resStep.color] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white relative flex-shrink-0">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/15 hover:bg-white/25 rounded-xl transition-colors">
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black font-serif">Rastrea tu Pedido</h2>
              <p className="text-white/70 text-xs font-medium">Ingresa los últimos 4 dígitos de tu código</p>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative">
            <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ej: 7829"
              maxLength={10}
              className="w-full bg-white text-gray-900 rounded-xl pl-10 pr-24 py-3.5 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-accent uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!query.trim()}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-primary text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-brand-primary/90 transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              <MagnifyingGlassIcon className="w-4 h-4" />
              Buscar
            </button>
          </form>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          
          {/* Error */}
          {searched && !resultOrder && !resultRes && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <XCircleIcon className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-600 font-bold text-lg mb-1">No encontrado</p>
              <p className="text-gray-500 text-sm">No encontramos ninguna orden o cita con ese código. Verifica e intenta de nuevo.</p>
            </div>
          )}

          {/* ═══ ORDER RESULT ═══ */}
          {resultOrder && (
            <div className="space-y-5 animate-fade-in-up">
              {/* Status Hero */}
              <div className={`rounded-2xl border-2 ${currentColor?.border || 'border-gray-200'} ${currentColor?.bg || 'bg-gray-50'} p-6 text-center`}>
                <div className={`w-16 h-16 rounded-2xl ${currentColor?.bg || 'bg-gray-100'} border-2 ${currentColor?.border || ''} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  {isCancelled ? (
                    <XCircleIcon className="w-8 h-8 text-red-500" />
                  ) : currentStep ? (
                    <currentStep.icon className={`w-8 h-8 ${currentColor?.text || 'text-gray-500'}`} />
                  ) : null}
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Estado de tu orden</p>
                <h3 className={`text-2xl font-black ${currentColor?.text || 'text-gray-700'}`}>{resultOrder.status}</h3>
                <p className="text-xs text-gray-400 mt-1 font-mono font-bold">{resultOrder.id}</p>
              </div>

              {/* Timeline (for non-cancelled) */}
              {!isCancelled && (
                <div className="bg-gray-50 rounded-2xl border border-gray-100 px-4 py-5">
                  <div className="flex items-center justify-between gap-1">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const StepIcon = step.icon;
                      const sc = colorMap[step.color];
                      return (
                        <React.Fragment key={step.key}>
                          <div className="flex flex-col items-center relative flex-shrink-0">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                              isCurrent 
                                ? `${sc.bg} border-2 ${sc.border} shadow-md ring-3 ${sc.ring}/20` 
                                : isCompleted 
                                  ? `${sc.bg} border ${sc.border}` 
                                  : 'bg-white border border-gray-200'
                            }`}>
                              <StepIcon className={`w-4 h-4 ${isCompleted ? sc.text : 'text-gray-400'}`} />
                            </div>
                            <span className={`mt-1.5 text-[8px] font-bold text-center leading-tight max-w-[60px] ${
                              isCurrent ? sc.text : isCompleted ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {step.label}
                            </span>
                            {isCurrent && (
                              <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 ${sc.dot} rounded-full animate-pulse ring-2 ring-white`}></div>
                            )}
                          </div>
                          {idx < STATUS_STEPS.length - 1 && (
                            <div className={`h-0.5 flex-1 mx-0.5 mt-[-16px] rounded-full ${
                              idx < currentStepIndex ? 'bg-green-300' : 'bg-gray-200'
                            }`}></div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Cliente</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{resultOrder.clientName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Habitación</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{resultOrder.room || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Fecha</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{new Date(resultOrder.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Package size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Artículos</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{resultOrder.items.reduce((acc, curr) => acc + curr.quantity, 0)} productos</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {resultOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                    {item.details?.logoStyle && item.details?.designs ? (
                      <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200">
                        <TShirtMockup2D
                          color={item.details.color === 'Negro' ? '#1a1a1a' : item.details.color === 'Blanco' ? '#ffffff' : '#374151'}
                          logoStyle={item.details.logoStyle}
                          logoColor={item.details.logoColor || '#DAA520'}
                          designs={item.details.designs}
                          view="front"
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        <Package size={18} className="text-gray-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{item.details?.customName || item.name}</p>
                      <div className="flex gap-1.5 mt-0.5">
                        {item.details?.size && <span className="text-[9px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{item.details.size}</span>}
                        {item.details?.color && <span className="text-[9px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{item.details.color}</span>}
                        <span className="text-[9px] font-bold text-brand-primary">x{item.quantity}</span>
                      </div>
                    </div>
                    <p className="font-black text-brand-primary text-sm whitespace-nowrap">RD${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-brand-primary/5 rounded-2xl p-4 border border-brand-primary/10 flex justify-between items-center">
                <span className="font-black text-brand-primary text-sm uppercase tracking-wider">Total del Pedido</span>
                <span className="font-black text-brand-primary text-2xl">RD${resultOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* ═══ RESERVATION RESULT ═══ */}
          {resultRes && (
            <div className={`space-y-5 animate-fade-in-up ${resultOrder ? 'mt-6 pt-6 border-t border-gray-200' : ''}`}>
              {/* Status Hero */}
              <div className={`rounded-2xl border-2 ${resColor?.border || 'border-gray-200'} ${resColor?.bg || 'bg-gray-50'} p-6 text-center`}>
                <div className={`w-16 h-16 rounded-2xl ${resColor?.bg || 'bg-gray-100'} border-2 ${resColor?.border || ''} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  {resStep && <resStep.icon className={`w-8 h-8 ${resColor?.text || 'text-gray-500'}`} />}
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Estado de tu cita</p>
                <h3 className={`text-2xl font-black ${resColor?.text || 'text-gray-700'}`}>{resultRes.status}</h3>
                <p className="text-xs text-gray-400 mt-1 font-mono font-bold">{resultRes.id}</p>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Cliente</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{resultRes.clientName}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={12} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Habitación</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{resultRes.room || 'N/A'}</p>
                </div>
                <div className="bg-brand-primary/5 rounded-xl p-3 border border-brand-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={12} className="text-brand-primary" />
                    <span className="text-[10px] text-brand-primary font-bold uppercase">Fecha</span>
                  </div>
                  <p className="font-black text-brand-primary text-sm">{resultRes.date}</p>
                </div>
                <div className="bg-brand-primary/5 rounded-xl p-3 border border-brand-primary/10">
                  <div className="flex items-center gap-2 mb-1">
                    <ClockIcon className="w-3 h-3 text-brand-primary" />
                    <span className="text-[10px] text-brand-primary font-bold uppercase">Hora</span>
                  </div>
                  <p className="font-black text-brand-primary text-sm">{resultRes.time}</p>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-2">
                {resultRes.servicesDetails.map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        <Calendar size={16} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                        {(s.quantity || 1) > 1 && <span className="text-[10px] text-brand-primary font-bold">x{s.quantity}</span>}
                      </div>
                    </div>
                    <p className="font-black text-brand-primary text-sm">RD${s.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="bg-brand-primary/5 rounded-2xl p-4 border border-brand-primary/10 flex justify-between items-center">
                <span className="font-black text-brand-primary text-sm uppercase tracking-wider">Total de la Cita</span>
                <span className="font-black text-brand-primary text-2xl">RD${resultRes.total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Initial state */}
          {!searched && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-400 font-bold text-lg mb-1">Ingresa tu código</p>
              <p className="text-gray-400 text-sm">Busca el número de orden o cita impreso en tu comprobante</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
