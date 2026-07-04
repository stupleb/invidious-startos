import { sdk } from '../sdk'
import { configYml } from '../fileModels/config.yml'

// Merging the empty object runs the file model's schema, whose .catch()
// defaults seed the db password, hmac_key, and companion key on first install.
export const seedFiles = sdk.setupOnInit(async (effects) => {
  await configYml.merge(effects, {})
})
