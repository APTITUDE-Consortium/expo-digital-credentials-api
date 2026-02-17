import type {
  RegisterCredentialsOptions,
  SendErrorResponseOptions,
  SendResponseOptions,
} from './DigitalCredentialsApi.types'
import Module from './DigitalCredentialsApiModule'
import { getEncodedAptitudeConsortiumConfigBase64, getEncodedCredentialsBase64 } from './encodeCredentials'
import { ensureAndroid } from './util'

export async function registerCredentials(options: RegisterCredentialsOptions): Promise<void> {
  ensureAndroid()
  const matcher = options.matcher ?? 'cmwallet'

  let credentialBytesBase64: string
  if (matcher === 'aptitude-consortium') {
    if (!options.aptitudeConsortiumConfig) {
      throw new Error('aptitudeConsortiumConfig is required when matcher is aptitude-consortium')
    }
    credentialBytesBase64 = getEncodedAptitudeConsortiumConfigBase64(options.aptitudeConsortiumConfig, {
      debug: options.debug,
    })
  } else {
    if (!options.credentials) {
      throw new Error('credentials are required when matcher is cmwallet or ubique')
    }
    credentialBytesBase64 = getEncodedCredentialsBase64(options.credentials, { debug: options.debug })
  }

  await Module?.registerCredentials(credentialBytesBase64, matcher)
}

export function sendResponse(options: SendResponseOptions) {
  ensureAndroid()

  Module?.sendResponse(options.response)
}

export function sendErrorResponse(options: SendErrorResponseOptions) {
  ensureAndroid()

  Module?.sendErrorResponse(options.errorMessage)
}

export function isGetCredentialActivity(): boolean {
  ensureAndroid()

  return Module?.isGetCredentialActivity() as boolean
}
