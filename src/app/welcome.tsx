import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEmergency } from '../context/EmergencyContext';
import { Colors, Typography } from '../constants/theme';
import { WELCOME_SEEN_KEY } from '../constants/storage';
import {
  AppChrome,
  CivicAtmosphere,
  CivicButton,
  CivicListRow,
  GlassSurface,
  LanguageSheet,
  ScreenEnter,
  ScreenScroll,
} from '../components/ui';
import { CircularIconContainer, GlobeGridIcon, ShieldCheckIcon } from '../components/ui/CivicIcons';
import { requestNotificationPermissions } from '../services/notificationService';

export default function WelcomeScreen() {
  const router = useRouter();
  const { language, setLanguage, t, refreshPermissions } = useEmergency();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(WELCOME_SEEN_KEY)
      .then((seen) => setHasSeenWelcome(Boolean(seen)))
      .catch(() => undefined);
  }, []);

  const handleContinue = async () => {
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, '1');
    if (Platform.OS !== 'web') {
      await requestNotificationPermissions();
      await refreshPermissions();
    }
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CivicAtmosphere>
        <ScreenEnter>
          <ScreenScroll contentContainerStyle={styles.container}>
            <AppChrome
              title={t.brandTitle}
              centered
              compact
              onBack={hasSeenWelcome ? () => router.replace('/') : undefined}
              backLabel={t.backToHome}
            />

            <View style={styles.hero}>
              <Text style={styles.tagline}>{t.welcomeTagline}</Text>
              <Text style={styles.job}>{t.welcomeJob}</Text>
            </View>

            <GlassSurface tone="mint" glow="safe" style={styles.card}>
              <View style={styles.cardInner}>
                <Text style={styles.cardTitle}>{t.welcomeWhatTitle}</Text>
                <Text style={styles.body}>{t.welcomeWhatBody}</Text>
              </View>
            </GlassSurface>

            <GlassSurface tone="neutral" style={styles.card}>
              <View style={styles.cardInner}>
                <Text style={styles.cardTitle}>{t.welcomeHowTitle}</Text>
                <Text style={styles.journey}>{t.welcomeJourney}</Text>
                <Text style={styles.body}>{t.welcomeHowBody}</Text>
              </View>
            </GlassSurface>

            <GlassSurface tone="neutral" style={styles.card}>
              <View style={styles.cardInner}>
                <Text style={styles.cardTitle}>{t.welcomeCanTitle}</Text>
                <Text style={styles.capability}>{t.welcomeCan1}</Text>
                <Text style={styles.capability}>{t.welcomeCan2}</Text>
                <Text style={styles.capability}>{t.welcomeCan3}</Text>
                <Text style={styles.capability}>{t.welcomeCan4}</Text>
              </View>
            </GlassSurface>

            <GlassSurface tone="mint" style={styles.card}>
              <View style={styles.cardInner}>
                <Text style={styles.cardTitle}>{t.welcomeQuestionsTitle}</Text>
                <Text style={styles.question}>{t.welcomeQ1}</Text>
                <Text style={styles.question}>{t.welcomeQ2}</Text>
                <Text style={styles.question}>{t.welcomeQ3}</Text>
                <Text style={styles.question}>{t.welcomeQ4}</Text>
              </View>
            </GlassSurface>

            <GlassSurface tone="neutral" style={styles.list}>
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

            <Text style={styles.disclaimer}>{t.trainingDisclaimer}</Text>

            <View style={styles.actions}>
              <CivicButton
                title={t.continueToApp}
                variant="primary-safety"
                icon={<ShieldCheckIcon size={22} color={Colors.textOnColor} strokeWidth={2.5} />}
                showChevron
                href="/"
                onPress={() => {
                  void handleContinue();
                }}
              />
            </View>
          </ScreenScroll>
        </ScreenEnter>
      </CivicAtmosphere>

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
    minHeight: Platform.OS === 'web' ? '100%' : 0,
    backgroundColor: Colors.canvas,
  },
  container: {
    paddingBottom: 88,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 18,
  },
  tagline: {
    ...Typography.title1,
    textAlign: 'center',
    color: Colors.textPrimary,
  },
  job: {
    ...Typography.headline,
    textAlign: 'center',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cardInner: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 8,
  },
  cardTitle: {
    ...Typography.subhead,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: Colors.textPrimary,
  },
  body: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  capability: {
    ...Typography.body,
    color: Colors.textPrimary,
    lineHeight: 22,
    fontWeight: '600',
  },
  question: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  journey: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  list: {
    marginHorizontal: 16,
    marginTop: 4,
  },
  disclaimer: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginHorizontal: 24,
    marginTop: 16,
    textAlign: 'center',
  },
  actions: {
    marginHorizontal: 16,
    marginTop: 20,
  },
});
