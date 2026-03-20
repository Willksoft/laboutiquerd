import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingBag, ArrowRight, Activity, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
           <h2 className="text-2xl font-serif font-black text-gray-800">Resumen General</h2>
           <p className="text-gray-500 font-medium">Métricas de pedidos, reservas y diseños de la Boutique.</p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
         {[
           { title: 'Ventas Totales', value: 'RD$ 124,500', icon: <DollarSign className="text-emerald-500" size={24}/>, trend: '+12%', color: 'from-emerald-500/10 to-transparent border-emerald-500/20' },
           { title: 'Nuevas Órdenes', value: '45', icon: <ShoppingBag className="text-brand-accent" size={24}/>, trend: '+5%', color: 'from-brand-accent/10 text-brand-primary border-brand-accent/30' },
           { title: 'Citas Trenzas', value: '18', icon: <Users className="text-blue-500" size={24}/>, trend: 'Estable', color: 'from-blue-500/10 to-transparent border-blue-500/20' },
           { title: 'Tasa Conversión', value: '3.2%', icon: <Activity className="text-purple-500" size={24}/>, trend: '+0.5%', color: 'from-purple-500/10 to-transparent border-purple-500/20' }
         ].map((kpi, i) => (
             <div key={i} className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col justify-between bg-gradient-to-br ${kpi.color}`}>
                 <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                     <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{kpi.title}</span>
                     {kpi.icon}
                 </div>
                 <div className="flex items-end justify-between">
                     <span className="text-3xl font-black text-gray-800 tracking-tighter">{kpi.value}</span>
                     <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md flex items-center gap-1">
                         <TrendingUp size={12}/> {kpi.trend}
                     </span>
                 </div>
             </div>
         ))}
      </div>

      {/* Main Charts / List placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px] flex flex-col justify-center items-center text-gray-300">
             <Activity size={64} className="mb-4 opacity-20" />
             <p className="font-bold">Gráfico de Rendimiento (Próximamente)</p>
         </div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
             <h3 className="font-bold text-gray-800 uppercase tracking-wider text-sm mb-6 pb-2 border-b border-gray-100">Órdenes Recientes</h3>
             <div className="flex-1 flex items-center justify-center text-gray-400">
                 <p className="text-sm text-center">Aún no hay conectividad a base de datos. Los pedidos aparecerán aquí.</p>
             </div>
             <button className="w-full mt-4 py-3 bg-gray-50 hover:bg-gray-100 text-brand-primary font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                 Ver Todas <ArrowRight size={16} />
             </button>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
