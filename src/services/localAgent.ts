import { AgentResponse, EmergencyAgentContext } from '../types/chat';

const MAX_MESSAGE_CHARS = 140;

export type ChatIntent =
  | 'HELP_STATUS'
  | 'HELP'
  | 'HELP_WALK'
  | 'SAFE'
  | 'UNKNOWN_SHIP'
  | 'DANGER'
  | 'DISTANCE'
  | 'DIRECTION'
  | 'DESTINATION'
  | 'REPEAT'
  | 'UPDATE'
  | 'GENERAL';

const clip = (text: string): string => {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= MAX_MESSAGE_CHARS) {
    return clean;
  }
  return `${clean.slice(0, MAX_MESSAGE_CHARS - 1).trim()}…`;
};

export const classifyIntent = (message: string): ChatIntent => {
  const t = message.toLowerCase().trim();
  if (/help request received|was my help|fikk .*hjelp|er hjelpen/.test(t)) return 'HELP_STATUS';
  if (/broke my leg|injured|hurt|skadet|brukket/.test(t)) return 'HELP';
  if (/can'?t walk|cannot walk|kan ikke gå/.test(t)) return 'HELP_WALK';
  if (/need help|i need help|trenger hjelp/.test(t)) return 'HELP';
  if (/made it|i am safe|i'm safe|jeg er trygg|kom fram/.test(t)) return 'SAFE';
  if (/ship crashed|has the ship|har skipet|har båten/.test(t)) return 'UNKNOWN_SHIP';
  if (/(harbor|harbour|waterfront|kai|havn)/.test(t)) return 'DANGER';
  if (/how far|hvor langt|distance|meters/.test(t)) return 'DISTANCE';
  if (/which way|how do i get|neste|veien|get there/.test(t)) return 'DIRECTION';
  if (/where should i go|hvor skal|where do i go/.test(t)) return 'DESTINATION';
  if (/repeat|instruction|gjenta/.test(t)) return 'REPEAT';
  if (/what changed|latest update|siste oppdater|what was the latest/.test(t)) return 'UPDATE';
  if (/danger|in danger|i fare|am i in/.test(t)) return 'DANGER';
  return 'GENERAL';
};

export const answerQuestion = (message: string, context: EmergencyAgentContext): AgentResponse => {
  const language = context.selectedLanguage === 'no' ? 'no' : 'en';
  const intent = classifyIntent(message);
  const cached = context.connectionStatus === 'DEGRADED';

  if (!context.hasActiveIncident) {
    if (intent === 'UNKNOWN_SHIP') {
      return {
        type: 'answer',
        action: null,
        speak: true,
        cached,
        message:
          language === 'no'
            ? 'Jeg har ingen verifisert oppdatering som bekrefter det.'
            : 'I do not have a verified update confirming that.',
      };
    }
    return {
      type: 'answer',
      action: null,
      speak: true,
      cached,
      message: language === 'no' ? 'Ingen aktiv hendelse er verifisert nå.' : 'No active emergency is verified right now.',
    };
  }

  const zone = context.nearestSafeZone || 'the confirmed safe area';
  const suffix = context.lastVerifiedUpdate
    ? language === 'no'
      ? ` Sist verifisert ${context.lastVerifiedUpdate}.`
      : ` Last verified ${context.lastVerifiedUpdate}.`
    : '';
  const prefix = cached ? (language === 'no' ? 'Buffer: ' : 'Cached: ') : '';

  if (intent === 'DESTINATION') {
    return {
      type: 'answer',
      action: 'SHOW_SAFE_ZONE',
      speak: true,
      cached,
      message: clip(
        language === 'no'
          ? `${prefix}Gå til ${zone}. Det er bekreftet trygt samlingssted.${suffix}`
          : `${prefix}Go to ${zone}. It is the currently confirmed safe area.${suffix}`
      ),
    };
  }

  if (intent === 'DIRECTION' || intent === 'REPEAT') {
    const primary =
      context.currentRoute ||
      (language === 'no' ? 'Følg merket evakueringsvei.' : 'Follow the marked evacuation route.');
    const next = context.nextNavigationInstruction;
    return {
      type: 'answer',
      action: intent === 'DIRECTION' ? 'OPEN_SAFE_ROUTE' : 'REPEAT_DIRECTION',
      speak: true,
      cached,
      message: clip(`${prefix}${primary}${next ? ` ${next}` : ''}${suffix}`),
    };
  }

  if (intent === 'DISTANCE') {
    if (context.safeZoneDistance == null) {
      return {
        type: 'answer',
        action: 'SHOW_SAFE_ZONE',
        speak: true,
        cached,
        message:
          language === 'no'
            ? 'Avstand til trygt sted er ikke verifisert.'
            : 'Distance to the safe area is not verified.',
      };
    }
    return {
      type: 'answer',
      action: 'SHOW_SAFE_ZONE',
      speak: true,
      cached,
      message: clip(
        language === 'no'
          ? `${prefix}${zone} er ${context.safeZoneDistance} m unna, ca. ${context.walkingTime ?? '?'} min gange.${suffix}`
          : `${prefix}${zone} is ${context.safeZoneDistance} m away, about ${context.walkingTime ?? '?'} min walk.${suffix}`
      ),
    };
  }

  if (intent === 'DANGER') {
    const blocked = context.blockedAreas.join(', ');
    return {
      type: 'answer',
      action: 'SHOW_LAST_UPDATE',
      speak: true,
      cached,
      message: clip(
        language === 'no'
          ? `${prefix}Ikke gå tilbake til kaien.${blocked ? ` Stengt: ${blocked}.` : ''}${suffix}`
          : `${prefix}Do not return to the waterfront.${blocked ? ` Closed: ${blocked}.` : ''}${suffix}`
      ),
    };
  }

  if (intent === 'HELP' || intent === 'HELP_WALK') {
    return {
      type: 'offer_help',
      action: 'OPEN_HELP_FLOW',
      speak: true,
      cached,
      message:
        language === 'no'
          ? 'Du kan trenge bistand. Jeg kan åpne hjelpeforespørselen. Du må bekrefte selv.'
          : 'You may need assistance. I can open the help request screen. You must confirm it.',
    };
  }

  if (intent === 'SAFE') {
    return {
      type: 'offer_safe',
      action: null,
      speak: true,
      cached,
      message:
        language === 'no'
          ? 'Jeg kan åpne JEG ER TRYGG. Du må bekrefte ankomst selv.'
          : 'I can open I AM SAFE. You must confirm arrival yourself.',
    };
  }

  if (intent === 'HELP_STATUS') {
    if (!context.helpRequestStatus) {
      return {
        type: 'answer',
        action: null,
        speak: true,
        cached,
        message:
          language === 'no' ? 'Ingen hjelpeforespørsel er registrert ennå.' : 'No help request is registered yet.',
      };
    }
    return {
      type: 'answer',
      action: null,
      speak: true,
      cached,
      message: clip(
        language === 'no'
          ? `Hjelpeforespørselen har status ${context.helpRequestStatus}. Dette er ikke et ekte 112-kall.`
          : `Your help request status is ${context.helpRequestStatus}. This is not a real 112 call.`
      ),
    };
  }

  if (intent === 'UNKNOWN_SHIP') {
    return {
      type: 'answer',
      action: null,
      speak: true,
      cached,
      message:
        language === 'no'
          ? 'Jeg har ingen verifisert oppdatering som bekrefter det.'
          : 'I do not have a verified update confirming that.',
    };
  }

  if (intent === 'UPDATE') {
    return {
      type: 'answer',
      action: 'SHOW_LAST_UPDATE',
      speak: true,
      cached,
      message: clip(
        language === 'no'
          ? `${prefix}${context.incidentTitle || 'Aktiv hendelse'}.${suffix}`
          : `${prefix}${context.incidentTitle || 'Active incident'}.${suffix}`
      ),
    };
  }

  return {
    type: 'answer',
    action: null,
    speak: true,
    cached,
    message: clip(
      language === 'no'
        ? `${prefix}Bruk bekreftet veiledning på skjermen. Jeg kan gjenta destinasjon eller rute.${suffix}`
        : `${prefix}Use the confirmed guidance on screen. I can repeat the destination or route.${suffix}`
    ),
  };
};
