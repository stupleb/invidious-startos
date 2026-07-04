import { FileHelper, z, utils } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { companionPort, POSTGRES_DB, POSTGRES_USER, uiPort } from '../utils'

const randomString = (len: number) =>
  utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len })

const dbSchema = z.object({
  user: z.literal(POSTGRES_USER).catch(POSTGRES_USER),
  password: z.string().catch(randomString(24)),
  host: z.literal('localhost').catch('localhost'),
  port: z.literal(5432).catch(5432),
  dbname: z.literal(POSTGRES_DB).catch(POSTGRES_DB),
})

// Invidious proxies all companion traffic itself when only private_url is
// set — no public interface for the companion is needed.
const companionUrl = `http://localhost:${companionPort}/companion` as const
const companionSchema = z.object({
  private_url: z.literal(companionUrl).catch(companionUrl),
})

const shape = z.object({
  db: dbSchema.catch(() => dbSchema.parse({})),
  // Creates/repairs the schema on startup — replaces the manual
  // init-invidious-db.sh step from the upstream docker-compose.
  check_tables: z.literal(true).catch(true),
  // Mandatory random secret for CSRF tokens and cookies.
  hmac_key: z.string().catch(randomString(32)),
  invidious_companion: z
    .array(companionSchema)
    .catch(() => [companionSchema.parse({})]),
  // Shared secret between Invidious and the companion (upstream docs
  // specify exactly 16 characters).
  invidious_companion_key: z.string().catch(randomString(16)),
  port: z.literal(uiPort).catch(uiPort),
  host_binding: z.literal('0.0.0.0').catch('0.0.0.0'),
  // StartOS serves each interface under its own hostname (.local, .onion,
  // clearnet); leave domain unset so Invidious derives URLs from the Host
  // header, and let StartOS handle TLS.
  https_only: z.literal(false).catch(false),
  registration_enabled: z.boolean().catch(true),
  login_enabled: z.boolean().catch(true),
  popular_enabled: z.boolean().catch(true),
  statistics_enabled: z.boolean().catch(false),
})

export type ConfigType = z.infer<typeof shape>

export const configYml = FileHelper.yaml(
  {
    base: sdk.volumes.main,
    subpath: 'config.yml',
  },
  shape,
)
