# tailwindcss-fluid-size
A Tailwind CSS plugin that provides fluid fonts and spacings

## Installation
```sh
npm install -D tailwindcss-fluid-spacing
// or
yarn add -D tailwindcss-fluid-spacing
```

And add the plugin to your `tailwind.config.js` file:
```js
// tailwind.config.js
module.exports = {
  // ...
  plugins: [
    require('tailwindcss-fluid-size'),
    // ...
  ]
};
```

## Usage
Just include the plugin and set the configuration. All settings are optional:

```js
require('tailwindcss-fluid-size')({
  prefix: '',
  fontMin: 12,
  fontMax: 16,
  viewMin: 320,
  viewMax: 1920,
  fontMinKeep: false,
  fontMaxKeep: false,
  spaceMinKeep: false,
  spaceMaxKeep: false,
  fontSizes: {
    xs1: { min: 0.625, max: 0.700, lh: 1.00 },
    sm1: { min: 0.750, max: 0.800, lh: 1.25 },
    bs1: { min: 1.000, max: 1.000, lh: 1.60 },
    xl1: { min: 1.100, max: 1.800, lh: 1.3 },
  },
  spaceSizes: {
    xs1: { min: 5, max: 20 },
    md1: { min: 10, max: 40 },
    lg1: { min: 20, max: 60 },
  }
})
```
> It will extend: `fontSizes`, `margin`, `padding`, `inset`, `gap`, `w`, `h`, `max-w`,`max-h`

In you code just use it as you would with tailwind:

```html
<h1 class="text-xl1">Big headline</h1>
<p class="text-bs1">Will be scaled</p>
<div clas="h-lg1">
  <!-- I'm just a spacer -->
</div>

<!-- Combine -->
<p class="text-bs1 p-xs1">Added scaled padding to text</p>

<!-- In case you set a prefix (fluid) -->
<p class="text-fluid-bs1">Added scaled padding to text</p>
```

## Settings
```ts
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
 * It will extend: `margin`, `padding`, `inset`, `gap`, `w`,
 * `h`, `max-w`, `max-h`
 *
 * Default = {}
 */
spaceSizes?: FluidSizeProps<FluidSizeSpace>;
```

## License
MIT