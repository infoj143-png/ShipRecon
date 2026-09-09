import {
  PurchaseOrderRow,
  ReceivingRow,
  ReconciliationResult,
  ReconciliationSummary,
  ReconciliationStatus,
} from '@/types/reconciliation';

export const SAMPLE_PURCHASE_ORDER: PurchaseOrderRow[] = [
  { sku: 'SKU-001', orderedQuantity: 100, unitPrice: 15.0, supplier: 'Apex Industrial Supply', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-002', orderedQuantity: 50, unitPrice: 10.0, supplier: 'Apex Industrial Supply', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-003', orderedQuantity: 40, unitPrice: 25.0, supplier: 'Apex Industrial Supply', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-004', orderedQuantity: 30, unitPrice: 8.0, supplier: 'Apex Industrial Supply', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-005', orderedQuantity: 20, unitPrice: 50.0, supplier: 'Apex Industrial Supply', poNumber: 'PO-2025-0891' },
];

export const SAMPLE_RECEIVING: ReceivingRow[] = [
  { sku: 'SKU-001', receivedQuantity: 100, unitPrice: 15.0, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' }, // Matched
  { sku: 'SKU-002', receivedQuantity: 42, unitPrice: 10.0, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' },  // Short -8 ($80)
  { sku: 'SKU-003', receivedQuantity: 50, unitPrice: 25.0, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' },  // Over +10
  // SKU-004 omitted => Missing -30 ($240)
  { sku: 'SKU-005', receivedQuantity: 20, unitPrice: 50.0, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' },  // Matched
  { sku: 'SKU-006', receivedQuantity: 20, unitPrice: 12.0, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' },  // Unexpected +20
];

interface AggregatedItem {
  displaySku: string;
  orderedQuantity: number;
  unitPrice?: number;
  supplier?: string;
  poNumber?: string;
  hasUnitPrice: boolean;
}

interface AggregatedRecvItem {
  displaySku: string;
  receivedQuantity: number;
  unitPrice?: number;
  supplier?: string;
  poNumber?: string;
  hasUnitPrice: boolean;
}

export function reconcileRows(
  poRows: PurchaseOrderRow[],
  receivingRows: ReceivingRow[]
): { results: ReconciliationResult[]; summary: ReconciliationSummary } {
  const poMap = new Map<string, AggregatedItem>();
  const receivingMap = new Map<string, AggregatedRecvItem>();

  poRows.forEach((row) => {
    const rawSku = (row.sku || '').trim();
    if (!rawSku) return;
    const key = rawSku.toUpperCase();
    const qty = Number.isNaN(row.orderedQuantity) ? 0 : row.orderedQuantity;

    const existing = poMap.get(key);
    if (existing) {
      existing.orderedQuantity += qty;
      if (existing.unitPrice === undefined && row.unitPrice !== undefined && !Number.isNaN(row.unitPrice)) {
        existing.unitPrice = row.unitPrice;
        existing.hasUnitPrice = true;
      }
      if (!existing.supplier && row.supplier) existing.supplier = row.supplier;
      if (!existing.poNumber && row.poNumber) existing.poNumber = row.poNumber;
    } else {
      const hasPrice = row.unitPrice !== undefined && row.unitPrice !== null && !Number.isNaN(row.unitPrice);
      poMap.set(key, {
        displaySku: rawSku,
        orderedQuantity: qty,
        unitPrice: hasPrice ? row.unitPrice : undefined,
        supplier: row.supplier,
        poNumber: row.poNumber,
        hasUnitPrice: hasPrice,
      });
    }
  });

  receivingRows.forEach((row) => {
    const rawSku = (row.sku || '').trim();
    if (!rawSku) return;
    const key = rawSku.toUpperCase();
    const qty = Number.isNaN(row.receivedQuantity) ? 0 : row.receivedQuantity;

    const existing = receivingMap.get(key);
    if (existing) {
      existing.receivedQuantity += qty;
      if (existing.unitPrice === undefined && row.unitPrice !== undefined && !Number.isNaN(row.unitPrice)) {
        existing.unitPrice = row.unitPrice;
        existing.hasUnitPrice = true;
      }
      if (!existing.supplier && row.supplier) existing.supplier = row.supplier;
      if (!existing.poNumber && row.poNumber) existing.poNumber = row.poNumber;
    } else {
      const hasPrice = row.unitPrice !== undefined && row.unitPrice !== null && !Number.isNaN(row.unitPrice);
      receivingMap.set(key, {
        displaySku: rawSku,
        receivedQuantity: qty,
        unitPrice: hasPrice ? row.unitPrice : undefined,
        supplier: row.supplier,
        poNumber: row.poNumber,
        hasUnitPrice: hasPrice,
      });
    }
  });

  const allKeys = Array.from(new Set([...Array.from(poMap.keys()), ...Array.from(receivingMap.keys())]));
  const results: ReconciliationResult[] = [];

  let matchedCount = 0;
  let shortCount = 0;
  let overCount = 0;
  let missingCount = 0;
  let unexpectedCount = 0;
  let totalOrderedQty = 0;
  let totalReceivedQty = 0;
  let totalShortageQty = 0;
  let totalShortageValue = 0;
  let globalHasUnitPrice = false;

  allKeys.forEach((key) => {
    const po = poMap.get(key);
    const recv = receivingMap.get(key);

    const sku = po?.displaySku || recv?.displaySku || key;
    const orderedQuantity = po ? po.orderedQuantity : 0;
    const receivedQuantity = recv ? recv.receivedQuantity : 0;

    const unitPrice = po?.unitPrice !== undefined ? po.unitPrice : recv?.unitPrice;
    const itemHasUnitPrice = (po?.hasUnitPrice || recv?.hasUnitPrice) ?? false;
    if (itemHasUnitPrice) {
      globalHasUnitPrice = true;
    }

    const supplier = po?.supplier || recv?.supplier;
    const poNumber = po?.poNumber || recv?.poNumber;

    const rawDiff = receivedQuantity - orderedQuantity;
    const difference = Math.round(rawDiff * 10000) / 10000;

    let status: ReconciliationStatus;
    let shortageValue: number | undefined = undefined;

    if (!po && recv) {
      status = 'unexpected';
      unexpectedCount++;
    } else if (po && !recv) {
      status = 'missing';
      missingCount++;
      const shortQty = orderedQuantity;
      totalShortageQty += shortQty;
      if (itemHasUnitPrice && unitPrice !== undefined) {
        shortageValue = Math.round(Math.abs(shortQty) * unitPrice * 100) / 100;
        totalShortageValue += shortageValue;
      }
    } else if (difference === 0) {
      status = 'matched';
      matchedCount++;
    } else if (difference < 0) {
      status = 'short';
      shortCount++;
      const shortQty = Math.abs(difference);
      totalShortageQty += shortQty;
      if (itemHasUnitPrice && unitPrice !== undefined) {
        shortageValue = Math.round(shortQty * unitPrice * 100) / 100;
        totalShortageValue += shortageValue;
      }
    } else {
      status = 'over';
      overCount++;
    }

    totalOrderedQty += orderedQuantity;
    totalReceivedQty += receivedQuantity;

    results.push({
      sku,
      orderedQuantity,
      receivedQuantity,
      difference,
      status,
      shortageValue,
      unitPrice: itemHasUnitPrice ? unitPrice : undefined,
      supplier,
      poNumber,
    });
  });

  const discrepanciesCount = shortCount + overCount + missingCount + unexpectedCount;

  const summary: ReconciliationSummary = {
    totalSkus: results.length,
    matchedCount,
    shortCount,
    overCount,
    missingCount,
    unexpectedCount,
    discrepanciesCount,
    totalOrderedQty: Math.round(totalOrderedQty * 10000) / 10000,
    totalReceivedQty: Math.round(totalReceivedQty * 10000) / 10000,
    totalShortageQty: Math.round(totalShortageQty * 10000) / 10000,
    totalShortageValue: globalHasUnitPrice ? Math.round(totalShortageValue * 100) / 100 : null,
    hasUnitPrice: globalHasUnitPrice,
  };

  return { results, summary };
}
