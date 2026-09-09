'use client';

import { useState, ChangeEvent } from 'react';

interface FileUploadProps {
  title: string;
  description: string;
  fileState: { fileName: string; rawHeaders: string[]; rawRows: Record<string, string>[] } | null;
  onFileLoaded: (data: { fileName: string; rawHeaders: string[]; rawRows: Record<string, string>[] }) => void;
  onLoadSample: () => void;
  onClear: () => void;
  fileTypeLabel?: string;
}

export function FileUpload({
  title,
  description,
  fileState,
  onFileLoaded,
  onLoadSample,
  onClear,
  fileTypeLabel = 'CSV File',
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const parseCSVText = (text: string, fileName: string) => {
    const lines = text.split(/\r\n|\n/).map((line) => line.trim()).filter((line) => line.length > 0);
    if (lines.length === 0) return;

    const parseLine = (line: string) => {
      const result = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(cur.trim());
          cur = '';
        } else {
          cur += char;
        }
      }
      result.push(cur.trim());
      return result;
    };

    const headers = parseLine(lines[0]);
    const rows: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i]);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? '';
      });
      rows.push(row);
    }

    onFileLoaded({
      fileName,
      rawHeaders: headers,
      rawRows: rows,
    });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        parseCSVText(text, file.name);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
          {fileTypeLabel}
        </span>
      </div>

      {fileState ? (
        <div className="border border-emerald-200 bg-emerald-50/50 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              CSV
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{fileState.fileName}</p>
              <p className="text-xs text-slate-600">
                {fileState.rawRows.length} rows detected • {fileState.rawHeaders.length} columns
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-slate-600 hover:text-rose-600 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded transition-colors"
          >
            Remove File
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (ev) => {
                const text = ev.target?.result as string;
                if (text) parseCSVText(text, file.name);
              };
              reader.readAsText(file);
            }
          }}
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
                accept=".csv,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </p>
          <p className="text-xs text-slate-400 mt-1">Supports standard CSV files with headers</p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2">
            <span className="text-xs text-slate-500">Don&apos;t have a file right now?</span>
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
    </div>
  );
}
