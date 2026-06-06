/** Intrinsic viewBox of `public/logo.svg` and `public/logo-White.svg`. */
export const FLUVOO_LOGO_INTRINSIC_WIDTH = 178;
export const FLUVOO_LOGO_INTRINSIC_HEIGHT = 42;

/** Standard rendered logo width used across the app. */
export const FLUVOO_LOGO_DISPLAY_WIDTH = 100;

export const FLUVOO_LOGO_DISPLAY_HEIGHT = Math.round(
  (FLUVOO_LOGO_DISPLAY_WIDTH * FLUVOO_LOGO_INTRINSIC_HEIGHT) /
    FLUVOO_LOGO_INTRINSIC_WIDTH
);
