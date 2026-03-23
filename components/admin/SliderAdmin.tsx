import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Plus, EyeOff, ImageIcon, MoveUp, MoveDown, Trash2, Edit2, Check, X, ArrowUpCircle, ArrowDownCircle, Grid, Link, Image as TypeIcon } from 'lucide-react';
import { useOffers } from '../../hooks/useOffers';
import { Offer } from '../../types';
import ImageUploader from './ImageUploader';
import { useConfirm } from '../../hooks/useConfirm';
import { useSiteContent } from '../../hooks/useSiteContent';
import { useProducts } from '../../hooks/useProducts';
import { useTranslation } from 'react-i18next';

const SliderAdmin: React.FC = () => {
  const { offers, addOffer, updateOffer, deleteOffer, updateOrderings } = useOffers();
  const { content, updateValue } = useSiteContent();
  const { products } = useProducts();
  const [editingSlide, setEditingSlide] = useState<Offer | null>(null);
  const { showConfirm, showAlert, ConfirmDialog } = useConfirm();
  const [activeTab, setActiveTab] = useState<'slider' | 'categories'>('slider');
  const { t } = useTranslation();

  // Parse quick categories
  const [quickCats, setQuickCats] = useState<any[]>([]);
  useEffect(() => {
     try {
       setQuickCats(JSON.parse(content.home_quick_categories || '[]'));
     } catch {
       setQuickCats([]);
     }
  }, [content.home_quick_categories]);

  // Unique categories from products
  const productCategories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const handleCreateNew = () => {
    setEditingSlide({
      id: `temp-${Date.now()}`,
      title: '',
      subtitle: '',
      image: '',
      discount: '',
      link: '',
      isActive: true,
      sortOrder: offers.length
    });
  };

  const handleSave = () => {
    if (!editingSlide || !editingSlide.title.trim() || !editingSlide.image) {
      showAlert('El título y la imagen son requeridos para el slider.');
      return;
    }
    if (offers.some(b => b.id === editingSlide.id)) {
      updateOffer(editingSlide);
    } else {
      addOffer(editingSlide);
    }
    setEditingSlide(null);
  };

  const handleDelete = async (slide: Offer) => {
    const confirmed = await showConfirm(`¿Seguro que deseas eliminar el slide "${slide.title}"?`);
    if (confirmed) {
      deleteOffer(slide.id);
    }
  };

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === offers.length - 1) return;

    const newOffers = [...offers];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    const temp = newOffers[index];
    newOffers[index] = newOffers[targetIndex];
    newOffers[targetIndex] = temp;

    // re-assign sortOrders
    const ordered = newOffers.map((o, idx) => ({ ...o, sortOrder: idx }));
    updateOrderings(ordered);
  };

  return (
    <>
    <ConfirmDialog />
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[600px] relative">
      {!editingSlide && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-serif font-black text-brand-primary flex items-center gap-3">
              <LayoutDashboard className="text-brand-accent p-1.5 bg-brand-accent/10 rounded-lg" size={32} />
              {t('Editor de Slider & Categorías')}
            </h2>
            <p className="text-gray-500 mt-1 font-medium text-sm">
              {t('Configura el slider principal y la cantidad de categorías rápidas a mostrar en el Home.')}
            </p>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
             <button onClick={() => setActiveTab('slider')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'slider' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                {t('Banners (Slider)')}
             </button>
             <button onClick={() => setActiveTab('categories')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'categories' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                {t('Categorías Rápidas')}
             </button>
          </div>
          {activeTab === 'slider' && (
             <button
                onClick={handleCreateNew}
                className="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-accent hover:text-brand-primary transition-colors whitespace-nowrap"
             >
                <Plus size={18} /> {t('Nuevo Slide')}
             </button>
          )}
        </div>
      )}

      {!editingSlide ? (
        activeTab === 'slider' ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col gap-3 pr-2">
              {offers.map((slide, index) => (
                <div key={slide.id} className={`bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 group hover:border-brand-accent/50 hover:shadow-sm transition-all duration-200 ${slide.isActive === false ? 'opacity-60 bg-gray-50' : ''}`}>
                  
                  {/* Sorting controls */}
                  <div className="flex flex-col gap-1 items-center text-gray-300">
                    <button onClick={() => moveSlide(index, 'up')} disabled={index === 0} className="hover:text-blue-500 disabled:opacity-30"><ArrowUpCircle size={20}/></button>
                    <button onClick={() => moveSlide(index, 'down')} disabled={index === offers.length - 1} className="hover:text-blue-500 disabled:opacity-30"><ArrowDownCircle size={20}/></button>
                  </div>

                  <div className="w-24 h-16 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center border border-gray-100 overflow-hidden relative">
                    {slide.image ? (
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-gray-300" />
                    )}
                    {slide.isActive === false && (
                      <div className="absolute top-1 right-1 bg-black/70 text-white p-0.5 rounded shadow-sm">
                        <EyeOff size={10} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate">{slide.title}</h3>
                      {slide.discount && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded font-bold">-{slide.discount}</span>}
                    </div>
                    {slide.subtitle && <p className="text-sm text-gray-500 truncate">{slide.subtitle}</p>}
                    <p className="text-xs text-brand-accent mt-1 truncate">Link: {slide.link ? slide.link : '/offers'}</p>
                  </div>

                  <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => updateOffer({ ...slide, isActive: !slide.isActive })} className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${slide.isActive ? 'text-gray-500' : 'text-blue-500'}`} title={slide.isActive ? 'Ocultar' : 'Mostrar'}>
                         <EyeOff size={18} />
                      </button>
                      <button onClick={() => setEditingSlide(slide)} className="p-2 text-brand-primary hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                         <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(slide)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                         <Trash2 size={18} />
                      </button>
                  </div>
                </div>
              ))}
              {offers.length === 0 && (
                <div className="text-center py-20 text-gray-400 font-medium border-2 border-dashed border-gray-100 rounded-xl">
                  No hay slides configurados.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
             <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 relative">
                 <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Grid size={20} className="text-brand-primary"/> Categorías Destacadas</h3>
                 <p className="text-sm text-gray-500 mb-6">Configura la cantidad y orden de las categorías que aparecen en cuadrícula debajo del slider principal.</p>

                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                     {quickCats.map((cat, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col gap-3 shadow-sm relative group">
                            <button onClick={async () => {
                                const newCats = quickCats.filter((_, i) => i !== idx);
                                setQuickCats(newCats);
                                await updateValue('home_quick_categories', JSON.stringify(newCats));
                            }} className="absolute -top-2 -right-2 bg-red-100 text-red-500 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                               <X size={12} className="stroke-[3]" />
                            </button>
                            <div>
                                <label className="text-xs font-bold text-gray-500">ID / Ruta</label>
                                <input type="text" value={cat.id} onChange={(e) => {
                                    const newCats = [...quickCats]; newCats[idx].id = e.target.value; setQuickCats(newCats);
                                }} onBlur={() => updateValue('home_quick_categories', JSON.stringify(quickCats))} className="w-full bg-gray-50 p-2 rounded-lg text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Etiqueta</label>
                                <input type="text" value={cat.label} onChange={(e) => {
                                    const newCats = [...quickCats]; newCats[idx].label = e.target.value; setQuickCats(newCats);
                                }} onBlur={() => updateValue('home_quick_categories', JSON.stringify(quickCats))} className="w-full bg-gray-50 p-2 rounded-lg text-sm mt-1" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Icono (Ej: SwatchIcon)</label>
                                <input type="text" value={cat.icon} onChange={(e) => {
                                    const newCats = [...quickCats]; newCats[idx].icon = e.target.value; setQuickCats(newCats);
                                }} onBlur={() => updateValue('home_quick_categories', JSON.stringify(quickCats))} className="w-full bg-gray-50 p-2 rounded-lg text-sm mt-1" />
                            </div>
                        </div>
                     ))}
                     
                     <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[150px] cursor-pointer hover:border-brand-primary transition-colors hover:bg-gray-100" onClick={async () => {
                         const newCats = [...quickCats, { id: 'nueva-categoria', label: 'Nueva Categoría', icon: 'ShoppingBagIcon' }];
                         setQuickCats(newCats);
                         await updateValue('home_quick_categories', JSON.stringify(newCats));
                     }}>
                         <Plus size={32} className="text-gray-400 mb-2" />
                         <span className="text-sm font-bold text-gray-500">Añadir Categoría</span>
                     </div>
                 </div>
             </div>
          </div>
        )
      ) : (
        /* Edit Form */
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-2xl font-serif font-black text-brand-primary">
              {editingSlide.id.startsWith('temp-') ? 'Crear Nuevo Slide' : 'Manejo Avanzado de Slider'}
            </h2>
            <button onClick={() => setEditingSlide(null)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 custom-scrollbar pb-8">
            <div className="space-y-6">
               <div className="form-control">
                  <label className="label text-sm font-bold text-gray-700">Título del Slide (Obligatorio) *</label>
                  <input type="text" value={editingSlide.title} onChange={e => setEditingSlide({...editingSlide, title: e.target.value})} className="input w-full border border-gray-200 rounded-xl px-4 py-2" placeholder="Ej: Nueva Colección..." maxLength={100} />
               </div>
               
               <div className="form-control">
                  <label className="label text-sm font-bold text-gray-700">Subtítulo Descriptivo</label>
                  <input type="text" value={editingSlide.subtitle} onChange={e => setEditingSlide({...editingSlide, subtitle: e.target.value})} className="input w-full border border-gray-200 rounded-xl px-4 py-2" placeholder="Ej: Materiales orgánicos 100%..." maxLength={200} />
               </div>

               <div className="border-t border-gray-100 pt-4 mt-2">
                   <h4 className="font-bold text-gray-700 mb-4 text-xs uppercase tracking-widest text-brand-accent">Traductor Global</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Título (Inglés)</label>
                           <input type="text" value={editingSlide.titleEn || ''} onChange={e => setEditingSlide({...editingSlide, titleEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Subtítulo (Inglés)</label>
                           <input type="text" value={editingSlide.subtitleEn || ''} onChange={e => setEditingSlide({...editingSlide, subtitleEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Título (Francés)</label>
                           <input type="text" value={editingSlide.titleFr || ''} onChange={e => setEditingSlide({...editingSlide, titleFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-gray-500 mb-1">Subtítulo (Francés)</label>
                           <input type="text" value={editingSlide.subtitleFr || ''} onChange={e => setEditingSlide({...editingSlide, subtitleFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                       </div>
                   </div>
               </div>
               
               <div className="form-control">
                  <label className="label text-sm font-bold text-gray-700">Insignia Promocional (Opcional)</label>
                  <input type="text" value={editingSlide.discount} onChange={e => setEditingSlide({...editingSlide, discount: e.target.value})} className="input w-full border border-gray-200 rounded-xl px-4 py-2" placeholder="Ej: 20%" maxLength={50} />
               </div>
               
               <div className="form-control">
                  <label className="label text-sm font-bold text-gray-700">Enlace Dinámico de Categoría / Sección</label>
                  <select 
                     className="input w-full border border-gray-200 rounded-xl px-4 py-2"
                     value={editingSlide.link || ''}
                     onChange={e => setEditingSlide({...editingSlide, link: e.target.value})}
                  >
                     <option value="">Vista Predeterminada (/offers)</option>
                     <option value="/offers">Ofertas (/offers)</option>
                     <option value="/braids">Estudio de Trenzas (/braids)</option>
                     <option value="/custom">Personalizables T-Shirts (/custom)</option>
                     <option value="/universal-designer">Personalizados Totales (/universal-designer)</option>
                     <option value="/gift-cards">Gift Cards (/gift-cards)</option>
                     {productCategories.map(cat => (
                         <option key={cat} value={'/' + cat}>Cat: {cat.toUpperCase()}</option>
                     ))}
                  </select>
               </div>
               
               <label className="flex items-center gap-2 cursor-pointer mt-4">
                  <input type="checkbox" checked={editingSlide.isActive !== false} onChange={e => setEditingSlide({...editingSlide, isActive: e.target.checked})} className="rounded text-brand-primary" />
                  <span className="text-sm font-bold text-gray-700">Slide Visible al Público</span>
               </label>
            </div>
            
            <div>
               <label className="label text-sm font-bold text-gray-700 mb-2 block">Cargar Imagen Destacada (Aspect Ratio Horizontal recomendado) *</label>
               <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <ImageUploader key="img-uploader" currentUrl={editingSlide.image} onImageChange={(url) => setEditingSlide({ ...editingSlide, image: url })} />
               </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end gap-3">
             <button onClick={() => setEditingSlide(null)} className="px-6 py-2 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition-colors">Cancelar</button>
             <button onClick={handleSave} className="bg-brand-primary text-white font-bold px-8 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-accent hover:text-brand-primary transition-colors">
                 <Check size={18} /> Aplicar Cambios
             </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default SliderAdmin;
