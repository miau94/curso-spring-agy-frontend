import { LayoutGrid, List, Search, X } from 'lucide-react';
import React from 'react';

interface CustomerToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'table' | 'cards';
  onViewModeChange: (mode: 'table' | 'cards') => void;
}

export const CustomerToolbar: React.FC<CustomerToolbarProps> = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#0F1623] p-3.5 rounded-2xl border border-slate-200/85 dark:border-slate-800/90 shadow-xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre, apellido, correo, teléfono o dirección..."
          className="w-full pl-10 pr-9 py-2 rounded-xl text-sm bg-slate-50 dark:bg-slate-950/90 border border-slate-200/90 dark:border-slate-800 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-3 focus:ring-indigo-500/15 transition-all"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Limpiar búsqueda"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl self-end sm:self-auto border border-slate-200/60 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onViewModeChange('table')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'table'
              ? 'bg-white dark:bg-[#0F1623] text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Tabla</span>
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('cards')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            viewMode === 'cards'
              ? 'bg-white dark:bg-[#0F1623] text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Tarjetas</span>
        </button>
      </div>
    </div>
  );
};
