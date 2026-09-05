import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { SafeZone } from '../../types/incident';

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
      {/* Map Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>LOCAL SITUATION MAP</Text>
          <Text style={styles.headerSubtitle}>Inner Aurlandsfjord • Flåm</Text>
        </View>
        <View style={styles.calmBadge}>
          <View style={styles.calmDot} />
          <Text style={styles.calmBadgeText}>CLEAR</Text>
        </View>
      </View>

      {/* Schematic Map Surface */}
      <View style={styles.mapSurface}>
        {/* Fjord Water Representation */}
        <View style={styles.fjordWater}>
          <Text style={styles.fjordLabel}>AURLANDSFJORD</Text>
          <View style={styles.waterDepthLine} />
        </View>

        {/* Shoreline / Kai boundary */}
        <View style={styles.shoreline} />

        {/* Civilian Location Pin */}
        <View style={styles.civilianPin}>
          <View style={styles.civilianPulseRing} />
          <View style={styles.civilianCoreDot} />
          <View style={styles.calloutBubble}>
            <Text style={styles.calloutLabel}>YOU ARE HERE</Text>
            <Text style={styles.calloutLocation}>{userLocationName}</Text>
          </View>
        </View>

        {/* Nearby Safe Assembly Indicators */}
        <View style={styles.shelterPin1}>
          <View style={styles.shelterBadge}>
            <Text style={styles.shelterBadgeText}>S</Text>
          </View>
          <Text style={styles.shelterTag}>Flåm Skule (650m)</Text>
        </View>

        <View style={styles.shelterPin2}>
          <View style={styles.shelterBadge}>
            <Text style={styles.shelterBadgeText}>S</Text>
          </View>
          <Text style={styles.shelterTag}>Fretheim Høyde (850m)</Text>
        </View>

        {/* Scale & Compass Marker */}
        <View style={styles.mapFooterBar}>
          <Text style={styles.scaleText}>500 m</Text>
          <View style={styles.scaleBar} />
          <Text style={styles.northIndicator}>N ▲</Text>
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
          <Text style={styles.exploreLink}>View Safe Places ›</Text>
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
    marginBottom: Spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
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
  },
  headerSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  calmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.safetyGreenDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  calmDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.safetyGreenText,
    marginRight: 4,
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
    backgroundColor: '#12151B',
    position: 'relative',
    overflow: 'hidden',
  },
  fjordWater: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#0E1724',
    justifyContent: 'center',
    paddingLeft: Spacing.md,
  },
  fjordLabel: {
    ...Typography.caption,
    color: '#3B5982',
    fontWeight: '700',
    letterSpacing: 1.5,
    fontSize: 10,
  },
  waterDepthLine: {
    height: 1,
    backgroundColor: '#182C48',
    width: '75%',
    marginTop: 4,
  },
  shoreline: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#273852',
  },
  civilianPin: {
    position: 'absolute',
    top: 75,
    left: 45,
    alignItems: 'center',
  },
  civilianPulseRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(59, 130, 246, 0.25)',
    position: 'absolute',
    top: -3,
    left: -3,
  },
  civilianCoreDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  calloutBubble: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
    marginTop: 4,
  },
  calloutLabel: {
    ...Typography.caption,
    color: '#60A5FA',
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
    right: 35,
    alignItems: 'center',
  },
  shelterPin2: {
    position: 'absolute',
    top: 80,
    right: 25,
    alignItems: 'center',
  },
  shelterBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.safetyGreen,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  shelterTag: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    backgroundColor: 'rgba(10, 38, 22, 0.85)',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: BorderRadius.xs,
  },
  mapFooterBar: {
    position: 'absolute',
    bottom: 8,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scaleText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
  },
  scaleBar: {
    width: 32,
    height: 2,
    backgroundColor: Colors.textMuted,
  },
  northIndicator: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
    marginLeft: 6,
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
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.safetyGreenText,
    marginRight: 8,
  },
  statusFooterText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  exploreLink: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 12,
  },
});
