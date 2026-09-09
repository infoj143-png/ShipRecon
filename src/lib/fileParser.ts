import * as XLSX from 'xlsx';
import { ColumnMappingConfig } from '@/types/reconciliation';

export interface ParsedFileResult {
  fileName: string;
  fileSizeFormatted: string;
  rawHeaders: string[];
  rawRows: Record<string, string>[];
  detectedMapping: ColumnMappingConfig;
  parseError?: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function autoDetectColumns(headers: string[], type: 'po' | 'receiving'): ColumnMappingConfig {
  const normHeaders = headers.map((h) => ({ original: h, clean: h.trim().toLowerCase() }));

  const findBestHeader = (keywords: string[]): string => {
    // 1. Exact match
    for (const kw of keywords) {
      const match = normHeaders.find((h) => h.clean === kw);
      if (match) return match.original;
    }
    // 2. Contains match
    for (const kw of keywords) {
      const match = normHeaders.find((h) => h.clean.includes(kw));
      if (match) return match.original;
    }
    return '';
  };

  const skuKeywords = [
    'sku',
    'product sku',
    'item sku',
    'item code',
    'product code',
    'sku code',
    'item',
    'product',
    'part',
    'code',
  ];

  const poQtyKeywords = [
    'ordered quantity',
    'order quantity',
    'qty ordered',
    'quantity ordered',
    'ordered qty',
    'ordered',
    'quantity',
    'qty',
    'count',
    'units',
  ];

  const recvQtyKeywords = [
    'received quantity',
    'quantity received',
    'qty received',
    'received qty',
    'delivered quantity',
    'delivered qty',
    'received',
    'quantity',
    'qty',
    'count',
    'units',
  ];

  const priceKeywords = ['unit price', 'unit_price', 'price/unit', 'price', 'cost', 'rate', 'unit cost'];
  const supplierKeywords = ['supplier', 'vendor', 'source', 'supplier name', 'vendor name'];
  const poNumKeywords = ['po number', 'po #', 'po', 'purchase order', 'order id', 'order number', 'purchase order number'];

  return {
    sku: findBestHeader(skuKeywords),
    quantity: findBestHeader(type === 'po' ? poQtyKeywords : recvQtyKeywords),
    unitPrice: findBestHeader(priceKeywords),
    supplier: findBestHeader(supplierKeywords),
    poNumber: findBestHeader(poNumKeywords),
  };
}

export async function parseUploadedFile(
  file: File,
  type: 'po' | 'receiving'
): Promise<ParsedFileResult> {
  const fileName = file.name;
  const fileSizeFormatted = formatFileSize(file.size);

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array', cellDates: true, raw: false });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        fileName,
        fileSizeFormatted,
        rawHeaders: [],
        rawRows: [],
        detectedMapping: { sku: '', quantity: '' },
        parseError: 'The uploaded file appears to be empty or corrupted (no sheets found).',
      };
    }

    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    const jsonRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: '',
      raw: false,
    });

    if (jsonRows.length === 0) {
      return {
        fileName,
        fileSizeFormatted,
        rawHeaders: [],
        rawRows: [],
        detectedMapping: { sku: '', quantity: '' },
        parseError: 'The uploaded file contains no data rows.',
      };
    }

    // Extract headers from the keys of the first row object
    const rawHeaders = Array.from(
      new Set(jsonRows.flatMap((row) => Object.keys(row)))
    ).map((h) => String(h).trim()).filter((h) => h.length > 0);

    if (rawHeaders.length === 0) {
      return {
        fileName,
        fileSizeFormatted,
        rawHeaders: [],
        rawRows: [],
        detectedMapping: { sku: '', quantity: '' },
        parseError: 'Could not detect column headers in the uploaded file.',
      };
    }

    const rawRows: Record<string, string>[] = jsonRows.map((row) => {
      const formattedRow: Record<string, string> = {};
      rawHeaders.forEach((header) => {
        const val = row[header];
        formattedRow[header] = val !== undefined && val !== null ? String(val).trim() : '';
      });
      return formattedRow;
    });

    const detectedMapping = autoDetectColumns(rawHeaders, type);

    return {
      fileName,
      fileSizeFormatted,
      rawHeaders,
      rawRows,
      detectedMapping,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown parsing error';
    return {
      fileName,
      fileSizeFormatted,
      rawHeaders: [],
      rawRows: [],
      detectedMapping: { sku: '', quantity: '' },
      parseError: `Failed to parse file: ${errorMsg}. Please ensure it is a valid CSV, XLSX, or XLS file.`,
    };
  }
}
