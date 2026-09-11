import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_INSTRUCTION, SHIPRECON_KNOWLEDGE } from '@/lib/shiprecon-assistant';
import {
  generateWithFallback,
  GeminiFallbackError,
  sanitizeErrorMessage,
} from '@/lib/gemini-fallback';

export interface ChatHistoryItem {
  role: 'user' | 'model';
  content: string;
}

const DEFAULT_USER_ERROR =
  "Sorry, I'm having trouble connecting right now. Please try again in a moment.";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error(
        '[ShipRecon Chatbot API Error] [MISSING_API_KEY] GEMINI_API_KEY environment variable is missing.'
      );
      return NextResponse.json({ error: DEFAULT_USER_ERROR }, { status: 500 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      console.error(
        '[ShipRecon Chatbot API Error] [INVALID_REQUEST] Failed to parse JSON body.'
      );
      return NextResponse.json(
        { error: 'Invalid request payload. Expected valid JSON.' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object') {
      console.error(
        '[ShipRecon Chatbot API Error] [INVALID_REQUEST] Payload is not an object.'
      );
      return NextResponse.json(
        { error: 'Invalid request payload.' },
        { status: 400 }
      );
    }

    const { message, history } = body as { message?: unknown; history?: unknown };

    if (typeof message !== 'string' || !message.trim()) {
      console.error(
        '[ShipRecon Chatbot API Error] [INVALID_REQUEST] Missing or empty message field.'
      );
      return NextResponse.json(
        { error: 'Message is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 500) {
      console.error(
        '[ShipRecon Chatbot API Error] [INVALID_REQUEST] Message exceeds 500 character limit.'
      );
      return NextResponse.json(
        { error: 'Message exceeds maximum length of 500 characters.' },
        { status: 400 }
      );
    }

    // Process and sanitize conversation history (limit to last 8 items)
    const sanitizedHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] =
      [];
    if (Array.isArray(history)) {
      const recentHistory = history.slice(-8);
      for (const item of recentHistory) {
        if (
          item &&
          typeof item === 'object' &&
          (item.role === 'user' || item.role === 'model') &&
          typeof item.content === 'string' &&
          item.content.trim()
        ) {
          sanitizedHistory.push({
            role: item.role === 'model' ? 'model' : 'user',
            parts: [{ text: item.content.trim().slice(0, 500) }],
          });
        }
      }
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstructionCombined = `${SYSTEM_INSTRUCTION}\n\n${SHIPRECON_KNOWLEDGE}`;

    const contents = [
      ...sanitizedHistory,
      {
        role: 'user' as const,
        parts: [{ text: trimmedMessage }],
      },
    ];

    let result;
    try {
      result = await generateWithFallback(ai, contents, systemInstructionCombined, {
        temperature: 0.3,
        maxOutputTokens: 600,
      });
    } catch (fallbackErr: unknown) {
      if (fallbackErr instanceof GeminiFallbackError) {
        const httpStatus = fallbackErr.categorized.httpStatus || 500;
        console.error(
          `[ShipRecon Chatbot API Error] [${fallbackErr.categorized.category}] ${fallbackErr.message}`
        );
        return NextResponse.json({ error: DEFAULT_USER_ERROR }, { status: httpStatus });
      }

      const errStr = sanitizeErrorMessage(fallbackErr);
      console.error(
        `[ShipRecon Chatbot API Error] [GEMINI_FALLBACK_FAILED] ${errStr}`
      );
      return NextResponse.json({ error: DEFAULT_USER_ERROR }, { status: 500 });
    }

    return NextResponse.json({ text: result.text });
  } catch (error: unknown) {
    const errStr = sanitizeErrorMessage(error);
    console.error(`[ShipRecon Chatbot API Error] [INTERNAL_ERROR] ${errStr}`);
    return NextResponse.json({ error: DEFAULT_USER_ERROR }, { status: 500 });
  }
}
