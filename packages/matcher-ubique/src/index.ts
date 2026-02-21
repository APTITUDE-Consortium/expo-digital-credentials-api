import { registerCredentials as registerCredentialsRaw } from '@animo-id/expo-digital-credentials-api'
import { encodeCredentials, type CredentialItem, type SdJwtDcClaims, type CredentialDisplayData } from './encodeCredentials'
import { loadMatcherBytes } from './matcherBytes'

export type { CredentialItem, SdJwtDcClaims, CredentialDisplayData }
export { encodeCredentials, loadMatcherBytes }

export interface RegisterCredentialsOptions {
  credentials: CredentialItem[]
  debug?: boolean
  protocol?: string
  type?: string
  registerCompatType?: boolean
}

export async function registerCredentials(options: RegisterCredentialsOptions): Promise<void> {
  const credentialBytes = encodeCredentials(options.credentials, { debug: options.debug })
  const matcherBytes = await loadMatcherBytes()
  return registerCredentialsRaw({
    credentialBytes,
    matcherBytes,
    protocol: options.protocol ?? 'openid4vp',
    type: options.type,
    registerCompatType: options.registerCompatType,
  })
}
