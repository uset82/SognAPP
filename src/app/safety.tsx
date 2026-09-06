import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors } from '../constants/theme';
import {
  AppChrome,
  CheckCircleSolidIcon,
  CivicAtmosphere,
  CivicButton,
  CivicRouteMapCard,
  ClockIcon,
  MetricPill,
  ScreenEnter,
  ShieldCheckBadge,
  ShieldCheckIcon,
  StatusHero,
  TimestampMeta,
  WalkingPersonIcon,
  ArrowsSwapIcon,
} from '../components/ui';

export default function FindSafetyScreen() {
  const router = useRouter();
  const { incident, enrichedZones, language, t, civicOffset, selectedZoneId, setSelectedZoneId, lastSyncTimestamp } =
    useEmergency();

  const selectedIndex = Math.max(
    0,
    enrichedZones.findIndex((zone) => zone.id === selectedZoneId)
  );
  const activeZone = enrichedZones[selectedIndex] || incident?.primarySafeZone || enrichedZones[0];
  const isConfirmed = activeZone?.status === 'OPEN_AND_CONFIRMED';

  const handleNextSafeZone = () => {
    const next = (selectedIndex + 1) % (enrichedZones.length || 1);
    setSelectedZoneId(enrichedZones[next].id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CivicAtmosphere>
      <ScreenEnter>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <AppChrome title={t.brandTitle} subtitle={t.civilianApp} district={t.districtName} />

          <StatusHero
            variant="safe"
            eyebrow={t.nearestSafeArea}
            title={activeZone?.name || 'Flåm School'}
            icon={<ShieldCheckBadge size={48} badgeColor={Colors.safetyGreen} checkColor={Colors.textOnColor} />}
            footer={
              <View style={styles.pills}>
                <MetricPill
                  icon={<WalkingPersonIcon size={16} color={Colors.textPrimary} />}
                  label={`${activeZone?.distanceMeters || 650} ${t.metersAbbrev}`}
                />
                <MetricPill
                  icon={<ClockIcon size={16} color={Colors.textPrimary} />}
                  label={`${activeZone?.walkMinutes || 8} ${t.minWalk}`}
                />
                <MetricPill
                  tone="safe"
                  icon={<CheckCircleSolidIcon size={16} color={Colors.safetyGreen} />}
                  label={isConfirmed ? t.openAndConfirmed : t.standbyStatus}
                />
              </View>
            }
          />

          <View style={styles.map}>
            <CivicRouteMapCard
              mode="overview"
              destinationName={activeZone?.name || 'Flåm School'}
              youOffsetX={civicOffset.x}
              youOffsetY={civicOffset.y}
              youLabel={t.youLabel}
            />
          </View>

          <View style={styles.actions}>
            <CivicButton
              title={t.startSafeRoute}
              variant="primary-safety"
              icon={<ShieldCheckIcon size={24} color={Colors.textOnColor} strokeWidth={2.5} />}
              onPress={() => router.push('/evacuate')}
            />
            <CivicButton
              title={t.showAnotherSafeArea}
              variant="outline-neutral"
              icon={<ArrowsSwapIcon size={18} color={Colors.textPrimary} />}
              onPress={handleNextSafeZone}
            />
          </View>

          <TimestampMeta
            isoTimestamp={lastSyncTimestamp}
            language={language}
            prefix={t.lastVerified}
            mode="official"
            style={styles.footer}
          />
        </ScrollView>
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
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  map: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    overflow: 'hidden',
  },
  actions: {
    marginTop: 16,
    marginHorizontal: 16,
    gap: 10,
  },
  footer: {
    marginTop: 18,
  },
});
