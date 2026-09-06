import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors } from '../constants/theme';
import {
  AppChrome,
  CalmLocalMapCard,
  CivicAtmosphere,
  CivicButton,
  CivicListRow,
  GlassSurface,
  LanguageSheet,
  ScreenEnter,
  ScreenScroll,
  StatusHero,
  TimestampMeta,
} from '../components/ui';
import { HomeAssistantCard } from '../components/chat/HomeAssistantCard';
import { ReadinessModal } from '../components/modals/ReadinessModal';
import { SafePlacesModal } from '../components/modals/SafePlacesModal';
import { OfflineInfoModal } from '../components/modals/OfflineInfoModal';
import {
  AlertTriangleSolidIcon,
  BookOpenIcon,
  CheckCircleSolidIcon,
  CircularIconContainer,
  ClipboardCheckIcon,
  DownloadCheckIcon,
  GlobeGridIcon,
  ShelterGroupIcon,
  ShieldCheckBadge,
  ShieldCheckIcon,
} from '../components/ui/CivicIcons';

export default function ReadyScreen() {
  const router = useRouter();
  const {
    hasActiveIncident,
    incident,
    isDegradedConnection,
    triggerFlamScenario,
    clearScenario,
    language,
    setLanguage,
    t,
    safeZones,
    lastSyncTimestamp,
    civicOffset,
    locationPermissionGranted,
    notificationPermissionGranted,
  } = useEmergency();

  const [isReadinessOpen, setIsReadinessOpen] = useState(false);
  const [isSafePlacesOpen, setIsSafePlacesOpen] = useState(false);
  const [isOfflineInfoOpen, setIsOfflineInfoOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const handleStartFlam = async () => {
    await triggerFlamScenario();
    router.replace('/alert');
  };

  const permissionsMissing = !locationPermissionGranted || !notificationPermissionGranted;

  return (
    <SafeAreaView style={styles.safeArea}>
      <CivicAtmosphere>
      <ScreenEnter>
        <ScreenScroll contentContainerStyle={styles.container}>
          <AppChrome title={t.brandTitle} subtitle={t.civilianApp} district={t.districtName} />

          {isDegradedConnection ? (
            <GlassSurface tone="warning" glow="warning" style={styles.banner}>
              <Text style={styles.warningText}>{t.limitedConnectionSub}</Text>
            </GlassSurface>
          ) : null}

          {hasActiveIncident ? (
            <View style={styles.banner}>
              <CivicButton
                title={t.activeEmergencyTitle}
                subtitle={t.activeEmergencySub}
                variant="primary-emergency"
                icon={<AlertTriangleSolidIcon size={22} color={Colors.textOnColor} />}
                showChevron
                onPress={() => router.push('/alert')}
              />
            </View>
          ) : null}

          {permissionsMissing ? (
            <View style={styles.banner}>
              <CivicButton
                title={t.permissionsNeededTitle}
                subtitle={t.permissionsNeededSub}
                variant="outline-neutral"
                showChevron
                onPress={() => router.push('/permissions')}
              />
            </View>
          ) : null}

          <StatusHero
            variant={hasActiveIncident ? 'alert' : 'safe'}
            title={hasActiveIncident ? t.alertTitle : t.safeTitle}
            subtitle={hasActiveIncident ? (incident?.title || t.alertDefaultIncident) : t.safeSubtitle}
            icon={
              hasActiveIncident ? (
                <AlertTriangleSolidIcon size={32} color={Colors.textOnColor} />
              ) : (
                <ShieldCheckBadge size={54} badgeColor={Colors.safetyGreen} checkColor={Colors.textOnColor} />
              )
            }
          />

          <HomeAssistantCard />

          <View style={styles.mapWrap}>
            <CalmLocalMapCard
              safeZones={safeZones}
              userLocationName={t.districtName}
              statusText={t.normalMaritimeStatus}
              youOffsetX={civicOffset.x}
              youOffsetY={civicOffset.y}
              onPressExplore={() => setIsSafePlacesOpen(true)}
            />
          </View>

          <GlassSurface tone="neutral" glow="none" style={styles.list}>
            <CivicListRow
              icon={
                <CircularIconContainer size={42} bgColor={Colors.safetyGreenBg}>
                  <ClipboardCheckIcon size={22} color={Colors.safetyGreen} />
                </CircularIconContainer>
              }
              label={t.readinessTitle}
              onPress={() => setIsReadinessOpen(true)}
            />
            <CivicListRow
              icon={
                <CircularIconContainer size={42} bgColor={Colors.safetyGreenBg}>
                  <ShelterGroupIcon size={22} color={Colors.safetyGreen} />
                </CircularIconContainer>
              }
              label={t.safePlacesTitle}
              onPress={() => setIsSafePlacesOpen(true)}
            />
            <CivicListRow
              icon={
                <CircularIconContainer size={42} bgColor={Colors.safetyGreenBg}>
                  <BookOpenIcon size={22} color={Colors.safetyGreen} />
                </CircularIconContainer>
              }
              label={t.offlineInfoTitle}
              onPress={() => setIsOfflineInfoOpen(true)}
            />
            <CivicListRow
              icon={
                <CircularIconContainer size={42} bgColor={Colors.safetyGreenBg}>
                  <ShieldCheckIcon size={22} color={Colors.safetyGreen} />
                </CircularIconContainer>
              }
              label={language === 'no' ? 'Assistent' : 'Assistant'}
              href="/chat"
              onPress={() => router.push('/chat')}
              accessibilityLabel={language === 'no' ? 'Assistent' : 'Assistant'}
            />
            <CivicListRow
              icon={
                <CircularIconContainer size={42} bgColor={Colors.safetyGreenBg}>
                  <ShieldCheckIcon size={22} color={Colors.safetyGreen} />
                </CircularIconContainer>
              }
              label={t.howItWorksTitle}
              onPress={() => router.push('/welcome')}
              accessibilityLabel={t.howItWorksTitle}
            />
            <CivicListRow
              icon={
                <CircularIconContainer size={42} bgColor={Colors.safetyGreenBg}>
                  <GlobeGridIcon size={22} color={Colors.safetyGreen} />
                </CircularIconContainer>
              }
              label={t.languageLabel}
              value={language === 'no' ? t.languageNorwegian : t.languageEnglish}
              onPress={() => setIsLanguageOpen(true)}
              last
            />
          </GlassSurface>

          <GlassSurface tone="mint" glow="safe" style={styles.cache}>
            <View style={styles.cacheInner}>
              <View style={styles.cacheLeft}>
                <CircularIconContainer size={42} bgColor={Colors.safetyGreenBg}>
                  <DownloadCheckIcon size={22} color={Colors.safetyGreen} />
                </CircularIconContainer>
                <View style={styles.cacheText}>
                  <Text style={styles.cacheTitle}>{t.cacheDownloaded}</Text>
                  <TimestampMeta
                    isoTimestamp={lastSyncTimestamp}
                    language={language}
                    prefix={t.updatedRelativePrefix}
                    style={styles.cacheMeta}
                  />
                </View>
              </View>
              <CheckCircleSolidIcon size={24} color={Colors.safetyGreen} />
            </View>
          </GlassSurface>

          <GlassSurface tone="neutral" style={styles.training}>
            <View style={styles.trainingInner}>
              <Text style={styles.trainingLabel}>{t.trainingControls}</Text>
              {hasActiveIncident ? (
                <CivicButton
                  title={language === 'no' ? 'AVSLUTT SIMULERING / ALT KLART' : 'END SIMULATION / ALL CLEAR'}
                  variant="outline-emergency"
                  onPress={clearScenario}
                />
              ) : (
                <CivicButton
                  title={t.simulateFlam}
                  variant="primary-emergency"
                  onPress={handleStartFlam}
                />
              )}
              <Text style={styles.disclaimer}>{t.trainingDisclaimer}</Text>
            </View>
          </GlassSurface>
        </ScreenScroll>
      </ScreenEnter>
      </CivicAtmosphere>

      <ReadinessModal visible={isReadinessOpen} onClose={() => setIsReadinessOpen(false)} />
      <SafePlacesModal visible={isSafePlacesOpen} onClose={() => setIsSafePlacesOpen(false)} />
      <OfflineInfoModal visible={isOfflineInfoOpen} onClose={() => setIsOfflineInfoOpen(false)} />
      <LanguageSheet
        visible={isLanguageOpen}
        onClose={() => setIsLanguageOpen(false)}
        language={language}
        onSelect={setLanguage}
        title={t.chooseLanguage}
        closeLabel={t.closeBtn}
        englishLabel={t.languageEnglish}
        norwegianLabel={t.languageNorwegian}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: Colors.canvas,
  },
  container: {
    paddingBottom: 88,
  },
  banner: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  warningText: {
    color: Colors.warningAmberDark,
    fontWeight: '600',
    fontSize: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  mapWrap: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.hairlineRing,
  },
  list: {
    marginTop: 14,
    marginHorizontal: 16,
  },
  cache: {
    marginHorizontal: 16,
    marginTop: 14,
  },
  cacheInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cacheLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  cacheText: {
    flex: 1,
  },
  cacheTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cacheMeta: {
    textAlign: 'left',
    marginTop: 2,
  },
  training: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  trainingInner: {
    padding: 14,
    gap: 10,
  },
  trainingLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.textMuted,
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 15,
  },
});
