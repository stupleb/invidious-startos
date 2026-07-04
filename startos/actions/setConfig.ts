import { configYml } from '../fileModels/config.yml'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  registration_enabled: Value.toggle({
    name: i18n('Enable Registration'),
    description: i18n(
      'Allow anyone who can reach your instance to create an account. Disable this if you share your instance URL publicly and want to keep accounts limited to those already registered.',
    ),
    default: true,
  }),
  login_enabled: Value.toggle({
    name: i18n('Enable Login'),
    description: i18n(
      'Allow users to log in. Accounts are required for subscriptions, playlists, and watch history. Disabling this also hides registration.',
    ),
    default: true,
  }),
  popular_enabled: Value.toggle({
    name: i18n('Enable Popular Page'),
    description: i18n(
      'Show the "Popular" tab on the home page, listing trending videos from your subscribed instance data.',
    ),
    default: true,
  }),
  statistics_enabled: Value.toggle({
    name: i18n('Enable Statistics'),
    description: i18n(
      'Publish anonymous usage statistics (user counts, activity) at /api/v1/stats.',
    ),
    default: false,
  }),
})

export const setConfig = sdk.Action.withInput(
  // id
  'set-config',

  // metadata
  async ({ effects }) => ({
    name: i18n('Configure Invidious'),
    description: i18n('Configure settings for your Invidious instance'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // form input specification
  inputSpec,

  // optionally pre-fill the input form
  async ({ effects }) => {
    const config = await configYml.read().once()
    return config
      ? {
          registration_enabled: config.registration_enabled,
          login_enabled: config.login_enabled,
          popular_enabled: config.popular_enabled,
          statistics_enabled: config.statistics_enabled,
        }
      : {}
  },

  // the execution function
  async ({ effects, input }) =>
    configYml.merge(effects, {
      registration_enabled: input.registration_enabled,
      login_enabled: input.login_enabled,
      popular_enabled: input.popular_enabled,
      statistics_enabled: input.statistics_enabled,
    }),
)
