import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useEmergency } from '../../context/EmergencyContext';
import { TimestampMeta } from '../ui/TimestampMeta';
import { AppModal } from '../ui/AppModal';

interface OfflineInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const OfflineInfoModal: React.FC<OfflineInfoModalProps> = ({ visible, onClose }) => {
  const { language, t, offlineCacheStatus, lastSyncTimestamp } = useEmergency();
  const isNorwegian = language === 'no';

  return (
    <AppModal visible={visible} onClose={onClose}>
      <View style={styles.modalRoot}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.handleBar} />
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.modalCategory}>
                {isNorwegian ? 'FRAKOBLET SIKKERHET' : 'OFFLINE SAFETY GUIDE'}
              </Text>
              <Text style={styles.modalTitle}>
                {isNorwegian ? 'Beredskap uten dekning' : 'Operating Without Cellular'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close offline info modal"
            >
              <Text style={styles.closeBtnText}>{t.closeBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Cache Status Badge */}
          <View style={styles.cacheCard}>
            <View style={styles.cacheRow}>
              <View style={styles.cacheDot} />
              <Text style={styles.cacheTitle}>
                {isNorwegian ? 'LOKAL SIKKERHETSBUFFER AKTIV' : 'LOCAL SAFETY CACHE ACTIVE'}
              </Text>
            </View>
            <Text style={styles.cacheDesc}>
              {isNorwegian 
                ? 'All veiledning, kartskisser og nødprosedyrer er lagret lokalt på din iPhone og krever ikke internettforbindelse.'
                : 'All instructions, schematic maps, and emergency directives are cached on this iPhone and accessible without cellular data.'}
            </Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{offlineCacheStatus}</Text>
              <TimestampMeta
                isoTimestamp={lastSyncTimestamp}
                language={language}
                prefix={t.lastVerified}
                mode="official"
              />
            </View>
            <Text style={styles.cachedNote}>
              {isNorwegian
                ? 'Dette er bufret veiledning og kan være utdatert.'
                : 'This is cached guidance and may be outdated.'}
            </Text>
          </View>

          {/* Core Action Directives */}
          <Text style={styles.sectionHeading}>
            {isNorwegian ? 'AKUTTE TILTAK VED SKIPSHENDELSE I FLÅM' : 'ACTION DIRECTIVES: FLÅM HARBOR INCIDENTS'}
          </Text>

          <View style={styles.guideCard}>
            <View style={styles.guideNumberBadge}>
              <Text style={styles.guideNumber}>1</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>
                {isNorwegian ? 'Forlat kaiområdet til fots' : 'Move Away from Pier on Foot'}
              </Text>
              <Text style={styles.guideText}>
                {isNorwegian
                  ? 'Beveg deg umiddelbart vekk fra kaien og opp i terrenget (mot Flåm skule eller Fretheimsberget). Biler kan skape trafikkork som blokkerer redningsbiler.'
                  : 'Immediately move away from the waterfront pier and head uphill towards Flåm School or Fretheim Heights. Do not use personal vehicles.'}
              </Text>
            </View>
          </View>

          <View style={styles.guideCard}>
            <View style={styles.guideNumberBadge}>
              <Text style={styles.guideNumber}>2</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>
                {isNorwegian ? 'Hold deg motvinds ved røyk eller gass' : 'Stay Upwind of Smoke & Vapors'}
              </Text>
              <Text style={styles.guideText}>
                {isNorwegian
                  ? 'Ved drivstofflekkasje eller brann om bord på et passasjerskip, legg merke til vindretningen i fjorden og trekk oppover dalen bort fra røyken.'
                  : 'In case of fuel leakage or smoke aboard a vessel, observe fjord wind currents and evacuate up-valley away from smoke plumes.'}
              </Text>
            </View>
          </View>

          <View style={styles.guideCard}>
            <View style={styles.guideNumberBadge}>
              <Text style={styles.guideNumber}>3</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>
                {isNorwegian ? 'Spar på telefonens batteri' : 'Conserve Phone Battery'}
              </Text>
              <Text style={styles.guideText}>
                {isNorwegian
                  ? 'Ved overbelastning i mobilnettet, unngå videosamtaler og sosiale medier. Bruk SMS for korte meldinger til pårørende: "Jeg er trygg i Flåm".'
                  : 'During network congestion, avoid video streaming or social media. Use SMS for short check-ins: "I am safe in Flåm".'}
              </Text>
            </View>
          </View>

          <View style={styles.guideCard}>
            <View style={styles.guideNumberBadge}>
              <Text style={styles.guideNumber}>4</Text>
            </View>
            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>
                {isNorwegian ? 'Nødradio: NRK P1 (96,0 MHz)' : 'Emergency Radio: NRK P1 (96.0 MHz)'}
              </Text>
              <Text style={styles.guideText}>
                {isNorwegian
                  ? 'Ved bortfall av telekommunikasjon vil Aurland kommune og Sivilforsvaret kringkaste viktige meldinger over NRK P1.'
                  : 'If telecommunications fail, Aurland municipality and Civil Protection broadcast updates via NRK P1 (FM 96.0 MHz / DAB+).'}
              </Text>
            </View>
          </View>

          {/* Real Life vs Prototype Advisory */}
          <View style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>
              {isNorwegian ? 'AKADEMISK PROTOTYPE (HVL INN524)' : 'ACADEMIC DEMONSTRATION PROTOTYPE'}
            </Text>
            <Text style={styles.disclaimerText}>
              {isNorwegian
                ? 'Dette er et forsknings- og innovasjonsprosjekt utviklet ved Høgskulen på Vestlandet. Appen sender ikke faktiske data til Hovedredningssentralen (HRS) eller nødetatene. Ved virkelige nødstilfeller ring 112 (Politi) eller 113 (Ambulanse).'
                : 'This application is a student innovation concept developed at Western Norway University of Applied Sciences (HVL). It does not dispatch real alerts to HRS or emergency responders. Always call 112/113 in real life.'}
            </Text>
          </View>
        </ScrollView>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalCategory: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    fontSize: 10,
  },
  modalTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  closeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  cacheCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  cacheRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  cacheDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.safetyGreenText,
    marginRight: 8,
  },
  cacheTitle: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cacheDesc: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  cachedNote: {
    ...Typography.caption,
    color: Colors.warningAmberText,
    marginTop: 8,
  },
  sectionHeading: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    minHeight: 64,
  },
  guideNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  guideNumber: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  guideText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  disclaimerCard: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  disclaimerTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  disclaimerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 17,
    fontSize: 11,
  },
});
