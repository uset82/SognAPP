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
import {
  MASTER_VIEWBOX,
  SMALL_TRANSFORM,
  GRADIENTS,
  BACKGROUND_RECTS,
  SYMBOL_LAYERS,
} from './logoGeometry.generated';

export type {
  GradientDef,
  GradientStop,
  SymbolLayer,
  BackgroundRect,
} from './logoGeometry.generated';

/**
 * SOGN SAFE brand mark.
 *
 * The mark is a folded metallic navigation symbol, top to bottom:
 *   1. Two tapered upper panels (left lit, right shaded) forming the bow,
 *      with a bright inner bevel along the fold.
 *   2. A wide folded tier (chevron pointing up) with a depth shadow beneath.
 *   3. A narrower lower folded tier, same construction.
 *   4. A solid downward triangular tip.
 *
 * SOURCE OF TRUTH — all geometry lives in `logoGeometry.generated.ts`, which is
 * produced from `assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg` (a measured
 * reconstruction of `Logoapp.png`) by `node scripts/logo-geometry.mjs`. Nothing
 * here is hand-transcribed, so the app cannot drift from the artwork.
 * `tests/logo-geometry.test.mjs` fails if the generated file goes stale.
 *
 * Two master features are intentionally absent because react-native-svg cannot
 * render them on iOS, and both are decorative:
 *   - `filter="url(#metalShadow)"` / `url(#tileShadow)` (feDropShadow)
 *   - the `Brushed-metal-detail` group (clip-path + 116 hairlines at 8% opacity)
 * The silhouette and every face gradient are unaffected.
 */

export type SognSafeLogoVariant =
  /** Dark rounded-square tile + metallic symbol. Default. */
  | 'master'
  /** Opaque square, no corner radius - for store submission. */
  | 'fullBleed'
  /**
   * Legibility variant for tiny sizes. Scales the symbol up about the canvas
   * centre so all four elements survive at 32px instead of merging into a blob.
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

export const SognSafeLogo: React.FC<SognSafeLogoProps> = ({
  size = 1024,
  variant = 'master',
  accessibilityLabel = 'SOGN SAFE',
  testID,
  style,
}) => {
  const isMono = variant === 'monoWhite' || variant === 'monoBlack';
  const isSmall = variant === 'small';
  const hasBackground =
    variant === 'master' || variant === 'fullBleed' || variant === 'small';

  const mono = variant === 'monoBlack' ? '#000000' : '#FFFFFF';

  // useId() returns ids like "«r0»". The guillemets are not valid XML name
  // characters, and on web react-native-svg serialises to real DOM ids, so
  // url(#«r0»-leftMetal) would not resolve there. Strip to alphanumerics; the
  // trailing counter still keeps ids unique per instance.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  const id = (name: string) => `${name}-${uid}`;

  /**
   * Resolve a raw master paint value. Mono variants collapse every fill and
   * stroke to the single colour; otherwise gradient references are re-pointed
   * at this instance's ids and literals pass through untouched.
   */
  const resolvePaint = (value?: string): string | undefined => {
    if (value === undefined) return undefined;
    if (isMono) return value === 'none' ? 'none' : mono;
    const ref = /^url\(#(.+)\)$/.exec(value);
    return ref ? `url(#${id(ref[1])})` : value;
  };

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
        viewBox={MASTER_VIEWBOX}
        preserveAspectRatio="none"
        fill="none"
      >
        <Defs>
          {GRADIENTS.map((g) => (
            <LinearGradient
              key={g.id}
              id={id(g.id)}
              x1={g.x1}
              y1={g.y1}
              x2={g.x2}
              y2={g.y2}
              gradientUnits="userSpaceOnUse"
            >
              {g.stops.map((s) => (
                <Stop key={s.offset} offset={s.offset} stopColor={s.color} />
              ))}
            </LinearGradient>
          ))}
        </Defs>

        {hasBackground
          ? BACKGROUND_RECTS.map((r) => (
              <Rect
                key={r.id}
                id={r.id}
                x={r.x}
                y={r.y}
                width={r.width}
                height={r.height}
                rx={variant === 'fullBleed' ? 0 : r.rx}
                fill={resolvePaint(r.fill)}
                stroke={resolvePaint(r.stroke)}
                strokeWidth={r.strokeWidth}
              />
            ))
          : null}

        <G transform={isSmall ? SMALL_TRANSFORM : undefined}>
          {SYMBOL_LAYERS.map((layer) => (
            <Path
              key={layer.id}
              id={layer.id}
              d={layer.d}
              fill={resolvePaint(layer.fill)}
              stroke={resolvePaint(layer.stroke)}
              strokeWidth={layer.strokeWidth}
              strokeOpacity={layer.strokeOpacity}
              strokeLinejoin={layer.strokeLinejoin}
            />
          ))}
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
