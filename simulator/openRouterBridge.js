let agentModulePromise = null;

const loadAgentModule = () => {
  if (!agentModulePromise) {
    agentModulePromise = import('./openrouterAgent.mjs').catch((error) => {
      agentModulePromise = null;
      throw error;
    });
  }
  return agentModulePromise;
};

const parseModelJson = (content) => {
  if (typeof content !== 'string') {
    return null;
  }
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const toPlainAnswer = (text) => {
  const parsed = parseModelJson(text);
  if (parsed && typeof parsed === 'object') {
    return parsed;
  }
  return {
    type: 'answer',
    message: String(text || '').trim(),
    action: null,
    speak: true,
  };
};

const askAgentWithSdk = async ({ message, context, conversation }) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return null;
  }
  const agent = await loadAgentModule();
  const result = await agent.askOpenRouterAgent({ message, context, conversation });
  if (!result?.text) {
    return null;
  }
  return {
    ...toPlainAnswer(result.text),
    model: result.model,
  };
};

const speakWithSdk = async (text, language) => {
  if (!process.env.OPENROUTER_API_KEY) {
    return null;
  }
  const agent = await loadAgentModule();
  return agent.synthesizeSpeech(text, language);
};

const describeModels = async () => {
  try {
    const agent = await loadAgentModule();
    return {
      chat: agent.getChatModels(),
      tts: agent.getTtsModels(),
    };
  } catch {
    return {
      chat: ['minimax/minimax-m3:free', 'thinkingmachines/inkling:free', 'openrouter/free'],
      tts: ['deepgram/flux-tts:free', 'fish-audio/s2.1-pro-free:free'],
    };
  }
};

module.exports = {
  askAgentWithSdk,
  speakWithSdk,
  describeModels,
};
