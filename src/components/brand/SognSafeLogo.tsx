import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Line,
  Rect,
  G,
} from 'react-native-svg';

/**
 * SOGN SAFE brand mark.
 *
 * Geometry ported from the verified vector master at
 * `assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg`. The composition is a
 * 3D metallic compass/navigation symbol: a ship bow with vertical centre seam
 * and horizontal bevel, three progressively smaller chevron "wave" layers
 * (each split horizontally into a lit top trapezoid and a shadow bottom
 * triangle), and a small downward-pointing diamond at the foot.
 *
 * Layer ids mirror the Figma structure (Ship / Navigation Layers / Direction
 * Mark) so the design file and this component stay comparable.
 */

export type SognSafeLogoVariant =
  /** Rounded-square dark background (180px radius). Default. */
  | 'master'
  /** Opaque square, no corner radius - for store submission. */
  | 'fullBleed'
  /**
   * Legibility variant for tiny sizes. Scales the symbol 1.22x so all five
   * elements survive at 32px instead of merging into one blob.
   */
  | 'small'
  /** Metallic symbol only, transparent background. */
  | 'symbolOnly'
  /** Single-colour white mark. */
  | 'monoWhite'
  /** Single-colour black mark. */
  | 'monoBlack';

export interface SognSafeLogoProps {
  /** Rendered width and height in points. Default 1024. */
  size?: number;
  variant?: SognSafeLogoVariant;
  /** Announced by screen readers. Default 'SOGN SAFE'. */
  accessibilityLabel?: string;
  testID?: string;
  style?: ViewStyle;
}

const CANVAS = 1024;

interface ShipBowGeometry {
  /** Apex of the bow (top peak). */
  apex: { x: number; y: number };
  /** Left + right shoulder vertices (widest point of the upper face). */
  leftShoulder: { x: number; y: number };
  rightShoulder: { x: number; y: number };
  /** Left + right base vertices where the bevel meets the lower face. */
  leftBase: { x: number; y: number };
  rightBase: { x: number; y: number };
  /** Bottom-centre vertex (the slight downward tongue at the bottom of the bow). */
  bottomCenter: { x: number; y: number };
}

interface ChevronGeometry {
  /** Top edge: narrow horizontal line (the chevron's "back"). */
  topLeft: { x: number; y: number };
  topRight: { x: number; y: number };
  /** Bottom edge of the top face / start of bottom face. The widest line. */
  seamLeft: { x: number; y: number };
  seamRight: { x: number; y: number };
  /** The chevron's tip. */
  point: { x: number; y: number };
}

interface LogoGeometry {
  shipBow: ShipBowGeometry;
  wave1: ChevronGeometry;
  wave2: ChevronGeometry;
  wave3: ChevronGeometry;
  diamond: ChevronGeometry;
}

/* ---------- geometry: standard (master / fullBleed / symbolOnly / mono) ----------
 *
 * Coordinates verified against the reference screenshot. Each chevron is a
 * pentagon: two top corners, two widest points (the seam), and a tip.
 *
 * Heights / widths in 1024-master units:
 *   - ship bow   apex y=230, base y=552  -> height 322 (31%)
 *   - wave 1     y=585..735              -> height 150 (15%)
 *   - wave 2     y=765..855              -> height  90 ( 9%)
 *   - wave 3     y=880..940              -> height  60 ( 6%)
 *   - diamond    y=958..998              -> height  40 ( 4%)
 */
const GEO: LogoGeometry = {
  shipBow: {
    apex: { x: 512, y: 250 },
    leftShoulder: { x: 215, y: 445 },
    rightShoulder: { x: 809, y: 445 },
    leftBase: { x: 280, y: 525 },
    rightBase: { x: 744, y: 525 },
    bottomCenter: { x: 512, y: 550 },
  },
  wave1: {
    topLeft: { x: 325, y: 585 },
    topRight: { x: 699, y: 585 },
    seamLeft: { x: 144, y: 665 },
    seamRight: { x: 880, y: 665 },
    point: { x: 512, y: 735 },
  },
  wave2: {
    topLeft: { x: 392, y: 765 },
    topRight: { x: 632, y: 765 },
    seamLeft: { x: 264, y: 812 },
    seamRight: { x: 760, y: 812 },
    point: { x: 512, y: 855 },
  },
  wave3: {
    topLeft: { x: 432, y: 880 },
    topRight: { x: 592, y: 880 },
    seamLeft: { x: 370, y: 910 },
    seamRight: { x: 654, y: 910 },
    point: { x: 512, y: 940 },
  },
  diamond: {
    topLeft: { x: 458, y: 958 },
    topRight: { x: 566, y: 958 },
    seamLeft: { x: 472, y: 978 },
    seamRight: { x: 552, y: 978 },
    point: { x: 512, y: 998 },
  },
};

/* ---------- geometry: small variant (1.22x scale about the symbol centre) ----------
 *
 * Same structure as GEO, just scaled. The scale factor is applied as a G
 * transform; the underlying numbers stay the same so both variants stay
 * comparable.
 */

const SMALL_TRANSFORM = 'translate(512 500) scale(1.22) translate(-512 -500)';

const PALETTE = {
  bgTop: '#141B20',
  bgMid: '#0B1013',
  bgBottom: '#06090B',
  seam: '#0B1013',
};

const pathFromPoints = (
  points: Array<{ x: number; y: number }>,
  close = true
): string => {
  let d = '';
  for (let i = 0; i < points.length; i++) {
    d += `${i === 0 ? 'M' : 'L'} ${points[i].x} ${points[i].y} `;
  }
  if (close) d += 'Z';
  return d.trim();
};

const shipBowPaths = (b: ShipBowGeometry) => ({
  /** Top-left face (lit): apex -> left shoulder -> centre seam. */
  topLeft: pathFromPoints([b.apex, b.leftShoulder, { x: 512, y: b.leftShoulder.y }]),
  /** Top-right face (mid): apex -> right shoulder -> centre seam. */
  topRight: pathFromPoints([b.apex, b.rightShoulder, { x: 512, y: b.rightShoulder.y }]),
  /** Bottom-left bevel: left shoulder -> left base -> bottomCentre -> centre seam. */
  bottomLeft: pathFromPoints([
    b.leftShoulder,
    b.leftBase,
    b.bottomCenter,
    { x: 512, y: b.leftShoulder.y },
  ]),
  /** Bottom-right bevel: right shoulder -> right base -> bottomCentre -> centre seam. */
  bottomRight: pathFromPoints([
    b.rightShoulder,
    b.rightBase,
    b.bottomCenter,
    { x: 512, y: b.rightShoulder.y },
  ]),
  /** Horizontal seam between top face and bevel. */
  horizontalSeam: `M ${b.leftShoulder.x} ${b.leftShoulder.y} L ${b.rightShoulder.x} ${b.rightShoulder.y}`,
  /** Vertical centre seam of the bow. */
  verticalSeam: `M ${b.apex.x} ${b.apex.y} L ${b.bottomCenter.x} ${b.bottomCenter.y}`,
});

const chevronPaths = (c: ChevronGeometry) => ({
  /** Top face (lit trapezoid): top edge -> widest edge. */
  top: pathFromPoints([c.topLeft, c.topRight, c.seamRight, c.seamLeft]),
  /** Bottom face (shadow triangle): seam -> tip. */
  bottom: pathFromPoints([c.seamLeft, c.seamRight, c.point]),
  /** Horizontal seam between top face and bottom face. */
  seam: `M ${c.seamLeft.x} ${c.seamLeft.y} L ${c.seamRight.x} ${c.seamRight.y}`,
});

export const SognSafeLogo: React.FC<SognSafeLogoProps> = ({
  size = CANVAS,
  variant = 'master',
  accessibilityLabel = 'SOGN SAFE',
  testID,
  style,
}) => {
  const isMono = variant === 'monoWhite' || variant === 'monoBlack';
  const isSmall = variant === 'small';
  const hasBackground =
    variant === 'master' || variant === 'fullBleed' || variant === 'small';
  const cornerRadius = variant === 'fullBleed' ? 0 : 180;

  const mono = variant === 'monoBlack' ? '#000000' : '#FFFFFF';

  // useId() returns ids like "«r0»". The guillemets are not valid XML name
  // characters, and on web react-native-svg serialises to real DOM ids, so
  // url(#«r0»-metalLeft) would not resolve there. Strip to alphanumerics; the
  // trailing counter still keeps ids unique per instance.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (name: string) => `${name}-${uid}`;

  const ship = shipBowPaths(GEO.shipBow);
  const waves = [GEO.wave1, GEO.wave2, GEO.wave3].map(chevronPaths);
  const diamond = chevronPaths(GEO.diamond);

  const faceFill = (name: string) =>
    isMono ? mono : `url(#${id(name)})`;

  return (
    <View
      style={[styles.wrap, { width: size, height: size }, style]}
      testID={testID}
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${CANVAS} ${CANVAS}`}
        fill="none"
      >
        <Defs>
          <LinearGradient id={id('bg')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={PALETTE.bgTop} />
            <Stop offset="0.55" stopColor={PALETTE.bgMid} />
            <Stop offset="1" stopColor={PALETTE.bgBottom} />
          </LinearGradient>

          {/* Ship bow top-left face (lit). Brightest at top apex. */}
          <LinearGradient id={id('bowTL')} x1="0.2" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#F8F9F6" />
            <Stop offset="0.45" stopColor="#DCDFDA" />
            <Stop offset="1" stopColor="#8E9396" />
          </LinearGradient>

          {/* Ship bow top-right face (mid). Darker, satin. */}
          <LinearGradient id={id('bowTR')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#9CA1A3" />
            <Stop offset="1" stopColor="#4D5357" />
          </LinearGradient>

          {/* Ship bow bottom-left bevel. */}
          <LinearGradient id={id('bowBevelL')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#7A8084" />
            <Stop offset="1" stopColor="#3F4447" />
          </LinearGradient>

          {/* Ship bow bottom-right bevel. */}
          <LinearGradient id={id('bowBevelR')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#5E6366" />
            <Stop offset="1" stopColor="#2D3235" />
          </LinearGradient>

          {/* Chevron top face (lit). Brightest at top, darker at the seam. */}
          <LinearGradient id={id('chevTop')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F6F7F4" />
            <Stop offset="0.5" stopColor="#D8D9D5" />
            <Stop offset="1" stopColor="#7A8084" />
          </LinearGradient>

          {/* Chevron bottom face (shadow). Brighter at the seam, darker at the tip. */}
          <LinearGradient id={id('chevBottom')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#A8ADAF" />
            <Stop offset="1" stopColor="#454A4D" />
          </LinearGradient>
        </Defs>

        {hasBackground ? (
          <Rect
            width={CANVAS}
            height={CANVAS}
            rx={cornerRadius}
            fill={isMono ? '#FFFFFF' : `url(#${id('bg')})`}
          />
        ) : null}

        <G transform={isSmall ? SMALL_TRANSFORM : undefined}>
          {/* Ship bow */}
          <Path id="Ship Top Left" d={ship.topLeft} fill={faceFill('bowTL')} />
          <Path id="Ship Top Right" d={ship.topRight} fill={faceFill('bowTR')} />
          <Path id="Ship Bevel Left" d={ship.bottomLeft} fill={faceFill('bowBevelL')} />
          <Path id="Ship Bevel Right" d={ship.bottomRight} fill={faceFill('bowBevelR')} />

          {/* Chevron waves */}
          {waves.map((w, i) => (
            <React.Fragment key={`w${i}`}>
              <Path id={`Wave ${i + 1} Top`} d={w.top} fill={faceFill('chevTop')} />
              <Path id={`Wave ${i + 1} Bottom`} d={w.bottom} fill={faceFill('chevBottom')} />
            </React.Fragment>
          ))}

          {/* Direction diamond */}
          <Path id="Diamond Top" d={diamond.top} fill={faceFill('chevTop')} />
          <Path id="Diamond Bottom" d={diamond.bottom} fill={faceFill('chevBottom')} />

          {/* Seams on top of the faces, so they read clearly. Hidden in mono. */}
          {!isMono ? (
            <>
              <Line
                id="Ship Horizontal Seam"
                x1={GEO.shipBow.leftShoulder.x}
                y1={GEO.shipBow.leftShoulder.y}
                x2={GEO.shipBow.rightShoulder.x}
                y2={GEO.shipBow.rightShoulder.y}
                stroke={PALETTE.seam}
                strokeWidth={3}
                strokeLinecap="round"
              />
              <Line
                id="Ship Vertical Seam"
                x1={GEO.shipBow.apex.x}
                y1={GEO.shipBow.apex.y}
                x2={GEO.shipBow.bottomCenter.x}
                y2={GEO.shipBow.bottomCenter.y}
                stroke={PALETTE.seam}
                strokeWidth={3}
                strokeLinecap="round"
              />
              {[GEO.wave1, GEO.wave2, GEO.wave3, GEO.diamond].map((c, i) => (
                <Line
                  key={`seam${i}`}
                  id={`Wave ${i + 1} Seam`}
                  x1={c.seamLeft.x}
                  y1={c.seamLeft.y}
                  x2={c.seamRight.x}
                  y2={c.seamRight.y}
                  stroke={PALETTE.seam}
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              ))}
            </>
          ) : null}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    // Keeps the mark square regardless of parent flex stretching.
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SognSafeLogo;