import { configYml } from './fileModels/config.yml'
import { sdk } from './sdk'
import { POSTGRES_DB, POSTGRES_PATH, POSTGRES_USER } from './utils'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withPgDump({
    imageId: 'postgres',
    dbVolume: 'db',
    mountpoint: POSTGRES_PATH,
    pgdataPath: '/data',
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: async () => {
      const password = await configYml.read((c) => c.db.password).once()
      if (!password) throw new Error('No db password found in config.yml')
      return password
    },
  }).addVolume('main'),
)
