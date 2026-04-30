export type ClaimsPathPointer = Array<string | number | null>

export type AptitudeConsortiumLogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace'

export type AptitudeConsortiumOpenId4VpRequestProtocol =
  | 'openid4vp-v1-unsigned'
  | 'openid4vp-v1-signed'
  | 'openid4vp-v1-multisigned'
  | (string & {})

export type AptitudeConsortiumOpenId4VpResponseMode = 'dc_api' | 'dc_api.jwt' | (string & {})

export type AptitudeConsortiumOpenId4VpResponseType = 'vp_token' | (string & {})

export type AptitudeConsortiumOpenId4VpQueryMethod = 'dcql_query' | (string & {})

export type AptitudeConsortiumOpenId4VpRequestParameter = 'transaction_data' | (string & {})

export interface AptitudeConsortiumOpenId4VpConfig {
  /**
   * Enable OpenID4VP handling.
   */
  enabled?: boolean
  /**
   * DC API protocol variants the matcher should accept.
   */
  supported_request_protocols?: AptitudeConsortiumOpenId4VpRequestProtocol[]
  /**
   * OpenID4VP response modes the matcher should accept.
   */
  supported_response_modes?: AptitudeConsortiumOpenId4VpResponseMode[]
  /**
   * OpenID4VP response types the matcher should accept when present.
   */
  supported_response_types?: AptitudeConsortiumOpenId4VpResponseType[]
  /**
   * Query mechanisms the matcher should accept.
   */
  supported_query_methods?: AptitudeConsortiumOpenId4VpQueryMethod[]
  /**
   * Extra request parameters the matcher should process.
   */
  supported_request_parameters?: AptitudeConsortiumOpenId4VpRequestParameter[]
}

export type AptitudeConsortiumCredentialSetOptionMode = 'all_satisfiable' | 'first_satisfiable_only'

export type AptitudeConsortiumOptionalCredentialSetsMode =
  | 'prefer_present'
  | 'prefer_absent'
  | 'always_present_if_satisfiable'

export interface AptitudeConsortiumPlanOptions {
  /**
   * How to choose between credential set options.
   */
  credential_set_option_mode?: AptitudeConsortiumCredentialSetOptionMode
  /**
   * How to handle optional credential sets.
   */
  optional_credential_sets_mode?: AptitudeConsortiumOptionalCredentialSetsMode
}

export interface AptitudeConsortiumLocalizedLabel {
  /**
   * Locale for the label (BCP-47).
   */
  locale: string
  /**
   * Label text.
   */
  label: string
  /**
   * Optional description text.
   */
  description?: string
}

export interface AptitudeConsortiumClaimConfig {
  /**
   * Claim path pointer for this claim.
   */
  path: ClaimsPathPointer
  /**
   * Localized display labels for this claim.
   */
  display?: AptitudeConsortiumLocalizedLabel[]
}

export interface AptitudeConsortiumLocalizedValue {
  /**
   * Locale for the value (BCP-47).
   */
  locale: string
  /**
   * Value text.
   */
  value: string
}

export interface AptitudeConsortiumUiLabelConfig {
  /**
   * Label key identifier.
   */
  key: string
  /**
   * Localized values for the key.
   */
  values?: AptitudeConsortiumLocalizedValue[]
}

export interface AptitudeConsortiumTransactionDataConfig {
  /**
   * Transaction data type.
   */
  type: string
  /**
   * Optional transaction data subtype.
   */
  subtype?: string
  /**
   * Claims included in transaction data.
   */
  claims?: AptitudeConsortiumClaimConfig[]
  /**
   * UI label mappings for transaction data.
   */
  ui_labels?: AptitudeConsortiumUiLabelConfig[]
}

export type AptitudeConsortiumIcon = string | number[]

export interface AptitudeConsortiumFieldConfig {
  /**
   * Claim path pointer for this field.
   */
  path: ClaimsPathPointer
  /**
   * Display label for the field.
   */
  display_name: string
  /**
   * Optional display value override.
   */
  display_value?: string
}

export interface AptitudeConsortiumCredentialConfig {
  /**
   * Optional credential id.
   */
  id?: string
  /**
   * Credential format identifier.
   */
  format: string
  /**
   * Display title.
   */
  title?: string
  /**
   * Display subtitle.
   */
  subtitle?: string
  /**
   * Optional disclaimer text.
   */
  disclaimer?: string
  /**
   * Optional warning text.
   */
  warning?: string
  /**
   * Display field definitions.
   */
  fields?: AptitudeConsortiumFieldConfig[]
  /**
   * Optional matcher-specific metadata.
   */
  metadata?: unknown
  /**
   * Icon bytes (base64 string without data URL prefix) or raw number array.
   */
  icon?: AptitudeConsortiumIcon
  /**
   * Accepted VCTs for SD-JWT credentials.
   */
  vcts?: string[]
  /**
   * Document type for mDOC credentials.
   */
  doctype?: string
  /**
   * Whether holder binding is required.
   */
  holder_binding?: boolean
  /**
   * Optional claims definition.
   */
  claims?: unknown
  /**
   * Supported protocols for this credential.
   */
  protocols?: string[]
  /**
   * Transaction data types supported by this credential.
   */
  transaction_data_types?: AptitudeConsortiumTransactionDataConfig[]
}

export interface AptitudeConsortiumConfig {
  /**
   * Default id prefix for generated credential ids.
   */
  default_id_prefix?: string
  /**
   * OpenID4VP configuration.
   */
  openid4vp?: AptitudeConsortiumOpenId4VpConfig
  /**
   * DCQL planning options.
   */
  dcql?: AptitudeConsortiumPlanOptions
  /**
   * Matcher log level.
   */
  log_level?: AptitudeConsortiumLogLevel
  /**
   * Credential registry entries.
   */
  credentials?: AptitudeConsortiumCredentialConfig[]
}
