import React from 'react';

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  iconContainerClass: string;
  children: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  iconContainerClass,
  children,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#0F1623] border border-slate-200/85 dark:border-slate-800/90 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{title}</span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconContainerClass}`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
};
