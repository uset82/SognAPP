import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Path,
  Rect,
  G,
} from 'react-native-svg';

/**
 * SOGN SAFE brand mark.
 *
 * Geometry is ported from the verified vector master at
 * `assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg`, so the numbers below are
 * not arbitrary: symbol occupies 61.6% x 63.3% of the canvas, centred at
 * x 511.5 / y 499.0, with the right face deliberately darker than the left
 * (luma 166.6 vs 183.8) so light reads as coming from the upper left.
 *
 * Layer ids mirror the Figma structure (Ship / Navigation Layers /
 * Direction Mark) so the design file and this component stay comparable.
 */

export type SognSafeLogoVariant =
  /** Rounded-square dark background (195px radius). Default. */
  | 'master'
  /** Opaque square, no corner radius - for store submission. */
  | 'fullBleed'
  /**
   * Legibility variant for tiny sizes.
   *
   * DEVIATION FROM SPEC: the brief asks for the symbol to occupy 60-64% of the
   * canvas width. This variant measures 75.4% x 77.4% because the whole symbol
   * group is scaled 1.22x. That is deliberate - at 32px the standard geometry
   * merges two chevrons into one blob (4 distinct bands instead of 5), while
   * this one keeps all five elements separate (5 bands, and 30% more bright
   * pixels). The trade is proportion fidelity for small-size readability.
   *
   * If you would rather keep strict 60-64% proportions everywhere, drop the
   * SMALL_TRANSFORM below (set it to undefined) and use 'master' instead.
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

/**
 * Bevels and drop shadows exist only in the standard geometry. At small sizes
 * they collapse into the shape they sit under, so the small geometry omits
 * them entirely rather than shipping dead paths. Marking them optional lets
 * both geometry tables share one type, and lets the render code branch on
 * presence instead of on the variant.
 */
interface LogoGeometry {
  seam: string;
  shipLeft: string;
  shipRight: string;
  bevelLeft?: string;
  bevelRight?: string;
  wave1: string;
  wave1Shadow?: string;
  wave2: string;
  wave2Shadow?: string;
  wave3: string;
  wave3Shadow?: string;
  diamond: string;
}

interface WaveSpec {
  key: string;
  label: string;
  d: string;
  shadow?: string;
}

/* ---------- geometry: standard (master / fullBleed / symbolOnly / mono) ---------- */

const GEO: LogoGeometry = {
  seam: 'M507 175 H517 V430 H507 Z',
  shipLeft: 'M507 175 L196 240 L196 467 L507 430 Z',
  shipRight: 'M517 175 L828 240 L828 467 L517 430 Z',
  bevelLeft: 'M196 467 L507 430 L507 416 L196 453 Z',
  bevelRight: 'M828 467 L517 430 L517 416 L828 453 Z',
  wave1: 'M269 507 L512 491 L755 507 L512 523 Z',
  wave1Shadow: 'M269 514 L512 498 L755 514 L512 530 Z',
  wave2: 'M342 559 L512 545 L682 559 L512 573 Z',
  wave2Shadow: 'M342 566 L512 552 L682 566 L512 580 Z',
  wave3: 'M406 605 L512 593 L618 605 L512 617 Z',
  wave3Shadow: 'M406 612 L512 600 L618 612 L512 624 Z',
  diamond: 'M512 660 L577 690 L512 825 L447 690 Z',
};

/* ---------- geometry: small variant (wider seam, wider gaps, 1.22x scale) ---------- */

const GEO_SMALL: LogoGeometry = {
  seam: 'M497 175 H527 V398 H497 Z',
  shipLeft: 'M497 175 L196 240 L196 430 L497 398 Z',
  shipRight: 'M527 175 L828 240 L828 430 L527 398 Z',
  wave1: 'M269 480 L512 464 L755 480 L512 496 Z',
  wave2: 'M342 545 L512 530 L682 545 L512 560 Z',
  wave3: 'M406 607 L512 594 L618 607 L512 620 Z',
  diamond: 'M512 654 L581 686 L512 825 L443 686 Z',
};

/** Mirrors the small SVG's transform: scale 1.22 about the symbol centre. */
const SMALL_TRANSFORM = 'translate(512 500) scale(1.22) translate(-512 -500)';

const PALETTE = {
  bgTop: '#141B20',
  bgMid: '#0B1013',
  bgBottom: '#080C0E',
  seam: '#0D1114',
  shadow: '#05080A',
};

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
  const cornerRadius = variant === 'fullBleed' ? 0 : 195;

  const g = isSmall ? GEO_SMALL : GEO;
  const mono = variant === 'monoBlack' ? '#000000' : '#FFFFFF';

  // Gradients need unique ids per instance, otherwise two logos on one screen
  // collide and the second one renders with the first one's fills.
  //
  // useId() returns ids like "«r0»". The guillemets are not valid XML name
  // characters, and on web react-native-svg serialises to real DOM ids, so
  // url(#«r0»-metalLeft) would not resolve there. Strip to alphanumerics; the
  // trailing counter still keeps ids unique per instance.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (name: string) => `${name}-${uid}`;

  const metalFill = isMono ? mono : `url(#${id('metalLeft')})`;
  const metalRightFill = isMono ? mono : `url(#${id('metalRight')})`;
  const bevelFill = isMono ? 'transparent' : `url(#${id('bevelGrad')})`;
  const waveFill = isMono ? mono : `url(#${id('waveMetal')})`;
  const diamondFill = isMono ? mono : `url(#${id('diamondMetal')})`;

  // Driven from a list so the three chevrons cannot drift out of sync - they
  // share a fill and each is drawn immediately after its own shadow.
  const waves: WaveSpec[] = [
    { key: 'w1', label: 'Wave 01', d: g.wave1, shadow: g.wave1Shadow },
    { key: 'w2', label: 'Wave 02', d: g.wave2, shadow: g.wave2Shadow },
    { key: 'w3', label: 'Wave 03', d: g.wave3, shadow: g.wave3Shadow },
  ];

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
          <LinearGradient id={id('bgGrad')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={PALETTE.bgTop} />
            <Stop offset="0.5" stopColor={PALETTE.bgMid} />
            <Stop offset="1" stopColor={PALETTE.bgBottom} />
          </LinearGradient>

          {/* Left face: brightest toward the centre, darkest at the outer bottom. */}
          <LinearGradient id={id('metalLeft')} x1="1" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F7F7F4" />
            <Stop offset="0.34" stopColor="#D6DADD" />
            <Stop offset="0.68" stopColor="#9AA1A5" />
            <Stop offset="1" stopColor="#61686C" />
          </LinearGradient>

          {/* Right face: same family, darker overall. */}
          <LinearGradient id={id('metalRight')} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#E9EBEA" />
            <Stop offset="0.34" stopColor="#C1C6C8" />
            <Stop offset="0.68" stopColor="#8B9296" />
            <Stop offset="1" stopColor="#51585C" />
          </LinearGradient>

          <LinearGradient id={id('bevelGrad')} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#343A3D" />
            <Stop offset="1" stopColor="#171C1F" />
          </LinearGradient>

          <LinearGradient id={id('waveMetal')} x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#8A9195" />
            <Stop offset="0.18" stopColor="#DDE1E1" />
            <Stop offset="0.42" stopColor="#FAFAF8" />
            <Stop offset="0.62" stopColor="#CBD1D3" />
            <Stop offset="1" stopColor="#6E757A" />
          </LinearGradient>

          <LinearGradient id={id('diamondMetal')} x1="0.2" y1="0" x2="0.9" y2="1">
            <Stop offset="0" stopColor="#F2F3F1" />
            <Stop offset="0.4" stopColor="#C8CDCF" />
            <Stop offset="0.75" stopColor="#8E9599" />
            <Stop offset="1" stopColor="#5A6165" />
          </LinearGradient>
        </Defs>

        {hasBackground ? (
          <Rect
            width={CANVAS}
            height={CANVAS}
            rx={cornerRadius}
            fill={`url(#${id('bgGrad')})`}
          />
        ) : null}

        <G transform={isSmall ? SMALL_TRANSFORM : undefined}>
          {/* Ship */}
          {isMono ? null : (
            <Path id="Center Seam" d={g.seam} fill={PALETTE.seam} />
          )}
          <Path id="Ship Left" d={g.shipLeft} fill={metalFill} />
          <Path id="Ship Right" d={g.shipRight} fill={metalRightFill} />
          {isMono || !g.bevelLeft ? null : (
            <Path id="Left Bevel" d={g.bevelLeft} fill={bevelFill} />
          )}
          {isMono || !g.bevelRight ? null : (
            <Path id="Right Bevel" d={g.bevelRight} fill={bevelFill} />
          )}

          {/* Navigation layers */}
          {waves.map(({ key, label, d, shadow }) => (
            <React.Fragment key={key}>
              {isMono || !shadow ? null : (
                <Path
                  id={`${label} Shadow`}
                  d={shadow}
                  fill={PALETTE.shadow}
                  opacity={0.85}
                />
              )}
              <Path id={label} d={d} fill={waveFill} />
            </React.Fragment>
          ))}

          {/* Direction mark */}
          <Path id="Direction Diamond" d={g.diamond} fill={diamondFill} />
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
