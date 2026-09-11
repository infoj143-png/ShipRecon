import assert from 'node:assert';
import test from 'node:test';
import {
  getModelPipeline,
  classifyGeminiError,
  sanitizeErrorMessage,
  generateWithFallback,
  GeminiFallbackError,
  GeminiClientLike,
} from '../gemini-fallback';

test('getModelPipeline reads primary and fallback models from environment', () => {
  const origModel = process.env.GEMINI_MODEL;
  const origFallbacks = process.env.GEMINI_FALLBACK_MODELS;

  try {
    process.env.GEMINI_MODEL = 'gemini-3.6-flash';
    process.env.GEMINI_FALLBACK_MODELS = 'gemini-3.5-flash, gemini-3.1-flash';

    const pipeline = getModelPipeline();
    assert.deepStrictEqual(pipeline, [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash',
    ]);
  } finally {
    if (origModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = origModel;
    if (origFallbacks === undefined) delete process.env.GEMINI_FALLBACK_MODELS;
    else process.env.GEMINI_FALLBACK_MODELS = origFallbacks;
  }
});

test('getModelPipeline deduplicates models and handles empty configurations safely', () => {
  const origModel = process.env.GEMINI_MODEL;
  const origFallbacks = process.env.GEMINI_FALLBACK_MODELS;

  try {
    // Primary model duplicate in fallbacks
    process.env.GEMINI_MODEL = 'gemini-3.6-flash';
    process.env.GEMINI_FALLBACK_MODELS =
      'gemini-3.6-flash, gemini-3.5-flash, gemini-3.5-flash';

    const pipeline = getModelPipeline();
    assert.deepStrictEqual(pipeline, ['gemini-3.6-flash', 'gemini-3.5-flash']);

    // Empty fallback env var
    process.env.GEMINI_FALLBACK_MODELS = '';
    const pipelineEmptyFallback = getModelPipeline();
    assert.deepStrictEqual(pipelineEmptyFallback, ['gemini-3.6-flash']);

    // Missing env vars default safely
    delete process.env.GEMINI_MODEL;
    delete process.env.GEMINI_FALLBACK_MODELS;
    const defaultPipeline = getModelPipeline();
    assert.strictEqual(defaultPipeline[0], 'gemini-3.6-flash');
    assert.ok(defaultPipeline.length >= 2);
  } finally {
    if (origModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = origModel;
    if (origFallbacks === undefined) delete process.env.GEMINI_FALLBACK_MODELS;
    else process.env.GEMINI_FALLBACK_MODELS = origFallbacks;
  }
});

test('sanitizeErrorMessage redacts API keys and headers', () => {
  const rawError =
    'Error fetching https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=AIzaSyA12345678901234567890123456789012 with Bearer token_secret_123';
  const sanitized = sanitizeErrorMessage(rawError);

  assert.ok(!sanitized.includes('AIzaSyA12345678901234567890123456789012'));
  assert.ok(sanitized.includes('key=[REDACTED]'));
  assert.ok(sanitized.includes('Bearer [REDACTED]'));
});

test('classifyGeminiError correctly categorizes recoverable vs non-recoverable errors', () => {
  // 401 Invalid Key -> Non-recoverable
  const authErr = classifyGeminiError({ status: 401, message: 'API_KEY_INVALID' });
  assert.strictEqual(authErr.isRecoverable, false);
  assert.strictEqual(authErr.category, 'INVALID_API_KEY');

  // 404 Model Not Found -> Recoverable
  const notFoundErr = classifyGeminiError({
    status: 404,
    message: 'models/gemini-3.6-flash is not found',
  });
  assert.strictEqual(notFoundErr.isRecoverable, true);
  assert.strictEqual(notFoundErr.category, 'INVALID_MODEL');

  // 429 Rate Limit -> Recoverable
  const rateLimitErr = classifyGeminiError({
    status: 429,
    message: 'RESOURCE_EXHAUSTED',
  });
  assert.strictEqual(rateLimitErr.isRecoverable, true);
  assert.strictEqual(rateLimitErr.category, 'RATE_LIMITED');

  // 503 Overloaded -> Recoverable
  const unavailableErr = classifyGeminiError({
    status: 503,
    message: 'UNAVAILABLE: Service temporarily overloaded',
  });
  assert.strictEqual(unavailableErr.isRecoverable, true);
  assert.strictEqual(unavailableErr.category, 'MODEL_UNAVAILABLE');

  // 400 Bad Request -> Non-recoverable
  const badReqErr = classifyGeminiError({
    status: 400,
    message: 'INVALID_ARGUMENT: contents required',
  });
  assert.strictEqual(badReqErr.isRecoverable, false);
  assert.strictEqual(badReqErr.category, 'BAD_REQUEST');
});

test('generateWithFallback: 1. Primary model succeeds -> no fallback', async () => {
  const origModel = process.env.GEMINI_MODEL;
  const origFallbacks = process.env.GEMINI_FALLBACK_MODELS;

  try {
    process.env.GEMINI_MODEL = 'gemini-3.6-flash';
    process.env.GEMINI_FALLBACK_MODELS = 'gemini-3.5-flash,gemini-3.1-flash';

    const attemptedModels: string[] = [];
    const mockClient: GeminiClientLike = {
      models: {
        generateContent: async ({ model }) => {
          attemptedModels.push(model);
          return { text: 'Hello from primary model!' };
        },
      },
    };

    const res = await generateWithFallback(
      mockClient,
      [{ parts: [{ text: 'Hi' }] }],
      'System prompt'
    );
    assert.strictEqual(res.text, 'Hello from primary model!');
    assert.strictEqual(res.modelUsed, 'gemini-3.6-flash');
    assert.deepStrictEqual(attemptedModels, ['gemini-3.6-flash']);
  } finally {
    if (origModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = origModel;
    if (origFallbacks === undefined) delete process.env.GEMINI_FALLBACK_MODELS;
    else process.env.GEMINI_FALLBACK_MODELS = origFallbacks;
  }
});

test('generateWithFallback: 2. Primary model fails with model-not-found -> fallback model succeeds', async () => {
  const origModel = process.env.GEMINI_MODEL;
  const origFallbacks = process.env.GEMINI_FALLBACK_MODELS;

  try {
    process.env.GEMINI_MODEL = 'gemini-3.6-flash';
    process.env.GEMINI_FALLBACK_MODELS = 'gemini-3.5-flash,gemini-3.1-flash';

    const attemptedModels: string[] = [];
    const mockClient: GeminiClientLike = {
      models: {
        generateContent: async ({ model }) => {
          attemptedModels.push(model);
          if (model === 'gemini-3.6-flash') {
            throw { status: 404, message: 'Model gemini-3.6-flash not found' };
          }
          return { text: 'Hello from fallback model!' };
        },
      },
    };

    const res = await generateWithFallback(
      mockClient,
      [{ parts: [{ text: 'Hi' }] }],
      'System prompt'
    );
    assert.strictEqual(res.text, 'Hello from fallback model!');
    assert.strictEqual(res.modelUsed, 'gemini-3.5-flash');
    assert.deepStrictEqual(attemptedModels, ['gemini-3.6-flash', 'gemini-3.5-flash']);
  } finally {
    if (origModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = origModel;
    if (origFallbacks === undefined) delete process.env.GEMINI_FALLBACK_MODELS;
    else process.env.GEMINI_FALLBACK_MODELS = origFallbacks;
  }
});

test('generateWithFallback: 3. Primary fails -> second fallback fails -> third model succeeds', async () => {
  const origModel = process.env.GEMINI_MODEL;
  const origFallbacks = process.env.GEMINI_FALLBACK_MODELS;

  try {
    process.env.GEMINI_MODEL = 'gemini-3.6-flash';
    process.env.GEMINI_FALLBACK_MODELS = 'gemini-3.5-flash,gemini-3.1-flash';

    const attemptedModels: string[] = [];
    const mockClient: GeminiClientLike = {
      models: {
        generateContent: async ({ model }) => {
          attemptedModels.push(model);
          if (model === 'gemini-3.6-flash') {
            throw { status: 404, message: 'Model gemini-3.6-flash is retired' };
          }
          if (model === 'gemini-3.5-flash') {
            throw { status: 503, message: 'Service unavailable' };
          }
          return { text: 'Hello from third model!' };
        },
      },
    };

    const res = await generateWithFallback(
      mockClient,
      [{ parts: [{ text: 'Hi' }] }],
      'System prompt'
    );
    assert.strictEqual(res.text, 'Hello from third model!');
    assert.strictEqual(res.modelUsed, 'gemini-3.1-flash');
    assert.deepStrictEqual(attemptedModels, [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.1-flash',
    ]);
  } finally {
    if (origModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = origModel;
    if (origFallbacks === undefined) delete process.env.GEMINI_FALLBACK_MODELS;
    else process.env.GEMINI_FALLBACK_MODELS = origFallbacks;
  }
});

test('generateWithFallback: 4. All models fail -> throws GeminiFallbackError', async () => {
  const origModel = process.env.GEMINI_MODEL;
  const origFallbacks = process.env.GEMINI_FALLBACK_MODELS;

  try {
    process.env.GEMINI_MODEL = 'gemini-3.6-flash';
    process.env.GEMINI_FALLBACK_MODELS = 'gemini-3.5-flash';

    const attemptedModels: string[] = [];
    const mockClient: GeminiClientLike = {
      models: {
        generateContent: async ({ model }) => {
          attemptedModels.push(model);
          throw { status: 503, message: 'Service unavailable' };
        },
      },
    };

    await assert.rejects(
      async () => {
        await generateWithFallback(
          mockClient,
          [{ parts: [{ text: 'Hi' }] }],
          'System prompt'
        );
      },
      (err: unknown) => {
        assert.ok(err instanceof GeminiFallbackError);
        assert.strictEqual(err.categorized.category, 'MODEL_UNAVAILABLE');
        return true;
      }
    );

    assert.deepStrictEqual(attemptedModels, ['gemini-3.6-flash', 'gemini-3.5-flash']);
  } finally {
    if (origModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = origModel;
    if (origFallbacks === undefined) delete process.env.GEMINI_FALLBACK_MODELS;
    else process.env.GEMINI_FALLBACK_MODELS = origFallbacks;
  }
});

test('generateWithFallback: 5. Non-recoverable error -> stops cycling immediately', async () => {
  const origModel = process.env.GEMINI_MODEL;
  const origFallbacks = process.env.GEMINI_FALLBACK_MODELS;

  try {
    process.env.GEMINI_MODEL = 'gemini-3.6-flash';
    process.env.GEMINI_FALLBACK_MODELS = 'gemini-3.5-flash,gemini-3.1-flash';

    const attemptedModels: string[] = [];
    const mockClient: GeminiClientLike = {
      models: {
        generateContent: async ({ model }) => {
          attemptedModels.push(model);
          throw { status: 401, message: 'API_KEY_INVALID' };
        },
      },
    };

    await assert.rejects(
      async () => {
        await generateWithFallback(
          mockClient,
          [{ parts: [{ text: 'Hi' }] }],
          'System prompt'
        );
      },
      (err: unknown) => {
        assert.ok(err instanceof GeminiFallbackError);
        assert.strictEqual(err.categorized.isRecoverable, false);
        assert.strictEqual(err.categorized.category, 'INVALID_API_KEY');
        return true;
      }
    );

    // Should stop after first model attempt!
    assert.deepStrictEqual(attemptedModels, ['gemini-3.6-flash']);
  } finally {
    if (origModel === undefined) delete process.env.GEMINI_MODEL;
    else process.env.GEMINI_MODEL = origModel;
    if (origFallbacks === undefined) delete process.env.GEMINI_FALLBACK_MODELS;
    else process.env.GEMINI_FALLBACK_MODELS = origFallbacks;
  }
});
