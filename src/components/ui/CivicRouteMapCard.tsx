import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  Polyline,
  Line,
  G,
  Text as SvgText,
  Polygon,
} from 'react-native-svg';
import { CompassArrowIcon } from './CivicIcons';

interface CivicRouteMapCardProps {
  mode?: 'overview' | 'turn-by-turn';
  destinationName?: string;
  userStep?: number;
}

export const CivicRouteMapCard: React.FC<CivicRouteMapCardProps> = ({
  mode = 'overview',
  destinationName = 'Flåm School',
  userStep = 1,
}) => {
  const isTurnByTurn = mode === 'turn-by-turn';

  return (
    <View style={styles.container}>
      <Svg width="100%" height="100%" viewBox="0 0 360 380">
        {/* Background Terrain */}
        <Rect x="0" y="0" width="360" height="380" fill="#EBF2E4" />

        {/* Mountain Contour Curves */}
        <Path
          d="M0 60 Q 90 40, 180 80 T 360 40 L 360 0 L 0 0 Z"
          fill="#DFEBDA"
        />
        <Path
          d="M240 0 Q 300 80, 360 120 L 360 0 Z"
          fill="#D6E5D0"
        />
        <Path
          d="M0 240 Q 60 280, 0 340 Z"
          fill="#DFEBDA"
        />

        {/* Fjord Water (Aurlandsfjorden) */}
        <Path
          d="M0 200 L 140 180 Q 190 230, 210 280 L 360 280 L 360 380 L 0 380 Z"
          fill="#A4CDE8"
        />
        <Path
          d="M130 180 L 170 260 L 150 280 L 110 200 Z"
          fill="#94BFDD"
        />

        {/* Aurlandsfjorden Water Label */}
        <SvgText
          x="275"
          y="350"
          fill="#2C6E91"
          fontSize="13"
          fontStyle="italic"
          fontWeight="500"
          textAnchor="middle"
        >
          Aurlandsfjorden
        </SvgText>

        {/* Flåm River (Flåmselvi) */}
        <Path
          d="M135 0 C 130 50, 145 100, 140 160 C 138 180, 142 210, 145 250"
          stroke="#9AC4E2"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Town Street Network (Flåm Sentrum) */}
        {/* Main Road */}
        <Path
          d="M145 250 L 180 190 L 195 130 L 170 60 L 160 0"
          stroke="#FFFFFF"
          strokeWidth="7"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Street Grids */}
        <Path
          d="M180 190 L 260 210 M 195 130 L 280 140 M 170 60 L 250 80"
          stroke="#FFFFFF"
          strokeWidth="5"
          fill="none"
        />
        <Path
          d="M210 250 L 230 110 M 250 240 L 270 90 M 140 140 L 195 130"
          stroke="#FFFFFF"
          strokeWidth="4"
          fill="none"
        />

        {/* Minor Local Road Network lines */}
        <Path
          d="M140 220 L 120 230 M 160 240 L 180 270 M 120 180 L 80 190"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          fill="none"
        />

        {/* Town Name Label */}
        <SvgText
          x="100"
          y="235"
          fill="#4A5568"
          fontSize="15"
          fontWeight="700"
          textAnchor="middle"
        >
          Flåm
        </SvgText>

        {/* Red Affected / Danger Area (Waterfront Zone) */}
        {isTurnByTurn ? (
          <G>
            {/* Danger Area in Turn-by-Turn */}
            <Polygon
              points="180,240 260,195 330,205 340,280 220,290"
              fill="rgba(239, 68, 68, 0.22)"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray="4,4"
            />
            {/* Red striped waterfront bar */}
            <Path
              d="M180 245 Q 230 250, 310 250"
              stroke="#C5221F"
              strokeWidth="10"
              strokeDasharray="6,4"
              strokeLinecap="round"
            />
          </G>
        ) : (
          <G>
            {/* Affected Area in Overview */}
            <Polygon
              points="50,130 120,130 120,210 50,190"
              fill="rgba(239, 68, 68, 0.22)"
              stroke="#EF4444"
              strokeWidth="1.2"
              strokeDasharray="3,3"
            />
            <SvgText
              x="85"
              y="155"
              fill="#C5221F"
              fontSize="11"
              fontWeight="800"
              textAnchor="middle"
            >
              AFFECTED
            </SvgText>
            <SvgText
              x="85"
              y="170"
              fill="#C5221F"
              fontSize="11"
              fontWeight="800"
              textAnchor="middle"
            >
              AREA
            </SvgText>
          </G>
        )}

        {/* Blocked Waterfront Forbidden Sign */}
        <G>
          {isTurnByTurn ? (
            <G transform="translate(255, 240)">
              <Circle cx="0" cy="0" r="11" fill="#C5221F" />
              <Line x1="-7" y1="0" x2="7" y2="0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <SvgText x="0" y="18" fill="#991B1B" fontSize="9" fontWeight="800" textAnchor="middle">
                BLOCKED
              </SvgText>
              <SvgText x="0" y="27" fill="#991B1B" fontSize="9" fontWeight="800" textAnchor="middle">
                WATERFRONT
              </SvgText>
            </G>
          ) : (
            <G transform="translate(100, 225)">
              <Circle cx="0" cy="0" r="11" fill="#C5221F" />
              <Line x1="-7" y1="0" x2="7" y2="0" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <SvgText x="0" y="18" fill="#991B1B" fontSize="9" fontWeight="800" textAnchor="middle">
                BLOCKED
              </SvgText>
              <SvgText x="0" y="27" fill="#991B1B" fontSize="9" fontWeight="800" textAnchor="middle">
                WATERFRONT
              </SvgText>
            </G>
          )}
        </G>

        {/* Danger Area Warning Callout in Turn-by-Turn mode */}
        {isTurnByTurn && (
          <G transform="translate(260, 215)">
            <Path d="M0 -15 L -8 0 L 8 0 Z" fill="#C5221F" />
            <Line x1="0" y1="-10" x2="0" y2="-5" stroke="#FFFFFF" strokeWidth="1.5" />
            <Circle cx="0" cy="-2" r="0.8" fill="#FFFFFF" />
            <SvgText x="0" y="8" fill="#991B1B" fontSize="10" fontWeight="900" textAnchor="middle">
              DANGER AREA
            </SvgText>
            <SvgText x="0" y="18" fill="#7F1D1D" fontSize="8" fontWeight="600" textAnchor="middle">
              Stay away
            </SvgText>
          </G>
        )}

        {/* Alternative Safe Zones in Overview Mode */}
        {!isTurnByTurn && (
          <G>
            {/* Safe Zone B */}
            <G transform="translate(255, 185)">
              <Rect x="-45" y="-12" width="90" height="24" rx="12" fill="#1B5E36" />
              <Circle cx="-32" cy="0" r="8" fill="#144627" />
              <Path d="M-36 -3 L-32 -7 L-28 -3 V3 H-36 Z" fill="#FFFFFF" />
              <SvgText x="6" y="4" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                Safe Zone B
              </SvgText>
            </G>

            {/* Safe Zone C */}
            <G transform="translate(265, 255)">
              <Rect x="-45" y="-12" width="90" height="24" rx="12" fill="#1B5E36" />
              <Circle cx="-32" cy="0" r="8" fill="#144627" />
              <Path d="M-36 -3 L-32 -7 L-28 -3 V3 H-36 Z" fill="#FFFFFF" />
              <SvgText x="6" y="4" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
                Safe Zone C
              </SvgText>
            </G>
          </G>
        )}

        {/* SAFE EVACUATION ROUTE PATHWAY (Dark Green Solid Line) */}
        {isTurnByTurn ? (
          <G>
            {/* Shadow path */}
            <Path
              d="M155 255 L 160 215 L 175 190 L 168 150 L 180 120 L 165 95 L 162 70"
              stroke="rgba(27, 94, 54, 0.25)"
              strokeWidth="10"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Main Green Line */}
            <Path
              d="M155 255 L 160 215 L 175 190 L 168 150 L 180 120 L 165 95 L 162 70"
              stroke="#1B5E36"
              strokeWidth="6"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* Direction Arrows on route */}
            <Polyline points="158 238 160 234 162 238" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Polyline points="166 204 168 200 170 204" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Polyline points="171 170 173 166 175 170" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Polyline points="173 138 175 134 177 138" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Polyline points="169 110 167 106 165 110" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <Polyline points="163 85 162 80 161 85" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </G>
        ) : (
          <G>
            {/* Route in Overview Mode */}
            <Path
              d="M180 260 L 195 240 L 185 190 L 170 145 L 140 110 L 135 75"
              stroke="rgba(27, 94, 54, 0.2)"
              strokeWidth="8"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <Path
              d="M180 260 L 195 240 L 185 190 L 170 145 L 140 110 L 135 75"
              stroke="#1B5E36"
              strokeWidth="4.5"
              fill="none"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </G>
        )}

        {/* Destination Pin: Flåm School */}
        {isTurnByTurn ? (
          <G transform="translate(162, 60)">
            <Rect x="-45" y="-14" width="90" height="26" rx="13" fill="#1B5E36" stroke="#FFFFFF" strokeWidth="1" />
            <Circle cx="-30" cy="-1" r="9" fill="#144627" />
            <Path d="M-34 -4 L-30 -8 L-26 -4 V2 H-34 Z" fill="#FFFFFF" />
            <SvgText x="8" y="0" fill="#FFFFFF" fontSize="9.5" fontWeight="800" textAnchor="middle">
              Flåm School
            </SvgText>
            <SvgText x="8" y="9" fill="#D1FAE5" fontSize="7.5" fontWeight="600" textAnchor="middle">
              Safe Area
            </SvgText>
          </G>
        ) : (
          <G transform="translate(135, 65)">
            <Rect x="-45" y="-14" width="90" height="26" rx="13" fill="#1B5E36" stroke="#FFFFFF" strokeWidth="1" />
            <Circle cx="-30" cy="-1" r="9" fill="#144627" />
            <Path d="M-34 -4 L-30 -8 L-26 -4 V2 H-34 Z" fill="#FFFFFF" />
            <SvgText x="8" y="3" fill="#FFFFFF" fontSize="10" fontWeight="700" textAnchor="middle">
              Flåm School
            </SvgText>
            {/* Connecting dot to route start */}
            <Circle cx="0" cy="18" r="4" fill="#1B5E36" stroke="#FFFFFF" strokeWidth="2" />
          </G>
        )}

        {/* User GPS Pin: "YOU" */}
        {isTurnByTurn ? (
          <G transform="translate(155, 255)">
            <Circle cx="0" cy="0" r="16" fill="rgba(37, 99, 235, 0.25)" />
            <Circle cx="0" cy="0" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <Rect x="-18" y="10" width="36" height="18" rx="6" fill="#2563EB" />
            <SvgText x="0" y="23" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">
              YOU
            </SvgText>
          </G>
        ) : (
          <G transform="translate(180, 260)">
            <Circle cx="0" cy="0" r="16" fill="rgba(37, 99, 235, 0.25)" />
            <Circle cx="0" cy="0" r="7" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2" />
            <Rect x="-18" y="10" width="36" height="18" rx="6" fill="#2563EB" />
            <SvgText x="0" y="23" fill="#FFFFFF" fontSize="9" fontWeight="800" textAnchor="middle">
              YOU
            </SvgText>
          </G>
        )}

        {/* Scale bar indicator */}
        <G transform="translate(20, 345)">
          <Line x1="0" y1="0" x2="80" y2="0" stroke="#4B5563" strokeWidth="1.5" />
          <Line x1="0" y1="-3" x2="0" y2="3" stroke="#4B5563" strokeWidth="1.5" />
          <Line x1="40" y1="-2" x2="40" y2="2" stroke="#4B5563" strokeWidth="1.5" />
          <Line x1="80" y1="-3" x2="80" y2="3" stroke="#4B5563" strokeWidth="1.5" />
          <SvgText x="0" y="-5" fill="#4B5563" fontSize="8" textAnchor="middle">0</SvgText>
          <SvgText x="40" y="-5" fill="#4B5563" fontSize="8" textAnchor="middle">250</SvgText>
          <SvgText x="80" y="-5" fill="#4B5563" fontSize="8" textAnchor="middle">500 m</SvgText>
        </G>
      </Svg>

      {/* Floating Compass Arrow Button (Matching Image 3 & 5) */}
      <View style={styles.compassContainer}>
        <CompassArrowIcon size={34} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 380,
    backgroundColor: '#EBF2E4',
    position: 'relative',
  },
  compassContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
});
