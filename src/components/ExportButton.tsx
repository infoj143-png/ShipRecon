'use client';

import { ReconciliationResult, ReconciliationSummary } from '@/types/reconciliation';

interface ExportButtonProps {
  results: ReconciliationResult[];
  summary?: ReconciliationSummary;
}

export function ExportButton({ results }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = [
      'SKU',
      'Status',
      'Ordered Quantity',
      'Received Quantity',
      'Difference',
      'Unit Price ($)',
      'Shortage Impact ($)',
      'PO Number',
      'Supplier',
    ];

    const rows = results.map((r) => [
      `"${r.sku.replace(/"/g, '""')}"`,
      `"${r.status}"`,
      r.orderedQuantity,
      r.receivedQuantity,
      r.difference,
      r.unitPrice ?? 0,
      r.shortageValue ?? 0,
      `"${(r.poNumber || '').replace(/"/g, '""')}"`,
      `"${(r.supplier || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `shortage_reconciliation_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={exportToCSV}
        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-md shadow-sm transition-colors"
      >
        <span>Download CSV Discrepancy Report</span>
      </button>
    </div>
  );
}
