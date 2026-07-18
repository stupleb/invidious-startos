import { configYml } from './fileModels/config.yml'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  companionPort,
  CONFIG_FILE,
  CONFIG_MOUNTPOINT,
  PGDATA,
  POSTGRES_DB,
  POSTGRES_PATH,
  POSTGRES_USER,
  uiPort,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Invidious'))

  // restart on config changes
  const config = await configYml.read().const(effects)
  if (!config) throw new Error('config.yml not found')

  const postgresSub = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'db',
      subpath: null,
      mountpoint: POSTGRES_PATH,
      readonly: false,
    }),
    'postgres',
  )

  // The companion keeps only a disposable player cache on disk
  // (/var/tmp/youtubei.js), so it gets no persistent volume.
  const companionSub = sdk.SubContainer.of(
    effects,
    { imageId: 'companion' },
    null,
    'companion',
  )

  const invidiousSub = sdk.SubContainer.of(
    effects,
    { imageId: 'invidious' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'main',
      subpath: null,
      mountpoint: CONFIG_MOUNTPOINT,
      readonly: false,
    }),
    'invidious',
  )

  return sdk.Daemons.of(effects)
    .addDaemon('postgres', {
      subcontainer: postgresSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          POSTGRES_DB,
          POSTGRES_USER,
          POSTGRES_PASSWORD: config.db.password,
          PGDATA,
        },
      },
      ready: {
        display: null,
        fn: async () => {
          const { exitCode } = await postgresSub.exec([
            'pg_isready',
            '-U',
            POSTGRES_USER,
            '-h',
            'localhost',
          ])
          if (exitCode !== 0) {
            return { result: 'loading', message: null }
          }
          return { result: 'success', message: null }
        },
      },
      requires: [],
    })
    .addDaemon('companion', {
      subcontainer: companionSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          SERVER_SECRET_KEY: config.invidious_companion_key,
        },
      },
      ready: {
        display: null,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, companionPort, {
            successMessage: i18n('The companion is ready'),
            errorMessage: i18n('The companion is not ready'),
          }),
      },
      requires: [],
    })
    .addDaemon('invidious', {
      subcontainer: invidiousSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          INVIDIOUS_CONFIG_FILE: CONFIG_FILE,
        },
      },
      ready: {
        display: i18n('Web Interface'),
        gracePeriod: 20000,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The web interface is ready'),
            errorMessage: i18n('The web interface is not ready'),
          }),
      },
      requires: ['postgres', 'companion'],
    })
})
