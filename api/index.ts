import express, { type Express, type Request, type Response } from 'express';
import { GoogleGenAI, ThinkingLevel, type Content } from '@google/genai';

type ChatMode = 'coach' | 'concierge';

interface IncomingMessage {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTIONS: Record<ChatMode, string> = {
  coach: `You are the Head Strength & Conditioning Coach AI at Ironwork Barbell in Austin, TX (1420 S Congress Ave).
Your role is to help lifters with powerlifting programming (squat, bench press, deadlift), accessory selection, warm-ups, RPE progression, recovery (185F infrared sauna & 39F cold plunge), and performance macros.
Gym context you know accurately:
- Equipment: 42 calibrated Eleiko & Rogue racks, 12 deadlift platforms, Texas Power Bars, Kabuki trap bars, safety squat bars, chalk bowls at every platform, and turf conditioning lanes.
- Coaches on staff: Marcus Vance (Head Strength Coach, CSCS/USAPL), Elena Rostova (Conditioning Director), Devon Hale (Olympic & Mobility Lead).
- Guidelines: Give direct, practical, gritty coaching advice in plain text (avoid excessive markdown clutter). Keep responses concise (3-6 sentences or a tight bulleted block unless the user asks for a full weekly program). Never diagnose medical injuries; recommend seeing a sports physical therapist for sharp or persistent pain.`,
  concierge: `You are the Member Concierge AI at Ironwork Barbell, a 24/7 powerlifting and performance gym at 1420 S Congress Ave, Suite B, Austin, TX 78704.
Your role is to give fast, accurate answers about memberships, hours, classes, and the 3-day free trial.
Key facts:
- Hours: Open 24/7/365 via encrypted smartphone keycard; staffed daily 6:00 AM - 9:00 PM. Phone: (512) 555-0194.
- Free Trial: 3 consecutive days of 24/7 floor access, 1 coach-led class, complimentary InBody scan, and 1 sauna/cold plunge contrast session.
- Pricing: Monthly Open Gym ($89/mo or $71/mo billed yearly), Annual All-Access ($139/mo or $109/mo billed yearly — Best Value, includes unlimited classes + daily sauna & cold plunge), VIP Pro Coaching ($259/mo or $207/mo billed yearly, includes 4 private 1-on-1 sessions/mo). Zero initiation fees.
- Today's classes: Competition Barbell Club (6:00 AM, Marcus Vance), Metcon Turf Engine (7:30 AM, Elena Rostova), Olympic Lift & Mobility (12:00 PM, Devon Hale), Contrast Recovery Protocol (5:30 PM, Devon Hale), After-Hours Sled & Carry (7:00 PM, Elena Rostova).
Keep answers crisp, helpful, and under 4 sentences whenever possible.`,
};

function sanitizeMessages(raw: unknown): IncomingMessage[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > 30) {
    return null;
  }
  const cleaned: IncomingMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') return null;
    const record = item as Record<string, unknown>;
    const role = record.role;
    const text = record.text;
    if (
      (role !== 'user' && role !== 'model') ||
      typeof text !== 'string' ||
      text.trim().length === 0 ||
      text.length > 2500
    ) {
      return null;
    }
    cleaned.push({ role, text: text.trim() });
  }
  if (cleaned[cleaned.length - 1].role !== 'user') {
    return null;
  }
  return cleaned;
}

async function sendWithRetry<T>(operation: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (err: unknown) {
      lastError = err;
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status: unknown }).status)
          : 500;
      const isRetryable = status === 429 || status >= 500;
      if (!isRetryable || attempt === maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 400 * Math.pow(2, attempt)));
    }
  }
  throw lastError;
}

/**
 * Creates the Express application with Ironwork Barbell's API routes (/api/chat and /api/maps-config).
 */
export function createApiApp(): Express {
  const app = express();
  app.use(express.json({ limit: '512kb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  app.post('/api/chat', async (req: Request, res: Response) => {
    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'Gemini API key is not configured. Please add GEMINI_API_KEY in Settings > Secrets.',
      });
      return;
    }

    const body = req.body as Record<string, unknown>;
    const mode: ChatMode = body?.mode === 'concierge' ? 'concierge' : 'coach';
    const messages = sanitizeMessages(body?.messages);

    if (!messages) {
      res.status(400).json({
        error: 'Please enter a valid message to continue the conversation.',
      });
      return;
    }

    const model = mode === 'concierge' ? 'gemini-3.1-flash-lite' : 'gemini-4-hydrogen';
    const history: Content[] = messages.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    }));
    const latestMessage = messages[messages.length - 1].text;

    try {
      const response = await sendWithRetry(async () => {
        const chat = ai.chats.create({
          model,
          history,
          config: {
            systemInstruction: SYSTEM_INSTRUCTIONS[mode],
            ...(model === 'gemini-4-hydrogen'
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {}),
          },
        });
        return chat.sendMessage({ message: latestMessage });
      });

      const replyText = response.text?.trim();
      if (!replyText) {
        res.status(502).json({
          error: 'The assistant returned an empty response. Please try again.',
        });
        return;
      }

      res.json({ reply: replyText, model });
    } catch (err: unknown) {
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status: unknown }).status)
          : 500;

      if (status === 400 || status === 403) {
        res.status(status).json({
          error:
            'Unable to authorize Gemini request. Please verify your API key in Settings > Secrets.',
        });
        return;
      }

      if (status === 429) {
        res.status(429).json({
          error: 'Rate limit reached right now. Wait a few seconds and try again.',
        });
        return;
      }

      console.error('Gemini chat error:', err);
      res.status(500).json({
        error: 'Unable to reach Ironwork Assistant right now. Please try again shortly.',
      });
    }
  });

  app.get('/api/maps-config', (_req: Request, res: Response) => {
    const apiKey =
      process.env.VITE_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
    res.json({ apiKey });
  });

  return app;
}

const app = createApiApp();
export default app;
