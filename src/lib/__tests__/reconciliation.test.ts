import { test } from 'node:test';
import assert from 'node:assert';
import { reconcileRows } from '../reconciliation';
import { autoDetectColumns } from '../fileParser';
import { PurchaseOrderRow, ReceivingRow } from '@/types/reconciliation';

test('Test A — Perfect Match', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-001', orderedQuantity: 100 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-001', receivedQuantity: 100 }];

  const { results, summary } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-001');
  assert.strictEqual(results[0].status, 'matched');
  assert.strictEqual(results[0].difference, 0);
  assert.strictEqual(summary.matchedCount, 1);
  assert.strictEqual(summary.discrepanciesCount, 0);
});

test('Test B — Short Shipment', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-002', orderedQuantity: 100 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-002', receivedQuantity: 92 }];

  const { results, summary } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-002');
  assert.strictEqual(results[0].status, 'short');
  assert.strictEqual(results[0].difference, -8);
  assert.strictEqual(summary.shortCount, 1);
  assert.strictEqual(summary.totalShortageQty, 8);
});

test('Test C — Over Shipment', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-003', orderedQuantity: 50 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-003', receivedQuantity: 55 }];

  const { results, summary } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-003');
  assert.strictEqual(results[0].status, 'over');
  assert.strictEqual(results[0].difference, 5);
  assert.strictEqual(summary.overCount, 1);
});

test('Test D — Missing SKU', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-004', orderedQuantity: 20 }];
  const recv: ReceivingRow[] = [];

  const { results, summary } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-004');
  assert.strictEqual(results[0].status, 'missing');
  assert.strictEqual(results[0].difference, -20);
  assert.strictEqual(summary.missingCount, 1);
  assert.strictEqual(summary.totalShortageQty, 20);
});

test('Test E — Unexpected SKU', () => {
  const po: PurchaseOrderRow[] = [];
  const recv: ReceivingRow[] = [{ sku: 'SKU-005', receivedQuantity: 10 }];

  const { results, summary } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-005');
  assert.strictEqual(results[0].status, 'unexpected');
  assert.strictEqual(results[0].difference, 10);
  assert.strictEqual(summary.unexpectedCount, 1);
});

test('Test F — Duplicate SKU Aggregation', () => {
  const po: PurchaseOrderRow[] = [
    { sku: 'SKU-101', orderedQuantity: 50 },
    { sku: 'SKU-101', orderedQuantity: 30 },
  ];
  const recv: ReceivingRow[] = [
    { sku: 'SKU-101', receivedQuantity: 40 },
    { sku: 'SKU-101', receivedQuantity: 30 },
  ];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-101');
  assert.strictEqual(results[0].orderedQuantity, 80);
  assert.strictEqual(results[0].receivedQuantity, 70);
  assert.strictEqual(results[0].difference, -10);
  assert.strictEqual(results[0].status, 'short');
});

test('Test G — Unit Price Shortage Valuation', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-002', orderedQuantity: 100, unitPrice: 5 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-002', receivedQuantity: 92 }];

  const { results, summary } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].status, 'short');
  assert.strictEqual(results[0].difference, -8);
  assert.strictEqual(results[0].shortageValue, 40);
  assert.strictEqual(summary.totalShortageValue, 40);
});

test('Edge Case — Leading & Trailing Whitespace in SKU', () => {
  const po: PurchaseOrderRow[] = [{ sku: '  SKU-999  ', orderedQuantity: 10 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-999', receivedQuantity: 10 }];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-999');
  assert.strictEqual(results[0].status, 'matched');
});

test('Edge Case — Case Insenstive SKU Matching', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'sku-abc-123', orderedQuantity: 15 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-ABC-123', receivedQuantity: 15 }];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].status, 'matched');
  assert.strictEqual(results[0].difference, 0);
});

test('Edge Case — Decimal Quantities Precision', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'WEIGHT-01', orderedQuantity: 10.5, unitPrice: 2.5 }];
  const recv: ReceivingRow[] = [{ sku: 'WEIGHT-01', receivedQuantity: 8.2 }];

  const { results, summary } = reconcileRows(po, recv);
  assert.strictEqual(results[0].orderedQuantity, 10.5);
  assert.strictEqual(results[0].receivedQuantity, 8.2);
  assert.strictEqual(results[0].difference, -2.3);
  assert.strictEqual(results[0].shortageValue, 5.75); // 2.3 * 2.5 = 5.75
  assert.strictEqual(summary.totalShortageValue, 5.75);
});

test('Edge Case — Zero and Negative Quantities', () => {
  const po: PurchaseOrderRow[] = [
    { sku: 'ZERO-1', orderedQuantity: 0 },
    { sku: 'NEG-1', orderedQuantity: -5 },
  ];
  const recv: ReceivingRow[] = [
    { sku: 'ZERO-1', receivedQuantity: 0 },
    { sku: 'NEG-1', receivedQuantity: -5 },
  ];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 2);
  assert.strictEqual(results[0].status, 'matched');
  assert.strictEqual(results[1].status, 'matched');
});

test('Column Mapping Auto-Detection Keywords', () => {
  const headersPO1 = ['Product SKU', 'Quantity Ordered', 'Unit Price', 'Vendor'];
  const mapPO1 = autoDetectColumns(headersPO1, 'po');
  assert.strictEqual(mapPO1.sku, 'Product SKU');
  assert.strictEqual(mapPO1.quantity, 'Quantity Ordered');
  assert.strictEqual(mapPO1.unitPrice, 'Unit Price');
  assert.strictEqual(mapPO1.supplier, 'Vendor');

  const headersPO2 = ['Item Code', 'Qty Ordered', 'Price', 'PO Number'];
  const mapPO2 = autoDetectColumns(headersPO2, 'po');
  assert.strictEqual(mapPO2.sku, 'Item Code');
  assert.strictEqual(mapPO2.quantity, 'Qty Ordered');
  assert.strictEqual(mapPO2.unitPrice, 'Price');
  assert.strictEqual(mapPO2.poNumber, 'PO Number');

  const headersRecv = ['Product Code', 'Qty Received', 'Received Qty', 'Unit_Price'];
  const mapRecv = autoDetectColumns(headersRecv, 'receiving');
  assert.strictEqual(mapRecv.sku, 'Product Code');
  assert.strictEqual(mapRecv.quantity, 'Qty Received');
  assert.strictEqual(mapRecv.unitPrice, 'Unit_Price');
});

test('Sample PO and Receiving Dataset Reconciliation Verification', async () => {
  const { SAMPLE_PURCHASE_ORDER, SAMPLE_RECEIVING } = await import('../reconciliation');
  const { results, summary } = reconcileRows(SAMPLE_PURCHASE_ORDER, SAMPLE_RECEIVING);

  assert.strictEqual(results.length, 6);

  const sku1 = results.find((r) => r.sku === 'SKU-001');
  assert.strictEqual(sku1?.status, 'matched');
  assert.strictEqual(sku1?.difference, 0);

  const sku2 = results.find((r) => r.sku === 'SKU-002');
  assert.strictEqual(sku2?.status, 'short');
  assert.strictEqual(sku2?.difference, -8);
  assert.strictEqual(sku2?.shortageValue, 80);

  const sku3 = results.find((r) => r.sku === 'SKU-003');
  assert.strictEqual(sku3?.status, 'over');
  assert.strictEqual(sku3?.difference, 10);

  const sku4 = results.find((r) => r.sku === 'SKU-004');
  assert.strictEqual(sku4?.status, 'missing');
  assert.strictEqual(sku4?.difference, -30);
  assert.strictEqual(sku4?.shortageValue, 240);

  const sku5 = results.find((r) => r.sku === 'SKU-005');
  assert.strictEqual(sku5?.status, 'matched');
  assert.strictEqual(sku5?.difference, 0);

  const sku6 = results.find((r) => r.sku === 'SKU-006');
  assert.strictEqual(sku6?.status, 'unexpected');
  assert.strictEqual(sku6?.difference, 20);

  assert.strictEqual(summary.totalShortageValue, 320);
});
