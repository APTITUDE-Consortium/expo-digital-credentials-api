import { registerCreationOptions as registerCreationOptionsRaw } from '@animo-id/expo-digital-credentials-api'
import type { RegisterCreationOptionsOptions as RegisterCreationOptionsRawOptions } from '@animo-id/expo-digital-credentials-api'
import {
  encodeIssuanceCreationOptions,
  type IssuanceDisplayData,
  type IssuanceRegistryOptions,
} from './encodeIssuance'
import { loadMatcherBytes } from './matcherBytes'

export type { IssuanceDisplayData, IssuanceRegistryOptions }
export { encodeIssuanceCreationOptions, loadMatcherBytes }

export interface RegisterCreationOptionsOptions extends IssuanceRegistryOptions {
  type?: string
  id?: string
  intentAction?: string
}

export async function registerCreationOptions(options: RegisterCreationOptionsOptions): Promise<void> {
  const creationOptions = encodeIssuanceCreationOptions({
    display: options.display,
    issuerAllowlist: options.issuerAllowlist,
  })
  const matcherBytes = await loadMatcherBytes()

  return registerCreationOptionsRaw({
    creationOptions,
    matcherBytes,
    type: options.type,
    id: options.id ?? 'openid4vci',
    intentAction: options.intentAction ?? '',
  } satisfies RegisterCreationOptionsRawOptions)
}
