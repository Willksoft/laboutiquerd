import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, ShoppingBag, ArrowRight, Activity, DollarSign, Package, Calendar, Clock, User, MapPin, FileDown } from 'lucide-react';
import { useOrders } from '../../hooks/useOrders';
import { useReservations } from '../../hooks/useReservations';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const { reservations } = useReservations();
  const { t } = useTranslation();

  // ═══════ REAL KPIs ═══════
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString().split('T')[0];

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pendiente').length;
  const totalReservations = reservations.length;
  const pendingReservations = reservations.filter(r => r.status === 'Pendiente').length;

  // Today's stats
  const todayOrders = orders.filter(o => {
    if (!o.date) return false;
    return o.date.split('T')[0] === todayISO;
  }).length;

  const todayReservations = reservations.filter(r => {
    if (!r.date) return false;
    return r.date.split('T')[0] === todayISO;
  }).length;

  // Recent 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Recent 5 reservations
  const recentReservations = [...reservations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // ═══════ CSV EXPORT ═══════
  const exportOrdersCSV = () => {
    const headers = ['ID', 'Cliente', 'Habitación', 'Fecha', 'Total', 'Estado', 'Items'];
    const rows = orders.map(o => [
      o.id,
      o.clientName,
      o.room || '',
      new Date(o.date).toLocaleDateString('es-DO'),
      o.total.toFixed(2),
      o.status,
      o.items.map(i => `${i.name} x${i.quantity}`).join('; ')
    ]);
    downloadCSV([headers, ...rows], 'ordenes_laboutique.csv');
  };

  const exportReservationsCSV = () => {
    const headers = ['ID', 'Cliente', 'Habitación', 'Fecha', 'Hora', 'Modelo', 'Total', 'Estado'];
    const rows = reservations.map(r => [
      r.id,
      r.clientName,
      r.room || '',
      r.date,
      r.time,
      r.modelName,
      r.total.toFixed(2),
      r.status
    ]);
    downloadCSV([headers, ...rows], 'reservaciones_laboutique.csv');
  };

  const downloadCSV = (data: string[][], filename: string) => {
    const csv = data.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const STATUS_COLORS: Record<string, string> = {
    'Pendiente': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    'Diseñando': 'bg-blue-50 text-blue-700 border-blue-200',
    'En Producción': 'bg-purple-50 text-purple-700 border-purple-200',
    'Listo para Entrega': 'bg-orange-50 text-orange-700 border-orange-200',
    'Entregado': 'bg-green-50 text-green-700 border-green-200',
    'Cancelado': 'bg-red-50 text-red-700 border-red-200',
    'Confirmada': 'bg-blue-50 text-blue-700 border-blue-200',
    'Completada': 'bg-green-50 text-green-700 border-green-200',
    'Cancelada': 'bg-red-50 text-red-700 border-red-200',
    'No Show': 'bg-gray-100 text-gray-600 border-gray-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
           <h2 className="text-2xl font-serif font-black text-gray-800">{t('Resumen General')}</h2>
           <p className="text-gray-500 font-medium">{t('Métricas en tiempo real de pedidos, reservas y diseños.')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportOrdersCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <FileDown size={16} /> {t('Exportar Órdenes')}
          </button>
          <button onClick={exportReservationsCSV} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
            <FileDown size={16} /> {t('Exportar Citas')}
          </button>
        </div>
      </div>

      {/* KPI Grid — REAL DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         {[
           { title: t('Ventas Totales'), value: `RD$ ${totalSales.toLocaleString('es-DO', { minimumFractionDigits: 2 })}`, icon: <DollarSign className="text-emerald-500" size={24}/>, trend: `${totalOrders} ${t('órdenes')}`, color: 'from-emerald-500/10 to-transparent border-emerald-500/20' },
           { title: t('Hoy'), value: `${todayOrders} ${t('pedidos')}`, icon: <ShoppingBag className="text-brand-accent" size={24}/>, trend: `${todayReservations} ${t('citas')}`, color: 'from-brand-accent/10 text-brand-primary border-brand-accent/30' },
           { title: t('Citas Trenzas'), value: String(totalReservations), icon: <Users className="text-blue-500" size={24}/>, trend: `${pendingReservations} ${t('pendientes')}`, color: 'from-blue-500/10 to-transparent border-blue-500/20' },
           { title: t('Pendientes'), value: String(pendingOrders), icon: <Activity className="text-purple-500" size={24}/>, trend: t('órdenes por gestionar'), color: 'from-purple-500/10 to-transparent border-purple-500/20' }
         ].map((kpi, i) => (
             <div key={i} className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between bg-gradient-to-br ${kpi.color}`}>
                 <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                     <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{kpi.title}</span>
                     {kpi.icon}
                 </div>
                 <div className="flex items-end justify-between">
                     <span className="text-3xl font-black text-gray-800 tracking-tighter">{kpi.value}</span>
                     <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-md flex items-center gap-1">
                         {kpi.trend}
                     </span>
                 </div>
             </div>
         ))}
      </div>

      {/* Main Content: Recent Orders + Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Recent Orders */}
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
             <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Package size={16} className="text-brand-accent" /> {t('Órdenes Recientes')}
             </h3>
             <div className="flex-1 space-y-2">
                 {recentOrders.length === 0 ? (
                     <div className="flex-1 flex items-center justify-center text-gray-400 py-12">
                       <div className="text-center">
                         <Package size={32} className="mx-auto mb-2 opacity-30" />
                         <p className="font-bold text-sm">{t('Sin órdenes aún')}</p>
                       </div>
                     </div>
                 ) : recentOrders.map((order) => (
                     <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-accent/30 transition-colors">
                         <div className="flex items-center gap-3 min-w-0">
                             <div className="w-9 h-9 bg-brand-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                               <User size={14} className="text-brand-primary" />
                             </div>
                             <div className="min-w-0">
                                 <p className="font-bold text-gray-800 text-sm truncate">{order.clientName}</p>
                                 <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                     <span className="font-mono">{order.id}</span>
                                     {order.room && <><span>•</span><span className="flex items-center gap-0.5"><MapPin size={8}/> {order.room}</span></>}
                                 </div>
                             </div>
                         </div>
                         <div className="text-right flex-shrink-0 ml-2">
                             <p className="font-black text-brand-primary text-sm">RD${order.total.toFixed(2)}</p>
                             <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${STATUS_COLORS[order.status] || 'bg-gray-50 text-gray-500'}`}>
                                 {order.status}
                             </span>
                         </div>
                     </div>
                 ))}
             </div>
             {orders.length > 5 && (
               <button 
                 onClick={() => navigate('/admin/customizer')}
                 className="w-full mt-4 py-3 bg-gray-50 hover:bg-gray-100 text-brand-primary font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
               >
                 {t('Ver Todas')} ({orders.length}) <ArrowRight size={16} />
               </button>
             )}
         </div>

         {/* Recent Reservations */}
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
             <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
                <Calendar size={16} className="text-brand-accent" /> {t('Citas Recientes')}
             </h3>
             <div className="flex-1 space-y-2">
                 {recentReservations.length === 0 ? (
                     <div className="flex-1 flex items-center justify-center text-gray-400 py-12">
                       <div className="text-center">
                         <Calendar size={32} className="mx-auto mb-2 opacity-30" />
                         <p className="font-bold text-sm">{t('Sin citas aún')}</p>
                       </div>
                     </div>
                 ) : recentReservations.map((res) => (
                     <div key={res.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-brand-accent/30 transition-colors">
                         <div className="flex items-center gap-3 min-w-0">
                             <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                               <Clock size={14} className="text-blue-500" />
                             </div>
                             <div className="min-w-0">
                                 <p className="font-bold text-gray-800 text-sm truncate">{res.clientName}</p>
                                 <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                     <span>{res.date}</span>
                                     <span>•</span>
                                     <span className="font-bold text-brand-primary">{res.time}</span>
                                     {res.room && <><span>•</span><span className="flex items-center gap-0.5"><MapPin size={8}/> {res.room}</span></>}
                                 </div>
                             </div>
                         </div>
                         <div className="text-right flex-shrink-0 ml-2">
                             <p className="font-black text-brand-primary text-sm">RD${res.total.toFixed(2)}</p>
                             <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${STATUS_COLORS[res.status] || 'bg-gray-50 text-gray-500'}`}>
                                 {res.status}
                             </span>
                         </div>
                     </div>
                 ))}
             </div>
             {reservations.length > 5 && (
               <button 
                 onClick={() => navigate('/admin/braids')}
                 className="w-full mt-4 py-3 bg-gray-50 hover:bg-gray-100 text-brand-primary font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
               >
                 {t('Ver Todas')} ({reservations.length}) <ArrowRight size={16} />
               </button>
             )}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
