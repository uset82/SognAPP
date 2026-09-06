const MAX_MESSAGE_CHARS = 140;

function classifyIntent(message) {
  const t = String(message || '')
    .toLowerCase()
    .trim();

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
}

function clip(text) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= MAX_MESSAGE_CHARS) return clean;
  return `${clean.slice(0, MAX_MESSAGE_CHARS - 1).trim()}…`;
}

function langOf(context) {
  return context && context.selectedLanguage === 'no' ? 'no' : 'en';
}

function verifiedSuffix(context, language) {
  if (!context || !context.lastVerifiedUpdate) return '';
  return language === 'no'
    ? ` Sist verifisert ${context.lastVerifiedUpdate}.`
    : ` Last verified ${context.lastVerifiedUpdate}.`;
}

function cachedPrefix(context, language) {
  if (!context || context.connectionStatus !== 'DEGRADED') return '';
  return language === 'no' ? 'Buffer: ' : 'Cached: ';
}

function answerNoIncident(intent, language) {
  if (intent === 'UNKNOWN_SHIP') {
    return {
      type: 'answer',
      action: null,
      speak: true,
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
    message:
      language === 'no'
        ? 'Ingen aktiv hendelse er verifisert nå.'
        : 'No active emergency is verified right now.',
  };
}

function answerWithIncident(intent, context, language) {
  const zone = context.nearestSafeZone || 'the confirmed safe area';
  const suffix = verifiedSuffix(context, language);
  const prefix = cachedPrefix(context, language);

  if (intent === 'DESTINATION') {
    return {
      type: 'answer',
      action: 'SHOW_SAFE_ZONE',
      speak: true,
      message: clip(
        language === 'no'
          ? `${prefix}Gå til ${zone}. Det er bekreftet trygt samlingssted.${suffix}`
          : `${prefix}Go to ${zone}. It is the currently confirmed safe area.${suffix}`
      ),
    };
  }

  if (intent === 'DIRECTION' || intent === 'REPEAT') {
    const primary = context.currentRoute || (language === 'no' ? 'Følg merket evakueringsvei.' : 'Follow the marked evacuation route.');
    const next = context.nextNavigationInstruction;
    return {
      type: 'answer',
      action: intent === 'DIRECTION' ? 'OPEN_SAFE_ROUTE' : 'REPEAT_DIRECTION',
      speak: true,
      message: clip(`${prefix}${primary}${next ? ` ${next}` : ''}${suffix}`),
    };
  }

  if (intent === 'DISTANCE') {
    const meters = context.safeZoneDistance;
    const minutes = context.walkingTime;
    if (meters == null) {
      return {
        type: 'answer',
        action: 'SHOW_SAFE_ZONE',
        speak: true,
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
      message: clip(
        language === 'no'
          ? `${prefix}${zone} er ${meters} m unna, ca. ${minutes ?? '?'} min gange.${suffix}`
          : `${prefix}${zone} is ${meters} m away, about ${minutes ?? '?'} min walk.${suffix}`
      ),
    };
  }

  if (intent === 'DANGER') {
    const blocked = (context.blockedAreas || []).join(', ');
    return {
      type: 'answer',
      action: 'SHOW_LAST_UPDATE',
      speak: true,
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
      message:
        language === 'no'
          ? 'Jeg kan åpne JEG ER TRYGG. Du må bekrefte ankomst selv.'
          : 'I can open I AM SAFE. You must confirm arrival yourself.',
    };
  }

  if (intent === 'HELP_STATUS') {
    const status = context.helpRequestStatus;
    if (!status) {
      return {
        type: 'answer',
        action: null,
        speak: true,
        message:
          language === 'no'
            ? 'Ingen hjelpeforespørsel er registrert ennå.'
            : 'No help request is registered yet.',
      };
    }
    return {
      type: 'answer',
      action: null,
      speak: true,
      message: clip(
        language === 'no'
          ? `Hjelpeforespørselen har status ${status}. Dette er ikke et ekte 112-kall.`
          : `Your help request status is ${status}. This is not a real 112 call.`
      ),
    };
  }

  if (intent === 'UNKNOWN_SHIP') {
    return {
      type: 'answer',
      action: null,
      speak: true,
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
    message: clip(
      language === 'no'
        ? `${prefix}Bruk bekreftet veiledning på skjermen. Jeg kan gjenta destinasjon eller rute.${suffix}`
        : `${prefix}Use the confirmed guidance on screen. I can repeat the destination or route.${suffix}`
    ),
  };
}

function answerQuestion(message, context = {}) {
  const language = langOf(context);
  const intent = classifyIntent(message);

  if (!context.hasActiveIncident) {
    return { ...answerNoIncident(intent, language), cached: context.connectionStatus === 'DEGRADED' };
  }

  return { ...answerWithIncident(intent, context, language), cached: context.connectionStatus === 'DEGRADED' };
}

function validateAgentResponse(payload) {
  const allowed = [
    'NONE',
    'OPEN_SAFE_ROUTE',
    'OPEN_HELP_FLOW',
    'REPEAT_DIRECTION',
    'SHOW_SAFE_ZONE',
    'SHOW_LAST_UPDATE',
    'OPEN_CONNECTION_STATUS',
  ];
  const types = ['answer', 'offer_help', 'offer_safe', 'offline', 'error'];
  if (!payload || typeof payload !== 'object') return null;
  if (!types.includes(payload.type)) return null;
  if (typeof payload.message !== 'string' || payload.message.trim().length === 0) return null;
  if (payload.action != null && payload.action !== 'NONE' && !allowed.includes(payload.action)) {
    return { ...payload, action: null };
  }
  return {
    type: payload.type,
    message: clip(payload.message),
    action: payload.action === 'NONE' ? null : payload.action ?? null,
    speak: payload.speak !== false,
    cached: Boolean(payload.cached),
  };
}

module.exports = {
  classifyIntent,
  answerQuestion,
  validateAgentResponse,
  MAX_MESSAGE_CHARS,
};
