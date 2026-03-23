import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, X, Save, Check, Image as ImageIcon, EyeOff } from 'lucide-react';
import { useBrands } from '../../hooks/useBrands';
import { Brand } from '../../types';
import ImageUploader from './ImageUploader';
import { useConfirm } from '../../hooks/useConfirm';

const BrandsAdmin: React.FC = () => {
  const { brands, addBrand, updateBrand, deleteBrand } = useBrands();
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showConfirm, showAlert, ConfirmDialog } = useConfirm();

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setEditingBrand({
      id: `brand-${Date.now()}`,
      name: '',
      logo: '',
      description: '',
      isVisible: true,
    });
  };

  const handleSave = () => {
    if (!editingBrand || !editingBrand.name.trim()) {
      showAlert('El nombre de la marca es requerido.');
      return;
    }
    if (brands.some(b => b.id === editingBrand.id)) {
      updateBrand(editingBrand);
    } else {
      addBrand(editingBrand);
    }
    setEditingBrand(null);
  };

  return (
    <>
    <ConfirmDialog />
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[600px] relative">
      {!editingBrand ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-serif font-black text-brand-primary flex items-center gap-3">
                <Tag className="text-brand-accent p-1.5 bg-brand-accent/10 rounded-lg" size={32} />
                Marcas / Brands
              </h2>
              <p className="text-gray-500 mt-1 font-medium text-sm">
                Gestiona las marcas que se asocian a tus productos.
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Buscar marca..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 sm:w-48 border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand-accent focus:outline-none text-sm"
              />
              <button
                onClick={handleCreateNew}
                className="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-accent hover:text-brand-primary transition-colors whitespace-nowrap"
              >
                <Plus size={18} /> Nueva Marca
              </button>
            </div>
          </div>

          {/* Brands List View */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-3 pr-2">
              {filteredBrands.map(brand => (
                <div
                  key={brand.id}
                  className={`bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 group hover:border-brand-accent/50 hover:shadow-sm transition-all duration-200 ${brand.isVisible === false ? 'opacity-60 bg-gray-50' : ''}`}
                >
                  {/* Avatar / Logo Thumb */}
                  <div className="w-12 h-12 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden relative">
                    {brand.logo ? (
                      <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1.5" />
                    ) : (
                      <div className="text-gray-300">
                        <ImageIcon size={20} />
                      </div>
                    )}
                    {brand.isVisible === false && (
                      <div className="absolute top-1 right-1 bg-black/70 text-white p-0.5 rounded shadow-sm">
                        <EyeOff size={8} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 text-lg truncate">{brand.name}</h3>
                    {brand.description ? (
                      <p className="text-sm text-gray-500 truncate mt-0.5">{brand.description}</p>
                    ) : (
                       <p className="text-xs text-gray-400 italic mt-0.5">Sin descripción</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingBrand({ ...brand })}
                      className="p-2 text-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                      title="Editar Marca"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={async () => {
                        if (await showConfirm(`¿Eliminar la marca "${brand.name}"?`)) deleteBrand(brand.id);
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                      title="Eliminar Marca"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}

              {filteredBrands.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                  <Tag size={48} className="opacity-20 mb-3" />
                  <p className="font-bold text-lg">No hay marcas registradas</p>
                  <p className="text-sm mt-1">Crea una marca para asociarla a tus productos.</p>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* ═══════ BRAND EDITOR FORM ═══════ */
        <div className="flex-1 flex flex-col h-full overflow-hidden w-full bg-gray-50/30 -m-6 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-gray-800">
              {brands.some(b => b.id === editingBrand.id) ? 'Editar Marca' : 'Nueva Marca'}
            </h2>
            <button onClick={() => setEditingBrand(null)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 overflow-y-auto custom-scrollbar">
            {/* Preview */}
            <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center sticky top-0 h-fit">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 w-full text-center border-b border-gray-100 pb-2">Vista Previa</h3>
              <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                {editingBrand.logo ? (
                  <img src={editingBrand.logo} alt="preview" className="w-full h-full object-contain p-4" />
                ) : (
                  <div className="text-gray-300 flex flex-col items-center gap-2">
                    <ImageIcon size={48} />
                    <span className="text-xs font-bold">Sin Logo</span>
                  </div>
                )}
              </div>
              <h4 className="font-bold text-gray-800 mt-4 text-lg text-center">{editingBrand.name || 'Nombre de la Marca'}</h4>
              {editingBrand.description && (
                <p className="text-xs text-gray-500 mt-2 text-center">{editingBrand.description}</p>
              )}
            </div>

            {/* Form Fields */}
            <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 grid grid-cols-1 gap-6 shadow-sm h-fit">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nombre de la Marca *</label>
                <input
                  type="text"
                  value={editingBrand.name}
                  onChange={e => setEditingBrand({ ...editingBrand, name: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent"
                  maxLength={100}
                  placeholder="Ej: Nike, Larimar Collection, Dominican Vibes..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Logo de la Marca</label>
                <ImageUploader
                  currentUrl={editingBrand.logo || ''}
                  onImageChange={(url) => setEditingBrand({ ...editingBrand, logo: url })}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Descripción (opcional)</label>
                <textarea
                  value={editingBrand.description || ''}
                  onChange={e => setEditingBrand({ ...editingBrand, description: e.target.value })}
                  className="w-full border border-gray-200 p-2.5 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent h-24"
                  maxLength={500}
                  placeholder="Breve descripción de la marca..."
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer bg-gray-50 p-4 rounded-xl border border-gray-100">
                <input
                  type="checkbox"
                  checked={editingBrand.isVisible !== false}
                  onChange={e => setEditingBrand({ ...editingBrand, isVisible: e.target.checked })}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-accent"
                />
                <div>
                  <span className="block font-bold text-gray-800">Visible en Tienda</span>
                  <span className="block text-xs text-gray-500 mt-0.5">Si está desactivado, la marca no aparecerá en los filtros públicos.</span>
                </div>
              </label>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={() => setEditingBrand(null)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="bg-brand-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2"
                >
                  <Save size={18} /> Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default BrandsAdmin;
