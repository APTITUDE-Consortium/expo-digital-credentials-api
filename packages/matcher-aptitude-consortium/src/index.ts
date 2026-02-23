import { registerCredentials as registerCredentialsRaw } from '@animo-id/expo-digital-credentials-api'
import { loadMatcherBytes } from './matcherBytes'
import type {
  AptitudeConsortiumClaimConfig,
  AptitudeConsortiumConfig,
  AptitudeConsortiumCredentialConfig,
  AptitudeConsortiumCredentialSetOptionMode,
  AptitudeConsortiumFieldConfig,
  AptitudeConsortiumIcon,
  AptitudeConsortiumLogLevel,
  AptitudeConsortiumLocalizedLabel,
  AptitudeConsortiumLocalizedValue,
  AptitudeConsortiumOptionalCredentialSetsMode,
  AptitudeConsortiumOpenId4VpConfig,
  AptitudeConsortiumPlanOptions,
  AptitudeConsortiumTransactionDataConfig,
  AptitudeConsortiumUiLabelConfig,
  ClaimsPathPointer,
} from './schema'
import type {
  AptitudeSelectionCredential,
  AptitudeSelectionMetadata,
  DigitalCredentialsRequestWithAptitudeSelection,
} from './selection'
import { getAptitudeSelection } from './selection'

export type {
  AptitudeConsortiumClaimConfig,
  AptitudeConsortiumConfig,
  AptitudeConsortiumCredentialConfig,
  AptitudeConsortiumCredentialSetOptionMode,
  AptitudeConsortiumFieldConfig,
  AptitudeConsortiumIcon,
  AptitudeConsortiumLogLevel,
  AptitudeConsortiumLocalizedLabel,
  AptitudeConsortiumLocalizedValue,
  AptitudeConsortiumOptionalCredentialSetsMode,
  AptitudeConsortiumOpenId4VpConfig,
  AptitudeConsortiumPlanOptions,
  AptitudeConsortiumTransactionDataConfig,
  AptitudeConsortiumUiLabelConfig,
  ClaimsPathPointer,
  AptitudeSelectionCredential,
  AptitudeSelectionMetadata,
  DigitalCredentialsRequestWithAptitudeSelection,
}

export { loadMatcherBytes }
export { getAptitudeSelection }

export function encodeAptitudeConsortiumConfig(config: AptitudeConsortiumConfig): Uint8Array {
  const textEncoder = new TextEncoder()
  return textEncoder.encode(JSON.stringify(config))
}

export interface RegisterCredentialsOptions {
  /**
   * Unencoded Aptitude Consortium config.
   */
  aptitudeConsortiumConfig?: AptitudeConsortiumConfig
  /**
   * Pre-encoded registry bytes (advanced usage).
   */
  credentialsBytes?: Uint8Array
  matcherBytes?: Uint8Array
  protocol?: string
  type?: string
  registerCompatType?: boolean
}

export async function registerCredentials(options: RegisterCredentialsOptions): Promise<void> {
  const credentialsBytes =
    options.credentialsBytes ??
    (options.aptitudeConsortiumConfig ? encodeAptitudeConsortiumConfig(options.aptitudeConsortiumConfig) : null)
  if (!credentialsBytes) {
    throw new Error('Either aptitudeConsortiumConfig or credentialsBytes must be provided.')
  }
  const matcherBytes = options.matcherBytes ?? (await loadMatcherBytes())

  return registerCredentialsRaw({
    credentialBytes: credentialsBytes,
    matcherBytes,
    protocol: options.protocol ?? 'openid4vp',
    type: options.type,
    registerCompatType: options.registerCompatType,
  })
}
