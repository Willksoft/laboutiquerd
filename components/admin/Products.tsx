import React, { useState, useMemo } from 'react';
import { Box, Plus, Search, Edit2, Trash2, X, Save, EyeOff, Palette, ShoppingBag } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { Product } from '../../types';

const CUSTOM_CATEGORIES = ['custom'];

const ProductsAdmin: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productTab, setProductTab] = useState<'custom' | 'boutique'>('boutique');

  const customProducts = useMemo(() => products.filter(p => CUSTOM_CATEGORIES.includes(p.category)), [products]);
  const boutiqueProducts = useMemo(() => products.filter(p => !CUSTOM_CATEGORIES.includes(p.category)), [products]);

  const activeProducts = productTab === 'custom' ? customProducts : boutiqueProducts;
  const filteredProducts = activeProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCreateNew = () => {
    setEditingProduct({
        id: `p-${Date.now()}`,
        name: 'Nuevo Producto',
        price: 0,
        category: productTab === 'custom' ? 'custom' : 'boutique-pc',
        image: 'https://images.unsplash.com/photo-1595907409228-db6bbef26685?auto=format&fit=crop&q=80&w=400',
        description: '',
        isVisible: true,
        isSoldOut: false
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
       <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-widest sticky top-0 z-10">
             <tr>
               <th className="p-4 w-16">Estado</th>
               <th className="p-4">Imagen</th>
               <th className="p-4 w-1/3">Nombre / Descripción</th>
               <th className="p-4">Categoría</th>
               <th className="p-4">Precio (RD$)</th>
               <th className="p-4 text-center">Acciones</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
             {items.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors group ${product.isVisible === false ? 'bg-gray-50 opacity-60' : ''}`}>
                   <td className="p-4">
                       <div className="flex flex-col gap-1">
                          {product.isVisible === false && <span className="text-[9px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1 w-fit"><EyeOff size={10}/> Oculto</span>}
                          {product.isSoldOut && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider w-fit">Agotado</span>}
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
                      <span className="bg-brand-accent/20 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
                   </td>
                   <td className="p-4 font-black">
                      {product.originalPrice && <span className="text-gray-400 line-through text-xs block">${product.originalPrice.toFixed(2)}</span>}
                      ${product.price.toFixed(2)}
                   </td>
                   <td className="p-4 text-center space-x-2 whitespace-nowrap">
                      <button onClick={() => setEditingProduct(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                   </td>
                </tr>
             ))}
             {items.length === 0 && (
                 <tr>
                     <td colSpan={6} className="p-8 text-center text-gray-400 font-bold">No se encontraron productos.</td>
                 </tr>
             )}
          </tbody>
       </table>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full min-h-[600px] relative">
      {!editingProduct ? (
         <>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div>
               <h2 className="text-2xl font-serif font-black text-brand-primary flex items-center gap-3">
                   <Box className="text-brand-accent p-1.5 bg-brand-accent/10 rounded-lg" size={32}/> 
                   Catálogo de Productos
               </h2>
               <p className="text-gray-500 mt-1 font-medium text-sm">Productos divididos por tipo: personalizables y boutique.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <div className="relative flex-1">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                   <input 
                     type="text" 
                     placeholder="Buscar producto..." 
                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-accent focus:outline-none"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
               </div>
               <button onClick={handleCreateNew} className="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-brand-accent hover:text-brand-primary transition-colors whitespace-nowrap">
                  <Plus size={18} /> Nuevo
               </button>
            </div>
          </div>

          {/* Product Type Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-6 w-fit">
              <button 
                onClick={() => { setProductTab('boutique'); setSearchTerm(''); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${productTab === 'boutique' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  <ShoppingBag size={16}/> Boutique ({boutiqueProducts.length})
              </button>
              <button 
                onClick={() => { setProductTab('custom'); setSearchTerm(''); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${productTab === 'custom' ? 'bg-white shadow-sm text-brand-primary' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  <Palette size={16}/> Personalizables ({customProducts.length})
              </button>
          </div>

          {renderTable(filteredProducts)}
         </>
      ) : (
         /* Formulario de Edición */
         <div className="flex-1 flex flex-col h-full overflow-hidden w-full bg-gray-50/30 -m-6 p-6 rounded-2xl">
             <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-black text-gray-800">
                    {products.some(p => p.id === editingProduct.id) ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                 </h2>
                 <button onClick={() => setEditingProduct(null)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors"><X size={20} /></button>
             </div>
             
             <div className="flex flex-col lg:flex-row gap-6 overflow-y-auto custom-scrollbar">
                 <div className="w-full lg:w-1/3 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center sticky top-0 h-fit">
                     <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 w-full text-center border-b border-gray-100 pb-2">Vista Previa</h3>
                     <div className="w-full aspect-square overflow-hidden rounded-xl bg-gray-100 relative shadow-sm border border-gray-200">
                         <img src={editingProduct.image} alt="preview" className={`w-full h-full object-cover ${editingProduct.isSoldOut ? 'grayscale opacity-70' : ''}`}/>
                         
                         {editingProduct.category && (
                             <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded font-black text-[10px] text-brand-primary uppercase shadow-sm">
                                {editingProduct.category}
                             </div>
                         )}

                         {editingProduct.isSoldOut && (
                             <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center pointer-events-none">
                                <span className="bg-red-500 text-white font-black px-4 py-2 uppercase tracking-widest rounded-xl shadow-lg border-2 border-white -rotate-12">Agotado</span>
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
                         <label className="block text-sm font-bold text-gray-700 mb-1">Nombre</label>
                         <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent"/>
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
                         <select value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent bg-white">
                             <option value="custom">Merch (Custom)</option>
                             <option value="boutique-pc">Boutique Punta Cana</option>
                             <option value="boutique-miches">Boutique El Cedro</option>
                             <option value="boutique-beach">Boutique Playa</option>
                             <option value="fashion">Ropa</option>
                             <option value="jewelry">Joyería</option>
                             <option value="personal-care">Cuidado Personal</option>
                             <option value="bisuteria">Bisutería</option>
                             <option value="crafts">Artesanía</option>
                             <option value="gift-card">Gift Cards</option>
                             <option value="toys">Juguetes</option>
                         </select>
                     </div>
                     <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-gray-700 mb-1">URL Imagen</label>
                         <input type="text" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm text-gray-500"/>
                     </div>

                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Precio Real (RD$)</label>
                         <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent font-black text-brand-primary"/>
                     </div>
                     <div>
                         <label className="block text-sm font-bold text-gray-700 mb-1">Precio Anterior (Tachado) Opcional</label>
                         <input type="number" value={editingProduct.originalPrice || ''} onChange={e => setEditingProduct({...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-gray-400"/>
                     </div>


                     <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
                         <textarea value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent h-20"></textarea>
                     </div>

                     <div className="md:col-span-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                         <label className="flex items-start gap-3 cursor-pointer">
                             <input type="checkbox" checked={editingProduct.isVisible !== false} onChange={e => setEditingProduct({...editingProduct, isVisible: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-accent"/>
                             <div><span className="block font-bold text-gray-800">Visible en Tienda</span><span className="block text-xs text-gray-500 mt-0.5">Ocultar completamente del catálogo.</span></div>
                         </label>
                         <label className="flex items-start gap-3 cursor-pointer">
                             <input type="checkbox" checked={editingProduct.isSoldOut || false} onChange={e => setEditingProduct({...editingProduct, isSoldOut: e.target.checked})} className="w-5 h-5 mt-0.5 rounded border-gray-300 text-red-500 focus:ring-red-500"/>
                             <div><span className="block font-bold text-red-600">Marcado como Agotado</span><span className="block text-xs text-red-400 mt-0.5">Aparece pero no se puede seleccionar.</span></div>
                         </label>
                     </div>

                     <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                         <h4 className="font-bold text-gray-700 mb-4 text-xs uppercase tracking-widest text-brand-accent">Traducción Global a Inglés (Opcional)</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1">Nombre (Inglés)</label>
                                 <input type="text" value={editingProduct.nameEn || ''} onChange={e => setEditingProduct({...editingProduct, nameEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 mb-1">Descripción (Inglés)</label>
                                 <input type="text" value={editingProduct.descEn || ''} onChange={e => setEditingProduct({...editingProduct, descEn: e.target.value})} className="w-full bg-gray-50/50 border border-gray-200 p-2 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"/>
                             </div>
                         </div>
                     </div>

                     <div className="md:col-span-2 pt-4 flex justify-end gap-3 border-t border-gray-100 mt-4">
                         <button onClick={handleSaveProduct} className="bg-brand-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2"><Save size={18} /> Guardar Cambios</button>
                     </div>
                 </div>
             </div>
         </div>
      )}
    </div>
  );
};

export default ProductsAdmin;
