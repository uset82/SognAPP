import { AgentResponse, ChatSource, ConversationTurn, EmergencyAgentContext } from '../types/chat';
import { requestAgentChat } from './agentClient';
import { answerQuestion } from './localAgent';

const sanitize = (message: string): string => message.replace(/\s+/g, ' ').trim().slice(0, 500);

export interface PipelineInput {
  message: string;
  context: EmergencyAgentContext;
  conversation: ConversationTurn[];
  source: ChatSource;
}

export const runAgentPipeline = async ({
  message,
  context,
  conversation,
}: PipelineInput): Promise<{ response: AgentResponse; offline: boolean }> => {
  const clean = sanitize(message);
  if (!clean) {
    return {
      offline: false,
      response: {
        type: 'error',
        message:
          context.selectedLanguage === 'no'
            ? 'Jeg forsto ikke det. Skriv spørsmålet, eller vis gjeldende instruksjon.'
            : 'I could not understand that. Type the question, or view the current instruction.',
        action: null,
        speak: true,
      },
    };
  }

  const remote = context.connectionStatus === 'DEGRADED' ? null : await requestAgentChat(clean, context, conversation);
  if (remote) {
    return { response: remote, offline: false };
  }

  const local = answerQuestion(clean, context);
  return {
    response: {
      ...local,
      type: remote === null && context.connectionStatus === 'DEGRADED' ? local.type : local.type,
      cached: true,
    },
    offline: true,
  };
};
