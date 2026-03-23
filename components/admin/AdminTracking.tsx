import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrders } from '../../hooks/useOrders';
import { useReservations } from '../../hooks/useReservations';
import { Package, Calendar, User, MapPin, Hash, X } from 'lucide-react';
import {
  ClockIcon, CheckCircleIcon, XCircleIcon, CubeIcon,
  PaintBrushIcon, TruckIcon, MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Order, Reservation } from '../../types';
import TShirtMockup2D from '../TShirtMockup2D';

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

const AdminTracking: React.FC = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const { orders } = useOrders();
  const { reservations } = useReservations();

  const [resultOrder, setResultOrder] = useState<Order | null>(null);
  const [resultRes, setResultRes] = useState<Reservation | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const q = query.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[600px] overflow-hidden">
      
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white flex-shrink-0">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-inner text-white">
            <MagnifyingGlassIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black font-serif tracking-tight">{t('Rastreador Analítico')}</h2>
            <p className="text-white/80 text-sm font-medium">{t('Ingresa el código para rastrear una orden o cita en el sistema global.')}</p>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative max-w-xl">
          <Hash size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: 7829 o ORD-7829"
            className="w-full bg-white text-gray-900 rounded-xl pl-12 pr-32 py-4 font-bold outline-none focus:ring-2 focus:ring-brand-accent uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400 shadow-sm"
            autoFocus
          />
          <button 
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-brand-primary/90 transition-colors disabled:opacity-40 flex items-center gap-2 shadow-sm"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            {t('Buscar')}
          </button>
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/50">
        
        {/* Error */}
        {searched && !resultOrder && !resultRes && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
              <XCircleIcon className="w-10 h-10 text-red-500" />
            </div>
            <p className="text-gray-900 font-black text-xl mb-2">{t('Entrada No Encontrada')}</p>
            <p className="text-gray-500">{t('No se encontró ninguna orden o cita con ese código estructurado. Verifica e intenta de nuevo.')}</p>
          </div>
        )}

        {/* ═══ ORDER RESULT ═══ */}
        {resultOrder && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in-up">
            <div className={`rounded-3xl border-2 ${currentColor?.border || 'border-gray-200'} ${currentColor?.bg || 'bg-gray-50'} p-8 text-center shadow-sm`}>
              <div className={`w-20 h-20 rounded-2xl ${currentColor?.bg || 'bg-gray-100'} border-2 ${currentColor?.border || ''} flex items-center justify-center mx-auto mb-4 shadow-md bg-white`}>
                {isCancelled ? (
                  <XCircleIcon className="w-10 h-10 text-red-500" />
                ) : currentStep ? (
                  <currentStep.icon className={`w-10 h-10 ${currentColor?.text || 'text-gray-500'}`} />
                ) : null}
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t('Estado Actual de la Orden')}</p>
              <h3 className={`text-4xl font-black ${currentColor?.text || 'text-gray-700'}`}>{t(resultOrder.status)}</h3>
              <p className="text-sm text-gray-400 mt-2 font-mono font-bold tracking-widest">{resultOrder.id}</p>
            </div>

            {!isCancelled && (
              <div className="bg-white shadow-sm rounded-3xl border border-gray-100 px-6 py-8">
                <div className="flex items-center justify-between gap-1 relative">
                  {STATUS_STEPS.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;
                    const StepIcon = step.icon;
                    const sc = colorMap[step.color];
                    return (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center relative flex-shrink-0 z-10 bg-white">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isCurrent 
                              ? `${sc.bg} border-2 ${sc.border} shadow-lg ring-4 ${sc.ring}/20 scale-110` 
                              : isCompleted 
                                ? `${sc.bg} border-2 ${sc.border}` 
                                : 'bg-gray-50 border-2 border-dashed border-gray-200'
                          }`}>
                            <StepIcon className={`w-5 h-5 ${isCompleted ? sc.text : 'text-gray-400'}`} />
                          </div>
                          <span className={`mt-3 text-[10px] font-bold text-center leading-tight max-w-[70px] uppercase tracking-wide ${
                            isCurrent ? sc.text : isCompleted ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {t(step.label)}
                          </span>
                        </div>
                        {idx < STATUS_STEPS.length - 1 && (
                          <div className={`h-1 flex-1 mx-[-10px] rounded-full mt-[-28px] transition-all duration-500 ${
                            idx < currentStepIndex ? 'bg-gradient-to-r from-green-300 to-green-400 opacity-100' : 'bg-gray-100 opacity-50'
                          }`}></div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-brand-primary" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('Cliente')}</span>
                </div>
                <p className="font-bold text-gray-900 line-clamp-1">{resultOrder.clientName}</p>
              </div>
              <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-brand-primary" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('Habitación')}</span>
                </div>
                <p className="font-bold text-gray-900">{resultOrder.room || 'N/A'}</p>
              </div>
              <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-brand-primary" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('Fecha')}</span>
                </div>
                <p className="font-bold text-gray-900">{new Date(resultOrder.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={14} className="text-brand-primary" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('Artículos')}</span>
                </div>
                <p className="font-bold text-gray-900">{resultOrder.items.reduce((acc, curr) => acc + curr.quantity, 0)} {t('ítems')}</p>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-3xl border border-gray-100 overflow-hidden">
               <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><Package size={18} className="text-brand-accent"/> Productos</h3>
               </div>
               <div className="p-4 space-y-3">
                  {resultOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50/50 rounded-2xl p-4 border border-gray-100 hover:border-brand-primary/20 transition-all">
                      {item.details?.logoStyle && item.details?.designs ? (
                        <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-white border border-gray-200 p-1 shadow-sm">
                          <TShirtMockup2D
                            color={item.details.color === 'Negro' ? '#1a1a1a' : item.details.color === 'Blanco' ? '#ffffff' : '#374151'}
                            logoStyle={item.details.logoStyle}
                            logoColor={item.details.logoColor || '#DAA520'}
                            designs={item.details.designs}
                            view="front"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 flex-shrink-0 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                          <Package size={24} className="text-gray-300" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-lg truncate mb-1">{item.details?.customName || item.name}</p>
                        <div className="flex gap-2">
                          {item.details?.size && <span className="text-[10px] font-bold bg-white text-gray-600 px-2 py-1 rounded shadow-sm border border-gray-100">{item.details.size}</span>}
                          {item.details?.color && <span className="text-[10px] font-bold bg-white text-gray-600 px-2 py-1 rounded shadow-sm border border-gray-100">{item.details.color}</span>}
                        </div>
                      </div>
                      
                      <div className="text-right flex flex-col items-end">
                         <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg mb-1">Cant. x{item.quantity}</span>
                         <p className="font-black text-brand-primary text-xl">RD${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-brand-primary/5 rounded-3xl p-6 border border-brand-primary/20 flex justify-between items-center shadow-inner">
              <span className="font-black text-brand-primary text-sm uppercase tracking-widest">{t('Total Facturado')}</span>
              <span className="font-black text-brand-primary text-4xl">RD${resultOrder.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* ═══ RESERVATION RESULT ═══ */}
        {resultRes && (
          <div className={`max-w-3xl mx-auto space-y-6 animate-fade-in-up ${resultOrder ? 'mt-10 pt-10 border-t border-gray-200' : ''}`}>
            {/* Status Hero */}
            <div className={`rounded-3xl border-2 ${resColor?.border || 'border-gray-200'} ${resColor?.bg || 'bg-gray-50'} p-8 text-center shadow-sm`}>
              <div className={`w-20 h-20 rounded-2xl ${resColor?.bg || 'bg-gray-100'} border-2 ${resColor?.border || ''} flex items-center justify-center mx-auto mb-4 shadow-md bg-white`}>
                {resStep && <resStep.icon className={`w-10 h-10 ${resColor?.text || 'text-gray-500'}`} />}
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{t('Estado de tu cita')}</p>
              <h3 className={`text-4xl font-black ${resColor?.text || 'text-gray-700'}`}>{t(resultRes.status)}</h3>
              <p className="text-sm text-gray-400 mt-2 font-mono font-bold tracking-widest">{resultRes.id}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <User size={14} className="text-brand-primary" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('Cliente')}</span>
                </div>
                <p className="font-bold text-gray-900">{resultRes.clientName}</p>
              </div>
              <div className="bg-white shadow-sm rounded-2xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-brand-primary" />
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{t('Habitación')}</span>
                </div>
                <p className="font-bold text-gray-900">{resultRes.room || 'N/A'}</p>
              </div>
              <div className="bg-brand-primary/5 shadow-sm rounded-2xl p-4 border border-brand-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} className="text-brand-primary" />
                  <span className="text-xs text-brand-primary font-bold uppercase tracking-wider">{t('Fecha Programada')}</span>
                </div>
                <p className="font-black text-brand-primary text-xl">{resultRes.date}</p>
              </div>
              <div className="bg-brand-primary/5 shadow-sm rounded-2xl p-4 border border-brand-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-brand-primary" />
                  <span className="text-xs text-brand-primary font-bold uppercase tracking-wider">{t('Hora')}</span>
                </div>
                <p className="font-black text-brand-primary text-xl">{resultRes.time}</p>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-3xl border border-gray-100 overflow-hidden">
               <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2"><ScissorsIcon className="w-5 h-5 text-brand-accent"/> Servicios de Trenzas</h3>
               </div>
               <div className="p-4 space-y-3">
                  {resultRes.servicesDetails.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50/50 rounded-2xl p-4 border border-gray-100 hover:border-brand-primary/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                          <Calendar size={20} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg mb-1">{s.name}</p>
                          {(s.quantity || 1) > 1 && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-lg font-bold">x{s.quantity}</span>}
                        </div>
                      </div>
                      <p className="font-black text-brand-primary text-xl">RD${s.price.toFixed(2)}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-brand-primary/5 rounded-3xl p-6 border border-brand-primary/20 flex justify-between items-center shadow-inner">
              <span className="font-black text-brand-primary text-sm uppercase tracking-widest">{t('Costo Cita')}</span>
              <span className="font-black text-brand-primary text-4xl">RD${resultRes.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Initial state */}
        {!searched && (
          <div className="text-center py-24 px-4 h-full flex flex-col justify-center items-center">
            <div className="w-24 h-24 bg-white shadow-sm border border-gray-100 rounded-3xl flex items-center justify-center mb-6">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-200" />
            </div>
            <p className="text-gray-400 font-black text-2xl mb-2 tracking-tight">{t('Rastreador de Registros')}</p>
            <p className="text-gray-400 text-lg font-medium">{t('Ingresa el código en la barra superior para buscar un rastreo detallado')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Just an icon filler if imported incorrectly
const ScissorsIcon = ({className}:{className?:string}) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.057-7.121-5.021C2.948 4.436 2.053 2.536 4.005 1.365c1.953-1.17 3.852-.275 7.903 5.804 4.05 6.079 4.945 7.978 2.992 9.149A6.974 6.974 0 0113.8 15.503l.321.033zM15.536 14.121c1.952-1.171 1.057-3.07-5.021-7.121C4.436 2.948 2.536 2.053 1.365 4.005c-1.17 1.953-.275 3.852 5.804 7.903 6.079 4.05 7.978 4.945 9.149 2.992M19.071 19.071l-5.657-5.657M16.95 21l-3.536-3.536"/></svg>

export default AdminTracking;
