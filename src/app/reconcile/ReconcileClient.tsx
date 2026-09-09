'use client';

import { useState } from 'react';
import {
  WizardStep,
  FileDataState,
  PurchaseOrderRow,
  ReceivingRow,
  ReconciliationResult,
  ReconciliationSummary,
} from '@/types/reconciliation';
import { SAMPLE_PURCHASE_ORDER, SAMPLE_RECEIVING, reconcileRows } from '@/lib/reconciliation';
import { autoDetectColumns } from '@/lib/fileParser';
import { StepIndicator } from '@/components/StepIndicator';
import { FileUpload } from '@/components/FileUpload';
import { ColumnMapping } from '@/components/ColumnMapping';
import { SummaryCard } from '@/components/SummaryCard';
import { ResultsTable } from '@/components/ResultsTable';
import { ExportButton } from '@/components/ExportButton';
import { CTAButton } from '@/components/CTAButton';

export function ReconcileClient() {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);

  // File States
  const [poFile, setPoFile] = useState<FileDataState | null>(null);
  const [receivingFile, setReceivingFile] = useState<FileDataState | null>(null);

  // Results State
  const [reconciledResults, setReconciledResults] = useState<ReconciliationResult[] | null>(null);
  const [summaryState, setSummaryState] = useState<ReconciliationSummary | null>(null);

  const handlePoLoaded = (data: FileDataState) => {
    setPoFile({
      ...data,
      mapping: data.mapping.sku ? data.mapping : autoDetectColumns(data.rawHeaders, 'po'),
    });
  };

  const handleReceivingLoaded = (data: FileDataState) => {
    setReceivingFile({
      ...data,
      mapping: data.mapping.sku ? data.mapping : autoDetectColumns(data.rawHeaders, 'receiving'),
    });
  };

  const loadSamplePo = () => {
    const headers = ['SKU', 'Ordered Quantity', 'Unit Price', 'Supplier', 'PO Number'];
    const rows = SAMPLE_PURCHASE_ORDER.map((item) => ({
      SKU: item.sku,
      'Ordered Quantity': String(item.orderedQuantity),
      'Unit Price': String(item.unitPrice ?? ''),
      Supplier: item.supplier ?? '',
      'PO Number': item.poNumber ?? '',
    }));

    setPoFile({
      fileName: 'sample_purchase_order_2025.csv',
      fileSizeFormatted: '1.2 KB',
      rawHeaders: headers,
      rawRows: rows,
      mapping: {
        sku: 'SKU',
        quantity: 'Ordered Quantity',
        unitPrice: 'Unit Price',
        poNumber: 'PO Number',
        supplier: 'Supplier',
      },
    });
  };

  const loadSampleReceiving = () => {
    const headers = ['SKU', 'Received Quantity', 'Unit Price', 'Supplier', 'PO Number'];
    const rows = SAMPLE_RECEIVING.map((item) => ({
      SKU: item.sku,
      'Received Quantity': String(item.receivedQuantity),
      'Unit Price': String(item.unitPrice ?? ''),
      Supplier: item.supplier ?? '',
      'PO Number': item.poNumber ?? '',
    }));

    setReceivingFile({
      fileName: 'sample_receiving_log_0891.csv',
      fileSizeFormatted: '1.1 KB',
      rawHeaders: headers,
      rawRows: rows,
      mapping: {
        sku: 'SKU',
        quantity: 'Received Quantity',
        unitPrice: 'Unit Price',
        poNumber: 'PO Number',
        supplier: 'Supplier',
      },
    });
  };

  const parseNumber = (val: string | undefined): number | undefined => {
    if (!val) return undefined;
    const cleaned = String(val).replace(/[^0-9.-]/g, '');
    const num = parseFloat(cleaned);
    return Number.isNaN(num) ? undefined : num;
  };

  const getValidationWarnings = (): string[] => {
    const warnings: string[] = [];

    if (poFile) {
      let invalidQtyCount = 0;
      let emptySkuCount = 0;
      poFile.rawRows.forEach((r) => {
        const skuVal = (r[poFile.mapping.sku] || '').trim();
        if (!skuVal) emptySkuCount++;
        const qtyVal = parseNumber(r[poFile.mapping.quantity]);
        if (qtyVal === undefined) invalidQtyCount++;
      });
      if (invalidQtyCount > 0) {
        warnings.push(`Purchase Order file contains ${invalidQtyCount} row(s) with non-numeric or missing quantity values.`);
      }
      if (emptySkuCount > 0) {
        warnings.push(`Purchase Order file contains ${emptySkuCount} row(s) with empty SKU values (they will be skipped).`);
      }
    }

    if (receivingFile) {
      let invalidQtyCount = 0;
      let emptySkuCount = 0;
      receivingFile.rawRows.forEach((r) => {
        const skuVal = (r[receivingFile.mapping.sku] || '').trim();
        if (!skuVal) emptySkuCount++;
        const qtyVal = parseNumber(r[receivingFile.mapping.quantity]);
        if (qtyVal === undefined) invalidQtyCount++;
      });
      if (invalidQtyCount > 0) {
        warnings.push(`Receiving log file contains ${invalidQtyCount} row(s) with non-numeric or missing quantity values.`);
      }
      if (emptySkuCount > 0) {
        warnings.push(`Receiving log file contains ${emptySkuCount} row(s) with empty SKU values (they will be skipped).`);
      }
    }

    return warnings;
  };

  const runReconciliationProcess = () => {
    let poRows: PurchaseOrderRow[] = [];
    let receivingRows: ReceivingRow[] = [];

    if (poFile) {
      poRows = poFile.rawRows.map((row) => {
        const sku = (row[poFile.mapping.sku] || '').trim();
        const qty = parseNumber(row[poFile.mapping.quantity]) ?? 0;
        const price = poFile.mapping.unitPrice ? parseNumber(row[poFile.mapping.unitPrice]) : undefined;
        return {
          sku,
          orderedQuantity: qty,
          unitPrice: price,
          supplier: poFile.mapping.supplier ? row[poFile.mapping.supplier] : undefined,
          poNumber: poFile.mapping.poNumber ? row[poFile.mapping.poNumber] : undefined,
        };
      });
    }

    if (receivingFile) {
      receivingRows = receivingFile.rawRows.map((row) => {
        const sku = (row[receivingFile.mapping.sku] || '').trim();
        const qty = parseNumber(row[receivingFile.mapping.quantity]) ?? 0;
        const price = receivingFile.mapping.unitPrice ? parseNumber(row[receivingFile.mapping.unitPrice]) : undefined;
        return {
          sku,
          receivedQuantity: qty,
          unitPrice: price,
          supplier: receivingFile.mapping.supplier ? row[receivingFile.mapping.supplier] : undefined,
          poNumber: receivingFile.mapping.poNumber ? row[receivingFile.mapping.poNumber] : undefined,
        };
      });
    }

    const { results, summary } = reconcileRows(poRows, receivingRows);
    setReconciledResults(results);
    setSummaryState(summary);
    setCurrentStep(5);
  };

  const isStep1Valid = !!poFile && poFile.rawRows.length > 0;
  const isStep2Valid = !!receivingFile && receivingFile.rawRows.length > 0;
  const isStep3Valid =
    !!poFile &&
    !!receivingFile &&
    !!poFile.mapping.sku &&
    !!poFile.mapping.quantity &&
    !!receivingFile.mapping.sku &&
    !!receivingFile.mapping.quantity;

  const validationWarnings = getValidationWarnings();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Supplier Short-Shipment Reconciliation
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Upload your purchase order and receiving file, then instantly find what your supplier short-shipped.
        </p>
      </div>

      <StepIndicator currentStep={currentStep} onStepClick={(s) => setCurrentStep(s)} />

      {/* STEP 1: PO UPLOAD */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <FileUpload
            title="Step 1: Upload Purchase Order"
            description="Upload the PO or order confirmation file issued to your supplier."
            fileState={poFile}
            onFileLoaded={handlePoLoaded}
            onLoadSample={loadSamplePo}
            onClear={() => setPoFile(null)}
            fileTypeLabel="CSV, XLSX"
            documentType="po"
          />

          {!poFile && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                Upload your PO and receiving file to find supplier discrepancies.
              </p>
              <p className="text-xs text-slate-500">
                You can upload standard CSV or XLSX files from your ERP, warehouse management system, or spreadsheet.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <CTAButton
              disabled={!isStep1Valid}
              onClick={() => setCurrentStep(2)}
            >
              Continue to Step 2: Upload Receiving File →
            </CTAButton>
          </div>
        </div>
      )}

      {/* STEP 2: RECEIVING FILE UPLOAD */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <FileUpload
            title="Step 2: Upload Receiving File"
            description="Upload the warehouse receiving log, packing slip, or delivery report."
            fileState={receivingFile}
            onFileLoaded={handleReceivingLoaded}
            onLoadSample={loadSampleReceiving}
            onClear={() => setReceivingFile(null)}
            fileTypeLabel="CSV, XLSX"
            documentType="receiving"
          />

          {!receivingFile && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                Upload your receiving log file to compare against the PO.
              </p>
              <p className="text-xs text-slate-500">
                Supports CSV, XLSX, or XLS files. Duplicate SKUs will be automatically aggregated.
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <CTAButton
              variant="secondary"
              onClick={() => setCurrentStep(1)}
            >
              ← Back to PO Upload
            </CTAButton>
            <CTAButton
              disabled={!isStep2Valid}
              onClick={() => setCurrentStep(3)}
            >
              Continue to Step 3: Column Mapping →
            </CTAButton>
          </div>
        </div>
      )}

      {/* STEP 3: COLUMN MAPPING */}
      {currentStep === 3 && poFile && receivingFile && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-900 mb-1">Step 3: Column Mapping</p>
            Match the columns from your uploaded files to the required data fields. SKU and Quantity fields are required.
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
            <CTAButton
              variant="secondary"
              onClick={() => setCurrentStep(2)}
            >
              ← Back to Receiving Upload
            </CTAButton>
            <CTAButton
              disabled={!isStep3Valid}
              onClick={() => setCurrentStep(4)}
            >
              Continue to Step 4: Validate & Reconcile →
            </CTAButton>
          </div>
        </div>
      )}

      {/* STEP 4: DATA VALIDATION & RUN RECONCILIATION */}
      {currentStep === 4 && (
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-900 font-bold text-xl mb-3">
              🔍
            </div>
            <h2 className="text-xl font-bold text-slate-900">Step 4: Data Validation & Audit</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Reviewing file data before running short-shipment audit.
            </p>
          </div>

          <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-md p-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Purchase Order File:</span>
              <span className="font-mono text-slate-600">{poFile?.fileName} ({poFile?.rawRows.length} rows)</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-800">Receiving Log File:</span>
              <span className="font-mono text-slate-600">{receivingFile?.fileName} ({receivingFile?.rawRows.length} rows)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800">Duplicate SKU Handling:</span>
              <span className="text-emerald-700 font-medium">Automatic aggregation enabled</span>
            </div>
          </div>

          {validationWarnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-xs text-amber-900 space-y-1">
              <p className="font-semibold text-amber-950 flex items-center gap-1.5">
                <span>⚠️</span> Validation Warnings ({validationWarnings.length}):
              </p>
              {validationWarnings.map((warn, i) => (
                <p key={i} className="text-amber-800">• {warn}</p>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <CTAButton
              variant="secondary"
              onClick={() => setCurrentStep(3)}
            >
              ← Back to Mapping
            </CTAButton>
            <CTAButton
              onClick={runReconciliationProcess}
            >
              Run Reconciliation Now
            </CTAButton>
          </div>
        </div>
      )}

      {/* STEP 5: VIEW RESULTS */}
      {currentStep === 5 && reconciledResults && summaryState && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reconciliation Results</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit results comparing PO ({poFile?.fileName}) against Receiving Log ({receivingFile?.fileName}).
              </p>
            </div>
            <ExportButton results={reconciledResults} summary={summaryState} />
          </div>

          <SummaryCard summary={summaryState} />

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-slate-900">Line Item Discrepancies</h3>
            <ResultsTable results={reconciledResults} />
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <CTAButton
              variant="secondary"
              onClick={() => {
                setPoFile(null);
                setReceivingFile(null);
                setReconciledResults(null);
                setSummaryState(null);
                setCurrentStep(1);
              }}
            >
              Start New Reconciliation
            </CTAButton>
          </div>
        </div>
      )}
    </div>
  );
}
