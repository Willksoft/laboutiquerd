import React, { useState } from 'react';
import {
  Scissors, Gem, PenLine, Flower2, Droplets, Star, Heart, ShoppingBag,
  Shirt, Footprints, Watch, Sparkles, Palette, Home, Backpack,
  Puzzle, Smartphone, Wallet, Trophy, Package, Layers, Gift, Zap,
  Camera, Music, Utensils, Sun, Leaf, Crown
} from 'lucide-react';
import { X } from 'lucide-react';

export const ICON_MAP: Record<string, React.ReactNode> = {
  Scissors:    <Scissors    size={18} />,
  Gem:         <Gem         size={18} />,
  PenLine:     <PenLine     size={18} />,
  Flower2:     <Flower2     size={18} />,
  Droplets:    <Droplets    size={18} />,
  Star:        <Star        size={18} />,
  Heart:       <Heart       size={18} />,
  ShoppingBag: <ShoppingBag size={18} />,
  Shirt:       <Shirt       size={18} />,
  Footprints:  <Footprints  size={18} />,
  Watch:       <Watch       size={18} />,
  Sparkles:    <Sparkles    size={18} />,
  Palette:     <Palette     size={18} />,
  Home:        <Home        size={18} />,
  Backpack:    <Backpack    size={18} />,
  Puzzle:      <Puzzle      size={18} />,
  Smartphone:  <Smartphone  size={18} />,
  Wallet:      <Wallet      size={18} />,
  Trophy:      <Trophy      size={18} />,
  Package:     <Package     size={18} />,
  Layers:      <Layers      size={18} />,
  Gift:        <Gift        size={18} />,
  Zap:         <Zap         size={18} />,
  Camera:      <Camera      size={18} />,
  Music:       <Music       size={18} />,
  Utensils:    <Utensils    size={18} />,
  Sun:         <Sun         size={18} />,
  Leaf:        <Leaf        size={18} />,
  Crown:       <Crown       size={18} />,
};

export const renderIcon = (name: string | undefined, size = 18, className = '') => {
  if (!name || !ICON_MAP[name]) return null;
  const IconComp = {
    Scissors, Gem, PenLine, Flower2, Droplets, Star, Heart, ShoppingBag,
    Shirt, Footprints, Watch, Sparkles, Palette, Home, Backpack,
    Puzzle, Smartphone, Wallet, Trophy, Package, Layers, Gift, Zap,
    Camera, Music, Utensils, Sun, Leaf, Crown,
  }[name as keyof typeof ICON_MAP] as React.FC<{ size?: number; className?: string }> | undefined;
  return IconComp ? <IconComp size={size} className={className} /> : null;
};

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
  label?: string;
}

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, label = 'Ícono' }) => {
  const [open, setOpen] = useState(false);
  const iconNames = Object.keys(ICON_MAP);

  return (
    <div className="relative">
      <label className="block text-xs font-bold text-gray-500 mb-1.5">{label}</label>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 hover:border-brand-accent rounded-xl transition-all text-sm font-bold text-brand-primary bg-white"
      >
        <span className="text-brand-primary">{renderIcon(value, 18)}</span>
        <span className="text-gray-500 text-xs flex-1 text-left">{value || 'Seleccionar…'}</span>
        <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {/* Grid dropdown */}
      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-3 animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Selecciona un ícono</span>
            <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1.5 w-max max-w-[240px]">
            {iconNames.map(name => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => { onChange(name); setOpen(false); }}
                className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                  value === name
                    ? 'bg-brand-primary text-brand-accent shadow-md'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-brand-primary'
                }`}
              >
                {ICON_MAP[name]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IconPicker;
