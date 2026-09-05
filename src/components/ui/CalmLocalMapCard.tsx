import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Defs, LinearGradient, RadialGradient, Stop, G } from 'react-native-svg';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { SafeZone } from '../../types/incident';
import { CompassIcon, ChevronRightIcon, RadarReticleIcon } from './CivicIcons';

interface CalmLocalMapCardProps {
  userLocationName?: string;
  safeZones: SafeZone[];
  onPressExplore?: () => void;
  statusText?: string;
}

export const CalmLocalMapCard: React.FC<CalmLocalMapCardProps> = ({
  userLocationName = 'Flåm Kai / Sentrum',
  safeZones,
  onPressExplore,
  statusText = 'Normal maritime conditions • Harbor perimeter open',
}) => {
  return (
    <View style={styles.cardContainer} accessible accessibilityRole="summary">
      {/* Cockpit HUD Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.headerTagRow}>
            <RadarReticleIcon size={14} color="#38BDF8" />
            <Text style={styles.headerTitle}>MARITIM RADAR & SITUASJONSKART</Text>
          </View>
          <Text style={styles.coordinatesText}>60°51'48"N  07°06'44"E • INDRE AURLANDSFJORD</Text>
        </View>
        <View style={styles.calmBadge}>
          <View style={styles.calmPulseDot} />
          <Text style={styles.calmBadgeText}>SEKTOR SIKRET</Text>
        </View>
      </View>

      {/* High-Tech Nautical Chart Surface */}
      <View style={styles.mapSurface}>
        <Svg width="100%" height="220" viewBox="0 0 360 220" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#081726" stopOpacity="1" />
              <Stop offset="60%" stopColor="#040D18" stopOpacity="1" />
              <Stop offset="100%" stopColor="#071420" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="shoreGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#111923" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0B0F15" stopOpacity="1" />
            </LinearGradient>
            <RadialGradient id="radarScanAura" cx="22%" cy="48%" r="45%">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.18" />
              <Stop offset="60%" stopColor="#38BDF8" stopOpacity="0.04" />
              <Stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Fjord Water Body */}
          <Path
            d="M 0 0 L 360 0 L 360 90 Q 250 102 180 94 T 0 88 Z"
            fill="url(#waterGradient)"
          />

          {/* Bathymetry Depth Iso-Contours */}
          <Path
            d="M 0 30 Q 130 38 250 34 T 360 36"
            stroke="rgba(56, 189, 248, 0.14)"
            strokeWidth="1"
            strokeDasharray="4,4"
            fill="none"
          />
          <Path
            d="M 0 55 Q 160 66 280 60 T 360 64"
            stroke="rgba(56, 189, 248, 0.18)"
            strokeWidth="1"
            fill="none"
          />

          {/* Glowing Shoreline Border */}
          <Path
            d="M 0 88 Q 180 94 250 102 T 360 90"
            stroke="#1D3855"
            strokeWidth="3"
            fill="none"
          />

          {/* Landmass Basin */}
          <Path
            d="M 0 90 L 360 92 L 360 220 L 0 220 Z"
            fill="url(#shoreGradient)"
          />

          {/* Mountain Elevation Contour Curves */}
          <Path
            d="M 0 130 Q 100 120 200 138 T 360 126"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M 0 170 Q 120 158 240 176 T 360 168"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
            strokeDasharray="6,4"
            fill="none"
          />

          {/* Concentric Radar Horizon Rings around Civilian Location */}
          <Circle cx="80" cy="105" r="90" fill="url(#radarScanAura)" />
          <Circle cx="80" cy="105" r="40" stroke="rgba(56, 189, 248, 0.2)" strokeWidth="1" fill="none" />
          <Circle cx="80" cy="105" r="75" stroke="rgba(56, 189, 248, 0.12)" strokeWidth="1" strokeDasharray="3,3" fill="none" />
          <Circle cx="80" cy="105" r="115" stroke="rgba(56, 189, 248, 0.06)" strokeWidth="1" fill="none" />

          {/* Nautical Range Crosshairs */}
          <Line x1="15" y1="105" x2="145" y2="105" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="2,2" />
          <Line x1="80" y1="40" x2="80" y2="170" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="1" strokeDasharray="2,2" />
        </Svg>

        {/* Fjord Water Identity Badge */}
        <View style={styles.waterOverlayBadge}>
          <Text style={styles.waterOverlayTitle}>AURLANDSFJORDEN • 185m DYP</Text>
        </View>

        {/* Civilian GPS Target Reticle */}
        <View style={styles.civilianReticle}>
          <View style={styles.pulseAura} />
          <View style={styles.corePin} />
          <View style={styles.reticleCallout}>
            <Text style={styles.reticleEyebrow}>DEG HER • GPS 5m</Text>
            <Text style={styles.reticleLocation}>{userLocationName}</Text>
          </View>
        </View>

        {/* Shelter Pin 1: Flåm Skule (Primary Heated Reception) */}
        <View style={styles.shelterPin1}>
          <View style={styles.shelterBeaconGlow} />
          <View style={styles.shelterBadge}>
            <Text style={styles.shelterSymbol}>▲</Text>
          </View>
          <View style={styles.shelterCapsule}>
            <Text style={styles.shelterTitle}>Flåm Skule & Hall</Text>
            <Text style={styles.shelterMetric}>650m • 8 min gang • +18m</Text>
          </View>
        </View>

        {/* Shelter Pin 2: Fretheim Høyde (Safe High Ground) */}
        <View style={styles.shelterPin2}>
          <View style={styles.shelterBeaconGlow} />
          <View style={styles.shelterBadge}>
            <Text style={styles.shelterSymbol}>▲</Text>
          </View>
          <View style={styles.shelterCapsule}>
            <Text style={styles.shelterTitle}>Fretheim Høyde</Text>
            <Text style={styles.shelterMetric}>850m • 11 min • +45m HØYDE</Text>
          </View>
        </View>

        {/* Bottom Chart HUD (Compass + Scale Bar) */}
        <View style={styles.chartHudBar}>
          <Text style={styles.scaleDistanceText}>SKALA: 500 M</Text>
          <View style={styles.scaleBarLine} />
          <View style={styles.compassContainer}>
            <CompassIcon size={12} color="#94A3B8" />
            <Text style={styles.compassLabel}>N</Text>
          </View>
        </View>
      </View>

      {/* Live Maritime Telemetry Row */}
      <View style={styles.telemetryRow}>
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>FJORDNIVÅ</Text>
          <Text style={styles.telemetryValue}>0.4m NORMAL</Text>
        </View>
        <View style={styles.telemetryDivider} />
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>BØLGEHØYDE</Text>
          <Text style={styles.telemetryValue}>ROLOG SFJORD</Text>
        </View>
        <View style={styles.telemetryDivider} />
        <View style={styles.telemetryItem}>
          <Text style={styles.telemetryLabel}>HAVNESTATUS</Text>
          <Text style={styles.telemetryValue}>ÅPEN SEILAS</Text>
        </View>
      </View>

      {/* Interactive Exploration Footer */}
      <TouchableOpacity 
        style={styles.statusFooter}
        onPress={onPressExplore}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Se verifiserte tryggesteder"
      >
        <View style={styles.footerLeft}>
          <View style={styles.footerGreenDot} />
          <Text style={styles.footerStatusText}>{statusText}</Text>
        </View>
        {onPressExplore && (
          <View style={styles.exploreActionBtn}>
            <Text style={styles.exploreActionText}>Se Tryggesteder</Text>
            <ChevronRightIcon size={14} color="#38BDF8" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0E131A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: '#121822',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerLeft: {
    flex: 1,
  },
  headerTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    ...Typography.caption,
    color: '#E2E8F0',
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 10,
  },
  coordinatesText: {
    ...Typography.caption,
    color: '#64748B',
    fontSize: 9,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  calmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  calmPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 5,
  },
  calmBadgeText: {
    ...Typography.caption,
    color: '#6EE7B7',
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 0.8,
  },
  mapSurface: {
    height: 220,
    backgroundColor: '#070C12',
    position: 'relative',
    overflow: 'hidden',
  },
  waterOverlayBadge: {
    position: 'absolute',
    top: 10,
    left: Spacing.md,
    backgroundColor: 'rgba(6, 16, 26, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  waterOverlayTitle: {
    ...Typography.caption,
    color: '#38BDF8',
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: 9,
  },
  civilianReticle: {
    position: 'absolute',
    top: 92,
    left: 62,
    alignItems: 'center',
  },
  pulseAura: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    position: 'absolute',
    top: -9,
  },
  corePin: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#0284C7',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  reticleCallout: {
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    marginTop: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  reticleEyebrow: {
    ...Typography.caption,
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 8,
    letterSpacing: 0.8,
  },
  reticleLocation: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  shelterPin1: {
    position: 'absolute',
    bottom: 28,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shelterPin2: {
    position: 'absolute',
    top: 96,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shelterBeaconGlow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    position: 'absolute',
    left: -2,
  },
  shelterBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#059669',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelterSymbol: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  shelterCapsule: {
    backgroundColor: 'rgba(6, 28, 18, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  shelterTitle: {
    ...Typography.caption,
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '800',
  },
  shelterMetric: {
    ...Typography.caption,
    color: '#6EE7B7',
    fontSize: 9,
    fontWeight: '600',
  },
  chartHudBar: {
    position: 'absolute',
    bottom: 8,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(10, 15, 24, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  scaleDistanceText: {
    ...Typography.caption,
    color: '#94A3B8',
    fontSize: 9,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  scaleBarLine: {
    width: 24,
    height: 2,
    backgroundColor: '#64748B',
  },
  compassContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    gap: 3,
  },
  compassLabel: {
    ...Typography.caption,
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
  },
  telemetryRow: {
    flexDirection: 'row',
    backgroundColor: '#0B1017',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
  },
  telemetryItem: {
    flex: 1,
    alignItems: 'center',
  },
  telemetryLabel: {
    ...Typography.caption,
    color: '#64748B',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  telemetryValue: {
    ...Typography.caption,
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
  },
  telemetryDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 2,
  },
  statusFooter: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: '#121822',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    minHeight: 46,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  footerGreenDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#34D399',
    marginRight: 8,
  },
  footerStatusText: {
    ...Typography.caption,
    color: '#94A3B8',
    fontSize: 12,
  },
  exploreActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  exploreActionText: {
    ...Typography.caption,
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 11,
  },
});
