import { useState, useCallback } from 'react';
import { FunnelIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Product } from '../types';

interface ProductSidebarProps {
  products: Product[];
  onFilter: (filtered: Product[]) => void;
  t: (key: string) => string;
}

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

const CATEGORY_LABELS: Record<string, string> = {
  jewelry: 'Joyería',
  crafts: 'Artesanía',
  toys: 'Juguetes',
  'personal-care': 'Cuidado Personal',
  'boutique-pc': 'Boutique Punta Cana',
  'boutique-miches': 'Boutique Michès',
  'boutique-beach': 'Boutique Playa',
  'boutique-playa': 'Boutique Playa',
  bisuteria: 'Bisutería',
  custom: 'Personalizados',
};

export default function ProductSidebar({ products, onFilter, t }: ProductSidebarProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 99999]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [showOnlyOffers, setShowOnlyOffers] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sort: true,
    category: true,
    price: true,
    tags: false,
  });

  // Extract unique tags and categories
  const allTags = Array.from(
    new Set(products.flatMap(p => p.tags ?? []).filter(t => !t.startsWith('RD$')))
  ).sort();

  const allCategories = Array.from(new Set(products.map(p => p.category))).sort();
  const showCategoryFilter = allCategories.length > 1;

  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Centralized filter application
  const applyAllFilters = useCallback((
    price: [number, number],
    tags: string[],
    categories: string[],
    sort: SortOption,
    offers: boolean
  ) => {
    let filtered = [...products];

    // Category
    if (categories.length > 0) {
      filtered = filtered.filter(p => categories.includes(p.category));
    }
    // Price
    filtered = filtered.filter(p => p.price >= price[0] && p.price <= price[1]);
    // Tags
    if (tags.length > 0) {
      filtered = filtered.filter(p => p.tags?.some(t => tags.includes(t)));
    }
    // Offers
    if (offers) {
      filtered = filtered.filter(p => p.originalPrice && p.originalPrice > p.price);
    }
    // Sort
    switch (sort) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    onFilter(filtered);
  }, [products, onFilter]);

  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    applyAllFilters([min, max], selectedTags, selectedCategories, sortBy, showOnlyOffers);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag) ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag];
    setSelectedTags(newTags);
    applyAllFilters(priceRange, newTags, selectedCategories, sortBy, showOnlyOffers);
  };

  const handleCategoryToggle = (cat: string) => {
    const newCats = selectedCategories.includes(cat) ? selectedCategories.filter(c => c !== cat) : [...selectedCategories, cat];
    setSelectedCategories(newCats);
    applyAllFilters(priceRange, selectedTags, newCats, sortBy, showOnlyOffers);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort);
    applyAllFilters(priceRange, selectedTags, selectedCategories, sort, showOnlyOffers);
  };

  const handleOffersToggle = () => {
    const newVal = !showOnlyOffers;
    setShowOnlyOffers(newVal);
    applyAllFilters(priceRange, selectedTags, selectedCategories, sortBy, newVal);
  };

  const clearFilters = () => {
    setPriceRange([0, 99999]);
    setSelectedTags([]);
    setSelectedCategories([]);
    setSortBy('default');
    setShowOnlyOffers(false);
    onFilter(products);
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedCategories.length > 0 || showOnlyOffers || sortBy !== 'default' || priceRange[0] > 0 || priceRange[1] < 99999;

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 space-y-1.5 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-brand-primary" />
            <h3 className="font-semibold text-brand-primary text-sm uppercase tracking-wider">{t('Filtros')}</h3>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors">
              <XMarkIcon className="w-3.5 h-3.5" />
              {t('Limpiar')}
            </button>
          )}
        </div>

        {/* Sort By */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <button 
            onClick={() => toggleSection('sort')} 
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('Ordenar por')}
            {expandedSections.sort ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
          {expandedSections.sort && (
            <div className="px-4 pb-3 space-y-1">
              {([
                ['default', t('Relevancia')],
                ['price-asc', t('Precio: Menor a Mayor')],
                ['price-desc', t('Precio: Mayor a Menor')],
                ['name-asc', t('Nombre A-Z')],
              ] as [SortOption, string][]).map(([value, label]) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer py-1 group">
                  <input
                    type="radio"
                    name="sort"
                    checked={sortBy === value}
                    onChange={() => handleSortChange(value)}
                    className="w-3.5 h-3.5 text-brand-primary accent-brand-primary"
                  />
                  <span className={`text-sm ${sortBy === value ? 'text-brand-primary font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Categories - only show when multiple categories exist */}
        {showCategoryFilter && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button 
              onClick={() => toggleSection('category')} 
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('Categoría')}
              {expandedSections.category ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {expandedSections.category && (
              <div className="px-4 pb-3 space-y-1">
                {allCategories.map(cat => {
                  const count = products.filter(p => p.category === cat).length;
                  return (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer py-1 group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryToggle(cat)}
                        className="w-3.5 h-3.5 rounded accent-brand-primary text-brand-primary"
                      />
                      <span className={`text-sm flex-1 ${selectedCategories.includes(cat) ? 'text-brand-primary font-medium' : 'text-gray-600 group-hover:text-gray-800'}`}>
                        {t(CATEGORY_LABELS[cat] || cat)}
                      </span>
                      <span className="text-[10px] text-gray-400">{count}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Price Range */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <button 
            onClick={() => toggleSection('price')} 
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('Precio')}
            {expandedSections.price ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
          {expandedSections.price && (
            <div className="px-4 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wide">Min</label>
                  <input
                    type="number"
                    value={priceRange[0] || ''}
                    onChange={e => handlePriceChange(Number(e.target.value) || 0, priceRange[1])}
                    placeholder={`${minPrice}`}
                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none"
                  />
                </div>
                <span className="text-gray-300 mt-4">—</span>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-400 uppercase tracking-wide">Max</label>
                  <input
                    type="number"
                    value={priceRange[1] < 99999 ? priceRange[1] : ''}
                    onChange={e => handlePriceChange(priceRange[0], Number(e.target.value) || 99999)}
                    placeholder={`${maxPrice}`}
                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 outline-none"
                  />
                </div>
              </div>
              <p className="text-[10px] text-gray-400">RD${minPrice.toLocaleString()} — RD${maxPrice.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <button 
              onClick={() => toggleSection('tags')} 
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t('Etiquetas')}
              {expandedSections.tags ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
            </button>
            {expandedSections.tags && (
              <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-brand-primary hover:text-brand-primary'
                    }`}
                  >
                    {t(tag)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Offers Only */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <label className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={showOnlyOffers}
              onChange={handleOffersToggle}
              className="w-4 h-4 rounded accent-brand-primary text-brand-primary"
            />
            <span className="text-sm text-gray-700">{t('Solo ofertas')}</span>
          </label>
        </div>

        {/* Product count */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-400">
            {products.length} {t('productos')}
          </p>
        </div>
      </div>
    </aside>
  );
}
