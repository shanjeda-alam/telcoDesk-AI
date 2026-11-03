import { NextResponse } from "next/server";
import {
  analyzeComplaintWithGemini,
  chatWithGeminiAssistant,
  GeminiServiceError,
} from "@/lib/gemini";

// Simple in-memory sliding-window rate limiter per client IP
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 25;
const requestLog = new Map();

function checkRateLimit(clientKey) {
  const now = Date.now();
  const timestamps = requestLog.get(clientKey) || [];
  const recent = timestamps.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  recent.push(now);
  requestLog.set(clientKey, recent);
  return true;
}

export async function POST(request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "local";

    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT",
            message:
              "Too many AI requests in a short period. Please wait a minute before trying again.",
          },
        },
        { status: 429 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid JSON request body.",
          },
        },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Request payload must be a JSON object.",
          },
        },
        { status: 400 }
      );
    }

    const { mode, payload } = body;

    if (!mode || typeof mode !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message:
              "Missing required 'mode' parameter. Supported modes: 'analyze', 'chat'.",
          },
        },
        { status: 400 }
      );
    }

    if (mode === "analyze") {
      const analysis = await analyzeComplaintWithGemini(payload || body);
      return NextResponse.json(
        {
          success: true,
          mode: "analyze",
          data: analysis,
        },
        { status: 200 }
      );
    }

    if (mode === "chat") {
      const chatResult = await chatWithGeminiAssistant(payload || body);
      return NextResponse.json(
        {
          success: true,
          mode: "chat",
          data: chatResult,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNSUPPORTED_MODE",
          message: `Unsupported mode '${mode}'. Allowed modes are 'analyze' and 'chat'.`,
        },
      },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected server error occurred while processing the AI request.",
        },
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Use POST /api/gemini with mode 'analyze' or 'chat'.",
      },
    },
    { status: 405 }
  );
}
