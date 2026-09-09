import { test } from 'node:test';
import assert from 'node:assert';
import { formatFileSize, autoDetectColumns } from '../fileParser';

test('formatFileSize formats bytes correctly', () => {
  assert.strictEqual(formatFileSize(500), '500 B');
  assert.strictEqual(formatFileSize(2048), '2.0 KB');
  assert.strictEqual(formatFileSize(1572864), '1.5 MB');
});

test('autoDetectColumns matches headers with hyphens and underscores', () => {
  const headersPO = ['product_sku', 'qty-ordered', 'unit_cost', 'po-number', 'vendor_name'];
  const mapPO = autoDetectColumns(headersPO, 'po');
  assert.strictEqual(mapPO.sku, 'product_sku');
  assert.strictEqual(mapPO.quantity, 'qty-ordered');
  assert.strictEqual(mapPO.unitPrice, 'unit_cost');
  assert.strictEqual(mapPO.poNumber, 'po-number');
  assert.strictEqual(mapPO.supplier, 'vendor_name');

  const headersRecv = ['item_code', 'quantity_received', 'price_per_unit', 'order_id'];
  const mapRecv = autoDetectColumns(headersRecv, 'receiving');
  assert.strictEqual(mapRecv.sku, 'item_code');
  assert.strictEqual(mapRecv.quantity, 'quantity_received');
  assert.strictEqual(mapRecv.unitPrice, 'price_per_unit');
  assert.strictEqual(mapRecv.poNumber, 'order_id');
});
