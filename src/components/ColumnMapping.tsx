'use client';

import { ColumnMappingConfig } from '@/types/reconciliation';

interface ColumnMappingProps {
  title: string;
  fileName: string;
  rawHeaders: string[];
  mapping: ColumnMappingConfig;
  onChangeMapping: (mapping: ColumnMappingConfig) => void;
}

export function ColumnMapping({
  title,
  fileName,
  rawHeaders,
  mapping,
  onChangeMapping,
}: ColumnMappingProps) {
  const fields: {
    key: keyof ColumnMappingConfig;
    label: string;
    required: boolean;
    description: string;
  }[] = [
    { key: 'sku', label: 'SKU / Item Identifier', required: true, description: 'Unique code identifying the item' },
    { key: 'quantity', label: 'Quantity', required: true, description: 'Ordered or Received units' },
    { key: 'unitPrice', label: 'Unit Price', required: false, description: 'Price per unit for shortage valuation' },
    { key: 'poNumber', label: 'PO Number', required: false, description: 'Purchase Order reference' },
    { key: 'supplier', label: 'Supplier / Vendor', required: false, description: 'Supplier name or code' },
  ];

  const handleSelectChange = (key: keyof ColumnMappingConfig, value: string) => {
    onChangeMapping({
      ...mapping,
      [key]: value,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            File: <span className="font-mono text-slate-700">{fileName}</span> ({rawHeaders.length} columns detected)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center py-2 border-b border-slate-50 last:border-0">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-900">
                {field.label} {field.required && <span className="text-rose-500">*</span>}
              </label>
              <p className="text-[11px] text-slate-500">{field.description}</p>
            </div>
            <div className="sm:col-span-7">
              <select
                value={mapping[field.key] || ''}
                onChange={(e) => handleSelectChange(field.key, e.target.value)}
                className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-slate-900 font-mono"
              >
                <option value="">-- Ignore column --</option>
                {rawHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
