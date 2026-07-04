export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Invidious': 0,
  'The companion is ready': 1,
  'The companion is not ready': 2,
  'Web Interface': 3,
  'The web interface is ready': 4,
  'The web interface is not ready': 5,

  // interfaces.ts
  'Web UI': 6,
  'Web interface for Invidious': 7,

  // actions/setConfig.ts
  'Configure Invidious': 8,
  'Configure settings for your Invidious instance': 9,
  'Enable Registration': 10,
  'Allow anyone who can reach your instance to create an account. Disable this if you share your instance URL publicly and want to keep accounts limited to those already registered.': 11,
  'Enable Login': 12,
  'Allow users to log in. Accounts are required for subscriptions, playlists, and watch history. Disabling this also hides registration.': 13,
  'Enable Popular Page': 14,
  'Show the "Popular" tab on the home page, listing trending videos from your subscribed instance data.': 15,
  'Enable Statistics': 16,
  'Publish anonymous usage statistics (user counts, activity) at /api/v1/stats.': 17,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
