import {
  registerCredentials as registerCredentialsRaw,
  type AptitudeConsortiumConfig,
  type AptitudeConsortiumCredentialConfig,
  type AptitudeConsortiumFieldConfig,
  type AptitudeConsortiumLogLevel,
  type AptitudeConsortiumOpenId4VciConfig,
  type AptitudeConsortiumOpenId4VpConfig,
  type AptitudeConsortiumPlanOptions,
  type AptitudeConsortiumTransactionDataConfig,
  type ClaimsPathPointer,
} from '@animo-id/expo-digital-credentials-api'
import { loadMatcherBytes } from './matcherBytes'

export type {
  AptitudeConsortiumConfig,
  AptitudeConsortiumCredentialConfig,
  AptitudeConsortiumFieldConfig,
  AptitudeConsortiumLogLevel,
  AptitudeConsortiumOpenId4VciConfig,
  AptitudeConsortiumOpenId4VpConfig,
  AptitudeConsortiumPlanOptions,
  AptitudeConsortiumTransactionDataConfig,
  ClaimsPathPointer,
}

export { loadMatcherBytes }

export type AptitudeConsortiumIcon = Uint8Array | number[] | string

function normalizeAptitudeIcon(icon: AptitudeConsortiumIcon): string | number[] {
  if (icon instanceof Uint8Array) return Array.from(icon)

  if (typeof icon === 'string') {
    if (icon.startsWith('data:')) {
      const commaIndex = icon.indexOf(',')
      return commaIndex >= 0 ? icon.slice(commaIndex + 1) : icon
    }
    return icon
  }

  return icon
}

function normalizeAptitudeCredential(credential: AptitudeConsortiumCredentialConfig): AptitudeConsortiumCredentialConfig {
  if (!credential.icon) return credential

  return {
    ...credential,
    icon: normalizeAptitudeIcon(credential.icon as AptitudeConsortiumIcon),
  }
}

function normalizeAptitudeConsortiumConfig(
  config: AptitudeConsortiumConfig,
  debug?: boolean
): AptitudeConsortiumConfig {
  const normalized: AptitudeConsortiumConfig = {
    ...config,
  }

  if (debug && !normalized.log_level) {
    normalized.log_level = 'debug'
  }

  if (normalized.credentials) {
    normalized.credentials = normalized.credentials.map(normalizeAptitudeCredential)
  }

  return normalized
}

export function encodeAptitudeConsortiumConfig(
  config: AptitudeConsortiumConfig,
  { debug }: { debug?: boolean } = {}
): Uint8Array {
  const textEncoder = new TextEncoder()
  const normalized = normalizeAptitudeConsortiumConfig(config, debug)
  return textEncoder.encode(JSON.stringify(normalized))
}

export interface RegisterCredentialsOptions {
  aptitudeConsortiumConfig: AptitudeConsortiumConfig
  debug?: boolean
  protocol?: string
  type?: string
  registerCompatType?: boolean
}

export async function registerCredentials(options: RegisterCredentialsOptions): Promise<void> {
  const credentialBytes = encodeAptitudeConsortiumConfig(options.aptitudeConsortiumConfig, {
    debug: options.debug,
  })
  const matcherBytes = await loadMatcherBytes()

  return registerCredentialsRaw({
    credentialBytes,
    matcherBytes,
    protocol: options.protocol ?? 'openid4vp',
    type: options.type,
    registerCompatType: options.registerCompatType,
  })
}
