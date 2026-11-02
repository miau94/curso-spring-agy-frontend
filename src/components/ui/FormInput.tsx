import { AlertCircle } from 'lucide-react';
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  hint,
  error,
  leftIcon,
  rightElement,
  className = '',
  ...inputProps
}) => {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
        {hint ? <span className="text-[11px] text-slate-400">{hint}</span> : null}
      </div>

      <div className="relative">
        {leftIcon ? (
          <span className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            {leftIcon}
          </span>
        ) : null}

        <input
          id={id}
          className={`w-full ${leftIcon ? 'pl-10' : 'pl-3.5'} ${
            rightElement ? 'pr-10' : 'pr-4'
          } py-2.5 rounded-xl text-sm bg-white dark:bg-slate-950/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border transition-all focus:outline-none focus:ring-3 ${
            error
              ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/15'
              : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-indigo-500/15'
          } ${className}`}
          {...inputProps}
        />

        {rightElement ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        ) : null}
      </div>

      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
};
