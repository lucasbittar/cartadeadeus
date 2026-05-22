/**
 * Site-wide configuration constants.
 *
 * These are intentionally editable values that control external integrations
 * without touching component code.
 */
export const config = {
  /**
   * X (Twitter) handle whose live timeline powers the "O que estão dizendo"
   * section. Change this to point the embedded feed at a different account.
   * No leading "@".
   */
  xHandle: 'fresnorock',

  /**
   * Official Fresno store. Currently the band's Instagram shop.
   */
  storeUrl: 'https://www.instagram.com/1999fresno/',
} as const;
