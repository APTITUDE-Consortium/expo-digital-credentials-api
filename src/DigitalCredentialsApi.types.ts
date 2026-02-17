import type { DigitalCredentialsApiMatcher } from './DigitalCredentialsApiModule'
import type { CredentialItem } from './encodeCredentials'

export interface DigitalCredentialsRequest {
  /**
   * e.g. `https://digital-credentials.dev`
   */
  origin: string

  /**
   * e.g. `com.android.chrome`
   */
  packageName: string

  request:
    | {
        requests?: never

        /**
         * List of providers that can handle the request
         *
         * @deprecated in v1.0 only `requests` should/will be used, but for interoperability
         * you should also handle the providers.
         */
        providers: Array<{
          /**
           * OpenID4VP or OpenID4VCI request
           */
          protocol: 'openid4vp' | 'openid4vci'

          /**
           * The OpenID4VP specific request as a JSON String
           */
          request: string
        }>
      }
    | {
        providers?: never

        requests: Array<{
          /**
           * OpenID4VP or OpenID4VCI request
           */
          protocol: 'openid4vp' | 'openid4vci'

          /**
           * The OpenID4VP specific request data as a JSON string
           */
          data: string
        }>
      }

  selectedEntry: {
    /**
     * The credential id as provided to the register credentials method
     */
    credentialId: string

    /**
     * The index of the provider that was selected
     */
    providerIndex: number
  }
}

export interface RegisterCredentialsOptions {
  /**
   * Credentials encoded for the CMWallet/Ubique matchers.
   *
   * When using the aptitude consortium matcher this is ignored.
   */
  credentials?: CredentialItem[]

  /**
   * The matcher to use. Avaialbe options are:
   * - `cmwallet` (default)
   * - `ubique`
   * - `aptitude-consortium`
   */
  matcher?: DigitalCredentialsApiMatcher

  /**
   * Whether to enable debug mode in the matcher.
   *
   * This is supported for the `ubique` matcher and maps to `log_level=debug` for the
   * aptitude consortium matcher when no explicit log level is provided.
   */
  debug?: boolean

  /**
   * Configuration for the aptitude consortium matcher.
   *
   * Only used when `matcher` is set to `aptitude-consortium`.
   */
  aptitudeConsortiumConfig?: AptitudeConsortiumConfig
}
export type { DigitalCredentialsApiMatcher }

export interface SendResponseOptions {
  response: string
}

export interface SendErrorResponseOptions {
  errorMessage: string
}

export type OnRequestEventPayload = {
  request: string
}

export type DigitalCredentialsApiModuleEvents = {
  onRequest: (params: OnRequestEventPayload) => void
}

export type ClaimsPathPointer = Array<string | number | null>

export type AptitudeConsortiumLogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace'

export interface AptitudeConsortiumOpenId4VpConfig {
  enabled?: boolean
  allow_dcql?: boolean
  allow_dcql_scope?: boolean
  allow_transaction_data?: boolean
  allow_signed_requests?: boolean
  allow_response_mode_jwt?: boolean
}

export interface AptitudeConsortiumOpenId4VciConfig {
  enabled?: boolean
  allow_credential_offer?: boolean
  allow_credential_offer_uri?: boolean
  allow_authorization_code?: boolean
  allow_pre_authorized_code?: boolean
  allow_tx_code?: boolean
  allow_authorization_details?: boolean
  allow_scope?: boolean
}

export type AptitudeConsortiumCredentialSetOptionMode = 'all_satisfiable' | 'first_satisfiable_only'

export type AptitudeConsortiumOptionalCredentialSetsMode =
  | 'prefer_present'
  | 'prefer_absent'
  | 'always_present_if_satisfiable'

export interface AptitudeConsortiumPlanOptions {
  credential_set_option_mode?: AptitudeConsortiumCredentialSetOptionMode
  optional_credential_sets_mode?: AptitudeConsortiumOptionalCredentialSetsMode
}

export interface AptitudeConsortiumLocalizedLabel {
  locale: string
  label: string
  description?: string
}

export interface AptitudeConsortiumClaimConfig {
  path: ClaimsPathPointer
  display?: AptitudeConsortiumLocalizedLabel[]
}

export interface AptitudeConsortiumLocalizedValue {
  locale: string
  value: string
}

export interface AptitudeConsortiumUiLabelConfig {
  key: string
  values?: AptitudeConsortiumLocalizedValue[]
}

export interface AptitudeConsortiumTransactionDataConfig {
  type: string
  subtype?: string
  claims?: AptitudeConsortiumClaimConfig[]
  ui_labels?: AptitudeConsortiumUiLabelConfig[]
  schema: unknown
}

export type AptitudeConsortiumIcon = Uint8Array | number[] | string

export interface AptitudeConsortiumFieldConfig {
  path: ClaimsPathPointer
  display_name: string
  display_value?: string
}

export interface AptitudeConsortiumCredentialConfig {
  id?: string
  format: string
  title?: string
  subtitle?: string
  disclaimer?: string
  warning?: string
  fields?: AptitudeConsortiumFieldConfig[]
  metadata?: unknown
  icon?: AptitudeConsortiumIcon
  vcts?: string[]
  doctype?: string
  holder_binding?: boolean
  claims?: unknown
  protocols?: string[]
  transaction_data_types?: AptitudeConsortiumTransactionDataConfig[]
}

export interface AptitudeConsortiumConfig {
  default_id_prefix?: string
  openid4vp?: AptitudeConsortiumOpenId4VpConfig
  openid4vci?: AptitudeConsortiumOpenId4VciConfig
  dcql?: AptitudeConsortiumPlanOptions
  log_level?: AptitudeConsortiumLogLevel
  credentials?: AptitudeConsortiumCredentialConfig[]
}
