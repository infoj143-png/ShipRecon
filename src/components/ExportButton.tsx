'use client';

import { useState } from 'react';

import * as XLSX from 'xlsx';
import { ReconciliationResult, ReconciliationSummary } from '@/types/reconciliation';

interface ExportButtonProps {
  results: ReconciliationResult[];
  summary?: ReconciliationSummary;
}

export function ExportButton({ results }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format: 'csv' | 'xlsx', discrepanciesOnly: boolean) => {
    const dataToExport = discrepanciesOnly
      ? results.filter((r) => r.status !== 'matched')
      : results;

    if (dataToExport.length === 0) {
      alert('No discrepancies found. All items matched the purchase order perfectly!');
      setIsOpen(false);
      return;
    }

    const dataRows = dataToExport.map((r) => ({
      'SKU': r.sku,
      'Status': r.status.toUpperCase(),
      'Ordered Quantity': r.orderedQuantity,
      'Received Quantity': r.receivedQuantity,
      'Difference': r.difference,
      'Unit Price ($)': r.unitPrice !== undefined ? r.unitPrice : 'N/A',
      'Shortage Impact ($)': r.shortageValue !== undefined ? r.shortageValue : 0,
      'PO Number': r.poNumber || '',
      'Supplier': r.supplier || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reconciliation');

    const prefix = discrepanciesOnly ? 'discrepancy_report' : 'reconciliation_report';
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `${prefix}_${dateStr}.${format}`;

    if (format === 'csv') {
      XLSX.writeFile(workbook, fileName, { bookType: 'csv' });
    } else {
      XLSX.writeFile(workbook, fileName, { bookType: 'xlsx' });
    }

    setIsOpen(false);
  };

  const discrepancyCount = results.filter((r) => r.status !== 'matched').length;

  return (
    <div className="relative inline-block text-left">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => handleExport('csv', true)}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm px-3.5 py-2 rounded-md shadow-sm transition-colors"
        >
          <span>Download Discrepancies (CSV)</span>
          <span className="bg-slate-700 text-slate-200 text-[10px] px-1.5 py-0.5 rounded font-mono">
            {discrepancyCount}
          </span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-medium text-xs sm:text-sm px-3 py-2 rounded-md shadow-sm transition-colors"
          >
            <span>More Export Options</span>
            <span className="text-[10px]">▼</span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-md shadow-lg z-20 py-1 font-sans">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Discrepancy Report Only
              </div>
              <button
                type="button"
                onClick={() => handleExport('csv', true)}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Export Discrepancies as CSV</span>
                <span className="text-[10px] font-mono text-slate-400">.csv</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport('xlsx', true)}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Export Discrepancies as XLSX</span>
                <span className="text-[10px] font-mono text-slate-400">.xlsx</span>
              </button>

              <div className="px-3 py-1.5 border-t border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">
                Full Reconciliation Report
              </div>
              <button
                type="button"
                onClick={() => handleExport('csv', false)}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Export All Items as CSV</span>
                <span className="text-[10px] font-mono text-slate-400">.csv</span>
              </button>
              <button
                type="button"
                onClick={() => handleExport('xlsx', false)}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Export All Items as XLSX</span>
                <span className="text-[10px] font-mono text-slate-400">.xlsx</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
