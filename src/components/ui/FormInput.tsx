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
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
      >
        {label}{' '}
        {hint && <span className="font-normal text-slate-400">({hint})</span>}
      </label>

      <div className="relative">
        {leftIcon && (
          <span className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          className={`w-full ${leftIcon ? 'pl-10' : 'pl-3.5'} ${
            rightElement ? 'pr-10' : 'pr-4'
          } py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-slate-950 border transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20'
          } ${className}`}
          {...inputProps}
        />

        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
};
