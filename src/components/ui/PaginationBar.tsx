import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemLabel = 'registros',
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#0F1623] border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
      <span className="tabular-nums">
        Mostrando página <strong className="text-slate-800 dark:text-slate-200">{currentPage}</strong> de{' '}
        <strong className="text-slate-800 dark:text-slate-200">{totalPages}</strong> ({totalItems}{' '}
        {itemLabel} en total)
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-35 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 rounded-lg font-mono text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
              p === currentPage
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-35 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
