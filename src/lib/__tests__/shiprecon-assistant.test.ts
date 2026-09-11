import assert from 'node:assert';
import test from 'node:test';
import {
  isValidRoute,
  extractActionsFromText,
  SHIPRECON_KNOWLEDGE,
  SYSTEM_INSTRUCTION,
  QUICK_PROMPTS,
} from '../shiprecon-assistant';

test('isValidRoute identifies valid ShipRecon routes', () => {
  assert.strictEqual(isValidRoute('/'), true);
  assert.strictEqual(isValidRoute('/reconcile'), true);
  assert.strictEqual(isValidRoute('/blog'), true);
  assert.strictEqual(isValidRoute('/blog/supplier-short-shipment'), true);
  assert.strictEqual(isValidRoute('/about'), true);
  assert.strictEqual(isValidRoute('/privacy'), true);
  assert.strictEqual(isValidRoute('/#how-it-works'), true);

  // Invalid routes
  assert.strictEqual(isValidRoute('/external-page'), false);
  assert.strictEqual(isValidRoute('https://malicious.com'), false);
});

test('extractActionsFromText extracts valid internal links from markdown text', () => {
  const text =
    'You can check your shipment at [Check Shipment](/reconcile) or read our guide at [Short Shipment Guide](/blog/supplier-short-shipment). Avoid [Unsafe Link](https://external.com).';

  const actions = extractActionsFromText(text);

  assert.strictEqual(actions.length, 2);
  assert.deepStrictEqual(actions[0], {
    label: 'Check Shipment',
    href: '/reconcile',
  });
  assert.deepStrictEqual(actions[1], {
    label: 'Short Shipment Guide',
    href: '/blog/supplier-short-shipment',
  });
});

test('Knowledge base and system instructions contain necessary core concepts', () => {
  assert.ok(SHIPRECON_KNOWLEDGE.includes('Purchase Order'));
  assert.ok(SHIPRECON_KNOWLEDGE.includes('Receiving File'));
  assert.ok(SHIPRECON_KNOWLEDGE.includes('CSV'));
  assert.ok(SHIPRECON_KNOWLEDGE.includes('XLSX'));
  assert.ok(SHIPRECON_KNOWLEDGE.includes('Matched'));
  assert.ok(SHIPRECON_KNOWLEDGE.includes('Short'));
  assert.ok(SHIPRECON_KNOWLEDGE.includes('Over'));
  assert.ok(SHIPRECON_KNOWLEDGE.includes('Missing'));
  assert.ok(SHIPRECON_KNOWLEDGE.includes('Unexpected'));

  assert.ok(SYSTEM_INSTRUCTION.includes('ShipRecon Website Assistant'));
  assert.ok(QUICK_PROMPTS.length >= 5);
});
