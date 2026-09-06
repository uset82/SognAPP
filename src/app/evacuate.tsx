import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors } from '../constants/theme';
import { stopEmergencyAlert } from '../services/alertSound';
import {
  AlertTriangleSolidIcon,
  AppChrome,
  CivicAtmosphere,
  CivicButton,
  CivicRouteMapCard,
  CircularIconContainer,
  GlassSurface,
  MedicalCrossIcon,
  ScreenEnter,
  ScreenScroll,
  ShelterGroupIcon,
  TimestampMeta,
  UpArrowNavIcon,
} from '../components/ui';
import { AskDock } from '../components/chat/AskDock';

export default function EvacuateScreen() {
  const router = useRouter();
  const {
    incident,
    language,
    t,
    reportIAmSafe,
    civicOffset,
    enrichedZones,
    selectedZoneId,
    lastSyncTimestamp,
  } = useEmergency();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const route = incident?.defaultRoute;
  const destination =
    enrichedZones.find((zone) => zone.id === selectedZoneId) ||
    route?.destinationSafeZone ||
    enrichedZones[0];

  const steps = useMemo(() => {
    const remaining = route?.remainingDistanceMeters ?? 520;
    const minutes = route?.estimatedWalkingMinutes ?? 6;
    const rerouted = route?.routeStatus === 'HAZARD_REROUTED';
    return [
      {
        title: language === 'no' ? t.continueNorth : (route?.primaryInstruction || t.continueNorth),
        subtitle: language === 'no' ? t.turnLeftIn : (route?.secondaryInstruction || t.turnLeftIn),
        remaining,
        minutes,
      },
      {
        title: language === 'no' ? 'SVING VENSTRE INN TIL SKULEN' : 'TURN LEFT INTO FLÅM SCHOOL',
        subtitle: language === 'no' ? 'Hovedinngang til samlingssted' : 'Main entrance to assembly shelter',
        remaining: Math.max(120, Math.round(remaining * 0.27)),
        minutes: Math.max(2, Math.round(minutes * 0.33)),
      },
      ...(rerouted
        ? [
            {
              title: language === 'no' ? 'NY TRYGG VEI NORD' : 'NEW SAFE PATH NORTH',
              subtitle: t.reroutedBanner,
              remaining: Math.max(180, Math.round(remaining * 0.4)),
              minutes: Math.max(3, Math.round(minutes * 0.5)),
            },
          ]
        : []),
    ];
  }, [language, route, t]);

  const activeStep = steps[Math.min(currentStepIndex, steps.length - 1)];
  const isRerouted = route?.routeStatus === 'HAZARD_REROUTED';

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      return;
    }
    reportIAmSafe();
    router.push('/safe');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CivicAtmosphere>
      <ScreenEnter>
        <ScreenScroll contentContainerStyle={styles.container}>
          <AppChrome
            title={t.brandTitle}
            compact
            district={t.districtName}
            onBack={() => {
              void stopEmergencyAlert();
              router.replace('/');
            }}
            backLabel={t.backToHome}
          />

          <CivicButton
            title={activeStep.title}
            subtitle={activeStep.subtitle}
            variant="primary-safety"
            icon={<UpArrowNavIcon size={38} color={Colors.textOnColor} />}
            onPress={handleNextStep}
            style={styles.nav}
          />

          {isRerouted ? (
            <GlassSurface tone="warning" glow="warning" style={styles.reroute}>
              <Text style={styles.rerouteText}>{t.reroutedBanner}</Text>
            </GlassSurface>
          ) : null}

          <GlassSurface tone="neutral" style={styles.destination}>
            <View style={styles.destInner}>
              <CircularIconContainer size={42} bgColor={Colors.safetyGreen}>
                <ShelterGroupIcon size={22} color={Colors.textOnColor} />
              </CircularIconContainer>
              <View style={styles.destText}>
                <Text style={styles.destName}>{destination?.name || 'Flåm School'}</Text>
                <Text style={styles.destSub}>{t.nearestSafeArea}</Text>
              </View>
              <View>
                <Text style={styles.remainLabel}>{t.remainingLabel}</Text>
                <Text style={styles.remainValue}>
                  {activeStep.remaining} {t.metersAbbrev} · {activeStep.minutes} min
                </Text>
              </View>
              <View style={styles.openPill}>
                <Text style={styles.openText}>{t.safeAreaOpen}</Text>
              </View>
            </View>
          </GlassSurface>

          <View style={styles.map}>
            <CivicRouteMapCard
              mode="turn-by-turn"
              destinationName={destination?.name || 'Flåm School'}
              userStep={currentStepIndex + 1}
              youOffsetX={civicOffset.x}
              youOffsetY={civicOffset.y}
              youLabel={t.youLabel}
            />
          </View>

          <GlassSurface tone="warning" glow="warning" style={styles.warn}>
            <View style={styles.warnInner}>
              <AlertTriangleSolidIcon size={28} color={Colors.warningAmber} />
              <View style={styles.warnText}>
                <Text style={styles.warnTitle}>{t.doNotReturn}</Text>
                <Text style={styles.warnSub}>{t.followSafeRoute}</Text>
              </View>
            </View>
          </GlassSurface>

          <View style={styles.actions}>
            <CivicButton
              title={t.needHelp}
              variant="primary-emergency"
              icon={<MedicalCrossIcon size={22} color={Colors.textOnColor} />}
              showChevron
              onPress={() => {
                void stopEmergencyAlert();
                router.push('/help');
              }}
            />
            <CivicButton
              title={currentStepIndex < steps.length - 1 ? t.nextNavStep : t.confirmArrival}
              variant="outline-neutral"
              onPress={handleNextStep}
            />
          </View>

          <AskDock onOpenChat={() => { void stopEmergencyAlert(); }} />

          <TimestampMeta
            isoTimestamp={lastSyncTimestamp}
            language={language}
            prefix={t.lastVerified}
            mode="official"
            style={styles.footer}
          />
        </ScreenScroll>
      </ScreenEnter>
      </CivicAtmosphere>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  container: {
    paddingBottom: 40,
  },
  nav: {
    marginHorizontal: 16,
  },
  reroute: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  rerouteText: {
    color: Colors.warningAmberDark,
    fontWeight: '700',
    fontSize: 13,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  destination: {
    marginHorizontal: 16,
    marginTop: 10,
  },
  destInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  destText: {
    flex: 1,
  },
  destName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  destSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  remainLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  remainValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  openPill: {
    backgroundColor: Colors.safetyGreenBg,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  openText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.safetyGreen,
    letterSpacing: 0.3,
  },
  map: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  warn: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  warnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  warnText: {
    flex: 1,
  },
  warnTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.warningAmberDark,
  },
  warnSub: {
    fontSize: 12,
    color: Colors.warningAmberText,
    marginTop: 2,
  },
  actions: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 10,
  },
  footer: {
    marginTop: 16,
  },
});
