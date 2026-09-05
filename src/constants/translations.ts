export type Language = 'en' | 'no';

export interface TranslationStrings {
  // Brand & Header
  brandTitle: string;
  brandSubtitle: string;
  trainingMode: string;
  trainingDisclaimer: string;

  // Status
  allClear: string;
  safeTitle: string;
  safeSubtitle: string;
  monitoredZoneLabel: string;
  monitoredZoneValue: string;
  lastUpdatedLabel: string;
  cacheStatusLabel: string;

  // Map Card
  localMapTitle: string;
  localMapSubtitle: string;
  currentLocationLabel: string;
  normalMaritimeStatus: string;

  // Utilities / Services
  readinessTitle: string;
  readinessSubtitle: string;
  safePlacesTitle: string;
  safePlacesSubtitle: string;
  offlineInfoTitle: string;
  offlineInfoSubtitle: string;
  languageLabel: string;

  // Connection
  limitedConnectionTitle: string;
  limitedConnectionSub: string;

  // Simulator Controls
  simTitle: string;
  simDesc: string;
  startScenarioBtn: string;
  simOfflineBtn: string;
  simRestoreBtn: string;
  viewActiveAlertBtn: string;

  // Modals
  closeBtn: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    brandTitle: 'SOGN SAFE',
    brandSubtitle: 'CIVILIAN EMERGENCY SYSTEM • INNER SOGN',
    trainingMode: 'TRAINING / PROTOTYPE DEMONSTRATOR',
    trainingDisclaimer: 'Fictional student concept (HVL INN524). Not connected to real 112/HRS services.',
    allClear: 'ALL CLEAR',
    safeTitle: 'SAFE',
    safeSubtitle: 'No active emergency in your area.',
    monitoredZoneLabel: 'MONITORED REGION',
    monitoredZoneValue: 'Flåm, Aurland & Nærøyfjord',
    lastUpdatedLabel: 'Last sync: Today 20:45 CET',
    cacheStatusLabel: 'Offline cache: Up to date (stored on device)',
    localMapTitle: 'LOCAL SITUATION OVERVIEW',
    localMapSubtitle: 'Harbor and fjord perimeter normal. No evacuation active.',
    currentLocationLabel: 'Your position: Flåm Kai / Sentrum',
    normalMaritimeStatus: 'Normal conditions • Waterfront clear',
    readinessTitle: 'Emergency Readiness',
    readinessSubtitle: 'Home safety checklist and 72-hour preparedness',
    safePlacesTitle: 'Safe Places in Flåm & Aurland',
    safePlacesSubtitle: '3 verified assembly shelters and high-ground points',
    offlineInfoTitle: 'Offline Safety Information',
    offlineInfoSubtitle: 'Cached guidelines and emergency contacts (works offline)',
    languageLabel: 'Norsk / English',
    limitedConnectionTitle: 'LIMITED CONNECTION',
    limitedConnectionSub: 'Operating from local cache. Cached safe routes remain active.',
    simTitle: 'PLATFORM SIMULATOR (DEMO CONTROLS)',
    simDesc: 'Trigger classroom emergency events to test civilian iPhone navigation and push alerts.',
    startScenarioBtn: 'START FLÅM VESSEL SCENARIO',
    simOfflineBtn: 'SIMULATE OFFLINE',
    simRestoreBtn: 'RESTORE FULL SIGNAL',
    viewActiveAlertBtn: 'VIEW ACTIVE ALERT',
    closeBtn: 'Close',
  },
  no: {
    brandTitle: 'SOGN SAFE',
    brandSubtitle: 'SIVILT BEREDSKAPSSYSTEM • INDRE SOGN',
    trainingMode: 'ØVINGS- OG PROTOTYPEDEMONSTRASJON',
    trainingDisclaimer: 'Fiktivt studentkonsept (HVL INN524). Ikke koblet til nødetater eller HRS.',
    allClear: 'ALT NORMALISERES',
    safeTitle: 'TRYGG',
    safeSubtitle: 'Ingen pågående nødssituasjon i ditt område.',
    monitoredZoneLabel: 'OVERVÅKET REGION',
    monitoredZoneValue: 'Flåm, Aurland & Nærøyfjorden',
    lastUpdatedLabel: 'Siste oppdatering: I dag 20:45 CET',
    cacheStatusLabel: 'Frakoblet buffer: Oppdatert (lagret lokalt)',
    localMapTitle: 'LOKAL OVERSIKT OVER OMRÅDET',
    localMapSubtitle: 'Havne- og fjordsone normal. Ingen evakuering påkrevd.',
    currentLocationLabel: 'Din posisjon: Flåm kai / sentrum',
    normalMaritimeStatus: 'Normale forhold • Havneområdet åpent',
    readinessTitle: 'Egenberedskap',
    readinessSubtitle: 'Sjekkliste for hjemmeberedskap og 72 timers trygghet',
    safePlacesTitle: 'Trygge samlingssteder i Flåm & Aurland',
    safePlacesSubtitle: '3 verifiserte tilfluktsrom og høydepunkter',
    offlineInfoTitle: 'Frakoblet sikkerhetsinformasjon',
    offlineInfoSubtitle: 'Lokalt lagrede råd og nødnummer (fungerer uten dekning)',
    languageLabel: 'English / Norsk',
    limitedConnectionTitle: 'BEGRENSET FORBINDELSE',
    limitedConnectionSub: 'Bruker lokalt lagret data. Sikre ruter er fortsatt tilgjengelige.',
    simTitle: 'PLATTFORMSIMULATOR (TESTKONTROLLER)',
    simDesc: 'Utløs simulerte hendelser for å teste iPhone-varsling og evakueringsveiledning.',
    startScenarioBtn: 'START FLÅM-HENDELSESSIMULERING',
    simOfflineBtn: 'SIMULER UTEN DEKNING',
    simRestoreBtn: 'GJENOPPRETT SIGNAL',
    viewActiveAlertBtn: 'SE PÅGÅENDE VARSEL',
    closeBtn: 'Lukk',
  },
};
