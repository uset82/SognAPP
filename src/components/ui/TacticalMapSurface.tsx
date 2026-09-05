import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

interface TacticalMapSurfaceProps {
  destinationName: string;
  distanceMeters: number;
  walkMinutes: number;
  blockedZoneName?: string;
  instructionText?: string;
  style?: ViewStyle;
}

export const TacticalMapSurface: React.FC<TacticalMapSurfaceProps> = ({
  destinationName,
  distanceMeters,
  walkMinutes,
  blockedZoneName = 'Flåm Waterfront Kai',
  instructionText = 'Follow designated pedestrian corridor inland away from water risk.',
  style,
}) => {
  return (
    <View style={[styles.cardContainer, style]}>
      {/* Header Metric Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.headerLabel}>EVACUATION PATHWAY</Text>
          <Text style={styles.destinationTitle}>{destinationName}</Text>
        </View>
        <View style={styles.metricPill}>
          <Text style={styles.metricValue}>{distanceMeters} m</Text>
          <Text style={styles.metricSeparator}>•</Text>
          <Text style={styles.metricTime}>{walkMinutes} min</Text>
        </View>
      </View>

      {/* Schematic Map Representation */}
      <View style={styles.schematicCanvas}>
        {/* Blocked Danger Zone Indicator */}
        <View style={styles.dangerZoneBadge}>
          <Text style={styles.dangerIcon}>▲</Text>
          <Text style={styles.dangerText}>BLOCKED: {blockedZoneName.toUpperCase()}</Text>
        </View>

        {/* Route Visual Pathway */}
        <View style={styles.routeRow}>
          <View style={styles.userMarkerContainer}>
            <View style={styles.userMarkerPulse} />
            <View style={styles.userMarkerDot} />
            <Text style={styles.userMarkerLabel}>YOU</Text>
          </View>

          <View style={styles.pathTrack}>
            <View style={styles.pathSegment} />
            <View style={styles.pathArrow}>
              <Text style={styles.arrowGlyph}>›</Text>
            </View>
            <View style={styles.pathSegment} />
          </View>

          <View style={styles.destMarkerContainer}>
            <View style={styles.destMarkerBox}>
              <View style={styles.destMarkerDot} />
            </View>
            <Text style={styles.destMarkerLabel}>SAFE SHELTER</Text>
          </View>
        </View>
      </View>

      {/* Footer Instruction */}
      <View style={styles.footerNote}>
        <Text style={styles.instructionBody}>{instructionText}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  headerLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    fontSize: 10,
  },
  destinationTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceRaised,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  metricValue: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  metricSeparator: {
    color: Colors.textMuted,
    marginHorizontal: 4,
  },
  metricTime: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '700',
  },
  schematicCanvas: {
    height: 160,
    backgroundColor: Colors.canvas,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  dangerZoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.emergencyRedDark,
    borderColor: Colors.emergencyRedBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  dangerIcon: {
    color: Colors.emergencyRed,
    fontSize: 10,
    marginRight: 4,
  },
  dangerText: {
    ...Typography.caption,
    color: Colors.emergencyRedText,
    fontSize: 10,
    fontWeight: '700',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xs,
  },
  userMarkerContainer: {
    alignItems: 'center',
  },
  userMarkerPulse: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.25)',
    top: -4,
  },
  userMarkerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.routeBlue,
    borderWidth: 3,
    borderColor: Colors.canvas,
  },
  userMarkerLabel: {
    ...Typography.caption,
    color: Colors.routeBlue,
    fontWeight: '800',
    fontSize: 10,
    marginTop: 4,
  },
  pathTrack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  pathSegment: {
    flex: 1,
    height: 3,
    backgroundColor: Colors.safetyGreen,
    borderRadius: 1.5,
  },
  pathArrow: {
    paddingHorizontal: 4,
  },
  arrowGlyph: {
    color: Colors.safetyGreen,
    fontSize: 18,
    fontWeight: '900',
  },
  destMarkerContainer: {
    alignItems: 'center',
  },
  destMarkerBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.safetyGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destMarkerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  destMarkerLabel: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '800',
    fontSize: 10,
    marginTop: 4,
  },
  footerNote: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  instructionBody: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
});
