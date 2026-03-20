import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Globe, Shield, CreditCard, Mail } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px] overflow-hidden md:flex-row">
       {/* Settings Sidebar Menus */}
       <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
           <h3 className="font-serif font-black text-gray-800 text-lg mb-6 flex items-center gap-2 uppercase tracking-wide">
               <SettingsIcon size={20} className="text-brand-accent"/> Configuración
           </h3>

           {[
              { id: 'general', label: 'General', icon: <SettingsIcon size={18}/> },
              { id: 'notifications', label: 'Notificaciones', icon: <Bell size={18}/> },
              { id: 'localization', label: 'Idiomas y Textos', icon: <Globe size={18}/> },
              { id: 'payments', label: 'Pagos y Facturación', icon: <CreditCard size={18}/> },
              { id: 'security', label: 'Seguridad', icon: <Shield size={18}/> },
              { id: 'emails', label: 'Plantillas E-mail', icon: <Mail size={18}/> },
           ].map(tab => (
               <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

       {/* Settings Content Area */}
       <div className="flex-1 p-8 bg-white flex flex-col">
           <div className="flex-1 max-w-2xl">
               {activeTab === 'general' && (
                   <div className="space-y-8 animate-fade-in">
                        <div>
                            <h4 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">Información de la Boutique</h4>
                            
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-600">Nombre de la Tienda</label>
                                        <input type="text" defaultValue="La Boutique RD" className="border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-600">Correo Electrónico de Contacto</label>
                                        <input type="email" defaultValue="admin@laboutiquerd.clubmed" className="border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-accent focus:outline-none" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-gray-600">Descripción (SEO)</label>
                                    <textarea rows={3} defaultValue="Tienda de ropa, accesorios personalizados y reservas de trenzas en Club Med." className="border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-accent focus:outline-none resize-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2 mb-6">Apariencia y Marca</h4>
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-2xl bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-lg border-2 border-brand-accent">
                                    <span className="font-serif font-black text-2xl">CM</span>
                                </div>
                                <div className="space-y-2">
                                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold text-gray-700 transition-colors">
                                        Subir Nuevo Logo
                                    </button>
                                    <p className="text-xs text-gray-500">Recomendado SVG o PNG transparente (512x512px max 2MB).</p>
                                </div>
                            </div>
                        </div>
                   </div>
               )}

               {activeTab !== 'general' && (
                   <div className="h-full flex flex-col items-center justify-center text-gray-400 animate-fade-in p-12">
                       <SettingsIcon size={48} className="mb-4 opacity-20" />
                       <h4 className="font-bold text-lg text-gray-600 mb-2">Módulo en Construcción</h4>
                       <p className="text-center text-sm">Pronto podrás configurar las preferencias de {activeTab} desde este panel seguro.</p>
                   </div>
               )}
           </div>

           <div className="mt-auto pt-8 flex justify-end">
               <button className="bg-brand-primary text-brand-accent px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-accent hover:text-brand-primary transition-all">
                   <Save size={20} /> Guardar Cambios
               </button>
           </div>
       </div>
    </div>
  );
};

export default Settings;
