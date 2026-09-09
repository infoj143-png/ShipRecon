'use client';

import { useState, useMemo } from 'react';
import { ReconciliationResult, ReconciliationStatus } from '@/types/reconciliation';
import { StatusBadge } from './StatusBadge';

interface ResultsTableProps {
  results: ReconciliationResult[];
}

export function ResultsTable({ results }: ResultsTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof ReconciliationResult>('status');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredResults = useMemo(() => {
    return results
      .filter((row) => {
        const matchesSearch = row.sku.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          statusFilter === 'all'
            ? true
            : statusFilter === 'discrepancies'
            ? row.status !== 'matched'
            : row.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField] ?? '';
        let valB = b[sortField] ?? '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }

        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();

        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [results, search, statusFilter, sortField, sortAsc]);

  const handleSort = (field: keyof ReconciliationResult) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const filterButtons: { id: string; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'short', label: 'Short' },
    { id: 'over', label: 'Over' },
    { id: 'missing', label: 'Missing' },
    { id: 'unexpected', label: 'Unexpected' },
    { id: 'matched', label: 'Matched' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      {/* Controls Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="w-full md:w-72">
          <label htmlFor="sku-search" className="sr-only">Search by SKU</label>
          <div className="relative">
            <input
              id="sku-search"
              type="text"
              placeholder="Search by SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-md pl-9 pr-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 placeholder-slate-400"
            />
            <span className="absolute left-3 top-2 text-slate-400 text-xs">🔍</span>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Filter:</span>
          {filterButtons.map((btn) => {
            const count =
              btn.id === 'all'
                ? results.length
                : results.filter((r) => r.status === (btn.id as ReconciliationStatus)).length;
            const isActive = statusFilter === btn.id;

            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => setStatusFilter(btn.id)}
                className={`text-xs px-2.5 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {btn.label} <span className={`text-[10px] ml-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 text-xs tracking-wider uppercase">
              <th
                onClick={() => handleSort('sku')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                SKU {sortField === 'sku' && (sortAsc ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('orderedQuantity')}
                className="p-3 text-right cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                Ordered {sortField === 'orderedQuantity' && (sortAsc ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('receivedQuantity')}
                className="p-3 text-right cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                Received {sortField === 'receivedQuantity' && (sortAsc ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('difference')}
                className="p-3 text-right cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                Difference {sortField === 'difference' && (sortAsc ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('status')}
                className="p-3 cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                Status {sortField === 'status' && (sortAsc ? '↑' : '↓')}
              </th>
              <th
                onClick={() => handleSort('shortageValue')}
                className="p-3 text-right cursor-pointer hover:bg-slate-200/60 transition-colors"
              >
                Shortage Value {sortField === 'shortageValue' && (sortAsc ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-xs text-slate-800">
            {filteredResults.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400 font-sans">
                  No line items matched your search filters.
                </td>
              </tr>
            ) : (
              filteredResults.map((row) => {
                const diffDisplay =
                  row.difference > 0
                    ? `+${row.difference}`
                    : row.difference === 0
                    ? '0'
                    : `${row.difference}`;

                const diffColor =
                  row.difference < 0
                    ? 'text-amber-700 font-bold'
                    : row.difference > 0
                    ? 'text-blue-700 font-bold'
                    : 'text-slate-400';

                return (
                  <tr key={row.sku} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-900 font-mono">
                      {row.sku}
                      {row.poNumber && (
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">
                          PO: {row.poNumber}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">{row.orderedQuantity}</td>
                    <td className="p-3 text-right">{row.receivedQuantity}</td>
                    <td className={`p-3 text-right ${diffColor}`}>{diffDisplay}</td>
                    <td className="p-3 font-sans">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="p-3 text-right font-semibold text-slate-900 font-mono">
                      {row.shortageValue !== undefined && row.shortageValue !== null
                        ? currencyFormatter.format(row.shortageValue)
                        : '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
        <span>
          Showing <strong className="text-slate-900">{filteredResults.length}</strong> of{' '}
          <strong className="text-slate-900">{results.length}</strong> SKUs
        </span>
      </div>
    </div>
  );
}
