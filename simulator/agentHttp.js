const { transcribeWithWhisper } = require('./whisper');
const { askAgentWithSdk, speakWithSdk } = require('./openRouterBridge');
const { answerQuestion, validateAgentResponse } = require('./localAgent');

const chatHits = new Map();

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });

const requestIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'local';
};

const tooManyChatRequests = (ip) => {
  const now = Date.now();
  const recent = (chatHits.get(ip) || []).filter((stamp) => now - stamp < 60000);
  recent.push(now);
  chatHits.set(ip, recent);
  return recent.length > 30;
};

const logAssistant = (message) => {
  console.log(`[Agent: ASSISTANT] ${message}`);
};

const tryHandleAgentApi = async (req, res, pathname) => {
  const isAgentPath =
    pathname === '/api/agent/chat' ||
    pathname === '/api/agent/health' ||
    pathname === '/api/audio/speech' ||
    pathname === '/api/audio/transcribe';

  if (!isAgentPath) {
    return false;
  }

  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && pathname === '/api/agent/health') {
    res.writeHead(200);
    res.end(
      JSON.stringify({
        openrouter: Boolean(process.env.OPENROUTER_API_KEY),
        whisper: Boolean(process.env.WHISPER_API_KEY || process.env.OPENAI_API_KEY),
      })
    );
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/agent/chat') {
    if (tooManyChatRequests(requestIp(req))) {
      res.writeHead(429);
      res.end(JSON.stringify({ type: 'error', message: 'Too many assistant requests.', action: null, speak: false }));
      return true;
    }

    const body = await parseBody(req);
    const message = typeof body.message === 'string' ? body.message.slice(0, 500) : '';
    if (!message) {
      res.writeHead(400);
      res.end(JSON.stringify({ type: 'error', message: 'Missing message.', action: null, speak: false }));
      return true;
    }

    const rawSize = JSON.stringify(body).length;
    if (rawSize > 20000) {
      res.writeHead(413);
      res.end(JSON.stringify({ type: 'error', message: 'Request too large.', action: null, speak: false }));
      return true;
    }

    const context = body.context || {};
    const fallback = validateAgentResponse(answerQuestion(message, context));
    if (!process.env.OPENROUTER_API_KEY) {
      logAssistant('Local verified-context answer (no OpenRouter key).');
      res.writeHead(200);
      res.end(JSON.stringify(fallback));
      return true;
    }

    try {
      const modelResult = await askAgentWithSdk({
        message,
        context,
        conversation: body.conversation || [],
      });
      const validated = validateAgentResponse(modelResult) || fallback;
      logAssistant('OpenRouter Agent SDK answer validated against allowed actions.');
      res.writeHead(200);
      res.end(JSON.stringify(validated));
    } catch {
      logAssistant('OpenRouter unavailable. Local fallback used. No secret logged.');
      res.writeHead(200);
      res.end(JSON.stringify({ ...fallback, cached: true }));
    }
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/audio/speech') {
    const body = await parseBody(req);
    const text = typeof body.text === 'string' ? body.text.slice(0, 400) : '';
    if (!text) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Missing text.' }));
      return true;
    }
    if (!process.env.OPENROUTER_API_KEY) {
      res.writeHead(503);
      res.end(JSON.stringify({ error: 'Speech unavailable.' }));
      return true;
    }

    try {
      const audio = await speakWithSdk(text, body.language === 'no' ? 'no' : 'en');
      if (!audio) {
        res.writeHead(502);
        res.end(JSON.stringify({ error: 'Speech provider unavailable.' }));
        return true;
      }
      logAssistant('OpenRouter free TTS synthesized. No secret logged.');
      res.writeHead(200);
      res.end(
        JSON.stringify({
          audioBase64: audio.buffer.toString('base64'),
          mimeType: audio.contentType || 'audio/mpeg',
          model: audio.model,
        })
      );
    } catch {
      logAssistant('OpenRouter TTS unavailable. No secret logged.');
      res.writeHead(504);
      res.end(JSON.stringify({ error: 'Speech timeout or provider error.' }));
    }
    return true;
  }

  if (req.method === 'POST' && pathname === '/api/audio/transcribe') {
    const body = await parseBody(req);
    if (!body.audioBase64 || String(body.audioBase64).length > 2_000_000) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'Invalid audio payload.' }));
      return true;
    }

    const whisperKey = process.env.WHISPER_API_KEY || process.env.OPENAI_API_KEY;
    if (!whisperKey) {
      logAssistant('Whisper unavailable. No audio retained.');
      res.writeHead(503);
      res.end(JSON.stringify({ error: 'Transcription unavailable.' }));
      return true;
    }

    try {
      const result = await transcribeWithWhisper(
        body.audioBase64,
        body.mimeType || 'audio/m4a',
        body.language === 'no' ? 'no' : 'en',
        whisperKey
      );
      logAssistant('Audio transcribed. Recording discarded after processing.');
      res.writeHead(200);
      res.end(JSON.stringify({ transcript: result.text || '' }));
    } catch {
      logAssistant('Whisper transcription failed. Recording discarded.');
      res.writeHead(504);
      res.end(JSON.stringify({ error: 'Transcription timeout or provider error.' }));
    }
    return true;
  }

  return false;
};

module.exports = { tryHandleAgentApi };
