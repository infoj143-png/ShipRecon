import assert from 'node:assert';
import test from 'node:test';
import { POST } from '../../app/api/chat/route';

test('POST /api/chat returns 500 when GEMINI_API_KEY is missing', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  try {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hi' }),
    });

    const res = await POST(req);
    assert.strictEqual(res.status, 500);

    const data = await res.json();
    assert.strictEqual(
      data.error,
      "Sorry, I'm having trouble connecting right now. Please try again in a moment."
    );
  } finally {
    if (originalKey) process.env.GEMINI_API_KEY = originalKey;
  }
});

test('POST /api/chat returns 400 for invalid or empty message', async () => {
  process.env.GEMINI_API_KEY = 'test-key';

  try {
    // Missing message
    const req1 = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res1 = await POST(req1);
    assert.strictEqual(res1.status, 400);

    // Empty whitespace message
    const req2 = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: '   ' }),
    });
    const res2 = await POST(req2);
    assert.strictEqual(res2.status, 400);

    // Message exceeding 500 chars
    const req3 = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'a'.repeat(501) }),
    });
    const res3 = await POST(req3);
    assert.strictEqual(res3.status, 400);
  } finally {
    delete process.env.GEMINI_API_KEY;
  }
});

test('POST /api/chat handles invalid API key error gracefully with 401 status', async () => {
  process.env.GEMINI_API_KEY = 'invalid-fake-key';

  try {
    const req = new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello' }),
    });

    const res = await POST(req);
    // Invalid key causes 401 status
    assert.strictEqual(res.status, 401);

    const data = await res.json();
    assert.strictEqual(
      data.error,
      "Sorry, I'm having trouble connecting right now. Please try again in a moment."
    );
  } finally {
    delete process.env.GEMINI_API_KEY;
  }
});
