export interface CategorizedError {
  isRecoverable: boolean;
  category: string;
  httpStatus: number;
}

export interface GenerateResult {
  text: string;
  modelUsed: string;
}

export interface FallbackOptions {
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * Parses and returns the ordered list of Gemini models to attempt.
 * Primary model is always tried first, followed by fallbacks.
 * Duplicates are filtered out while preserving priority order.
 */
export function getModelPipeline(): string[] {
  const primaryModel = process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash';
  const fallbackModelsRaw = process.env.GEMINI_FALLBACK_MODELS;

  let fallbackModels: string[] = [];
  if (fallbackModelsRaw !== undefined && fallbackModelsRaw !== null) {
    fallbackModels = fallbackModelsRaw
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0);
  } else {
    // Default safety fallback if GEMINI_FALLBACK_MODELS env var is absent
    fallbackModels = ['gemini-3.5-flash', 'gemini-3.1-flash'];
  }

  const pipeline: string[] = [];
  for (const model of [primaryModel, ...fallbackModels]) {
    if (model && !pipeline.includes(model)) {
      pipeline.push(model);
    }
  }

  return pipeline;
}

/**
 * Redacts secret API keys or headers from error strings to prevent accidental log leaks.
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (!error) return 'Unknown error';
  let message =
    typeof error === 'string'
      ? error
      : (error as { message?: string }).message || String(error);

  message = message.replace(/key=[A-Za-z0-9_-]+/gi, 'key=[REDACTED]');
  message = message.replace(/AIzaSy[A-Za-z0-9_-]{33}/g, '[REDACTED_KEY]');
  message = message.replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer [REDACTED]');
  return message.slice(0, 500);
}

/**
 * Classifies errors from Gemini API into recoverable (model-related/availability/rate-limit)
 * versus non-recoverable (invalid API key, bad client payload) errors.
 */
export function classifyGeminiError(error: unknown): CategorizedError {
  const errStr = sanitizeErrorMessage(error);
  const status =
    (error as { status?: number | string })?.status ??
    (error as { code?: number | string })?.code ??
    '';
  const statusNum = Number(status) || 0;

  // 1. Non-recoverable: Authentication & Authorization errors
  if (
    statusNum === 401 ||
    statusNum === 403 ||
    /API_KEY_INVALID|UNAUTHENTICATED|PERMISSION_DENIED|API key not valid|invalid api key/i.test(
      errStr
    )
  ) {
    return { isRecoverable: false, category: 'INVALID_API_KEY', httpStatus: 401 };
  }

  // 2. Client Bad Request (e.g. invalid JSON input, malformed prompt structure)
  if (statusNum === 400 || /INVALID_ARGUMENT|bad request/i.test(errStr)) {
    // Exception: If 400 specifically mentions model not found/unsupported, treat as model error
    if (
      /model/i.test(errStr) &&
      /not found|not supported|invalid model|does not exist/i.test(errStr)
    ) {
      return { isRecoverable: true, category: 'INVALID_MODEL', httpStatus: 500 };
    }
    return { isRecoverable: false, category: 'BAD_REQUEST', httpStatus: 400 };
  }

  // 3. Recoverable: Model Not Found / 404 / Retired / Disabled / Unsupported
  if (
    statusNum === 404 ||
    /NOT_FOUND|Model not found|is not found|not supported|deprecated|shut down|retired/i.test(
      errStr
    )
  ) {
    return { isRecoverable: true, category: 'INVALID_MODEL', httpStatus: 500 };
  }

  // 4. Recoverable: Temporary model or server availability errors (5xx, UNAVAILABLE)
  if (
    statusNum >= 500 ||
    /UNAVAILABLE|INTERNAL|OVERLOADED|service unavailable|gateway timeout/i.test(
      errStr
    )
  ) {
    return { isRecoverable: true, category: 'MODEL_UNAVAILABLE', httpStatus: 500 };
  }

  // 5. Recoverable: Rate Limited / Quota / Overload (429)
  if (
    statusNum === 429 ||
    /RESOURCE_EXHAUSTED|rate limit|quota|too many requests/i.test(errStr)
  ) {
    return { isRecoverable: true, category: 'RATE_LIMITED', httpStatus: 429 };
  }

  // 6. Default fallback for unknown model/generation errors: recoverable model error
  return { isRecoverable: true, category: 'GEMINI_REQUEST_FAILED', httpStatus: 500 };
}

/**
 * Interface representing the minimal Gemini client methods required for generation.
 */
export interface GeminiClientLike {
  models: {
    generateContent: (params: {
      model: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      contents: any;
      config?: {
        systemInstruction?: string;
        temperature?: number;
        maxOutputTokens?: number;
      };
    }) => Promise<{ text?: string }>;
  };
}

export class GeminiFallbackError extends Error {
  categorized: CategorizedError;
  modelAttempted?: string;

  constructor(message: string, categorized: CategorizedError, modelAttempted?: string) {
    super(message);
    this.name = 'GeminiFallbackError';
    this.categorized = categorized;
    this.modelAttempted = modelAttempted;
  }
}

/**
 * Executes a Gemini content generation request sequentially with model fallbacks.
 * Iterates through configured models until one succeeds or a non-recoverable error occurs.
 */
export async function generateWithFallback(
  ai: GeminiClientLike,
  contents: unknown,
  systemInstructionCombined: string,
  options: FallbackOptions = {}
): Promise<GenerateResult> {
  const models = getModelPipeline();
  let lastCategorizedError: CategorizedError = {
    isRecoverable: true,
    category: 'GEMINI_REQUEST_FAILED',
    httpStatus: 500,
  };
  let lastErrorMsg = 'All configured models failed.';

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemInstructionCombined,
          temperature: options.temperature ?? 0.3,
          maxOutputTokens: options.maxOutputTokens ?? 600,
        },
      });

      const responseText = response?.text;
      if (responseText && responseText.trim()) {
        if (i > 0) {
          console.log(`[ShipRecon Chatbot] Fallback succeeded with model: ${model}`);
        }
        return { text: responseText.trim(), modelUsed: model };
      } else {
        throw new Error(`Empty text response returned from model ${model}`);
      }
    } catch (err: unknown) {
      const categorized = classifyGeminiError(err);
      lastCategorizedError = categorized;
      lastErrorMsg = sanitizeErrorMessage(err);

      console.warn(
        `[ShipRecon Chatbot API Warning] Model '${model}' failed [${categorized.category}]: ${lastErrorMsg}`
      );

      // Non-recoverable error (e.g. invalid API key, bad request) -> stop fallback cycle immediately
      if (!categorized.isRecoverable) {
        throw new GeminiFallbackError(lastErrorMsg, categorized, model);
      }
    }
  }

  throw new GeminiFallbackError(lastErrorMsg, lastCategorizedError);
}
