export const uiPort = 3000
export const companionPort = 8282

export const POSTGRES_PATH = '/var/lib/postgresql' as const
export const PGDATA = `${POSTGRES_PATH}/data`
export const POSTGRES_DB = 'invidious'
export const POSTGRES_USER = 'invidious'

/** Where the `main` volume (holding config.yml) is mounted inside the Invidious container. */
export const CONFIG_MOUNTPOINT = '/data' as const
export const CONFIG_FILE = `${CONFIG_MOUNTPOINT}/config.yml`
