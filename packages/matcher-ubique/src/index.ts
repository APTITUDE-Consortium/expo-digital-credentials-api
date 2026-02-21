import { registerCredentials as registerCredentialsRaw } from '@animo-id/expo-digital-credentials-api'
import { encodeCredentials, type CredentialItem, type SdJwtDcClaims, type CredentialDisplayData } from './encodeCredentials'
import { loadMatcherBytes } from './matcherBytes'
import type {
  MatcherRegistryBytes,
  MatcherRegistryJson,
  RegistryCredentialCommon,
  RegistryIconPointer,
  RegistrySdJwtPaths,
  RegistryValue,
} from './schema'

export type {
  CredentialItem,
  SdJwtDcClaims,
  CredentialDisplayData,
  MatcherRegistryBytes,
  MatcherRegistryJson,
  RegistryCredentialCommon,
  RegistryIconPointer,
  RegistrySdJwtPaths,
  RegistryValue,
}
export { encodeCredentials, loadMatcherBytes }

export interface RegisterCredentialsOptions {
  credentialBytes: Uint8Array
  matcherBytes?: Uint8Array
  protocol?: string
  type?: string
  registerCompatType?: boolean
}

export async function registerCredentials(options: RegisterCredentialsOptions): Promise<void> {
  const matcherBytes = options.matcherBytes ?? (await loadMatcherBytes())
  return registerCredentialsRaw({
    credentialBytes: options.credentialBytes,
    matcherBytes,
    protocol: options.protocol ?? 'openid4vp',
    type: options.type,
    registerCompatType: options.registerCompatType,
  })
}
