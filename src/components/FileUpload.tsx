'use client';

import { useState, ChangeEvent, DragEvent } from 'react';
import { FileDataState } from '@/types/reconciliation';
import { parseUploadedFile } from '@/lib/fileParser';

interface FileUploadProps {
  title: string;
  description: string;
  fileState: FileDataState | null;
  onFileLoaded: (data: FileDataState) => void;
  onLoadSample: () => void;
  onClear: () => void;
  fileTypeLabel?: string;
  documentType: 'po' | 'receiving';
}

export function FileUpload({
  title,
  description,
  fileState,
  onFileLoaded,
  onLoadSample,
  onClear,
  fileTypeLabel = 'CSV, XLSX',
  documentType,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileNameLower = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => fileNameLower.endsWith(ext));

    if (!isValid) {
      alert('Unsupported file format. Please upload a CSV, XLSX, or XLS file.');
      return;
    }

    const result = await parseUploadedFile(file, documentType);

    if (result.parseError) {
      alert(result.parseError);
      return;
    }

    onFileLoaded({
      fileName: result.fileName,
      fileSizeFormatted: result.fileSizeFormatted,
      rawHeaders: result.rawHeaders,
      rawRows: result.rawRows,
      mapping: result.detectedMapping,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
          Accepted: {fileTypeLabel}
        </span>
      </div>

      {fileState ? (
        <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs uppercase font-mono">
              {fileState.fileName.split('.').pop() || 'FILE'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{fileState.fileName}</p>
              <p className="text-xs text-slate-600">
                {fileState.fileSizeFormatted ? `${fileState.fileSizeFormatted} • ` : ''}
                {fileState.rawRows.length} rows detected • {fileState.rawHeaders.length} columns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-slate-700 hover:text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded cursor-pointer transition-colors">
              Replace File
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-medium text-rose-700 hover:text-rose-800 border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-slate-900 bg-slate-50' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-medium text-lg mb-3">
            ↑
          </div>
          <p className="text-sm text-slate-700 font-medium">
            Drag and drop your file here, or{' '}
            <label className="text-slate-900 underline font-semibold cursor-pointer hover:text-slate-700">
              browse
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </p>
          <p className="text-xs text-slate-400 mt-1">Accepted formats: CSV, XLSX, XLS</p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
            <span className="text-xs text-slate-500">Don&apos;t have a file ready?</span>
            <button
              type="button"
              onClick={onLoadSample}
              className="text-xs font-semibold text-slate-900 underline hover:text-slate-700"
            >
              Load Sample Data
            </button>
          </div>
        </div>
      )}

      <p className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 rounded px-3 py-2 flex items-center gap-1.5">
        <span className="text-slate-700">🔒</span>
        Your files are processed locally in your browser and are not uploaded to our servers.
      </p>
    </div>
  );
}
