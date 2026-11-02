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
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        {children}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconContainerClass}`}>
        {icon}
      </div>
    </div>
  );
};
