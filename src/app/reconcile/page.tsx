'use client';

import { useState } from 'react';
import {
  WizardStep,
  FileDataState,
  ColumnMappingConfig,
  PurchaseOrderRow,
  ReceivingRow,
  ReconciliationResult,
  ReconciliationSummary,
} from '@/types/reconciliation';
import { SAMPLE_PURCHASE_ORDER, SAMPLE_RECEIVING, reconcileRows } from '@/lib/reconciliation';
import { StepIndicator } from '@/components/StepIndicator';
import { FileUpload } from '@/components/FileUpload';
import { ColumnMapping } from '@/components/ColumnMapping';
import { SummaryCard } from '@/components/SummaryCard';
import { ResultsTable } from '@/components/ResultsTable';
import { ExportButton } from '@/components/ExportButton';

export default function ReconcilePage() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // File States
  const [poFile, setPoFile] = useState<FileDataState | null>(null);
  const [receivingFile, setReceivingFile] = useState<FileDataState | null>(null);

  // Results State
  const [reconciledResults, setReconciledResults] = useState<ReconciliationResult[] | null>(null);
  const [summaryState, setSummaryState] = useState<ReconciliationSummary | null>(null);

  // Auto detect columns
  const detectMapping = (headers: string[]): ColumnMappingConfig => {
    const findHeader = (keywords: string[]) =>
      headers.find((h) => keywords.some((k) => h.toLowerCase().includes(k))) || '';

    return {
      sku: findHeader(['sku', 'item', 'product', 'part', 'code']),
      quantity: findHeader(['qty', 'quantity', 'count', 'ordered', 'received', 'units']),
      unitPrice: findHeader(['price', 'cost', 'unit price', 'unit_price', 'rate']),
      poNumber: findHeader(['po', 'purchase order', 'po number', 'order_id']),
      supplier: findHeader(['supplier', 'vendor', 'source']),
    };
  };

  const handlePoLoaded = (data: { fileName: string; rawHeaders: string[]; rawRows: Record<string, string>[] }) => {
    setPoFile({
      ...data,
      mapping: detectMapping(data.rawHeaders),
    });
  };

  const handleReceivingLoaded = (data: { fileName: string; rawHeaders: string[]; rawRows: Record<string, string>[] }) => {
    setReceivingFile({
      ...data,
      mapping: detectMapping(data.rawHeaders),
    });
  };

  const loadSamplePo = () => {
    const headers = ['sku', 'orderedQuantity', 'unitPrice', 'supplier', 'poNumber'];
    const rows = SAMPLE_PURCHASE_ORDER.map((item) => ({
      sku: item.sku,
      orderedQuantity: String(item.orderedQuantity),
      unitPrice: String(item.unitPrice ?? ''),
      supplier: item.supplier ?? '',
      poNumber: item.poNumber ?? '',
    }));

    setPoFile({
      fileName: 'sample_purchase_order_2025.csv',
      rawHeaders: headers,
      rawRows: rows,
      mapping: {
        sku: 'sku',
        quantity: 'orderedQuantity',
        unitPrice: 'unitPrice',
        poNumber: 'poNumber',
        supplier: 'supplier',
      },
    });
  };

  const loadSampleReceiving = () => {
    const headers = ['sku', 'receivedQuantity', 'unitPrice', 'supplier', 'poNumber'];
    const rows = SAMPLE_RECEIVING.map((item) => ({
      sku: item.sku,
      receivedQuantity: String(item.receivedQuantity),
      unitPrice: String(item.unitPrice ?? ''),
      supplier: item.supplier ?? '',
      poNumber: item.poNumber ?? '',
    }));

    setReceivingFile({
      fileName: 'sample_receiving_log_0891.csv',
      rawHeaders: headers,
      rawRows: rows,
      mapping: {
        sku: 'sku',
        quantity: 'receivedQuantity',
        unitPrice: 'unitPrice',
        poNumber: 'poNumber',
        supplier: 'supplier',
      },
    });
  };

  const runReconciliationProcess = () => {
    let poRows: PurchaseOrderRow[] = [];
    let receivingRows: ReceivingRow[] = [];

    if (poFile) {
      poRows = poFile.rawRows.map((row) => ({
        sku: (row[poFile.mapping.sku] || '').trim(),
        orderedQuantity: parseFloat(row[poFile.mapping.quantity] || '0') || 0,
        unitPrice: poFile.mapping.unitPrice ? parseFloat(row[poFile.mapping.unitPrice] || '0') || 0 : undefined,
        supplier: poFile.mapping.supplier ? row[poFile.mapping.supplier] : undefined,
        poNumber: poFile.mapping.poNumber ? row[poFile.mapping.poNumber] : undefined,
      }));
    }

    if (receivingFile) {
      receivingRows = receivingFile.rawRows.map((row) => ({
        sku: (row[receivingFile.mapping.sku] || '').trim(),
        receivedQuantity: parseFloat(row[receivingFile.mapping.quantity] || '0') || 0,
        unitPrice: receivingFile.mapping.unitPrice
          ? parseFloat(row[receivingFile.mapping.unitPrice] || '0') || 0
          : undefined,
        supplier: receivingFile.mapping.supplier ? row[receivingFile.mapping.supplier] : undefined,
        poNumber: receivingFile.mapping.poNumber ? row[receivingFile.mapping.poNumber] : undefined,
      }));
    }

    const { results, summary } = reconcileRows(poRows, receivingRows);
    setReconciledResults(results);
    setSummaryState(summary);
    setCurrentStep(5);
  };

  const isStep1Valid = !!poFile;
  const isStep2Valid = !!receivingFile;
  const isStep3Valid =
    !!poFile &&
    !!receivingFile &&
    !!poFile.mapping.sku &&
    !!poFile.mapping.quantity &&
    !!receivingFile.mapping.sku &&
    !!receivingFile.mapping.quantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Supplier Short-Shipment Reconciliation
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Compare your Purchase Order line items with actual received quantities to find shortages and billing errors.
        </p>
      </div>

      <StepIndicator currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />

      {/* STEP 1: PO UPLOAD */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <FileUpload
            title="Step 1: Upload Purchase Order File"
            description="Upload the official PO or order confirmation file issued to your supplier."
            fileState={poFile}
            onFileLoaded={handlePoLoaded}
            onLoadSample={loadSamplePo}
            onClear={() => setPoFile(null)}
            fileTypeLabel="Purchase Order"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              disabled={!isStep1Valid}
              onClick={() => setCurrentStep(2)}
              className="bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium text-xs sm:text-sm px-5 py-2.5 rounded-md transition-colors"
            >
              Continue to Step 2: Upload Receiving Log →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: RECEIVING FILE UPLOAD */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <FileUpload
            title="Step 2: Upload Receiving Log File"
            description="Upload the warehouse receiving log, packing slip, or delivery report."
            fileState={receivingFile}
            onFileLoaded={handleReceivingLoaded}
            onLoadSample={loadSampleReceiving}
            onClear={() => setReceivingFile(null)}
            fileTypeLabel="Receiving Log"
          />

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 bg-white px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              ← Back to PO Upload
            </button>
            <button
              type="button"
              disabled={!isStep2Valid}
              onClick={() => setCurrentStep(3)}
              className="bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium text-xs sm:text-sm px-5 py-2.5 rounded-md transition-colors"
            >
              Continue to Step 3: Column Mapping →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: COLUMN MAPPING */}
      {currentStep === 3 && poFile && receivingFile && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-900 mb-1">Verify Column Mapping</p>
            Please match the columns from your uploaded files to the required data fields. SKU and Quantity fields are mandatory.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColumnMapping
              title="Purchase Order Mapping"
              fileName={poFile.fileName}
              rawHeaders={poFile.rawHeaders}
              mapping={poFile.mapping}
              onChangeMapping={(newMap) => setPoFile({ ...poFile, mapping: newMap })}
            />

            <ColumnMapping
              title="Receiving File Mapping"
              fileName={receivingFile.fileName}
              rawHeaders={receivingFile.rawHeaders}
              mapping={receivingFile.mapping}
              onChangeMapping={(newMap) => setReceivingFile({ ...receivingFile, mapping: newMap })}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 bg-white px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              ← Back to Receiving Upload
            </button>
            <button
              type="button"
              disabled={!isStep3Valid}
              onClick={() => setCurrentStep(4)}
              className="bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed font-medium text-xs sm:text-sm px-5 py-2.5 rounded-md transition-colors"
            >
              Continue to Step 4: Run Reconciliation →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RUN RECONCILIATION */}
      {currentStep === 4 && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-900 font-bold text-xl">
            ⚙️
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ready to Reconcile Shipment Data</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              We will compare SKU rows between <span className="font-semibold text-slate-900">{poFile?.fileName}</span> ({poFile?.rawRows.length} rows) and{' '}
              <span className="font-semibold text-slate-900">{receivingFile?.fileName}</span> ({receivingFile?.rawRows.length} rows).
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-4 text-left text-xs space-y-1">
            <p className="font-semibold text-slate-700">Audit Plan:</p>
            <p className="text-slate-600">• Aggregate ordered quantities by SKU</p>
            <p className="text-slate-600">• Aggregate received quantities by SKU</p>
            <p className="text-slate-600">• Flag shortages, missing items, overages, and unexpected items</p>
            <p className="text-slate-600">• Calculate total shortage dollar impact</p>
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 bg-white px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              ← Back to Mapping
            </button>
            <button
              type="button"
              onClick={runReconciliationProcess}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-md shadow-sm transition-colors"
            >
              Run Reconciliation Now
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: VIEW RESULTS */}
      {currentStep === 5 && reconciledResults && summaryState && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reconciliation Results Summary</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit complete for PO file ({poFile?.fileName}) vs Receiving file ({receivingFile?.fileName}).
              </p>
            </div>
            <ExportButton results={reconciledResults} summary={summaryState} />
          </div>

          <SummaryCard summary={summaryState} />

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">Item Discrepancy Breakdown</h3>
            <ResultsTable results={reconciledResults} />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setPoFile(null);
                setReceivingFile(null);
                setReconciledResults(null);
                setSummaryState(null);
                setCurrentStep(1);
              }}
              className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-900 border border-slate-300 bg-white px-4 py-2 rounded-md hover:bg-slate-50 transition-colors"
            >
              Start New Reconciliation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
