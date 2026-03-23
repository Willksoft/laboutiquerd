import React, { useState, useRef } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, EyeIcon, EyeSlashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useCategories, type ProductCategory } from '../../hooks/useCategories';
import { useConfirm } from '../../hooks/useConfirm';
import ImageUploader from './ImageUploader';
import CustomSelect from '../ui/CustomSelect';

const EMOJI_OPTIONS = ['👗','👟','👜','💎','📿','🧴','🌸','🏺','🏠','🎒','🧸','📱','👛','🩱','⚽','🛍️','🎁','🎨','🍫','💄','🧳','🔮','⌚','🎭','🏋️','🎮','🪆','🧶','🪡','🥿'];

type FormMode = 'create' | 'edit';

const emptyForm = (): Omit<ProductCategory, 'id'> => ({
  key: '',
  name: '',
  nameEn: '',
  nameFr: '',
  emoji: '🛍️',
  image: '',
  sortOrder: 99,
  isActive: true,
});

const CategoriesAdmin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [mode, setMode] = useState<FormMode | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const getCatName = (cat: ProductCategory) => {
    const lang = i18n.language;
    return (lang.startsWith('en') && cat.nameEn) ? cat.nameEn
         : (lang.startsWith('fr') && cat.nameFr) ? cat.nameFr
         : cat.name;
  };

  const openCreate = () => {
    setForm(emptyForm());
    setMode('create');
    setEditingId(null);
    setError('');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const openEdit = (cat: ProductCategory) => {
    setForm({
      key: cat.key,
      name: cat.name,
      nameEn: cat.nameEn || '',
      nameFr: cat.nameFr || '',
      emoji: cat.emoji || '🛍️',
      image: cat.image || '',
      sortOrder: cat.sortOrder ?? 99,
      isActive: cat.isActive !== false,
    });
    setMode('edit');
    setEditingId(cat.id);
    setError('');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError(t('El nombre es obligatorio')); return; }
    if (!form.key.trim()) form.key = form.name;
    setSaving(true);
    setError('');
    try {
      if (mode === 'create') {
        await addCategory({ ...form, sortOrder: categories.length + 1 });
      } else if (editingId) {
        await updateCategory(editingId, form);
      }
      setMode(null);
      setEditingId(null);
    } catch (e: any) {
      setError(e.message || t('Error al guardar'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: ProductCategory) => {
    const ok = await showConfirm(
      `${t('¿Eliminar categoría?')} "${getCatName(cat)}"`,
      { title: t('¿Eliminar categoría?'), confirmLabel: t('Eliminar'), danger: true }
    );
    if (!ok) return;
    await deleteCategory(cat.id);
  };

  const moveOrder = async (cat: ProductCategory, dir: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
    const idx = sorted.findIndex(c => c.id === cat.id);
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const swapCat = sorted[swapIdx];
    await Promise.all([
      updateCategory(cat.id, { sortOrder: swapCat.sortOrder ?? swapIdx + 1 }),
      updateCategory(swapCat.id, { sortOrder: cat.sortOrder ?? idx + 1 }),
    ]);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <ConfirmDialog />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('Categorías de Productos')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('Gestiona las categorías del catálogo y el mega menú')}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all"
        >
          <PlusIcon className="w-4 h-4" />
          {t('Nueva Categoría')}
        </button>
      </div>

      {/* Form */}
      {mode && (
        <div ref={formRef} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 animate-fade-in-up">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            {mode === 'create' ? t('Nueva Categoría') : t('Editar Categoría')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name ES */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('Nombre')} (ES) *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value, key: e.target.value }))}
                placeholder="Ej: Moda & Ropa"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            {/* Name EN */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('Nombre')} (EN)</label>
              <input
                type="text"
                value={form.nameEn}
                onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                placeholder="Ej: Fashion & Clothing"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            {/* Name FR */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('Nombre')} (FR)</label>
              <input
                type="text"
                value={form.nameFr}
                onChange={e => setForm(f => ({ ...f, nameFr: e.target.value }))}
                placeholder="Ej: Mode & Vêtements"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            {/* Emoji */}
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('Emoji')}</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{form.emoji}</span>
                <CustomSelect
                  variant="input"
                  value={form.emoji || ''}
                  options={EMOJI_OPTIONS.map(em => ({ value: em, label: em }))}
                  onChange={val => setForm(f => ({ ...f, emoji: val }))}
                  className="flex-1"
                />
              </div>
            </div>
            {/* Image */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1.5">{t('Imagen de Categoría')}</label>
              <ImageUploader
                currentUrl={form.image}
                onImageChange={url => setForm(f => ({ ...f, image: url }))}
                compact={false}
              />
              <p className="text-[10px] text-gray-400 mt-1">{t('También puedes pegar una URL directamente:')}</p>
              <input
                type="url"
                value={form.image}
                onChange={e => setForm(f => ({ ...f, image: e.target.value }))}
                placeholder="https://..."
                className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? 'bg-black' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            <span className="text-sm font-medium text-gray-700">{form.isActive ? t('Activo') : t('Inactivo')}</span>
          </div>

          {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}

          <div className="flex gap-3 mt-5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {saving ? t('Guardando...') : t('Guardar')}
            </button>
            <button
              onClick={() => { setMode(null); setEditingId(null); }}
              className="px-5 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              {t('Cancelar')}
            </button>
          </div>
        </div>
      )}

      {/* Categories List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">{t('Cargando...')}</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center text-xs font-bold text-gray-400 uppercase tracking-wider px-4 py-2.5 border-b border-gray-100 bg-gray-50">
            <span className="w-8">#</span>
            <span>{t('Categoría')}</span>
            <span className="w-20 text-center">{t('Estado')}</span>
            <span className="w-20 text-center">{t('Orden')}</span>
            <span className="w-20 text-center">{t('Acciones')}</span>
          </div>

          {categories.length === 0 && (
            <div className="py-12 text-center text-gray-400">
              <PhotoIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>{t('No hay categorías aún.')}</p>
            </div>
          )}

          {[...categories]
            .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99))
            .map((cat, idx, arr) => (
            <div
              key={cat.id}
              className={`grid grid-cols-[auto_1fr_auto_auto_auto] items-center px-4 py-3 border-b border-gray-50 hover:bg-gray-50/60 transition-colors ${editingId === cat.id ? 'bg-amber-50/30' : ''}`}
            >
              {/* Sort number */}
              <span className="w-8 text-[11px] text-gray-400 font-mono">{idx + 1}</span>

              {/* Name + image */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                  {cat.image
                    ? <img src={cat.image} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-lg">{cat.emoji}</div>
                  }
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">{getCatName(cat)} {cat.emoji}</p>
                  <p className="text-[11px] text-gray-400 truncate">{cat.nameEn && `EN: ${cat.nameEn}`}{cat.nameFr && ` · FR: ${cat.nameFr}`}</p>
                </div>
              </div>

              {/* Status */}
              <div className="w-20 flex justify-center">
                <button
                  onClick={() => updateCategory(cat.id, { isActive: !cat.isActive })}
                  title={cat.isActive ? t('Activo - clic para desactivar') : t('Inactivo - clic para activar')}
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}
                >
                  {cat.isActive ? <><EyeIcon className="w-3 h-3" />{t('Visible')}</> : <><EyeSlashIcon className="w-3 h-3" />{t('Oculto')}</>}
                </button>
              </div>

              {/* Order controls */}
              <div className="w-20 flex justify-center gap-0.5">
                <button onClick={() => moveOrder(cat, 'up')} disabled={idx === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                  <ChevronUpIcon className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => moveOrder(cat, 'down')} disabled={idx === arr.length - 1} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition-colors">
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Actions */}
              <div className="w-20 flex justify-center gap-1">
                <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-black hover:text-white transition-all text-gray-400">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(cat)} className="p-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-all text-gray-400">
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoriesAdmin;
