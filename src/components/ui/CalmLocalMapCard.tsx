import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle, Rect, Line, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { SafeZone } from '../../types/incident';
import { CompassArrowIcon, ShelterGroupIcon } from './CivicIcons';

interface CalmLocalMapCardProps {
  userLocationName?: string;
  safeZones: SafeZone[];
  onPressExplore?: () => void;
  statusText?: string;
  youOffsetX?: number;
  youOffsetY?: number;
}

export const CalmLocalMapCard: React.FC<CalmLocalMapCardProps> = ({
  userLocationName = 'Flåm Sentrum',
  safeZones,
  onPressExplore,
  statusText,
  youOffsetX = 0,
  youOffsetY = 0,
}) => {
  return (
    <TouchableOpacity 
      style={styles.cardContainer} 
      onPress={onPressExplore}
      activeOpacity={0.9}
      accessible 
      accessibilityRole="button"
      accessibilityLabel="Situation map showing nearby safe shelters"
    >
      <View style={styles.mapCanvas}>
        <Svg width="100%" height="200" viewBox="0 0 360 200" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#A8C8E8" />
              <Stop offset="100%" stopColor="#9BBFE2" />
            </LinearGradient>
            <LinearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#F5F6F4" />
              <Stop offset="100%" stopColor="#EDEDEA" />
            </LinearGradient>
          </Defs>

          {/* Landmass Background */}
          <Rect width="360" height="200" fill="url(#landGrad)" />

          {/* Topographic Green Hills (Top Right) */}
          <Path
            d="M 160 0 Q 240 40 360 10 L 360 140 Q 280 120 220 80 Z"
            fill="#E3EDE2"
          />

          {/* Fjord Water Channel (Bottom Left) */}
          <Path
            d="M 0 95 Q 80 85 140 125 T 260 185 L 260 200 L 0 200 Z"
            fill="url(#waterGrad)"
          />

          {/* Waterfront Quay Pier Structure */}
          <Path
            d="M 85 125 L 135 155 L 125 168 L 78 138 Z"
            fill="#FFFFFF"
            stroke="#D1D5DB"
            strokeWidth="1"
          />

          {/* Street Network (White roads with subtle borders) */}
          <Path
            d="M 0 65 Q 120 80 180 88 T 360 110"
            stroke="#FFFFFF"
            strokeWidth="8"
            fill="none"
          />
          <Path
            d="M 0 65 Q 120 80 180 88 T 360 110"
            stroke="#E2E5EB"
            strokeWidth="1"
            fill="none"
          />

          {/* Secondary Roads */}
          <Path
            d="M 120 0 Q 150 90 175 140 T 240 200"
            stroke="#FFFFFF"
            strokeWidth="6"
            fill="none"
          />
          <Path
            d="M 80 40 L 220 160"
            stroke="#FFFFFF"
            strokeWidth="4"
            fill="none"
          />
          <Path
            d="M 160 30 L 320 90"
            stroke="#FFFFFF"
            strokeWidth="4"
            fill="none"
          />
          <Path
            d="M 220 70 L 360 160"
            stroke="#FFFFFF"
            strokeWidth="5"
            fill="none"
          />

          {/* River Stream */}
          <Path
            d="M 180 0 Q 165 70 178 120 T 155 170"
            stroke="#A3C5E6"
            strokeWidth="3"
            fill="none"
          />
        </Svg>

        {/* Map Labels */}
        <Text style={styles.waterLabel}>Aurlandsfjorden</Text>
        <Text style={styles.townLabel}>Flåm Sentrum</Text>
        <Text style={styles.quayLabel}>Flåm Kai</Text>

        {/* Road 55 / E16 Shield Badge */}
        <View style={styles.roadBadge}>
          <Text style={styles.roadBadgeText}>E16</Text>
        </View>

        {/* Civilian User GPS Location Dot */}
        <View style={[styles.userLocationContainer, { transform: [{ translateX: youOffsetX }, { translateY: youOffsetY }] }]}>
          <View style={styles.userPulseAura} />
          <View style={styles.userCoreDot} />
        </View>

        {/* Shelter Pin 1: Flåm Skule (Top Center) */}
        <View style={styles.shelterPin1}>
          <View style={styles.shelterCircle}>
            <ShelterGroupIcon size={16} color="#FFFFFF" />
          </View>
        </View>

        {/* Shelter Pin 2: Fretheim Høyde (Right) */}
        <View style={styles.shelterPin2}>
          <View style={styles.shelterCircle}>
            <ShelterGroupIcon size={16} color="#FFFFFF" />
          </View>
        </View>

        {/* Shelter Pin 3: Waterfront Quay (Bottom Left) */}
        <View style={styles.shelterPin3}>
          <View style={styles.shelterCircle}>
            <ShelterGroupIcon size={16} color="#FFFFFF" />
          </View>
        </View>

        {/* Floating Compass Button (Bottom Right) */}
        <View style={styles.compassWrapper}>
          <CompassArrowIcon size={32} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  mapCanvas: {
    height: 200,
    backgroundColor: '#F5F6F4',
    position: 'relative',
  },
  waterLabel: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    fontSize: 10,
    fontWeight: '600',
    color: '#6B8EAD',
  },
  townLabel: {
    position: 'absolute',
    top: 85,
    left: 195,
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  quayLabel: {
    position: 'absolute',
    bottom: 60,
    left: 135,
    fontSize: 9,
    fontWeight: '600',
    color: '#4B5563',
  },
  roadBadge: {
    position: 'absolute',
    bottom: 65,
    right: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#9CA3AF',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  roadBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1F2937',
  },
  userLocationContainer: {
    position: 'absolute',
    top: 90,
    left: 170,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPulseAura: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.22)',
    position: 'absolute',
  },
  userCoreDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  shelterPin1: {
    position: 'absolute',
    top: 25,
    left: 140,
  },
  shelterPin2: {
    position: 'absolute',
    top: 75,
    right: 90,
  },
  shelterPin3: {
    position: 'absolute',
    bottom: 35,
    left: 100,
  },
  shelterCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1B5E36',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  compassWrapper: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
