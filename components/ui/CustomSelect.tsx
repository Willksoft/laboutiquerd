import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
  colorClass?: string;
  dotColor?: string;
}

interface CustomSelectProps {
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
  className?: string;
  variant?: 'default' | 'input';
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, options, onChange, className = '', variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedOpt = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isInput = variant === 'input';

  const triggerClasses = isInput
    ? `w-full flex items-center justify-between gap-2 px-3 py-3 rounded-xl border-2 font-bold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent ${selectedOpt?.colorClass || 'bg-white border-gray-200 text-brand-primary hover:border-brand-accent'}`
    : `w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-full border-2 font-bold text-xs transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-accent ${selectedOpt?.colorClass || 'bg-white border-gray-200 text-gray-700 hover:border-brand-primary'}`;

  const dropdownItemClasses = isInput
    ? `w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm font-bold transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none`
    : `w-full flex items-center gap-2 text-left px-4 py-2 text-xs font-bold transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none`;

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)} 
        className={triggerClasses}
      >
        <div className="flex items-center gap-2 truncate">
           {selectedOpt?.dotColor && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedOpt.dotColor}`} />}
           <span className="truncate">{selectedOpt?.label}</span>
        </div>
        <ChevronDown size={isInput ? 16 : 14} className={`transition-transform text-gray-400 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}/>
      </button>
      
      {isOpen && (
        <div className={`absolute top-full mt-1.5 left-0 w-full z-50 bg-white ${isInput ? 'rounded-xl' : 'rounded-xl'} shadow-xl shadow-brand-primary/10 border border-gray-100 py-1 overflow-hidden animate-fade-in-up max-h-[200px] overflow-y-auto custom-scrollbar`}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`${dropdownItemClasses} ${opt.value === value ? 'text-brand-primary bg-brand-primary/5' : 'text-gray-600'}`}
            >
              {opt.dotColor && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dotColor}`} />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
