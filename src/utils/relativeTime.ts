export const formatRelativeUpdated = (
  isoTimestamp: string,
  language: 'en' | 'no',
  prefix: string
): string => {
  const parsed = Date.parse(isoTimestamp);
  if (Number.isNaN(parsed)) {
    return `${prefix} · ${isoTimestamp}`;
  }

  const elapsedMs = Math.max(0, Date.now() - parsed);
  const minutes = Math.floor(elapsedMs / 60000);

  if (minutes < 1) {
    return language === 'no' ? `${prefix} nå nettopp` : `${prefix} just now`;
  }
  if (minutes === 1) {
    return language === 'no' ? `${prefix} for 1 minutt siden` : `${prefix} 1 minute ago`;
  }
  if (minutes < 60) {
    return language === 'no'
      ? `${prefix} for ${minutes} minutter siden`
      : `${prefix} ${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours === 1) {
    return language === 'no' ? `${prefix} for 1 time siden` : `${prefix} 1 hour ago`;
  }
  return language === 'no'
    ? `${prefix} for ${hours} timer siden`
    : `${prefix} ${hours} hours ago`;
};

export const formatClock = (isoTimestamp: string): string => {
  const parsed = Date.parse(isoTimestamp);
  if (Number.isNaN(parsed)) {
    return isoTimestamp;
  }
  return new Date(parsed).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
