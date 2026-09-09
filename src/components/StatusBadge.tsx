import { ReconciliationStatus } from '@/types/reconciliation';

interface StatusBadgeProps {
  status: ReconciliationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const configs: Record<
    ReconciliationStatus,
    { label: string; icon: string; className: string }
  > = {
    matched: {
      label: 'Matched',
      icon: '✓',
      className: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-medium',
    },
    short: {
      label: 'Short',
      icon: '↓',
      className: 'bg-amber-50 text-amber-900 border-amber-300 font-medium',
    },
    missing: {
      label: 'Missing',
      icon: '✕',
      className: 'bg-rose-50 text-rose-800 border-rose-300 font-medium',
    },
    over: {
      label: 'Over',
      icon: '↑',
      className: 'bg-blue-50 text-blue-800 border-blue-300 font-medium',
    },
    unexpected: {
      label: 'Unexpected',
      icon: '?',
      className: 'bg-purple-50 text-purple-800 border-purple-300 font-medium',
    },
  };

  const config = configs[status] || configs.matched;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs border ${config.className}`}
    >
      <span aria-hidden="true" className="font-bold text-[10px]">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
