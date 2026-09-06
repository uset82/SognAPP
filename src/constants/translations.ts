import { HelpCondition } from '../types/incident';

export type Language = 'en' | 'no';

export interface TranslationStrings {
  brandTitle: string;
  brandSubtitle: string;
  civilianApp: string;
  districtName: string;
  trainingMode: string;
  trainingDisclaimer: string;
  fictionalPrototype: string;

  allClear: string;
  safeTitle: string;
  safeSubtitle: string;
  monitoredZoneLabel: string;
  monitoredZoneValue: string;
  lastUpdatedLabel: string;
  cacheStatusLabel: string;
  cacheDownloaded: string;
  updatedRelativePrefix: string;

  localMapTitle: string;
  localMapSubtitle: string;
  currentLocationLabel: string;
  normalMaritimeStatus: string;
  youLabel: string;

  readinessTitle: string;
  readinessSubtitle: string;
  safePlacesTitle: string;
  safePlacesSubtitle: string;
  offlineInfoTitle: string;
  offlineInfoSubtitle: string;
  languageLabel: string;
  languageEnglish: string;
  languageNorwegian: string;
  chooseLanguage: string;

  limitedConnectionTitle: string;
  limitedConnectionSub: string;

  simTitle: string;
  simDesc: string;
  startScenarioBtn: string;
  simOfflineBtn: string;
  simRestoreBtn: string;
  viewActiveAlertBtn: string;
  trainingControls: string;
  simulateFlam: string;

  closeBtn: string;
  cancelBtn: string;
  continueBtn: string;
  backToHome: string;
  howItWorksTitle: string;
  welcomeTagline: string;
  welcomeJob: string;
  welcomeQuestionsTitle: string;
  welcomeQ1: string;
  welcomeQ2: string;
  welcomeQ3: string;
  welcomeQ4: string;
  welcomeJourneyTitle: string;
  welcomeJourney: string;
  welcomeHelpNote: string;
  soundOff: string;

  activeEmergencyTitle: string;
  activeEmergencySub: string;
  permissionsNeededTitle: string;
  permissionsNeededSub: string;

  alertTitle: string;
  alertDefaultIncident: string;
  vibrateOn: string;
  soundOn: string;
  insideAffected: string;
  leaveHarbor: string;
  riskWindow: string;
  riskWindowSub: string;
  goToSafety: string;
  needHelp: string;
  officialUpdate: string;
  coordinatingAgency: string;

  nearestSafeArea: string;
  openAndConfirmed: string;
  standbyStatus: string;
  startSafeRoute: string;
  showAnotherSafeArea: string;
  lastVerified: string;
  metersAbbrev: string;
  minWalk: string;

  continueNorth: string;
  turnLeftIn: string;
  remainingLabel: string;
  safeAreaOpen: string;
  doNotReturn: string;
  followSafeRoute: string;
  nextNavStep: string;
  confirmArrival: string;
  reroutedBanner: string;

  helpTitle: string;
  selectCondition: string;
  selectConditionSub: string;
  dataToTransmit: string;
  selectedCondition: string;
  approxLocation: string;
  timestampAndDevice: string;
  sendHelpSignal: string;
  transmitting: string;
  confirmLocationTitle: string;
  confirmLocationSub: string;
  sendMyLocation: string;
  locationAccuracy: string;
  helpReceived: string;
  helpAcknowledged: string;
  helpReceivedBody: string;
  helpAcknowledgedBody: string;
  reportedCondition: string;
  locationTransmitted: string;
  transmissionTime: string;
  deviceId: string;
  staySheltered: string;
  returnToGuidance: string;

  conditionInjured: string;
  conditionInjuredSub: string;
  conditionTrapped: string;
  conditionTrappedSub: string;
  conditionCannotWalk: string;
  conditionCannotWalkSub: string;
  conditionWithOthers: string;
  conditionWithOthersSub: string;
  conditionOther: string;
  conditionOtherSub: string;

  safeRecorded: string;
  safeRecordedBody: string;
  registeredShelter: string;
  confirmed: string;
  remainUntilCleared: string;
  returnDashboard: string;

  permissionsHeading: string;
  permissionsLead: string;
  notifTitle: string;
  notifBody: string;
  locationTitle: string;
  locationBody: string;
  statusGranted: string;
  statusDenied: string;
  statusPending: string;
  enablePermissions: string;
  continueWithout: string;
  continueToApp: string;
  openIosSettings: string;
  sendTestPush: string;
  testDispatched: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    brandTitle: 'SOGN SAFE',
    brandSubtitle: 'CIVILIAN EMERGENCY SYSTEM • INNER SOGN',
    civilianApp: 'Civilian Emergency App',
    districtName: 'Inner Sogn',
    trainingMode: 'TRAINING / PROTOTYPE DEMONSTRATOR',
    trainingDisclaimer: 'Fictional student concept (HVL INN524). Not connected to real 112/HRS services.',
    fictionalPrototype: 'Fictional prototype',
    allClear: 'ALL CLEAR',
    safeTitle: 'SAFE',
    safeSubtitle: 'No active emergency in your area.',
    monitoredZoneLabel: 'MONITORED REGION',
    monitoredZoneValue: 'Flåm, Aurland & Nærøyfjord',
    lastUpdatedLabel: 'Last sync',
    cacheStatusLabel: 'Offline cache: Up to date (stored on device)',
    cacheDownloaded: 'Emergency information downloaded',
    updatedRelativePrefix: 'Updated',
    localMapTitle: 'LOCAL SITUATION OVERVIEW',
    localMapSubtitle: 'Harbor and fjord perimeter normal. No evacuation active.',
    currentLocationLabel: 'Your position: Flåm Kai / Sentrum',
    normalMaritimeStatus: 'Normal conditions • Waterfront clear',
    youLabel: 'YOU',
    readinessTitle: 'Emergency readiness',
    readinessSubtitle: 'Home safety checklist and 72-hour preparedness',
    safePlacesTitle: 'Safe places',
    safePlacesSubtitle: '3 verified assembly shelters and high-ground points',
    offlineInfoTitle: 'Offline information',
    offlineInfoSubtitle: 'Cached guidelines and emergency contacts (works offline)',
    languageLabel: 'Language',
    languageEnglish: 'English',
    languageNorwegian: 'Norsk',
    chooseLanguage: 'Choose language',
    limitedConnectionTitle: 'LIMITED CONNECTION',
    limitedConnectionSub: 'Limited cellular network • Operating on local cache',
    simTitle: 'TRAINING CONTROLS',
    simDesc: 'Classroom-only simulator actions. Not a public alert.',
    startScenarioBtn: 'START FLÅM VESSEL SCENARIO',
    simOfflineBtn: 'SIMULATE OFFLINE',
    simRestoreBtn: 'RESTORE FULL SIGNAL',
    viewActiveAlertBtn: 'VIEW ACTIVE ALERT',
    trainingControls: 'TRAINING CONTROLS',
    simulateFlam: 'SIMULATE FLÅM EMERGENCY ALERT',
    closeBtn: 'Close',
    cancelBtn: 'Cancel',
    continueBtn: 'Continue',
    backToHome: 'Back to home',
    howItWorksTitle: 'How the app works',
    welcomeTagline: 'Guidance when seconds matter',
    welcomeJob: 'SOGN SAFE turns a complex incident into four civilian answers.',
    welcomeQuestionsTitle: 'Four civilian questions',
    welcomeQ1: 'Am I in danger?',
    welcomeQ2: 'Where should I go?',
    welcomeQ3: 'How do I get there?',
    welcomeQ4: 'What do I do if I cannot evacuate?',
    welcomeJourneyTitle: 'The journey',
    welcomeJourney: 'READY → ALERT → FIND SAFETY → EVACUATE → SAFE',
    welcomeHelpNote: 'If you cannot move, I NEED HELP sends your condition and location to the training dispatcher. It is never a real 112 call.',
    soundOff: 'SOUND OFF · tap to enable',
    activeEmergencyTitle: 'ACTIVE EMERGENCY ALERT',
    activeEmergencySub: 'Tap to open emergency route',
    permissionsNeededTitle: 'Permissions needed',
    permissionsNeededSub: 'Enable alerts and local guidance',
    alertTitle: 'EMERGENCY ALERT',
    alertDefaultIncident: 'Possible vessel collision near Flåm harbor',
    vibrateOn: 'VIBRATE ON',
    soundOn: 'SOUND ON',
    insideAffected: 'YOU ARE INSIDE\nTHE AFFECTED AREA',
    leaveHarbor: 'Leave the harbor area now.',
    riskWindow: '~15 MINUTES',
    riskWindowSub: 'Estimated time until possible impact',
    goToSafety: 'GO TO SAFETY',
    needHelp: 'I NEED HELP',
    officialUpdate: 'Official update',
    coordinatingAgency: 'Inner Sogn Emergency Coordination',
    nearestSafeArea: 'NEAREST SAFE AREA',
    openAndConfirmed: 'OPEN AND CONFIRMED',
    standbyStatus: 'STANDBY',
    startSafeRoute: 'START SAFE ROUTE',
    showAnotherSafeArea: 'Show another safe area',
    lastVerified: 'Last verified update',
    metersAbbrev: 'm',
    minWalk: 'min walk',
    continueNorth: 'CONTINUE NORTH',
    turnLeftIn: 'Turn left in 120 m',
    remainingLabel: 'Remaining',
    safeAreaOpen: 'SAFE AREA OPEN',
    doNotReturn: 'DO NOT RETURN TOWARD THE WATERFRONT',
    followSafeRoute: 'Follow the safe route.',
    nextNavStep: 'Next navigation step',
    confirmArrival: 'CONFIRM ARRIVAL AT SAFE AREA',
    reroutedBanner: 'Route updated. Follow the new safe path.',
    helpTitle: 'RESCUE SIGNAL',
    selectCondition: 'SELECT YOUR CONDITION',
    selectConditionSub: 'Emergency services prioritize resources based on the condition selected below.',
    dataToTransmit: 'DATA TO BE TRANSMITTED:',
    selectedCondition: 'Selected condition:',
    approxLocation: 'Approximate location:',
    timestampAndDevice: 'Verified timestamp and device identifier',
    sendHelpSignal: 'SEND HELP SIGNAL',
    transmitting: 'TRANSMITTING SIGNAL...',
    confirmLocationTitle: 'SEND HELP SIGNAL',
    confirmLocationSub: 'Your approximate position is sent only after you confirm. Coordinates stay off the device until then.',
    sendMyLocation: 'SEND MY LOCATION',
    locationAccuracy: 'Approximate accuracy',
    helpReceived: 'HELP REQUEST RECEIVED',
    helpAcknowledged: 'HELP REQUEST ACKNOWLEDGED',
    helpReceivedBody: 'Your signal has reached the simulator dispatcher. Awaiting responder confirmation.',
    helpAcknowledgedBody: 'Your signal has been registered by emergency dispatchers in Inner Sogn. Rescue teams have your approximate coordinates.',
    reportedCondition: 'REPORTED CONDITION:',
    locationTransmitted: 'LOCATION TRANSMITTED:',
    transmissionTime: 'TRANSMISSION TIME:',
    deviceId: 'DEVICE ID:',
    staySheltered: 'Stay in a sheltered location away from hazards. If your condition worsens, call 113 directly.',
    returnToGuidance: 'RETURN TO GUIDANCE',
    conditionInjured: 'I AM INJURED',
    conditionInjuredSub: 'Need immediate medical first aid',
    conditionTrapped: 'I AM TRAPPED',
    conditionTrappedSub: 'Cannot exit building, vehicle, or vessel',
    conditionCannotWalk: 'I CANNOT WALK',
    conditionCannotWalkSub: 'Mobility impaired or physical obstruction',
    conditionWithOthers: 'WITH OTHERS NEEDING HELP',
    conditionWithOthersSub: 'Children, elderly, or severely injured persons present',
    conditionOther: 'OTHER URGENT ASSISTANCE',
    conditionOtherSub: 'Emergency hazard preventing evacuation',
    safeRecorded: 'SAFE STATUS RECORDED',
    safeRecordedBody: 'Your status has been transmitted to authorities. You are registered as accounted for in the safe assembly area.',
    registeredShelter: 'REGISTERED ASSEMBLY SHELTER',
    confirmed: 'CONFIRMED',
    remainUntilCleared: 'Please remain in the safe assembly area until emergency personnel confirm the harbor zone is cleared.',
    returnDashboard: 'RETURN TO DASHBOARD',
    permissionsHeading: 'PERMISSIONS FOR CIVILIAN SAFETY',
    permissionsLead: 'SOGN SAFE needs two permissions to warn you during a harbor or fjord incident in Inner Sogn.',
    notifTitle: 'Emergency warnings',
    notifBody: 'Shows an alert banner and plays a warning sound when a simulated harbor hazard affects Flåm.',
    locationTitle: 'Local safety guidance',
    locationBody: 'Calculates walking distance to the nearest verified shelter. Coordinates are sent only when you confirm I NEED HELP.',
    statusGranted: 'GRANTED',
    statusDenied: 'DENIED',
    statusPending: 'NOT CONFIGURED',
    enablePermissions: 'ENABLE EMERGENCY PERMISSIONS',
    continueWithout: 'CONTINUE WITHOUT PERMISSIONS',
    continueToApp: 'CONTINUE TO SOGN SAFE',
    openIosSettings: 'OPEN IOS SETTINGS',
    sendTestPush: 'SEND TEST PUSH ALERT TO THIS IPHONE',
    testDispatched: 'TEST ALERT DISPATCHED',
  },
  no: {
    brandTitle: 'SOGN SAFE',
    brandSubtitle: 'SIVILT BEREDSKAPSSYSTEM • INDRE SOGN',
    civilianApp: 'Sivil beredskapsapp',
    districtName: 'Indre Sogn',
    trainingMode: 'ØVINGS- OG PROTOTYPEDEMONSTRASJON',
    trainingDisclaimer: 'Fiktivt studentkonsept (HVL INN524). Ikke koblet til nødetater eller HRS.',
    fictionalPrototype: 'Fiktiv prototype',
    allClear: 'ALT NORMALISERES',
    safeTitle: 'TRYGG',
    safeSubtitle: 'Ingen aktiv nødssituasjon i ditt område.',
    monitoredZoneLabel: 'OVERVÅKET REGION',
    monitoredZoneValue: 'Flåm, Aurland & Nærøyfjorden',
    lastUpdatedLabel: 'Siste synk',
    cacheStatusLabel: 'Frakoblet buffer: Oppdatert (lagret lokalt)',
    cacheDownloaded: 'Nødinformasjon lastet ned',
    updatedRelativePrefix: 'Oppdatert',
    localMapTitle: 'LOKAL OVERSIKT OVER OMRÅDET',
    localMapSubtitle: 'Havne- og fjordsone normal. Ingen evakuering påkrevd.',
    currentLocationLabel: 'Din posisjon: Flåm kai / sentrum',
    normalMaritimeStatus: 'Normale forhold • Havneområdet åpent',
    youLabel: 'DEG',
    readinessTitle: 'Egenberedskap',
    readinessSubtitle: 'Sjekkliste for hjemmeberedskap og 72 timers trygghet',
    safePlacesTitle: 'Trygge steder',
    safePlacesSubtitle: '3 verifiserte tilfluktsrom og høydepunkter',
    offlineInfoTitle: 'Frakoblet informasjon',
    offlineInfoSubtitle: 'Lokalt lagrede råd og nødnummer (fungerer uten dekning)',
    languageLabel: 'Språk',
    languageEnglish: 'English',
    languageNorwegian: 'Norsk',
    chooseLanguage: 'Velg språk',
    limitedConnectionTitle: 'BEGRENSET FORBINDELSE',
    limitedConnectionSub: 'Begrenset mobilnett • Viser lokal buffer',
    simTitle: 'ØVINGSKONTROLLER',
    simDesc: 'Kun for klasserom. Dette er ikke et offentlig varsel.',
    startScenarioBtn: 'START FLÅM-HENDELSESSIMULERING',
    simOfflineBtn: 'SIMULER UTEN DEKNING',
    simRestoreBtn: 'GJENOPPRETT SIGNAL',
    viewActiveAlertBtn: 'SE PÅGÅENDE VARSEL',
    trainingControls: 'ØVINGSKONTROLLER',
    simulateFlam: 'SIMULER FLÅM NØDVARSLING',
    closeBtn: 'Lukk',
    cancelBtn: 'Avbryt',
    continueBtn: 'Fortsett',
    backToHome: 'Tilbake til start',
    howItWorksTitle: 'Slik fungerer appen',
    welcomeTagline: 'Veiledning når sekundene teller',
    welcomeJob: 'SOGN SAFE gjør en kompleks hendelse om til fire sivile svar.',
    welcomeQuestionsTitle: 'Fire sivile spørsmål',
    welcomeQ1: 'Er jeg i fare?',
    welcomeQ2: 'Hvor skal jeg gå?',
    welcomeQ3: 'Hvordan kommer jeg dit?',
    welcomeQ4: 'Hva gjør jeg hvis jeg ikke kan evakuere?',
    welcomeJourneyTitle: 'Forløpet',
    welcomeJourney: 'KLAR → VARSEL → FINN TRYGGHET → EVAKUER → TRYGG',
    welcomeHelpNote: 'Hvis du ikke kan evakuere, sender JEG TRENGER HJELP tilstand og posisjon til øvingsoperatøren. Det er aldri et ekte 112-anrop.',
    soundOff: 'LYD AV · trykk for å slå på',
    activeEmergencyTitle: 'AKTIV NØDVARSLING',
    activeEmergencySub: 'Trykk for å se evakueringsrute',
    permissionsNeededTitle: 'Tillatelser mangler',
    permissionsNeededSub: 'Aktiver varsler og lokal veiledning',
    alertTitle: 'NØDVARSLING',
    alertDefaultIncident: 'Mulig skipskollisjon ved Flåm kai',
    vibrateOn: 'VIBRASJON PÅ',
    soundOn: 'LYD PÅ',
    insideAffected: 'DU ER INNENFOR\nDET BERØRTE OMRÅDET',
    leaveHarbor: 'Forlat havneområdet nå.',
    riskWindow: '~15 MINUTTER',
    riskWindowSub: 'Beregnet tid til mulig konsekvens',
    goToSafety: 'GÅ TIL TRYGGHET',
    needHelp: 'JEG TRENGER HJELP',
    officialUpdate: 'Offisiell oppdatering',
    coordinatingAgency: 'Indre Sogn Beredskapsledelse',
    nearestSafeArea: 'NÆRMESTE TRYGGESTED',
    openAndConfirmed: 'ÅPEN OG BEKREFTET',
    standbyStatus: 'BEREDSKAP',
    startSafeRoute: 'START TRYGG RUTE',
    showAnotherSafeArea: 'Vis et annet trygt område',
    lastVerified: 'Sist verifisert oppdatering',
    metersAbbrev: 'm',
    minWalk: 'min gange',
    continueNorth: 'FORTSETT NORD',
    turnLeftIn: 'Sving til venstre om 120 m',
    remainingLabel: 'Gjenstående',
    safeAreaOpen: 'TRYGG SONE ÅPEN',
    doNotReturn: 'IKKE GÅ TILBAKE MOT KAIEN',
    followSafeRoute: 'Følg den angitte trygge ruten.',
    nextNavStep: 'Neste navigasjonssteg',
    confirmArrival: 'BEKREFT ANKOMMET TRYGGESTED',
    reroutedBanner: 'Rute oppdatert. Følg den nye trygge veien.',
    helpTitle: 'NØDSIGNAL',
    selectCondition: 'VELG DIN SITUASJON',
    selectConditionSub: 'Beredskapsmannskaper prioriterer innsats basert på tilstanden du velger under.',
    dataToTransmit: 'DATA SOM BLIR TRANSMITTERT:',
    selectedCondition: 'Valgt tilstand:',
    approxLocation: 'Omtrentlig posisjon:',
    timestampAndDevice: 'Verifisert tidsstempel og enhets-ID',
    sendHelpSignal: 'SEND NØDSIGNAL',
    transmitting: 'SENDER SIGNAL...',
    confirmLocationTitle: 'SEND NØDSIGNAL',
    confirmLocationSub: 'Omtrentlig posisjon sendes først når du bekrefter. Koordinatene blir på enheten inntil da.',
    sendMyLocation: 'SEND MIN POSISJON',
    locationAccuracy: 'Omtrentlig nøyaktighet',
    helpReceived: 'NØDSIGNAL MOTTATT',
    helpAcknowledged: 'NØDSIGNAL BEKREFTET MOTTATT',
    helpReceivedBody: 'Ditt signal er formidlet til simulatorsentralen. Venter på bekreftelse fra operatør.',
    helpAcknowledgedBody: 'Ditt signal er registrert av beredskapsledelsen i Indre Sogn. Redningsmannskaper har dine koordinater.',
    reportedCondition: 'RAPPORTERT TILSTAND:',
    locationTransmitted: 'SENDT POSISJON:',
    transmissionTime: 'TIDSPUNKT:',
    deviceId: 'ENHETS-ID:',
    staySheltered: 'Bli på et trygt sted skjermet for røyk og bølger. Ved akutt forverring, ring 113 direkte.',
    returnToGuidance: 'TILBAKE TIL VEILEDNING',
    conditionInjured: 'JEG ER SKADET',
    conditionInjuredSub: 'Trenger akutt medisinsk førstehjelp',
    conditionTrapped: 'JEG ER INNESPERRET',
    conditionTrappedSub: 'Kan ikke forlate bygg, kjøretøy eller kai',
    conditionCannotWalk: 'JEG KAN IKKE GÅ',
    conditionCannotWalkSub: 'Nedsatt bevegelighet eller fysisk hindring',
    conditionWithOthers: 'MED ANDRE SOM TRENGER HJELP',
    conditionWithOthersSub: 'Barn, eldre eller alvorlig skadde til stede',
    conditionOther: 'ANNEN AKUTT BISTAND',
    conditionOtherSub: 'Akutt fare som hindrer trygg evakuering',
    safeRecorded: 'STATUS: REGISTRERT TRYGG',
    safeRecordedBody: 'Din status er formidlet til beredskapsledelsen. Du er registrert som gjort rede for i trygt samlingsområde.',
    registeredShelter: 'REGISTRERT SAMLINGSSTED',
    confirmed: 'BEKREFTET',
    remainUntilCleared: 'Vennligst bli værende i samlingsområdet inntil nødetatene eller kommunen bekrefter at havneområdet er sikret.',
    returnDashboard: 'TILBAKE TIL HOVEDSKJERM',
    permissionsHeading: 'TILLATELSER FOR SIVIL TRYGGHET',
    permissionsLead: 'SOGN SAFE trenger to tillatelser for å varsle deg ved en kai- eller fjordhendelse i Indre Sogn.',
    notifTitle: 'Nødvarsler',
    notifBody: 'Viser et varselbanner og spiller advarsel når en simulert havnefare rammer Flåm.',
    locationTitle: 'Lokal sikkerhetsveiledning',
    locationBody: 'Beregner gangavstand til nærmeste verifiserte samlingssted. Koordinater sendes bare når du bekrefter JEG TRENGER HJELP.',
    statusGranted: 'GITT',
    statusDenied: 'AVSLÅTT',
    statusPending: 'IKKE SATT',
    enablePermissions: 'AKTIVER NØDTILLATELSER',
    continueWithout: 'FORTSETT UTEN TILLATELSER',
    continueToApp: 'FORTSETT TIL SOGN SAFE',
    openIosSettings: 'ÅPNE IOS-INNSTILLINGER',
    sendTestPush: 'SEND TESTVARSEL TIL DENNE IPHONEN',
    testDispatched: 'TESTVARSEL SENDT',
  },
};

export const conditionLabel = (
  condition: HelpCondition,
  t: TranslationStrings
): { title: string; subtitle: string } => {
  switch (condition) {
    case 'I_AM_INJURED':
      return { title: t.conditionInjured, subtitle: t.conditionInjuredSub };
    case 'I_AM_TRAPPED':
      return { title: t.conditionTrapped, subtitle: t.conditionTrappedSub };
    case 'I_CANNOT_WALK':
      return { title: t.conditionCannotWalk, subtitle: t.conditionCannotWalkSub };
    case 'I_AM_WITH_PEOPLE_WHO_NEED_HELP':
      return { title: t.conditionWithOthers, subtitle: t.conditionWithOthersSub };
    case 'OTHER_URGENT_HELP':
    default:
      return { title: t.conditionOther, subtitle: t.conditionOtherSub };
  }
};
