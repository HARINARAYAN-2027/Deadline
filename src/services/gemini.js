import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim() || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const envModel = import.meta.env.VITE_GEMINI_MODEL?.trim();
const envModelCandidates = import.meta.env.VITE_GEMINI_MODEL_CANDIDATES?.split(',').map((item) => item.trim()).filter(Boolean);

// currently supported stable models ka array set 
const DEFAULT_MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-1.5-flash'
];

const MODEL_CANDIDATES = envModelCandidates?.length
  ? envModelCandidates
  : envModel
    ? [envModel]
    : DEFAULT_MODEL_CANDIDATES;

const MAX_ATTEMPTS = 3;
const BASE_RETRY_DELAY_MS = 600;

const buildSystemInstruction = () => {
  const now = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
  const dateLabel = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return `
You are the central system core of 'DeadlineAI', a high-performance productivity companion.
Your goal is to transform chaotic user input into a structured, prioritized autonomous action plan, AND write a direct conversational reply.

CURRENT CONTEXT:
- Timezone: ${tz}
- Current date: ${dateLabel}
- Current time: ${timeLabel}

MISSION:
1. Extract every task and deadline mentioned.
2. Prioritize tasks (High/Medium/Low) based on urgency and the current time (${timeLabel}).
3. Write a reassuring, clear, and direct friendly text response in the "chatResponse" field explaining the strategy you used to structure their day. Speak like an expert companion.
4. Schedule specific times for "Today Tasks" based on logical flow.

OUTPUT FORMAT:
Return ONLY valid JSON. Match this schema exactly. Do not include any text outside the JSON.
{
  "chatResponse": "String - Your complete conversational answer/breakdown to display in the chat window to the user",
  "productivityScore": number (0-100),
  "riskPercentage": number (0-100),
  "todayTasks": [
    {"task": "String", "time": "HH:MM AM/PM", "priority": "High|Medium|Low"}
  ],
  "upcomingDeadlines": [
    {"title": "String", "date": "DD", "month": "MMM", "time": "HH:MM AM/PM", "priority": "High"}
  ],
  "aiInsights": ["String - max 2 concise strategic insights"]
}
`;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isInvalidApiKeyError = (err) => {
  const message = String(err?.message || '').toLowerCase();
  return /api_key_invalid|api key not valid|unauthorized|permission denied|403|401/.test(message);
};

const isModelNotFoundError = (err) => {
  const message = String(err?.message || '').toLowerCase();
  const status = Number(err?.status || err?.code || 0);
  return status === 404 || /not found|missing model|model .* not found/.test(message);
};

const isTransientGeminiError = (err) => {
  const message = String(err?.message || '').toLowerCase();
  const status = Number(err?.status || err?.code || 0);
  return (
    /overloaded|busy|high demand|capacity|unavailable|timeout|temporar/.test(message) ||
    [408, 429, 500, 502, 503, 504].includes(status)
  );
};

export const generateAutonomousPlan = async (userCrisisText) => {
  if (!genAI || !apiKey) {
    return {
      success: false,
      message: '⚠️ API Key configurations missing or invalid in your .env file.',
      details: { status: 'CONFIG_ERROR', model: 'none' },
    };
  }

  let lastError = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: buildSystemInstruction(),
      });

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        try {
          const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: userCrisisText }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json',
            },
          });

          const response = await result.response;
          const text = response.text();
          const jsonStr = text.replace(/```json|```/g, '').trim();
          const payload = JSON.parse(jsonStr);

          return {
            success: true,
            payload,
            modelUsed: modelName,
          };
        } catch (err) {
          lastError = err;
          const rawMessage = String(err?.message || err || 'Unknown error');
          const status = err?.status || err?.code || 'ERROR';
          console.warn(`Gemini [${modelName}] failed (attempt ${attempt}):`, rawMessage);

          if (isInvalidApiKeyError(err)) {
            return {
              success: false,
              message: 'Invalid Gemini API Key. Ensure it starts with "AIza".',
              details: { status, model: modelName },
            };
          }

          
          if (isModelNotFoundError(err)) {
            break; 
          }

          const shouldRetry = attempt < MAX_ATTEMPTS && isTransientGeminiError(err);
          if (!shouldRetry) {
            break;
          }

          const retryDelay = BASE_RETRY_DELAY_MS * attempt;
          await sleep(retryDelay);
        }
      }
    } catch (outerErr) {
      lastError = outerErr;
      console.error(`Error initializing model [${modelName}]:`, outerErr);
    }
  }

  const rawMessage = String(lastError?.message || 'Failed to reach Gemini AI nodes.');
  const status = lastError?.status || lastError?.code || 'ERROR';

  return {
    success: false,
    message: rawMessage.includes('API_KEY_INVALID') || rawMessage.includes('API key not valid')
      ? 'Invalid Gemini API Key. Ensure it starts with "AIza".'
      : isModelNotFoundError(lastError)
        ? 'Gemini model not found. Please check your model configuration or VITE_GEMINI_MODEL environment variable.'
        : 'Gemini is currently overloaded or busy. Please retry in 30 seconds.',
    details: {
      status,
      model: MODEL_CANDIDATES[0],
    },
  };
};

export const processCrisisTelemetry = async (userCrisisText) => {
  return await generateAutonomousPlan(userCrisisText);
};
