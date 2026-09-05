import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { SafeZone } from '../../types/incident';
import { CompassIcon, ChevronRightIcon } from './CivicIcons';

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
  statusText = 'Normal conditions • Waterfront clear',
}) => {
  return (
    <View style={styles.cardContainer} accessible accessibilityRole="summary">
      {/* Map Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>LOCAL SITUATION MAP</Text>
          <Text style={styles.headerSubtitle}>Inner Aurlandsfjord • Flåm Sector</Text>
        </View>
        <View style={styles.calmBadge}>
          <View style={styles.calmDot} />
          <Text style={styles.calmBadgeText}>CLEAR</Text>
        </View>
      </View>

      {/* Cartographic Surface */}
      <View style={styles.mapSurface}>
        <Svg width="100%" height="180" viewBox="0 0 360 180" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="fjordGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#0B1A2C" stopOpacity="1" />
              <Stop offset="100%" stopColor="#07111D" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="landGradient" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#121720" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0D1117" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Fjord Water Channel (Top Region) */}
          <Path
            d="M 0 0 L 360 0 L 360 70 Q 240 78 180 72 T 0 68 Z"
            fill="url(#fjordGradient)"
          />

          {/* Bathymetry / Water Flow Contours */}
          <Path
            d="M 0 25 Q 120 32 240 28 T 360 30"
            stroke="rgba(56, 189, 248, 0.12)"
            strokeWidth="1"
            fill="none"
          />
          <Path
            d="M 0 45 Q 150 54 280 48 T 360 52"
            stroke="rgba(56, 189, 248, 0.16)"
            strokeWidth="1"
            fill="none"
          />

          {/* Shoreline / Kai Boundary */}
          <Path
            d="M 0 68 Q 120 72 180 72 Q 240 78 360 70"
            stroke="#1E3A5F"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Land / Valley Surface (Bottom Region) */}
          <Path
            d="M 0 70 L 360 72 L 360 180 L 0 180 Z"
            fill="url(#landGradient)"
          />

          {/* Mountain Topography Contour Lines */}
          <Path
            d="M 0 105 Q 90 95 180 112 T 360 102"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
            strokeDasharray="4,4"
            fill="none"
          />
          <Path
            d="M 0 140 Q 110 132 220 145 T 360 138"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
            fill="none"
          />

          {/* Radar Horizon Grid Concentric Arc */}
          <Circle
            cx="65"
            cy="90"
            r="38"
            stroke="rgba(56, 189, 248, 0.12)"
            strokeWidth="1"
            fill="none"
          />
          <Circle
            cx="65"
            cy="90"
            r="70"
            stroke="rgba(56, 189, 248, 0.07)"
            strokeWidth="1"
            strokeDasharray="2,3"
            fill="none"
          />
        </Svg>

        {/* Fjord Water Label */}
        <View style={styles.fjordBadge}>
          <Text style={styles.fjordLabel}>AURLANDSFJORDEN</Text>
        </View>

        {/* Civilian Location Pin */}
        <View style={styles.civilianPin}>
          <View style={styles.civilianPulseRing} />
          <View style={styles.civilianCoreDot} />
          <View style={styles.calloutBubble}>
            <Text style={styles.calloutLabel}>YOU ARE HERE</Text>
            <Text style={styles.calloutLocation}>{userLocationName}</Text>
          </View>
        </View>

        {/* Safe Assembly Shelter 1: Flåm Skule */}
        <View style={styles.shelterPin1}>
          <View style={styles.shelterBadge}>
            <Text style={styles.shelterBadgeIcon}>▲</Text>
          </View>
          <View style={styles.shelterTagBubble}>
            <Text style={styles.shelterName}>Flåm Skule</Text>
            <Text style={styles.shelterDistance}>650m • 45m elev</Text>
          </View>
        </View>

        {/* Safe Assembly Shelter 2: Fretheim Høyde */}
        <View style={styles.shelterPin2}>
          <View style={styles.shelterBadge}>
            <Text style={styles.shelterBadgeIcon}>▲</Text>
          </View>
          <View style={styles.shelterTagBubble}>
            <Text style={styles.shelterName}>Fretheim Høyde</Text>
            <Text style={styles.shelterDistance}>850m • 90m elev</Text>
          </View>
        </View>

        {/* Map Scale & Compass */}
        <View style={styles.mapFooterBar}>
          <Text style={styles.scaleText}>500 m</Text>
          <View style={styles.scaleBar} />
          <View style={styles.compassRow}>
            <CompassIcon size={12} color={Colors.textMuted} />
            <Text style={styles.northIndicator}>N</Text>
          </View>
        </View>
      </View>

      {/* Status Bar Beneath Map */}
      <TouchableOpacity 
        style={styles.statusFooter}
        onPress={onPressExplore}
        activeOpacity={onPressExplore ? 0.75 : 1}
        accessibilityRole="button"
        accessibilityLabel="View safe places details"
      >
        <View style={styles.statusDotRow}>
          <View style={styles.statusDot} />
          <Text style={styles.statusFooterText}>{statusText}</Text>
        </View>
        {onPressExplore && (
          <View style={styles.exploreLinkRow}>
            <Text style={styles.exploreLink}>View Safe Places</Text>
            <ChevronRightIcon size={14} color={Colors.textSecondary} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    backgroundColor: Colors.surfaceRaised,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.8,
    fontSize: 11,
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  calmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  calmDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.safetyGreenText,
    marginRight: 5,
  },
  calmBadgeText: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  mapSurface: {
    height: 180,
    backgroundColor: '#0A0E14',
    position: 'relative',
    overflow: 'hidden',
  },
  fjordBadge: {
    position: 'absolute',
    top: 8,
    left: Spacing.md,
    backgroundColor: 'rgba(7, 17, 29, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
  },
  fjordLabel: {
    ...Typography.caption,
    color: '#4B8898',
    fontWeight: '700',
    letterSpacing: 1.2,
    fontSize: 9,
  },
  civilianPin: {
    position: 'absolute',
    top: 76,
    left: 48,
    alignItems: 'center',
  },
  civilianPulseRing: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(56, 189, 248, 0.22)',
    position: 'absolute',
    top: -5,
    left: 17,
  },
  civilianCoreDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.routeBlue,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignSelf: 'center',
  },
  calloutBubble: {
    backgroundColor: 'rgba(24, 29, 38, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    marginTop: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  calloutLabel: {
    ...Typography.caption,
    color: Colors.routeBlue,
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  calloutLocation: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: '600',
  },
  shelterPin1: {
    position: 'absolute',
    bottom: 22,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shelterPin2: {
    position: 'absolute',
    top: 76,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shelterBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.safetyGreen,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelterBadgeIcon: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  shelterTagBubble: {
    backgroundColor: 'rgba(11, 36, 24, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  shelterName: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontSize: 10,
    fontWeight: '700',
  },
  shelterDistance: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
  },
  mapFooterBar: {
    position: 'absolute',
    bottom: 8,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(18, 22, 29, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  scaleText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
  },
  scaleBar: {
    width: 24,
    height: 2,
    backgroundColor: Colors.textMuted,
  },
  compassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    gap: 2,
  },
  northIndicator: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  statusFooter: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    minHeight: 44,
  },
  statusDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.safetyGreenText,
    marginRight: 8,
  },
  statusFooterText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  exploreLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  exploreLink: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 12,
  },
});
