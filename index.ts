import plugin from 'tailwindcss/plugin';
import { CSSRuleObject } from 'tailwindcss/types/config';

export interface FluidSizeProp {
  /**
   * The min value for the prop to use. Always in relation to the base size
   * set in the config of this plugin
   */
  min: number;

  /**
   * The max value for the prop to use. Always in relation to the base size
   * set in the config of this plugin
   */
  max: number;

  /**
   * Whether to keep the size growing after the max viewport has been reached
   * or just clamp the value to the max
   *
   * Default = false
   */
  maxKeep?: boolean;

  /**
   * Whether to keep the size shrinking after the min viewport has been reached
   * or just clamp the value to the min
   *
   * Default = false
   */
  minKeep?: boolean;
}

export interface FluidSizeProps<T extends FluidSizeProp = FluidSizeProp> {
  [key: string]: T;
}

export interface FluidSizeSpace extends FluidSizeProp {}
export interface FluidSizeFont extends FluidSizeProp {
  /**
   * Line height of the font setting. This should be fraction, since
   * we don't want to use the fluid scaling for this value. A percentage
   * is perfectly fine
   *
   * Default = none
   */
  lh?: number;
}

export interface FluidSizeOptions {
  /**
   * Custom prefix to set between the property and the value
   * For example .p-{prefix}-xs1
   *
   * Default = ''
   */
  prefix?: string;

  /**
   * The minimum view width to use for scaling
   *
   * Default = 320px
   */
  viewMin?: number;

  /**
   * The maximum view width to use for scaling
   *
   * Default = 1920px
   */
  viewMax?: number;

  /**
   * The minimum base font size to use for scaling
   *
   * Default = 12
   */
  fontMin?: number;

  /**
   * The maximum base font size to use for scaling
   *
   * Default = 16
   */
  fontMax?: number;

  /**
   * Whether to keep the size shrinking after the min viewport has
   * been reached or just clamp the value to the min
   *
   * Default = false
   */
  fontMinKeep?: boolean;

  /**
   * Whether to keep the size growing after the max viewport has
   * been reached or just clamp the value to the max
   *
   * Default = false
   */
  fontMaxKeep?: boolean;

  /**
   * Whether to keep the size shrinking after the min viewport has
   * been reached or just clamp the value to the min
   *
   * Default = false
   */
  spaceMinKeep?: boolean;

  /**
   * Whether to keep the size growing after the max viewport has
   * been reached or just clamp the value to the max
   *
   * Default = false
   */
  spaceMaxKeep?: boolean;

  /**
   * Default font size ratio definitions. You can define the font size
   * ratios here. The ratio is always a multiplicator of the base min and max
   * font size. For example a basic definition of `base` and `xs1` looks like
   * this:
   *
   * ```
   * {
   *   smol: { min: 0.625, max: 0.7, lh: 1 },
   *   base: { min: 1, max: 1, lh: 1.6 },
   * }
   * ```
   *
   * Smol will scale from (12 * 0.625)px to (16 * 0.7)px
   * You can also set lh to define the lineheight for the size
   *
   * To use it in your code just reference it like this: `text-smol` etc.
   *
   * Default = {}
   */
  fontSizes?: FluidSizeProps<FluidSizeFont>;

  /**
   * Default space size definitions (px). Similar to font sizes, you define
   * a name and min & max value. The difference is you'll use pixel values here
   * instead of multiplicators. A simple configuration could look like this:
   *
   * ```
   * {
   *   megachonk: { min: 120px, max: 320px },
   *   ultrachonk: { min: 320px, max: 520px },
   * }
   * ```
   *
   * Smol will scale from (12 * 0.625)px to (16 * 0.7)px
   * You can also set lh to define the lineheight for the size
   *
   * To use it in your code just reference it like this:
   *  - `h-megachonk`
   *  - `w-megachonk`
   *  - `p-megachonk`
   *  - `mt-megachonk`
   *  - ...
   *
   * It will extend: `margin`, `padding`, `inset`, `gap`, 'w`,
   * `h`, `max-w`, `max-h`
   *
   * Default = {}
   */
  spaceSizes?: FluidSizeProps<FluidSizeSpace>;
}

const fluidsize = (
  prop: string | string[],
  size: FluidSizeProp,
  view: { min: number, max: number },
  keep: { min: boolean, max: boolean } = { min: false, max: false },
  ng = false,
  options: CSSRuleObject = {}
) => {
  size = { ...size };

  if ( ! (prop instanceof Array)) {
    prop = [prop];
  }

  if (ng) {
    size.min *= -1;
    size.max *= -1;
  }

  const queryMin = `@media only screen and (min-width: ${view.min}px)`;
  const queryMax = `@media only screen and (min-width: ${view.max}px)`;

  prop.forEach(key => {
    options[key] = keep.min && size.minKeep !== false
      ? `${(size.min / view.min) * 100}vw`
      : `${size.min}px`;
  });

  if ( ! options.hasOwnProperty(queryMin)) {
    options[queryMin] = {};
  }

  if ( ! options.hasOwnProperty(queryMax)) {
    options[queryMax] = {};
  }

  prop.forEach(key => {
    (options[queryMin] as CSSRuleObject)[key] = `calc(`
      + `${size.min}px + (${size.max} - ${size.min}) *`
      + `(100vw - ${view.min}px) / (${view.max} - ${view.min}))`;

    (options[queryMax] as CSSRuleObject)[key] = (
      keep.max && size.maxKeep !== false
        ? `${(size.max / view.max) * 100}vw`
        : `${size.max}px`
    );
  });

  return options;
}

const cloneObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));
const utilProps: { [name: string]: { props: string[], negate?: boolean } } = {
  'p': { props: ['padding'] },
  'pt': { props: ['padding-top'] },
  'pb': { props: ['padding-bottom'] },
  'pl': { props: ['padding-left'] },
  'pr': { props: ['padding-right'] },
  'py': { props: ['padding-top', 'padding-bottom'] },
  'px': { props: ['padding-left', 'padding-right'] },
  'm': { props: ['margin'], negate: true },
  'mt': { props: ['margin-top'], negate: true },
  'mb': { props: ['margin-bottom'], negate: true },
  'ml': { props: ['margin-left'], negate: true },
  'mr': { props: ['margin-right'], negate: true },
  'my': { props: ['margin-top', 'margin-bottom'], negate: true },
  'mx': { props: ['margin-left', 'margin-right'], negate: true },
  'max-w': { props: ['max-width'] },
  'min-w': { props: ['min-width'] },
  'min-h': { props: ['min-height'] },
  'max-h': { props: ['max-height'] },
  'leading': { props: ['line-height'] },
  'tracking': { props: ['letter-spacing'], negate: true },
  'opacity': { props: ['opacity'] },
  'h': { props: ['height'] },
  'w': { props: ['width'] },
  'gap': { props: ['gap'] },
  'gap-x': { props: ['column-gap'], negate: true },
  'gap-y': { props: ['row-gap'], negate: true },
  'inset': { props: ['top', 'right', 'bottom', 'left'], negate: true },
  'inset-x': { props: ['left', 'right'], negate: true },
  'inset-y': { props: ['top', 'right'], negate: true },
  'left': { props: ['left'], negate: true },
  'right': { props: ['right'], negate: true },
  'bottom': { props: ['bottom'], negate: true },
  'top': { props: ['top'], negate: true }
};

export default () => {
  return plugin.withOptions<FluidSizeOptions>(
    ({
      prefix = '',
      fontMin = 12,
      fontMax = 16,
      viewMin = 320,
      viewMax = 1920,
      fontMinKeep = false,
      fontMaxKeep = false,
      spaceMinKeep = false,
      spaceMaxKeep = false,
      fontSizes = {},
      spaceSizes = {}
    } = {}) => ({ addUtilities, theme, e }) =>  {
      const viewSize = { min: viewMin, max: viewMax };
      const fontKeep = { min: fontMinKeep, max: fontMaxKeep };
      const spaceKeep = { min: spaceMinKeep, max: spaceMaxKeep };
      const fontSizeEntries = Object.entries(cloneObject(fontSizes));
      const spaceSizeEntries = Object.entries(cloneObject(spaceSizes));

      addUtilities([
        ...fontSizeEntries.map(([key, size]) => {
          size.min *= fontMin;
          size.max *= fontMax;

          const output = fluidsize('fontSize', size, viewSize, fontKeep);

          if (size.lh) {
            output.lineHeight = size.lh.toString();
          }

          return {
            [`.${e(`text${prefix ? `-${prefix}` : ''}-${key}`)}`]: output
          };
        }),
        ...spaceSizeEntries.map(([key, size]) => {
          const options: CSSRuleObject = {};

          for (const name in utilProps) {
            const { props, negate } = utilProps[name];
            const cls = `${e(`${name}${prefix ? `-${prefix}` : ''}-${key}`)}`;

            options[`.${cls}`] = fluidsize(props, size, viewSize, spaceKeep);

            if (negate) {
              options[`.-${cls}`] = fluidsize(
                props,
                size,
                viewSize,
                spaceKeep,
                true
              );

              // This is a fallback, since tailwind has a bug where it fails to
              // generate valid CSS code when utility classes are being used in
              // conjunction with breakpoints.
              //
              // For Example: <div class="lg:-mt-xs1"></div> would fail
              // Instead <div class="lg:neg-mt-xs1"></div> can be used
              options[`.neg-${cls}`] = fluidsize(
                props,
                size,
                viewSize,
                spaceKeep,
                true
              );
            }
          }

          return options;
        })
      ]);
    }
  )
}