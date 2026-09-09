import { test } from 'node:test';
import assert from 'node:assert';
import { reconcileRows } from '../reconciliation';
import { PurchaseOrderRow, ReceivingRow } from '@/types/reconciliation';

test('Test 1 — Perfect Match', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-001', orderedQuantity: 100 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-001', receivedQuantity: 100 }];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-001');
  assert.strictEqual(results[0].status, 'matched');
  assert.strictEqual(results[0].difference, 0);
});

test('Test 2 — Short Shipment', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-002', orderedQuantity: 100 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-002', receivedQuantity: 92 }];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-002');
  assert.strictEqual(results[0].status, 'short');
  assert.strictEqual(results[0].difference, -8);
});

test('Test 3 — Over Shipment', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-003', orderedQuantity: 50 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-003', receivedQuantity: 55 }];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-003');
  assert.strictEqual(results[0].status, 'over');
  assert.strictEqual(results[0].difference, 5);
});

test('Test 4 — Missing SKU', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-004', orderedQuantity: 20 }];
  const recv: ReceivingRow[] = [];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-004');
  assert.strictEqual(results[0].status, 'missing');
  assert.strictEqual(results[0].difference, -20);
});

test('Test 5 — Unexpected SKU', () => {
  const po: PurchaseOrderRow[] = [];
  const recv: ReceivingRow[] = [{ sku: 'SKU-005', receivedQuantity: 10 }];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-005');
  assert.strictEqual(results[0].status, 'unexpected');
  assert.strictEqual(results[0].difference, 10);
});

test('Test 6 — Duplicate SKU', () => {
  const po: PurchaseOrderRow[] = [
    { sku: 'SKU-101', orderedQuantity: 50 },
    { sku: 'SKU-101', orderedQuantity: 30 },
  ];
  const recv: ReceivingRow[] = [{ sku: 'SKU-101', receivedQuantity: 70 }];

  const { results } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].sku, 'SKU-101');
  assert.strictEqual(results[0].orderedQuantity, 80);
  assert.strictEqual(results[0].receivedQuantity, 70);
  assert.strictEqual(results[0].difference, -10);
  assert.strictEqual(results[0].status, 'short');
});

test('Test 7 — Unit Price Shortage Value Calculation', () => {
  const po: PurchaseOrderRow[] = [{ sku: 'SKU-002', orderedQuantity: 100, unitPrice: 5 }];
  const recv: ReceivingRow[] = [{ sku: 'SKU-002', receivedQuantity: 92 }];

  const { results, summary } = reconcileRows(po, recv);
  assert.strictEqual(results.length, 1);
  assert.strictEqual(results[0].status, 'short');
  assert.strictEqual(results[0].difference, -8);
  assert.strictEqual(results[0].shortageValue, 40);
  assert.strictEqual(summary.totalShortageValue, 40);
});
