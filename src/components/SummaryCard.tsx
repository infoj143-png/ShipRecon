import { ReconciliationSummary } from '@/types/reconciliation';

interface SummaryCardProps {
  summary: ReconciliationSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const estimatedLossText =
    summary.hasUnitPrice && summary.totalShortageValue !== null && summary.totalShortageValue !== undefined
      ? currencyFormatter.format(summary.totalShortageValue)
      : 'Not available';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. SKUs Checked */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SKUs Checked</p>
        <p className="text-2xl font-bold text-slate-900 mt-2">
          {summary.totalSkus}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          <span className="font-semibold text-emerald-600">{summary.matchedCount}</span> matched ({Math.round((summary.matchedCount / (summary.totalSkus || 1)) * 100)}%)
        </p>
      </div>

      {/* 2. Discrepancies */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Discrepancies</p>
        <p className="text-2xl font-bold text-rose-600 mt-2">
          {summary.discrepanciesCount}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {summary.shortCount} short, {summary.missingCount} missing, {summary.overCount} over, {summary.unexpectedCount} unexpected
        </p>
      </div>

      {/* 3. Units Short */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Units Short</p>
        <p className="text-2xl font-bold text-amber-600 mt-2">
          {summary.totalShortageQty}
        </p>
        <p className="text-xs text-slate-500 mt-1">Total unfulfilled units from short & missing SKUs</p>
      </div>

      {/* 4. Estimated Loss */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Estimated Loss</p>
        <p className={`text-2xl font-bold mt-2 ${summary.hasUnitPrice ? 'text-rose-700' : 'text-slate-400 text-xl'}`}>
          {estimatedLossText}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {summary.hasUnitPrice ? 'Based on unit price data' : 'Unit price not provided in files'}
        </p>
      </div>
    </div>
  );
}
