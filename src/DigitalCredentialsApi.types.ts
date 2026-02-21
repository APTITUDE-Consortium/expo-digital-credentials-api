
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

export interface DigitalCredentialsCreateRequest {
  /**
   * e.g. `https://digital-credentials.dev`
   */
  origin: string | null

  /**
   * e.g. `com.android.chrome`
   */
  packageName: string

  /**
   * Credential type for the request.
   */
  type: string

  /**
   * Request payload (if provided by the system).
   */
  request: {
    protocol: string
    data: unknown
  } | null
}

export interface RegisterCredentialsOptions {
  /**
   * Raw credential registry bytes to pass to the matcher.
   */
  credentialBytes: Uint8Array

  /**
   * Matcher wasm bytes to use for selection.
   */
  matcherBytes: Uint8Array

  /**
   * Protocol identifier to register against. Defaults to `openid4vp` if omitted.
   */
  protocol?: string

  /**
   * Credential type to register. Defaults to Android's Digital Credential type if omitted.
   */
  type?: string

  /**
   * Whether to register the legacy CredMan type for backwards compatibility.
   * Defaults to true.
   */
  registerCompatType?: boolean
}

export interface RegisterCreationOptionsOptions {
  /**
   * Raw creation options bytes to pass to the matcher.
   */
  creationOptions: Uint8Array

  /**
   * Matcher wasm bytes to use for issuance selection.
   */
  matcherBytes: Uint8Array

  /**
   * Credential type to register. Defaults to Android's Digital Credential type if omitted.
   */
  type?: string

  /**
   * Identifier for the creation options registration.
   *
   * Defaults to `openid4vci`.
   */
  id?: string

  /**
   * Optional intent action for creation options.
   *
   * Defaults to empty string.
   */
  intentAction?: string
}

export interface SendResponseOptions {
  response: string
}

export interface SendErrorResponseOptions {
  errorMessage: string
}

export interface SendCreateResponseOptions {
  response: string
  type?: string
  newEntryId?: string
}

export interface SendCreateErrorResponseOptions {
  errorMessage: string
}

export interface SetAllowedAppsOptions {
  /**
   * JSON payload describing allowed apps for origin verification.
   * Pass null or an empty string to clear the override and use the bundled default.
   */
  allowedAppsJson?: string | null
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
