import {
  PurchaseOrderRow,
  ReceivingRow,
  ReconciliationResult,
  ReconciliationSummary,
  ReconciliationStatus,
} from '@/types/reconciliation';

export const SAMPLE_PURCHASE_ORDER: PurchaseOrderRow[] = [
  { sku: 'SKU-1001', orderedQuantity: 500, unitPrice: 12.5, supplier: 'Apex Industrial Parts', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-1002', orderedQuantity: 250, unitPrice: 45.0, supplier: 'Apex Industrial Parts', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-1003', orderedQuantity: 120, unitPrice: 8.75, supplier: 'Apex Industrial Parts', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-1004', orderedQuantity: 80, unitPrice: 110.0, supplier: 'Apex Industrial Parts', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-1005', orderedQuantity: 300, unitPrice: 15.2, supplier: 'Apex Industrial Parts', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-1006', orderedQuantity: 150, unitPrice: 22.0, supplier: 'Apex Industrial Parts', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-1007', orderedQuantity: 400, unitPrice: 6.5, supplier: 'Apex Industrial Parts', poNumber: 'PO-2025-0891' },
];

export const SAMPLE_RECEIVING: ReceivingRow[] = [
  { sku: 'SKU-1001', receivedQuantity: 500, unitPrice: 12.5, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' },
  { sku: 'SKU-1002', receivedQuantity: 200, unitPrice: 45.0, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' }, // Short 50
  { sku: 'SKU-1003', receivedQuantity: 120, unitPrice: 8.75, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' }, // Matched
  { sku: 'SKU-1004', receivedQuantity: 0, unitPrice: 110.0, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' },   // Missing completely
  { sku: 'SKU-1005', receivedQuantity: 350, unitPrice: 15.2, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' }, // Over 50
  { sku: 'SKU-1006', receivedQuantity: 130, unitPrice: 22.0, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' }, // Short 20
  { sku: 'SKU-9999', receivedQuantity: 40, unitPrice: 30.0, supplier: 'Apex Logistics Recv', poNumber: 'PO-2025-0891' },  // Unexpected
];

export function reconcileRows(
  poRows: PurchaseOrderRow[],
  receivingRows: ReceivingRow[]
): { results: ReconciliationResult[]; summary: ReconciliationSummary } {
  const poMap = new Map<string, PurchaseOrderRow>();
  const receivingMap = new Map<string, ReceivingRow>();

  poRows.forEach((row) => {
    if (row.sku) {
      const existing = poMap.get(row.sku);
      if (existing) {
        existing.orderedQuantity += row.orderedQuantity;
      } else {
        poMap.set(row.sku, { ...row });
      }
    }
  });

  receivingRows.forEach((row) => {
    if (row.sku) {
      const existing = receivingMap.get(row.sku);
      if (existing) {
        existing.receivedQuantity += row.receivedQuantity;
      } else {
        receivingMap.set(row.sku, { ...row });
      }
    }
  });

  const allSkus = new Set([...Array.from(poMap.keys()), ...Array.from(receivingMap.keys())]);
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

  allSkus.forEach((sku) => {
    const po = poMap.get(sku);
    const recv = receivingMap.get(sku);

    const orderedQuantity = po ? po.orderedQuantity : 0;
    const receivedQuantity = recv ? recv.receivedQuantity : 0;
    const unitPrice = po?.unitPrice ?? recv?.unitPrice ?? 0;
    const supplier = po?.supplier ?? recv?.supplier;
    const poNumber = po?.poNumber ?? recv?.poNumber;

    const difference = receivedQuantity - orderedQuantity;

    let status: ReconciliationStatus;
    let shortageValue = 0;

    if (!po && recv) {
      status = 'unexpected';
      unexpectedCount++;
    } else if (po && !recv) {
      status = 'missing';
      missingCount++;
      const shortQty = orderedQuantity;
      shortageValue = shortQty * unitPrice;
      totalShortageQty += shortQty;
      totalShortageValue += shortageValue;
    } else if (difference === 0) {
      status = 'matched';
      matchedCount++;
    } else if (difference < 0) {
      status = 'short';
      shortCount++;
      const shortQty = Math.abs(difference);
      shortageValue = shortQty * unitPrice;
      totalShortageQty += shortQty;
      totalShortageValue += shortageValue;
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
      unitPrice,
      supplier,
      poNumber,
    });
  });

  const summary: ReconciliationSummary = {
    totalSkus: results.length,
    matchedCount,
    shortCount,
    overCount,
    missingCount,
    unexpectedCount,
    totalOrderedQty,
    totalReceivedQty,
    totalShortageQty,
    totalShortageValue,
  };

  return { results, summary };
}
