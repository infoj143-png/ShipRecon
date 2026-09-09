export type ReconciliationStatus =
  | 'matched'
  | 'short'
  | 'over'
  | 'missing'
  | 'unexpected';

export interface PurchaseOrderRow {
  sku: string;
  orderedQuantity: number;
  unitPrice?: number;
  supplier?: string;
  poNumber?: string;
}

export interface ReceivingRow {
  sku: string;
  receivedQuantity: number;
  unitPrice?: number;
  supplier?: string;
  poNumber?: string;
}

export interface ReconciliationResult {
  sku: string;
  orderedQuantity: number;
  receivedQuantity: number;
  difference: number;
  status: ReconciliationStatus;
  shortageValue?: number;
  unitPrice?: number;
  supplier?: string;
  poNumber?: string;
}

export interface ColumnMappingConfig {
  sku: string;
  quantity: string;
  unitPrice?: string;
  supplier?: string;
  poNumber?: string;
}

export interface FileDataState {
  fileName: string;
  fileSizeFormatted?: string;
  rawHeaders: string[];
  rawRows: Record<string, string>[];
  mapping: ColumnMappingConfig;
  parseErrors?: string[];
}

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface ReconciliationSummary {
  totalSkus: number;
  matchedCount: number;
  shortCount: number;
  overCount: number;
  missingCount: number;
  unexpectedCount: number;
  discrepanciesCount: number;
  totalOrderedQty: number;
  totalReceivedQty: number;
  totalShortageQty: number;
  totalShortageValue?: number | null;
  hasUnitPrice: boolean;
}
