import { AlertTriangle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import React from 'react';
import type { InvoiceStatus } from '../../types/api';

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  InvoiceStatus,
  {
    label: string;
    classes: string;
    icon: React.ReactNode;
  }
> = {
  PAID: {
    label: 'Pagada',
    classes:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  PENDING: {
    label: 'Pendiente',
    classes:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    icon: <Clock className="w-3 h-3" />,
  },
  OVERDUE: {
    label: 'Vencida',
    classes: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
    icon: <AlertTriangle className="w-3 h-3" />,
  },
  CANCELLED: {
    label: 'Cancelada',
    classes:
      'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
    icon: <XCircle className="w-3 h-3" />,
  },
};

export const InvoiceStatusBadge: React.FC<InvoiceStatusBadgeProps> = ({
  status,
  size = 'sm',
}) => {
  const cfg = statusConfig[status] ?? statusConfig.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold border rounded-full ${
        size === 'md' ? 'px-3 py-1 text-xs' : 'px-2.5 py-0.5 text-[11px]'
      } ${cfg.classes}`}
    >
      {cfg.icon}
      <span>{cfg.label}</span>
    </span>
  );
};
