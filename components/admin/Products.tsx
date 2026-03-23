import React, { useState, useMemo } from 'react';
import { Box, Plus, Search, Edit2, Trash2, X, Save, EyeOff, Palette, ShoppingBag, Tag, FolderPlus, Check, Images } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { useBrands } from '../../hooks/useBrands';
import { useCategories } from '../../hooks/useCategories';
import { Product } from '../../types';
import ImageUploader from './ImageUploader';
import CustomSelect from '../ui/CustomSelect';
import { useConfirm } from '../../hooks/useConfirm';
import { useTranslation } from 'react-i18next';

const CUSTOM_CATEGORIES = ['custom'];

const ProductsAdmin: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { brands } = useBrands();
  const { categories, addCategory } = useCategories();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const { t } = useTranslation();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productTab, setProductTab] = useState<'custom' | 'boutique'>('boutique');
  const [brandFilter, setBrandFilter] = useState('');

  // Inline category creation
  const [showNewCatForm, setShowNewCatForm] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [savingCat, setSavingCat] = useState(false);

  const handleCreateCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    setSavingCat(true);
    try {
      await addCategory({
        key: name, name, nameEn: '', nameFr: '',
        emoji: '🛍️', image: '', sortOrder: categories.length + 1, isActive: true,
      });
      if (editingProduct) setEditingProduct({ ...editingProduct, category: name as any });
      setNewCatName('');
      setShowNewCatForm(false);
    } finally {
      setSavingCat(false);
    }
  };



  const customProducts = useMemo(() => products.filter(p => CUSTOM_CATEGORIES.includes(p.category)), [products]);
  const boutiqueProducts = useMemo(() => products.filter(p => !CUSTOM_CATEGORIES.includes(p.category)), [products]);

  const activeProducts = productTab === 'custom' ? customProducts : boutiqueProducts;
  const filteredProducts = activeProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !brandFilter || p.brandId === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const getBrandName = (brandId?: string) => {
    if (!brandId) return null;
    return brands.find(b => b.id === brandId)?.name || null;
  };

  const handleCreateNew = () => {
    setEditingProduct({
        id: `p-${Date.now()}`,
        name: 'Nuevo Producto',
        price: 0,
        category: productTab === 'custom' ? 'custom' : 'boutique-pc',
        image: '',
        description: '',
        isVisible: true,
        isSoldOut: false,
        brandId: '',
    });
  };

  const handleSaveProduct = () => {
      if (!editingProduct) return;
      if (products.some(p => p.id === editingProduct.id)) {
          updateProduct(editingProduct);
      } else {
          addProduct(editingProduct);
      }
      setEditingProduct(null);
  };

  const renderTable = (items: Product[]) => (
    <div className="flex-1 overflow-x-auto border border-gray-100 rounded-xl relative">
       <table className="w-full text-left border-collapse min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest sticky top-0 z-10">
             <tr>
               <th className="p-4 w-16">{t('Estado')}</th>
               <th className="p-4">{t('Imagen')}</th>
               <th className="p-4 w-1/4">{t('Nombre / Descripción')}</th>
               <th className="p-4">{t('Marca')}</th>
               <th className="p-4">{t('Categoría')}</th>
               <th className="p-4">{t('Precio (RD$)')}</th>
               <th className="p-4 text-center">{t('Acciones')}</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
             {items.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors group ${product.isVisible === false ? 'bg-gray-50 opacity-60' : ''}`}>
                   <td className="p-4">
                       <div className="flex flex-col gap-1">
                          {product.isVisible === false && <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><EyeOff size={10}/> {t('Oculto')}</span>}
                          {product.isSoldOut && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider w-fit">{t('Agotado')}</span>}
                       </div>
                   </td>
                   <td className="p-4">
                      <img src={product.image} alt={product.name} className={`w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm ${product.isSoldOut ? 'grayscale opacity-80' : ''}`} />
                   </td>
                   <td className="p-4">
                      <p className="font-bold text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                      {product.nameEn && <p className="text-[10px] text-brand-accent font-bold mt-1">EN: {product.nameEn}</p>}
                   </td>
                   <td className="p-4">
                      {getBrandName(product.brandId) ? (
                        <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                          <Tag size={10} /> {getBrandName(product.brandId)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                   </td>
                   <td className="p-4">
                      <span className="bg-brand-accent/20 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
                   </td>
                   <td className="p-4 font-black">
                      {product.originalPrice && <span className="text-gray-400 line-through text-xs block">${product.originalPrice.toFixed(2)}</span>}
                      ${product.price.toFixed(2)}
                   </td>
                   <td className="p-4 text-center space-x-2 whitespace-nowrap">
                      <button onClick={() => setEditingProduct(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={async () => { if (await showConfirm(`¿Eliminar "${product.name}"?`)) deleteProduct(product.id); }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                   </td>
                </tr>
             ))}
             {items.length === 0 && (
                 <tr>
                     <td colSpan={7} className="p-8 text-center text-gray-400 font-bold">{t('No se encontraron productos.')}</td>
                 </tr>
             )}
          </tbody>
       </table>
    </div>
  );

  return (
    <>
    <ConfirmDialog />
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[600px] relative">
      {!editingProduct ? (
         <>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
               <h2 className="text-2xl font-serif font-black text-brand-primary flex items-center gap-3">
                   <Box className="text-brand-accent p-1.5 bg-brand-accent/10 rounded-lg" size={32}/> 
                   {t('Catálogo de Productos')}
               </h2>
               <p className="text-gray-500 mt-1 font-medium text-sm">{t('Productos divididos por tipo: personalizables y boutique.')}</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <div className="relative flex-1">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                   <input 
                     type="text" 
                     placeholder={t('Buscar producto...')} 
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:outline-none"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
               </div>
               <button onClick={handleCreateNew} className="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-accent hover:text-brand-primary transition-colors whitespace-nowrap">
                  <Plus size={18} /> {t('Nuevo')}
               </button>
            </div>
          </div>

          {/* Tabs + Brand Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
              <button 
                onClick={() => { setProductTab('boutique'); setSearchTerm(''); setBrandFilter(''); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${productTab === 'boutique' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  <ShoppingBag size={16}/> {t('Boutique')} ({boutiqueProducts.length})
              </button>
              <button 
                onClick={() => { setProductTab('custom'); setSearchTerm(''); setBrandFilter(''); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${productTab === 'custom' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  <Palette size={16}/> {t('Personalizables')} ({customProducts.length})
              </button>
            </div>

            {/* Brand filter */}
            {brands.length > 0 && (
              <div className="w-56">
                <CustomSelect
                  value={brandFilter}
                  onChange={val => setBrandFilter(val)}
                  options={[
                    { label: t('Todas las marcas'), value: '' },
                    ...brands.filter(b => b.isVisible !== false).map(b => ({ label: b.name, value: b.id }))
                  ]}
                  variant="input"
                />
              </div>
            )}
          </div>

          {renderTable(filteredProducts)}
         </>
      ) : (
         /* Formulario de Edición */
         <div className="flex-1 flex flex-col h-full overflow-hidden w-full bg-gray-50/30 -m-6 p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black text-gray-800">
                    {products.some(p => p.id === editingProduct.id) ? t('Editar Producto') : t('Agregar Nuevo Producto')}
                 </h2>
                 <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors"><X size={20} /></button>
             </div>
             
             <div className="flex flex-col lg:flex-row gap-6 overflow-y-auto custom-scrollbar">
                 <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center sticky top-0 h-fit">
                     <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 w-full text-center border-b border-gray-100 pb-2">{t('Vista Previa')}</h3>
                     <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100 relative shadow-sm border border-gray-200">
                         <img src={editingProduct.image} alt="preview" className={`w-full h-full object-cover ${editingProduct.isSoldOut ? 'grayscale opacity-70' : ''}`}/>
                         
                         {editingProduct.category && (
                             <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded font-black text-[10px] text-brand-primary uppercase shadow-sm">
                                {editingProduct.category}
                             </div>
                         )}
                         {getBrandName(editingProduct.brandId) && (
                             <div className="absolute top-2 right-2 bg-purple-500/90 backdrop-blur-sm text-white px-2 py-1 rounded font-bold text-[10px] flex items-center gap-1">
                                <Tag size={8} /> {getBrandName(editingProduct.brandId)}
                             </div>
                         )}

                         {editingProduct.isSoldOut && (
                             <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center pointer-events-none">
                                <span className="bg-red-500 text-white font-black px-4 py-2 uppercase tracking-widest rounded-xl shadow-lg border-2 border-white -rotate-12">{t('Agotado')}</span>
                             </div>
                         )}
                         {editingProduct.isVisible === false && (
                             <div className="absolute top-2 right-2 bg-black text-white p-1.5 rounded-lg shadow-xl"><EyeOff size={16}/></div>
                         )}
                     </div>
                     <div className="w-full mt-4 flex items-start justify-between">
                         <div>
                             <h4 className="font-bold text-gray-800">{editingProduct.name}</h4>
                             <p className="text-xs text-brand-primary font-black mt-1">RD$ {editingProduct.price.toFixed(2)}</p>
                         </div>
                     </div>
                     <p className="text-xs text-gray-500 mt-2 line-clamp-3 text-center">{editingProduct.description}</p>
                 </div>
                 
                 <div className="flex-1 bg-white p-6 rounded-2xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm h-fit">
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">{t('Nombre')}</label>
                         <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent" maxLength={200}/>
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">{t('Categoría')}</label>
                         <div className="flex gap-2 items-start">
                           <div className="flex-1">
                             <CustomSelect
                               value={editingProduct.category}
                               onChange={val => setEditingProduct({...editingProduct, category: val as any})}
                               options={[
                                 { label: t('Merch (Custom)'), value: 'custom' },
                                 { label: t('Boutique Punta Cana'), value: 'boutique-pc' },
                                 { label: t('Boutique El Cedro'), value: 'boutique-miches' },
                                 { label: t('Boutique Playa'), value: 'boutique-beach' },
                                 { label: t('Gift Cards'), value: 'gift-card' },
                                 ...categories
                                   .filter(c => c.isActive !== false)
                                   .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
                                   .filter(c => !['custom','boutique-pc','boutique-miches','boutique-beach','gift-card'].includes(c.key))
                                   .map(c => ({ label: ``, value: c.key }))
                               ]}
                               variant="input"
                             />
                           </div>
                           <button
                             type="button"
                             onClick={() => setShowNewCatForm(v => !v)}
                             title={t('Crear nueva categoría')}
                             className="mt-0.5 p-2.5 rounded-xl border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all text-gray-400 shrink-0"
                           >
                             <FolderPlus size={16} />
                           </button>
                         </div>
                         {showNewCatForm && (
                           <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                             <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide mb-2">{t('Nueva categoría rápida')}</p>
                             <div className="flex gap-2">
                               <input
                                 type="text"
                                 value={newCatName}
                                 onChange={e => setNewCatName(e.target.value)}
                                 onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
                                 placeholder={t('Nombre de la categoría...')}
                                 autoFocus
                                 className="flex-1 border border-amber-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                               />
                               <button
                                 onClick={handleCreateCategory}
                                 disabled={savingCat || !newCatName.trim()}
                                 className="px-3 py-1.5 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-40 flex items-center gap-1.5 transition-all"
                               >
                                 {savingCat ? '...' : <><Check size={14} />{t('Crear')}</>}
                               </button>
                               <button
                                 onClick={() => { setShowNewCatForm(false); setNewCatName(''); }}
                                 className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50"
                               >
                                 <X size={14} />
                               </button>
                             </div>
                             <p className="text-[10px] text-amber-600 mt-1.5">{t('Se creará como categoría activa. Puedes editarla desde el módulo "Categorías".')}</p>
                           </div>
                         )}
                     </div>

                     {/* BRAND SELECTOR */}
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1 flex items-center gap-1">
                           <Tag size={14} className="text-purple-500" /> {t('Marca')}
                         </label>
                         <CustomSelect
                           value={editingProduct.brandId || ''}
                           onChange={val => setEditingProduct({...editingProduct, brandId: val || undefined})}
                           options={[
                             { label: t('Sin marca específica (Global)'), value: '' },
                             ...brands.map(b => ({ label: b.name, value: b.id }))
                           ]}
                           variant="input"
                         />
                         {brands.length === 0 && (
                           <p className="text-[10px] text-gray-400 mt-1">{t('No hay marcas creadas. Créalas en la sección "Marcas" del menú.')}</p>
                         )}
                     </div>

                     <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-gray-700 mb-2">{t('Imagen del Producto')}</label>
                         <ImageUploader 
                           currentUrl={editingProduct.image} 
                           onImageChange={(url) => setEditingProduct({...editingProduct, image: url})} 
                         />
                     </div>

                      {/* Gallery */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                          <Images size={15} className="text-brand-accent"/>
                          {t('Galería de Fotos')}
                          <span className="text-xs font-normal text-gray-400">({(editingProduct.gallery?.length || 0)}/8)</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {(editingProduct.gallery || []).map((url, idx) => (
                            <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                              <img src={url} alt={`gallery-${idx}`} className="w-full h-full object-cover"/>
                              <button type="button"
                                onClick={() => {
                                  const g = [...(editingProduct.gallery || [])];
                                  g.splice(idx, 1);
                                  setEditingProduct({...editingProduct, gallery: g});
                                }}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                              >
                                <X size={12}/>
                              </button>
                              <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">#{idx+1}</div>
                            </div>
                          ))}
                          {(editingProduct.gallery?.length || 0) < 8 && (
                            <div className="aspect-square">
                              <ImageUploader
                                currentUrl=""
                                onImageChange={(url) => {
                                  if (!url) return;
                                  const g = [...(editingProduct.gallery || []), url];
                                  setEditingProduct({...editingProduct, gallery: g});
                                }}
                                compact={true}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{t('Añade hasta 8 fotos adicionales para la galería del producto.')}</p>
                      </div>


                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">{t('Precio Real (RD$)')}</label>
                         <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent font-black text-brand-primary"/>
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">{t('Precio Anterior (Tachado) Opcional')}</label>
                         <input type="number" value={editingProduct.originalPrice || ''} onChange={e => setEditingProduct({...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-gray-400"/>
                     </div>

                     <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-gray-700 mb-1">{t('Descripción')}</label>
                         <textarea value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent h-20" maxLength={1000}></textarea>
                     </div>

                     <div className="md:col-span-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                         <label className="flex items-start gap-3 cursor-pointer">
                             <input type="checkbox" checked={editingProduct.isVisible !== false} onChange={e => setEditingProduct({...editingProduct, isVisible: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-accent"/>
                             <div><span className="block font-bold text-gray-800">{t('Visible en Tienda')}</span><span className="block text-xs text-gray-500 mt-0.5">{t('Ocultar completamente del catálogo.')}</span></div>
                         </label>
                         <label className="flex items-start gap-3 cursor-pointer">
                             <input type="checkbox" checked={editingProduct.isSoldOut || false} onChange={e => setEditingProduct({...editingProduct, isSoldOut: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-red-500 focus:ring-red-500"/>
                             <div><span className="block font-bold text-red-600">{t('Marcado como Agotado')}</span><span className="block text-xs text-red-400 mt-0.5">{t('Aparece pero no se puede seleccionar.')}</span></div>
                         </label>
                     </div>

                     <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                         <h4 className="font-bold text-gray-700 mb-4 text-xs uppercase tracking-widest text-brand-accent">{t('Traductor Global (Opcional)')}</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1">{t('Nombre (Inglés)')}</label>
                                 <input type="text" value={editingProduct.nameEn || ''} onChange={e => setEditingProduct({...editingProduct, nameEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm" maxLength={200}/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1">{t('Descripción (Inglés)')}</label>
                                 <input type="text" value={editingProduct.descEn || ''} onChange={e => setEditingProduct({...editingProduct, descEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm" maxLength={500}/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1">{t('Nombre (Francés)')}</label>
                                 <input type="text" value={editingProduct.nameFr || ''} onChange={e => setEditingProduct({...editingProduct, nameFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm" maxLength={200}/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1">{t('Descripción (Francés)')}</label>
                                 <input type="text" value={editingProduct.descFr || ''} onChange={e => setEditingProduct({...editingProduct, descFr: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm" maxLength={500}/>
                             </div>
                         </div>
                     </div>

                     <div className="md:col-span-2 pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                         <button onClick={() => setEditingProduct(null)} className="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">{t('Cancelar')}</button>
                         <button onClick={handleSaveProduct} className="bg-brand-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2"><Save size={18} /> {t('Guardar Cambios')}</button>
                     </div>
                 </div>
             </div>
         </div>
       )}
    </div>
    </>
  );
};

export default ProductsAdmin;
