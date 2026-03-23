import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, ShoppingBag, LayoutGrid, Palette, Search, Filter, Trash2, X, Save, Eye, Phone as PhoneIcon, ChevronRight } from 'lucide-react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, CubeIcon, PaintBrushIcon, TruckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { MODEL_STYLES } from '../../constants';
import { usePresets } from '../../hooks/usePresets';
import { useOrders } from '../../hooks/useOrders';
import { LogoStyle, TShirtPreset, OrderStatus } from '../../types';
import TShirtMockup2D from '../TShirtMockup2D';
import CustomSelect from '../ui/CustomSelect';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';
import { useConfirm } from '../../hooks/useConfirm';

const CustomizerAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('presets');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const { presets, addPreset, updatePreset, deletePreset } = usePresets();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();

  const [editingPreset, setEditingPreset] = useState<TShirtPreset | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ orderId: string; newStatus: OrderStatus; orderName: string } | null>(null);
  const { showConfirm, ConfirmDialog: GlobalConfirmDialog } = useConfirm();

  useBodyScrollLock(!!confirmDialog);

  const handleSavePreset = () => {
    if (!editingPreset) return;
    
    // Check if it's new
    if (presets.some(p => p.id === editingPreset.id)) {
      updatePreset(editingPreset);
    } else {
      addPreset(editingPreset);
    }
    setEditingPreset(null);
  };

  const handleCreateNew = () => {
    setEditingPreset({
        id: `preset-${Date.now()}`,
        name: 'Nueva Variante',
        description: 'Descripción del modelo',
        logoStyle: 'classic',
        baseColorName: 'Blanco',
        baseColorValue: '#ffffff',
        defaultLogoColor: '#000000',
        tags: ['Nuevo']
    });
  };

  return (
    <>
    <GlobalConfirmDialog />
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px] overflow-hidden md:flex-row relative">
       {/* Sidebar para Módulo Customizer */}
       <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2 shrink-0">
           <h3 className="font-serif font-black text-gray-800 text-lg mb-6 flex items-center gap-2 uppercase tracking-wide">
               <Palette size={20} className="text-brand-accent"/> Personalización
           </h3>

           {[
              { id: 'orders', label: 'Órdenes de Clientes', icon: <ShoppingBag size={18}/> },
              { id: 'presets', label: 'Modelos 45', icon: <LayoutGrid size={18}/> },
              { id: 'logos', label: 'Estilos de Logo', icon: <PackagePlus size={18}/> },
           ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setEditingPreset(null); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left ${
                      activeTab === tab.id 
                      ? 'bg-white shadow-sm border border-gray-200 text-brand-primary' 
                      : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-800 border border-transparent'
                  }`}
               >
                   {tab.icon} {tab.label}
               </button>
           ))}
       </div>

       {/* Área Principal */}
       <div className="flex-1 overflow-hidden flex flex-col relative">
           
           {/* Vista de Formulario de Edición Condicional */}
           {editingPreset && activeTab === 'presets' ? (
               <div className="flex-1 bg-gray-50/20 p-6 overflow-y-auto">
                   <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-black text-gray-800">
                          {presets.some(p => p.id === editingPreset.id) ? 'Editar Plantilla' : 'Crear Plantilla'}
                       </h2>
                       <button onClick={() => setEditingPreset(null)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full">
                          <X size={20} />
                       </button>
                   </div>
                   
                   <div className="flex flex-col lg:flex-row gap-6">
                       {/* Live Preview Panel */}
                       <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center">
                           <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 w-full text-center border-b border-gray-100 pb-2">Vista Previa</h3>
                           <div className="w-full aspect-[3/4] flex items-center justify-center relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50" style={{ backgroundColor: editingPreset.baseColorValue === '#ffffff' ? '#e5e7eb' : '#f9fafb' }}>
                               <TShirtMockup2D 
                                  color={editingPreset.baseColorValue}
                                  logoStyle={editingPreset.logoStyle}
                                  logoColor={editingPreset.defaultLogoColor}
                                  className="w-[85%] h-[85%] z-10 pointer-events-none drop-shadow-md"
                               />
                           </div>
                           <div className="mt-4 text-center">
                               <h4 className="font-bold text-gray-800">{editingPreset.name || 'Sin Nombre'}</h4>
                               <p className="text-xs text-gray-400 mt-1">{editingPreset.baseColorName || 'Color Base'}</p>
                           </div>
                       </div>
                       
                       {/* Edit Form Panel */}
                       <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 grid grid-cols-1 xl:grid-cols-2 gap-6 shadow-sm h-fit">
                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                               <input type="text" value={editingPreset.name} onChange={e => setEditingPreset({...editingPreset, name: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent"/>
                           </div>
                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-1">Color Base (Nombre visual)</label>
                               <input type="text" value={editingPreset.baseColorName} onChange={e => setEditingPreset({...editingPreset, baseColorName: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent"/>
                           </div>
                           
                           <div className="xl:col-span-2">
                               <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                               <textarea value={editingPreset.description} onChange={e => setEditingPreset({...editingPreset, description: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent h-24"></textarea>
                           </div>

                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-1">Color Base HEX</label>
                               <div className="flex items-center gap-2">
                                   <input type="color" value={editingPreset.baseColorValue} onChange={e => setEditingPreset({...editingPreset, baseColorValue: e.target.value})} className="w-10 h-10 border-0 p-0 rounded-xl cursor-pointer" />
                                   <input type="text" value={editingPreset.baseColorValue} onChange={e => setEditingPreset({...editingPreset, baseColorValue: e.target.value})} className="flex-1 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent uppercase font-mono text-sm"/>
                               </div>
                           </div>

                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-1">Estilo de Logo por Defecto</label>
                               <CustomSelect 
                                   value={editingPreset.logoStyle} 
                                   onChange={val => setEditingPreset({...editingPreset, logoStyle: val as LogoStyle})}
                                   options={[
                                       { value: 'classic', label: 'Clásico' },
                                       { value: 'dominican', label: 'Dominicano' }
                                   ]}
                               />
                           </div>

                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-1">Color Logo HEX (Sólo Clásico)</label>
                               <div className="flex items-center gap-2">
                                   <input type="color" value={editingPreset.defaultLogoColor} onChange={e => setEditingPreset({...editingPreset, defaultLogoColor: e.target.value})} className="w-10 h-10 border-0 p-0 rounded-xl cursor-pointer" disabled={editingPreset.logoStyle !== 'classic'} />
                                   <input type="text" value={editingPreset.defaultLogoColor} onChange={e => setEditingPreset({...editingPreset, defaultLogoColor: e.target.value})} className="flex-1 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent uppercase font-mono text-sm" disabled={editingPreset.logoStyle !== 'classic'}/>
                               </div>
                           </div>

                           <div>
                               <label className="block text-sm font-bold text-gray-700 mb-1">Tags (separados por coma)</label>
                               <input type="text" value={editingPreset.tags?.join(', ') || ''} onChange={e => setEditingPreset({...editingPreset, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent"/>
                           </div>

                           {/* Configuración Global y Publicación */}
                           <div className="xl:col-span-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                               <label className="flex items-start gap-3 cursor-pointer">
                                   <input type="checkbox" checked={editingPreset.isVisible !== false} onChange={e => setEditingPreset({...editingPreset, isVisible: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-accent focus:ring-offset-1"/>
                                   <div>
                                       <span className="block font-bold text-gray-800">Visible en Tienda</span>
                                       <span className="block text-xs text-gray-500 mt-0.5">Desmárcalo para ocultar el producto del público.</span>
                                   </div>
                               </label>

                               <label className="flex items-start gap-3 cursor-pointer">
                                   <input type="checkbox" checked={editingPreset.isSoldOut || false} onChange={e => setEditingPreset({...editingPreset, isSoldOut: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-red-500 focus:ring-red-500 focus:ring-offset-1"/>
                                   <div>
                                       <span className="block font-bold text-red-600">Marcado como Agotado</span>
                                       <span className="block text-xs text-red-400/80 mt-0.5">Se verá, pero no permitirá interacción de compra.</span>
                                   </div>
                               </label>
                           </div>

                           {/* Traducciones */}
                           <div className="xl:col-span-2 border-t border-gray-100 pt-4 mt-2">
                               <h4 className="font-bold text-gray-700 mb-4 text-xs uppercase tracking-widest text-brand-accent">Traductor Global</h4>
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1">Nombre (Inglés)</label>
                                       <input type="text" placeholder="Ej: Red Impact" value={editingPreset.nameEn || ''} onChange={e => setEditingPreset({...editingPreset, nameEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1">Descripción (Inglés)</label>
                                       <input type="text" placeholder="Ej: Vibrant red with white logo." value={editingPreset.descEn || ''} onChange={e => setEditingPreset({...editingPreset, descEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1">Nombre (Francés)</label>
                                       <input type="text" placeholder="Ej: Impact Rouge" value={editingPreset.nameFr || ''} onChange={e => setEditingPreset({...editingPreset, nameFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                                   </div>
                                   <div>
                                       <label className="block text-xs font-bold text-gray-500 mb-1">Descripción (Francés)</label>
                                       <input type="text" placeholder="Ej: Rouge vibrant avec logo blanc." value={editingPreset.descFr || ''} onChange={e => setEditingPreset({...editingPreset, descFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                                   </div>
                               </div>
                           </div>

                           <div className="xl:col-span-2 pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                               {presets.some(p => p.id === editingPreset.id) && (
                                   <button 
                                      onClick={async () => { 
                                          if (await showConfirm('¿Estás seguro de eliminar esta plantilla de diseño?')) {
                                              deletePreset(editingPreset.id); 
                                              setEditingPreset(null); 
                                          }
                                      }} 
                                      className="px-4 py-2 border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center gap-2"
                                   >
                                       <Trash2 size={18} /> Eliminar
                                   </button>
                               )}
                               <button onClick={handleSavePreset} className="bg-brand-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2">
                                   <Save size={18} /> Guardar
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           ) : (
             <>
               <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                     <h2 className="text-2xl font-black text-gray-800">
                        {activeTab === 'orders' ? 'Órdenes Activas' : activeTab === 'presets' ? 'Galería de Plantillas' : 'Logos'}
                     </h2>
                     <p className="text-sm text-gray-500 font-medium">Gestiona todo sobre tus diseños personalizados.</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                     <div className="relative flex-1">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                         <input 
                           type="text" 
                           placeholder="Buscar..." 
                           className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm bg-gray-50"
                           value={searchTerm}
                           onChange={(e) => setSearchTerm(e.target.value)}
                         />
                     </div>
                     {activeTab === 'presets' && (
                         <button onClick={handleCreateNew} className="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl text-sm whitespace-nowrap">
                            + Nuevo
                         </button>
                     )}
                     {activeTab === 'orders' && (
                         <button className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-sm whitespace-nowrap flex items-center gap-2">
                             <Filter size={16}/> Filtros
                         </button>
                     )}
                  </div>
               </div>

               {/* Contenido Dinámico Listado */}
               <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/20">
                   {activeTab === 'orders' && (
                        <div className="space-y-4">
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                {[
                                  { label: 'Pendientes', count: orders.filter(o => o.status === 'Pendiente').length, icon: <ClockIcon className="w-5 h-5" />, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
                                  { label: 'En Producción', count: orders.filter(o => o.status === 'Diseñando' || o.status === 'En Producción').length, icon: <CubeIcon className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50 border-blue-200' },
                                  { label: 'Listo', count: orders.filter(o => o.status === 'Listo para Entrega').length, icon: <TruckIcon className="w-5 h-5" />, color: 'text-orange-600 bg-orange-50 border-orange-200' },
                                  { label: 'Entregados', count: orders.filter(o => o.status === 'Entregado').length, icon: <CheckCircleIcon className="w-5 h-5" />, color: 'text-green-600 bg-green-50 border-green-200' },
                                ].map(stat => (
                                  <div key={stat.label} className={`flex items-center gap-3 p-3 rounded-xl border ${stat.color}`}>
                                    {stat.icon}
                                    <div>
                                      <p className="text-lg font-black">{stat.count}</p>
                                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">{stat.label}</p>
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {/* Order Cards */}
                            {orders.filter(o => o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase())).map(o => {
                                const statusConfig: Record<string, { icon: React.ReactNode; bg: string; text: string; border: string; dot: string }> = {
                                  'Pendiente':         { icon: <ClockIcon className="w-4 h-4" />,             bg: 'bg-yellow-50',  text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
                                  'Diseñando':         { icon: <PaintBrushIcon className="w-4 h-4" />,        bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500' },
                                  'En Producción':     { icon: <CubeIcon className="w-4 h-4" />,              bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
                                  'Listo para Entrega':{ icon: <TruckIcon className="w-4 h-4" />,             bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
                                  'Entregado':         { icon: <CheckCircleIcon className="w-4 h-4" />,       bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-500' },
                                  'Cancelado':         { icon: <XCircleIcon className="w-4 h-4" />,           bg: 'bg-red-50',     text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500' },
                                };
                                const sc = statusConfig[o.status] || statusConfig['Pendiente'];
                                const itemCount = o.items.reduce((acc, curr) => acc + curr.quantity, 0);

                                return (
                                    <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        {/* Top color accent bar */}
                                        <div className={`h-1 w-full rounded-t-2xl ${sc.dot}`}></div>

                                        <div className="p-5">
                                            {/* Header row */}
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md font-bold">{o.id}</span>
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
                                                            {sc.icon} {o.status}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-black text-gray-900 text-lg leading-tight">{o.clientName}</h3>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                        {o.room && <span className="font-medium">Hab. {o.room}</span>}
                                                        {o.whatsapp && (
                                                            <span className="flex items-center gap-1 font-medium">
                                                                <PhoneIcon className="w-3 h-3" /> {o.whatsapp}
                                                            </span>
                                                        )}
                                                        <span className="text-gray-400">
                                                            {new Date(o.date).toLocaleDateString('es-DO', { day: 'numeric', month: 'short' })}, {new Date(o.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-2xl font-black text-brand-primary">RD${o.total.toFixed(2)}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">{itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}</p>
                                                </div>
                                            </div>

                                            {/* Items preview */}
                                            <div className="flex gap-3 mb-4 overflow-x-auto pb-1">
                                                {o.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100 flex-shrink-0 min-w-[200px]">
                                                        {/* Mockup preview */}
                                                        {item.details?.logoStyle && item.details?.designs ? (
                                                            <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
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
                                                            <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                                <ShoppingBag size={16} className="text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-gray-800 text-sm truncate">{item.details?.customName || item.name}</p>
                                                            <div className="flex gap-1.5 mt-0.5 flex-wrap">
                                                                {item.details?.size && <span className="text-[9px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded uppercase">{item.details.size}</span>}
                                                                {item.details?.color && <span className="text-[9px] font-bold bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">{item.details.color}</span>}
                                                                <span className="text-[9px] font-bold text-brand-primary">x{item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Actions row */}
                                            <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Cambiar Estado</label>
                                                    <CustomSelect 
                                                        value={o.status} 
                                                        onChange={(val) => {
                                                            if (val !== o.status) {
                                                                setConfirmDialog({ orderId: o.id, newStatus: val as OrderStatus, orderName: o.clientName });
                                                            }
                                                        }}
                                                        options={[
                                                            { value: 'Pendiente', label: 'Pendiente', colorClass: 'bg-yellow-50 text-yellow-600 border-yellow-200', dotColor: 'bg-yellow-500' },
                                                            { value: 'Diseñando', label: 'Diseñando', colorClass: 'bg-blue-50 text-blue-600 border-blue-200', dotColor: 'bg-blue-500' },
                                                            { value: 'En Producción', label: 'En Producción', colorClass: 'bg-purple-50 text-purple-600 border-purple-200', dotColor: 'bg-purple-500' },
                                                            { value: 'Listo para Entrega', label: 'Listo para Entrega', colorClass: 'bg-orange-50 text-orange-600 border-orange-200', dotColor: 'bg-orange-500' },
                                                            { value: 'Entregado', label: 'Entregado', colorClass: 'bg-green-50 text-green-600 border-green-200', dotColor: 'bg-green-500' },
                                                            { value: 'Cancelado', label: 'Cancelado', colorClass: 'bg-red-50 text-red-600 border-red-200', dotColor: 'bg-red-500' }
                                                        ]}
                                                    />
                                                </div>
                                                <div className="flex items-center gap-2 mt-4">
                                                    <button 
                                                        onClick={() => navigate('/admin/receipt', { state: { items: o.items, total: o.total, backTo: '/admin/customizer' } })}
                                                        className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-colors shadow-sm"
                                                    >
                                                        <Eye size={16} /> Ver Recibo
                                                    </button>
                                                    <button 
                                                        onClick={async () => {
                                                            if (await showConfirm('¿Estás seguro de eliminar esta orden?')) {
                                                                deleteOrder(o.id);
                                                            }
                                                        }}
                                                        className="p-2.5 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                                                        title="Eliminar Orden"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {orders.filter(o => o.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                                    <ShoppingBag size={48} className="mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-400 font-bold text-lg">No hay órdenes registradas</p>
                                    <p className="text-gray-300 text-sm mt-1">Las órdenes de personalización aparecerán aquí.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ Status Change Confirmation Dialog ═══ */}
                    {confirmDialog && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDialog(null)}>
                            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 text-lg">Confirmar Cambio de Estado</h3>
                                        <p className="text-sm text-gray-500">Orden de <span className="font-bold">{confirmDialog.orderName}</span></p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-6">
                                    ¿Estás seguro de cambiar el estado de esta orden a <span className="font-bold text-brand-primary">{confirmDialog.newStatus}</span>?
                                </p>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setConfirmDialog(null)}
                                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={() => {
                                            updateOrderStatus(confirmDialog.orderId, confirmDialog.newStatus);
                                            setConfirmDialog(null);
                                        }}
                                        className="flex-1 px-4 py-2.5 bg-brand-primary text-white rounded-xl font-bold text-sm hover:bg-brand-primary/90 transition-colors shadow-sm"
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                   {activeTab === 'presets' && (
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                           {presets.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((style) => (
                               <div key={style.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                   <div className="h-40 w-full flex items-center justify-center relative border-b border-gray-100 overflow-hidden">
                                       <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundColor: style.baseColorValue === '#ffffff' ? '#e5e7eb' : '#f9fafb' }}></div>
                                       <TShirtMockup2D 
                                          color={style.baseColorValue}
                                          logoStyle={style.logoStyle}
                                          logoColor={style.defaultLogoColor}
                                          className="w-[80%] h-[80%] z-10 pointer-events-none drop-shadow-sm"
                                       />
                                       <span className="absolute bottom-2 left-2 z-20 bg-black/30 backdrop-blur-sm text-white text-[10px] uppercase font-black px-2 py-0.5 rounded">
                                           {style.baseColorName}
                                       </span>
                                   </div>
                                   <div className="p-4">
                                       <h4 className="font-bold text-gray-800">{style.name}</h4>
                                       <p className="text-xs text-gray-400 mt-1 line-clamp-2">{style.description}</p>
                                       <div className="mt-3 flex justify-between items-center border-t border-gray-50 pt-3">
                                           <span className="text-xs font-bold text-gray-500">Logo: {style.logoStyle}</span>
                                           <button onClick={() => setEditingPreset({...style})} className="text-brand-accent text-xs font-bold hover:underline">Editar</button>
                                       </div>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}

                   {activeTab === 'logos' && (
                       <div className="flex flex-col gap-4">
                           <p className="text-sm text-gray-500 mb-2">Aquí puedes cargar o habilitar los SVG para que el cliente seleccione como 'Dominicano', 'Clásico', etc.</p>
                           {MODEL_STYLES.map(ls => (
                               <div key={ls.id} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200">
                                   <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                       <img src={ls.img} alt={ls.label} className="max-w-[80%] max-h-[80%] opacity-80" />
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-gray-800">{ls.label} (ID: {ls.id})</h4>
                                       <p className="text-sm text-gray-500">{ls.desc}</p>
                                   </div>
                                   <div className="ml-auto">
                                       <button className="text-blue-500 text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg">Configurar</button>
                                   </div>
                               </div>
                           ))}
                       </div>
                   )}
               </div>
             </>
           )}
       </div>


    </div>
    </>
  );
};

export default CustomizerAdmin;
