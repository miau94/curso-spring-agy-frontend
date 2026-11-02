import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Cargando datos...' }) => {
  return (
    <div className="p-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-3 text-slate-400">
      <Loader2 className="w-7 h-7 animate-spin text-indigo-500" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
