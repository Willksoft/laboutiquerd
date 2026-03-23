import React, { useState, useRef } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useServices, type ServiceItem } from '../../hooks/useServices';
import { useConfirm } from '../../hooks/useConfirm';
import ImageUploader from './ImageUploader';
import { Layers } from 'lucide-react';

const EMOJI_OPTIONS = ['💆‍♀️','💎','✏️','🌸','🧴','💄','🪡','💍','🎨','🪆','✂️','👗','👛','🏺','🎁','🌴','🤿','🏄','🏋️','🎭'];

const PATH_OPTIONS = [
  { value: '/braids',   label: 'Estudio de Trenzas (/braids)' },
  { value: '/bisuteria',label: 'Bisutería (/bisuteria)' },
  { value: '/custom',   label: 'Personalizados (/custom)' },
  { value: '/jewelry',  label: 'Joyería (/jewelry)' },
  { value: '/personal-care', label: 'Cuidado Personal (/personal-care)' },
  { value: '/products', label: 'Todos los Productos (/products)' },
];

type FormMode = 'create' | 'edit';

const emptyForm = (): Omit<ServiceItem, 'id'> => ({
  key: '/braids',
  name: '',
  nameEn: '',
  nameFr: '',
  description: '',
  descriptionEn: '',
  descriptionFr: '',
  emoji: '💆‍♀️',
  image: '',
  tag: '',
  sortOrder: 99,
  isActive: true,
});

const ServicesAdmin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { services, loading, addService, updateServiceItem, deleteServiceItem } = useServices();
  const { showConfirm, ConfirmDialog } = useConfirm();
  const [mode, setMode] = useState<FormMode | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const getSvcName = (svc: ServiceItem) => {
    const lang = i18n.language;
    return (lang.startsWith('en') && svc.nameEn) ? svc.nameEn
         : (lang.startsWith('fr') && svc.nameFr) ? svc.nameFr
         : svc.name;
  };

  const openCreate = () => {
    setForm(emptyForm());
    setMode('create');
    setEditingId(null);
    setError('');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const openEdit = (svc: ServiceItem) => {
    setForm({
      key: svc.key,
      name: svc.name,
      nameEn: svc.nameEn || '',
      nameFr: svc.nameFr || '',
      description: svc.description || '',
      descriptionEn: svc.descriptionEn || '',
      descriptionFr: svc.descriptionFr || '',
      emoji: svc.emoji || '💆‍♀️',
      image: svc.image || '',
      tag: svc.tag || '',
      sortOrder: svc.sortOrder ?? 99,
      isActive: svc.isActive !== false,
    });
    setMode('edit');
    setEditingId(svc.id);
    setError('');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError(t('El nombre es obligatorio')); return; }
    setSaving(true);
    setError('');
    try {
      if (mode === 'create') {
        await addService({ ...form, sortOrder: services.length + 1 });
      } else if (editingId) {
        await updateServiceItem(editingId, form);
      }
      setMode(null);
      setEditingId(null);
    } catch (e: any) {
      setError(e.message || t('Error al guardar'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (svc: ServiceItem) => {
    showConfirm(
      `${t('¿Eliminar')} "${getSvcName(svc)}"? ${t('Esta acción no se puede deshacer.')}`,
      { title: t('Eliminar servicio'), confirmLabel: t('Eliminar'), danger: true }
    ).then((ok) => {
      if (ok) deleteServiceItem(svc.id);
    });
  };

  const handleToggleActive = async (svc: ServiceItem) => {
    await updateServiceItem(svc.id, { isActive: !svc.isActive });
  };

  const setField = (k: keyof typeof form, v: unknown) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setError('');
  };

  return (
    <div className="space-y-6">
      <ConfirmDialog />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Layers size={22} className="text-brand-accent" />
            {t('Servicios del Mega Menú')}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{t('Administra las tarjetas del menú de Servicios en el encabezado.')}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-brand-accent rounded-xl font-bold text-sm hover:bg-brand-accent hover:text-brand-primary transition-all shadow-md"
        >
          <PlusIcon className="w-4 h-4" /> {t('Nuevo Servicio')}
        </button>
      </div>

      {/* Cards list */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">{t('Cargando...')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map(svc => (
            <div
              key={svc.id}
              className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col transition-all ${svc.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}
            >
              {/* Image preview */}
              <div className="relative h-36 bg-gray-100 overflow-hidden">
                {svc.image ? (
                  <img src={svc.image} alt={getSvcName(svc)} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {svc.emoji || '🛍️'}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                {svc.emoji && (
                  <span className="absolute top-2 left-2 text-xl drop-shadow-md">{svc.emoji}</span>
                )}
                {svc.tag && (
                  <span className="absolute top-2 right-2 bg-brand-accent text-brand-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {svc.tag}
                  </span>
                )}
                <p className="absolute bottom-2 left-3 text-white font-bold text-sm drop-shadow-md">{getSvcName(svc)}</p>
              </div>

              {/* Info + actions */}
              <div className="p-4 flex-1 flex flex-col gap-3">
                <div>
                  <p className="text-xs text-gray-400 font-mono">{svc.key}</p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{svc.description}</p>
                </div>
                <div className="flex items-center gap-2 mt-auto">
                  <button
                    onClick={() => openEdit(svc)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 hover:bg-brand-primary hover:text-white border border-gray-100 font-bold text-xs transition-all"
                  >
                    <PencilIcon className="w-3.5 h-3.5" /> {t('Editar')}
                  </button>
                  <button
                    onClick={() => handleToggleActive(svc)}
                    title={svc.isActive ? t('Desactivar') : t('Activar')}
                    className={`p-2 rounded-xl border font-bold text-xs transition-all ${svc.isActive ? 'bg-green-50 border-green-200 text-green-600 hover:bg-green-100' : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'}`}
                  >
                    {svc.isActive ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(svc)}
                    className="p-2 rounded-xl bg-red-50 border border-red-100 text-red-400 hover:bg-red-100 transition-all"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form panel */}
      {mode && (
        <div ref={formRef} className="bg-white rounded-2xl border border-brand-primary/20 shadow-lg p-6 space-y-6">
          <h4 className="font-bold text-gray-800 text-lg">
            {mode === 'create' ? t('Nuevo Servicio') : t('Editar Servicio')}
          </h4>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-4">
              {/* Route */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('Página de destino')}</label>
                <select
                  value={form.key}
                  onChange={e => setField('key', e.target.value)}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm"
                >
                  {PATH_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Name ES */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('Nombre (ES)')} *</label>
                <input type="text" value={form.name} onChange={e => setField('name', e.target.value)}
                  placeholder="Estudio de Trenzas" maxLength={80}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('Nombre (EN)')}</label>
                <input type="text" value={form.nameEn || ''} onChange={e => setField('nameEn', e.target.value)}
                  placeholder="Braid Studio" maxLength={80}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('Nombre (FR)')}</label>
                <input type="text" value={form.nameFr || ''} onChange={e => setField('nameFr', e.target.value)}
                  placeholder="Studio de Tresses" maxLength={80}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm" />
              </div>

              {/* Emoji + Tag + Sort */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{t('Emoji')}</label>
                  <select value={form.emoji || ''} onChange={e => setField('emoji', e.target.value)}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm">
                    {EMOJI_OPTIONS.map(em => <option key={em} value={em}>{em}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{t('Etiqueta')}</label>
                  <input type="text" value={form.tag || ''} onChange={e => setField('tag', e.target.value)}
                    placeholder="Reservable" maxLength={20}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">{t('Orden')}</label>
                  <input type="number" value={form.sortOrder ?? 99} onChange={e => setField('sortOrder', Number(e.target.value))}
                    min={1} max={99}
                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm" />
                </div>
              </div>

              {/* Active */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isActive !== false} onChange={e => setField('isActive', e.target.checked)}
                  className="w-4 h-4 accent-brand-primary rounded" />
                <span className="text-sm font-bold text-gray-700">{t('Visible en el mega menú')}</span>
              </label>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('Imagen del servicio')}</label>
                <ImageUploader currentUrl={form.image || ''} onImageChange={(url) => setField('image', url)} />
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('Descripción corta (ES)')}</label>
                <textarea value={form.description || ''} onChange={e => setField('description', e.target.value)}
                  placeholder="Trenzas caribeñas auténticas..." maxLength={200} rows={2}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('Descripción (EN)')}</label>
                <textarea value={form.descriptionEn || ''} onChange={e => setField('descriptionEn', e.target.value)}
                  placeholder="Authentic Caribbean braids..." maxLength={200} rows={2}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">{t('Descripción (FR)')}</label>
                <textarea value={form.descriptionFr || ''} onChange={e => setField('descriptionFr', e.target.value)}
                  placeholder="Tresses caribéennes..." maxLength={200} rows={2}
                  className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 outline-none focus:ring-brand-accent text-sm resize-none" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="px-8 py-3 bg-brand-primary text-brand-accent rounded-xl font-bold hover:bg-brand-accent hover:text-brand-primary transition-all shadow-md disabled:opacity-50">
              {saving ? t('Guardando...') : mode === 'create' ? t('Crear Servicio') : t('Guardar Cambios')}
            </button>
            <button onClick={() => { setMode(null); setEditingId(null); }}
              className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all">
              {t('Cancelar')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesAdmin;
