export type ClaimsPathPointer = Array<string | number | null>

export type AptitudeConsortiumLogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace'

export interface AptitudeConsortiumOpenId4VpConfig {
  /**
   * Enable OpenID4VP handling.
   */
  enabled?: boolean
  /**
   * Allow DCQL requests.
   */
  allow_dcql?: boolean
  /**
   * Allow DCQL scope usage.
   */
  allow_dcql_scope?: boolean
  /**
   * Allow transaction data.
   */
  allow_transaction_data?: boolean
  /**
   * Allow signed requests.
   */
  allow_signed_requests?: boolean
  /**
   * Allow response_mode=jwt.
   */
  allow_response_mode_jwt?: boolean
}

export interface AptitudeConsortiumOpenId4VciConfig {
  /**
   * Enable OpenID4VCI handling.
   */
  enabled?: boolean
  /**
   * Allow direct credential offers.
   */
  allow_credential_offer?: boolean
  /**
   * Allow credential offer URI.
   */
  allow_credential_offer_uri?: boolean
  /**
   * Allow authorization_code flow.
   */
  allow_authorization_code?: boolean
  /**
   * Allow pre-authorized code flow.
   */
  allow_pre_authorized_code?: boolean
  /**
   * Allow tx_code in pre-authorized flow.
   */
  allow_tx_code?: boolean
  /**
   * Allow authorization_details.
   */
  allow_authorization_details?: boolean
  /**
   * Allow scope parameter.
   */
  allow_scope?: boolean
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
  /**
   * Schema definition for transaction data.
   */
  schema: unknown
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
   * OpenID4VCI configuration.
   */
  openid4vci?: AptitudeConsortiumOpenId4VciConfig
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
