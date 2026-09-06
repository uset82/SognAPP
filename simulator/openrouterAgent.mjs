import { OpenRouter, stepCountIs, tool } from '@openrouter/agent';
import { createRequire } from 'module';
import { z } from 'zod';

const require = createRequire(import.meta.url);
const { SOGN_SAFE_SYSTEM_PROMPT } = require('./agentPrompt.js');
const { answerQuestion } = require('./localAgent.js');

const DEFAULT_CHAT_MODELS = [
  'minimax/minimax-m3:free',
  'thinkingmachines/inkling:free',
  'openrouter/free',
];

const DEFAULT_TTS_MODELS = ['deepgram/flux-tts:free', 'fish-audio/s2.1-pro-free:free'];

const parseModelList = (value, fallback) => {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback;
  }
  const list = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length ? list : fallback;
};

export const getChatModels = () => {
  const preferred = process.env.AGENT_MODEL?.trim();
  const list = parseModelList(process.env.AGENT_CHAT_MODELS, DEFAULT_CHAT_MODELS);
  if (!preferred) {
    return list;
  }
  return [preferred, ...list.filter((model) => model !== preferred)];
};

export const getTtsModels = () => parseModelList(process.env.AGENT_TTS_MODELS, DEFAULT_TTS_MODELS);

const getApiKey = () => {
  const key = process.env.OPENROUTER_API_KEY;
  return typeof key === 'string' && key.trim() ? key.trim() : '';
};

const createClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  return new OpenRouter({
    apiKey,
    httpReferer: 'https://sognsafe.canner.app',
    appTitle: 'SOGN SAFE training prototype',
    timeoutMs: 8000,
  });
};

const withTimeout = (promise, ms, label) =>
  Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(label || 'timeout')), ms);
    }),
  ]);

const toInputItems = (message, conversation) => [
  ...((conversation || []).slice(-6).map((turn) => ({
    role: turn.role === 'assistant' ? 'assistant' : 'user',
    content: String(turn.text || ''),
  }))),
  { role: 'user', content: String(message || '') },
];

export const askOpenRouterAgent = async ({ message, context, conversation }) => {
  const client = createClient();
  if (!client) {
    return null;
  }

  const models = getChatModels();
  const instructions = `${SOGN_SAFE_SYSTEM_PROMPT}\n\nVerified context JSON: ${JSON.stringify(context || {})}`;
  const input = toInputItems(message, conversation);
  const guidanceTool = tool({
    name: 'get_verified_guidance',
    description:
      'Return the only verified local answer for this civilian question. Never invent incident facts, ETAs, or casualties.',
    inputSchema: z.object({
      question: z.string().describe('The civilian question'),
    }),
    execute: async ({ question }) => answerQuestion(question, context || {}),
  });

  const deadline = Date.now() + 9000;
  let lastError = null;

  for (const [index, model] of models.entries()) {
    const remaining = deadline - Date.now();
    if (remaining < 1200) {
      break;
    }

    const attempts = index === 0 ? [true, false] : [false];
    for (const useTools of attempts) {
      const attemptMs = Math.min(4000, Math.max(1200, deadline - Date.now()));
      try {
        const result = client.callModel({
          model,
          instructions,
          input,
          ...(useTools
            ? {
                tools: [guidanceTool],
                stopWhen: stepCountIs(3),
              }
            : {}),
        });
        const text = await withTimeout(result.getText(), attemptMs, 'openrouter-timeout');
        if (typeof text === 'string' && text.trim()) {
          return { text: text.trim(), model, usedTools: useTools };
        }
      } catch (error) {
        lastError = error;
      }
    }
  }

  if (lastError && process.env.AGENT_DEBUG === '1') {
    console.warn('[OpenRouter] All free chat models failed.');
  }
  return null;
};

const requestSpeech = async (model, text, voice) => {
  const apiKey = getApiKey();
  const payload = {
    model,
    input: text.slice(0, 400),
    response_format: 'mp3',
  };
  if (voice) {
    payload.voice = voice;
  }

  const response = await fetch('https://openrouter.ai/api/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://sognsafe.canner.app',
      'X-Title': 'SOGN SAFE training prototype',
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    return null;
  }
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return null;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 80) {
    return null;
  }
  return { buffer, contentType: contentType || 'audio/mpeg', model };
};

export const synthesizeSpeech = async (text, language) => {
  if (!getApiKey() || !text) {
    return null;
  }

  const models = getTtsModels();
  const voices = language === 'no' ? [undefined, 'nova'] : [undefined, 'alloy'];

  for (const model of models) {
    for (const voice of voices) {
      try {
        const audio = await requestSpeech(model, text, voice);
        if (audio) {
          return audio;
        }
      } catch {
        // Try the next voice or TTS model.
      }
    }
  }
  return null;
};
