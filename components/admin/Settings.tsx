import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Users, Plus, Trash2, Edit2, X, Check } from 'lucide-react';
import { useVendors } from '../../hooks/useVendors';
import { Vendor } from '../../types';
import CustomSelect from '../ui/CustomSelect';
import { useConfirm } from '../../hooks/useConfirm';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('vendors');
  const { vendors, addVendor, deleteVendor, updateVendor } = useVendors();
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorRole, setNewVendorRole] = useState<'Vendedor' | 'Gerente' | 'Admin'>('Vendedor');
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const { showConfirm, ConfirmDialog } = useConfirm();

  const handleAddVendor = () => {
    if (!newVendorName.trim()) return;
    addVendor({ name: newVendorName.trim(), role: newVendorRole });
    setNewVendorName('');
    setNewVendorRole('Vendedor');
  };

  const handleUpdateVendor = () => {
    if (!editingVendor || !editingVendor.name.trim()) return;
    updateVendor(editingVendor);
    setEditingVendor(null);
  };

  return (
    <>
      <ConfirmDialog />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full min-h-[600px] overflow-hidden md:flex-row">
         {/* Settings Sidebar Menus */}
       <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
           <h3 className="font-serif font-black text-gray-800 text-lg mb-6 flex items-center gap-2 uppercase tracking-wide">
               <SettingsIcon size={20} className="text-brand-accent"/> Configuración
           </h3>

           {[
              { id: 'vendors', label: 'Vendedores', icon: <Users size={18}/> },
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
       <div className="flex-1 p-8 bg-white flex flex-col overflow-y-auto custom-scrollbar">
           <div className="flex-1 max-w-3xl">
               {/* ═══════ VENDOR MANAGEMENT ═══════ */}
               {activeTab === 'vendors' && (
                   <div className="space-y-6 animate-fade-in">
                        <div>
                            <h4 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2">Gestión de Vendedores</h4>
                            <p className="text-sm text-gray-500 mb-6">Agrega vendedores por nombre. Se usarán para identificar quién realizó cada venta o reserva.</p>
                        </div>

                        {/* Add New Vendor */}
                        <div className="bg-gray-50/70 p-5 rounded-2xl border border-gray-100">
                            <h5 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                              <Plus size={16} className="text-brand-accent" /> Agregar Vendedor
                            </h5>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                  type="text"
                                  value={newVendorName}
                                  onChange={e => setNewVendorName(e.target.value)}
                                  onKeyDown={e => e.key === 'Enter' && handleAddVendor()}
                                  placeholder="Nombre del vendedor..."
                                  maxLength={100}
                                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm"
                                />
                                <CustomSelect
                                  value={newVendorRole}
                                  onChange={val => setNewVendorRole(val as any)}
                                  options={[
                                    { label: 'Vendedor', value: 'Vendedor' },
                                    { label: 'Gerente', value: 'Gerente' },
                                    { label: 'Admin', value: 'Admin' },
                                  ]}
                                  variant="input"
                                />
                                <button
                                  onClick={handleAddVendor}
                                  disabled={!newVendorName.trim()}
                                  className="bg-brand-primary text-brand-accent font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-40 flex items-center gap-2 whitespace-nowrap"
                                >
                                  <Plus size={16} /> Agregar
                                </button>
                            </div>
                        </div>

                        {/* Vendor List */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4">Nombre</th>
                                        <th className="p-4">Rol</th>
                                        <th className="p-4 text-center w-32">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {vendors.map(vendor => (
                                        <tr key={vendor.id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="p-4">
                                              {editingVendor?.id === vendor.id ? (
                                                <input
                                                  type="text"
                                                  value={editingVendor.name}
                                                  onChange={e => setEditingVendor({...editingVendor, name: e.target.value})}
                                                  onKeyDown={e => e.key === 'Enter' && handleUpdateVendor()}
                                                  maxLength={100}
                                                  className="border border-brand-accent rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm w-full"
                                                  autoFocus
                                                />
                                              ) : (
                                                <div className="flex items-center gap-3">
                                                  <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm">
                                                    {vendor.name[0]?.toUpperCase()}
                                                  </div>
                                                  <span className="font-bold text-gray-800">{vendor.name}</span>
                                                </div>
                                              )}
                                            </td>
                                            <td className="p-4">
                                              {editingVendor?.id === vendor.id ? (
                                                <CustomSelect
                                                  value={editingVendor.role}
                                                  onChange={val => setEditingVendor({...editingVendor, role: val as any})}
                                                  options={[
                                                    { label: 'Vendedor', value: 'Vendedor' },
                                                    { label: 'Gerente', value: 'Gerente' },
                                                    { label: 'Admin', value: 'Admin' },
                                                  ]}
                                                  variant="input"
                                                />
                                              ) : (
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                  vendor.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                                  vendor.role === 'Gerente' ? 'bg-amber-100 text-amber-700' :
                                                  'bg-brand-accent/20 text-brand-primary'
                                                }`}>
                                                  {vendor.role}
                                                </span>
                                              )}
                                            </td>
                                            <td className="p-4 text-center">
                                              {editingVendor?.id === vendor.id ? (
                                                <div className="flex justify-center gap-1">
                                                  <button onClick={handleUpdateVendor} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Check size={16}/></button>
                                                  <button onClick={() => setEditingVendor(null)} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"><X size={16}/></button>
                                                </div>
                                              ) : (
                                                <div className="flex justify-center gap-1">
                                                  <button onClick={() => setEditingVendor({...vendor})} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={15}/></button>
                                                  <button onClick={async () => { if (await showConfirm(`¿Eliminar a ${vendor.name}?`)) deleteVendor(vendor.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15}/></button>
                                                </div>
                                              )}
                                            </td>
                                        </tr>
                                    ))}
                                    {vendors.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-8 text-center text-gray-400">
                                              <Users size={32} className="mx-auto mb-2 opacity-30" />
                                              <p className="font-bold">No hay vendedores registrados</p>
                                              <p className="text-xs mt-1">Agrega vendedores arriba para asignarlos a ventas y reservas.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
                          <strong>Nota:</strong> Los vendedores aparecerán como opciones en el checkout de ventas, reservas de trenzas y personalizados. El campo vendedor es opcional (se puede dejar sin asignar).
                        </div>
                   </div>
               )}
           </div>
       </div>
    </div>
    </>
  );
};

export default Settings;
