import { ReconciliationSummary } from '@/types/reconciliation';

interface SummaryCardProps {
  summary: ReconciliationSummary;
}

export function SummaryCard({ summary }: SummaryCardProps) {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Discrepancy Value</p>
        <p className="text-2xl font-bold text-rose-700 mt-2">
          {currencyFormatter.format(summary.totalShortageValue)}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          From <span className="font-semibold text-slate-700">{summary.totalShortageQty}</span> unfulfilled units
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Short / Missing SKUs</p>
        <p className="text-2xl font-bold text-amber-600 mt-2">
          {summary.shortCount + summary.missingCount}{' '}
          <span className="text-xs font-normal text-slate-500">/ {summary.totalSkus} SKUs</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {summary.shortCount} partial shortages, {summary.missingCount} zero-received
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Matched SKUs</p>
        <p className="text-2xl font-bold text-emerald-600 mt-2">
          {summary.matchedCount}{' '}
          <span className="text-xs font-normal text-slate-500">
            ({Math.round((summary.matchedCount / (summary.totalSkus || 1)) * 100)}%)
          </span>
        </p>
        <p className="text-xs text-slate-500 mt-1">Quantities matched expected line items</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overage & Unexpected</p>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {summary.overCount + summary.unexpectedCount}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {summary.overCount} overages, {summary.unexpectedCount} unlisted SKUs
        </p>
      </div>
    </div>
  );
}
