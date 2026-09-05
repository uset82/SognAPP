/**
 * GENERATED FILE - DO NOT EDIT.
 *
 * Source of truth: assets/sogn-safe-icon/SOGN-SAFE-App-Icon-1024.svg
 * Regenerate with: node scripts/logo-geometry.mjs
 *
 * tests/logo-geometry.test.mjs fails if this file is out of date.
 */

export interface GradientStop {
  offset: number;
  color: string;
}

export interface GradientDef {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stops: GradientStop[];
}

export interface SymbolLayer {
  id: string;
  group: string;
  d: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  strokeLinejoin?: 'round' | 'miter' | 'bevel';
}

export interface BackgroundRect {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

/**
 * The master works in a non-origin coordinate space (content spans
 * x 184.5..1068.5, y 91..950.5).
 * Keeping the same viewBox here - rather than rebasing to "0 0 1024 1024" -
 * means every path below is byte-identical to the master, which is what makes
 * the drift check meaningful.
 */
export const MASTER_VIEWBOX = '184.5 91 884 859.5';

/** Symbol ink extent in master units, excluding decorative brushed metal. */
export const SYMBOL_BBOX = {
  "minX": 306,
  "minY": 247,
  "maxX": 943,
  "maxY": 778,
  "width": 637,
  "height": 531,
  "centerX": 624.5,
  "centerY": 512.5
};

/** How much the `small` variant scales the symbol up for tiny sizes. */
export const SMALL_SCALE = 1.22;

/** Scale the symbol up about the viewBox centre, for 32-64px renders. */
export const SMALL_TRANSFORM = 'translate(626.5 520.75) scale(1.22) translate(-626.5 -520.75)';

/** All master gradients, gradientUnits="userSpaceOnUse". */
export const GRADIENTS: GradientDef[] = [
  {
    "id": "tile",
    "x1": 626,
    "y1": 91,
    "x2": 626,
    "y2": 949,
    "stops": [
      {
        "offset": 0,
        "color": "#1C262E"
      },
      {
        "offset": 0.43,
        "color": "#0C1419"
      },
      {
        "offset": 1,
        "color": "#050A0D"
      }
    ]
  },
  {
    "id": "rim",
    "x1": 626,
    "y1": 93,
    "x2": 626,
    "y2": 947,
    "stops": [
      {
        "offset": 0,
        "color": "#52616E"
      },
      {
        "offset": 0.38,
        "color": "#293740"
      },
      {
        "offset": 1,
        "color": "#18242B"
      }
    ]
  },
  {
    "id": "leftMetal",
    "x1": 550,
    "y1": 296,
    "x2": 405,
    "y2": 535,
    "stops": [
      {
        "offset": 0,
        "color": "#FFFFFF"
      },
      {
        "offset": 0.45,
        "color": "#F2F3F3"
      },
      {
        "offset": 1,
        "color": "#C5C9CC"
      }
    ]
  },
  {
    "id": "rightMetal",
    "x1": 635,
    "y1": 253,
    "x2": 835,
    "y2": 537,
    "stops": [
      {
        "offset": 0,
        "color": "#D5D9DB"
      },
      {
        "offset": 0.38,
        "color": "#9CA4A9"
      },
      {
        "offset": 1,
        "color": "#727C83"
      }
    ]
  },
  {
    "id": "edge",
    "x1": 619,
    "y1": 440,
    "x2": 624,
    "y2": 482,
    "stops": [
      {
        "offset": 0,
        "color": "#B2B8BB"
      },
      {
        "offset": 0.38,
        "color": "#525B60"
      },
      {
        "offset": 1,
        "color": "#11181C"
      }
    ]
  },
  {
    "id": "bandLeft",
    "x1": 623,
    "y1": 518,
    "x2": 485,
    "y2": 618,
    "stops": [
      {
        "offset": 0,
        "color": "#FAFBFB"
      },
      {
        "offset": 0.55,
        "color": "#E0E3E4"
      },
      {
        "offset": 1,
        "color": "#F8F9F9"
      }
    ]
  },
  {
    "id": "bandRight",
    "x1": 626,
    "y1": 512,
    "x2": 831,
    "y2": 623,
    "stops": [
      {
        "offset": 0,
        "color": "#BEC5C9"
      },
      {
        "offset": 0.45,
        "color": "#9AA3A9"
      },
      {
        "offset": 1,
        "color": "#D6DCDF"
      }
    ]
  },
  {
    "id": "lowerLeft",
    "x1": 625,
    "y1": 602,
    "x2": 497,
    "y2": 659,
    "stops": [
      {
        "offset": 0,
        "color": "#FAFBFB"
      },
      {
        "offset": 1,
        "color": "#D8DCDD"
      }
    ]
  },
  {
    "id": "lowerRight",
    "x1": 626,
    "y1": 601,
    "x2": 794,
    "y2": 663,
    "stops": [
      {
        "offset": 0,
        "color": "#AEB7BD"
      },
      {
        "offset": 1,
        "color": "#8D999F"
      }
    ]
  },
  {
    "id": "tipLeft",
    "x1": 547,
    "y1": 700,
    "x2": 626,
    "y2": 774,
    "stops": [
      {
        "offset": 0,
        "color": "#F7F8F8"
      },
      {
        "offset": 1,
        "color": "#C5CDD1"
      }
    ]
  },
  {
    "id": "tipRight",
    "x1": 626,
    "y1": 701,
    "x2": 690,
    "y2": 766,
    "stops": [
      {
        "offset": 0,
        "color": "#7E8B93"
      },
      {
        "offset": 1,
        "color": "#A5AFB5"
      }
    ]
  }
];

/** The dark tile and its hairline inner highlight. */
export const BACKGROUND_RECTS: BackgroundRect[] = [
  {
    "id": "Charcoal-tile",
    "x": 186,
    "y": 92,
    "width": 881,
    "height": 857,
    "rx": 191,
    "fill": "url(#tile)",
    "stroke": "#03080C",
    "strokeWidth": 3
  },
  {
    "id": "Fine-edge-highlight",
    "x": 191,
    "y": 96,
    "width": 871,
    "height": 848,
    "rx": 185,
    "fill": "none",
    "stroke": "url(#rim)",
    "strokeWidth": 3
  }
];

/**
 * The symbol paths in master document order. `fill` / `stroke` hold the
 * master's raw attribute values verbatim: a gradient reference stays
 * `url(#edge)` and is resolved to a per-instance id at render time.
 */
export const SYMBOL_LAYERS: SymbolLayer[] = [
  {
    "id": "Left-panel-depth",
    "group": "Upper-panels",
    "d": "M392 458 L418 540 Q421 548 427 547 L611 479 Q618 476 617 469 L616 252 L603 462 L423 539 Z",
    "fill": "url(#edge)"
  },
  {
    "id": "Right-panel-depth",
    "group": "Upper-panels",
    "d": "M636 252 L635 470 Q634 477 642 480 L824 547 Q830 549 834 540 L857 459 L826 540 L647 462 Z",
    "fill": "url(#edge)"
  },
  {
    "id": "Left-panel-face",
    "group": "Upper-panels",
    "d": "M614 250 Q617 247 616 254 L604 462 L425 540 Q420 542 418 537 L392 459 Q390 454 394 451 Z",
    "fill": "url(#leftMetal)",
    "stroke": "#DFE4E7",
    "strokeWidth": 2,
    "strokeLinejoin": "round"
  },
  {
    "id": "Right-panel-face",
    "group": "Upper-panels",
    "d": "M638 250 Q635 247 636 255 L647 462 L825 540 Q830 542 832 536 L856 460 Q859 454 854 450 Z",
    "fill": "url(#rightMetal)",
    "stroke": "#BDC5CA",
    "strokeWidth": 2,
    "strokeLinejoin": "round"
  },
  {
    "id": "Bright-inside-bevel",
    "group": "Upper-panels",
    "d": "M614 254 L604 462 L616 471 M638 254 L647 462 L636 471",
    "fill": "none",
    "stroke": "#FFFFFF",
    "strokeWidth": 2,
    "strokeOpacity": 0.72
  },
  {
    "id": "Wide-tier-depth",
    "group": "Wide-folded-tier",
    "d": "M306 607 Q354 614 402 613 L625 568 L848 613 Q897 614 943 607 L850 605 L625 559 L401 605 Z",
    "fill": "#333D43"
  },
  {
    "id": "Wide-tier-left",
    "group": "Wide-folded-tier",
    "d": "M306 607 L625 510 L625 559 L401 607 Z",
    "fill": "url(#bandLeft)"
  },
  {
    "id": "Wide-tier-right",
    "group": "Wide-folded-tier",
    "d": "M625 510 L943 607 L850 607 L625 559 Z",
    "fill": "url(#bandRight)"
  },
  {
    "id": "Wide-tier-light",
    "group": "Wide-folded-tier",
    "d": "M306 607 L625 510 L943 607 M625 512 L625 558",
    "fill": "none",
    "stroke": "#FFFFFF",
    "strokeWidth": 2.5,
    "strokeLinejoin": "round"
  },
  {
    "id": "Wide-tier-outline",
    "group": "Wide-folded-tier",
    "d": "M306 607 L401 607 L625 559 L850 607 L943 607",
    "fill": "none",
    "stroke": "#B4BDC2",
    "strokeWidth": 1.3
  },
  {
    "id": "Lower-tier-depth",
    "group": "Lower-folded-tier",
    "d": "M411 648 Q440 667 466 666 L625 655 L787 666 Q816 664 838 648 L788 659 L625 647 L465 659 Z",
    "fill": "#343F45"
  },
  {
    "id": "Lower-tier-left",
    "group": "Lower-folded-tier",
    "d": "M411 648 L625 601 L625 649 L465 660 Q438 660 411 648 Z",
    "fill": "url(#lowerLeft)"
  },
  {
    "id": "Lower-tier-right",
    "group": "Lower-folded-tier",
    "d": "M625 601 L838 648 Q809 659 788 660 L625 649 Z",
    "fill": "url(#lowerRight)"
  },
  {
    "id": "Lower-tier-light",
    "group": "Lower-folded-tier",
    "d": "M411 648 L625 601 L838 648 M625 603 L625 649",
    "fill": "none",
    "stroke": "#FFFFFF",
    "strokeWidth": 2.5,
    "strokeLinejoin": "round"
  },
  {
    "id": "Lower-tier-outline",
    "group": "Lower-folded-tier",
    "d": "M411 648 Q438 660 465 660 L625 649 L788 660 Q812 660 838 648",
    "fill": "none",
    "stroke": "#CAD1D5",
    "strokeWidth": 1.3
  },
  {
    "id": "Tip-depth",
    "group": "Solid-triangular-tip",
    "d": "M509 703 L625 778 L741 703 L625 769 Z",
    "fill": "#3E494F"
  },
  {
    "id": "Tip-left",
    "group": "Solid-triangular-tip",
    "d": "M509 702 L625 699 L625 773 Z",
    "fill": "url(#tipLeft)"
  },
  {
    "id": "Tip-right",
    "group": "Solid-triangular-tip",
    "d": "M625 699 L741 702 L625 773 Z",
    "fill": "url(#tipRight)"
  },
  {
    "id": "Tip-light",
    "group": "Solid-triangular-tip",
    "d": "M509 702 L625 699 L741 702 M625 701 L625 772",
    "fill": "none",
    "stroke": "#EFF3F5",
    "strokeWidth": 2,
    "strokeLinejoin": "round"
  },
  {
    "id": "Tip-outline",
    "group": "Solid-triangular-tip",
    "d": "M509 702 L625 773 L741 702",
    "fill": "none",
    "stroke": "#B8C2C8",
    "strokeWidth": 1.5,
    "strokeLinejoin": "round"
  }
];
