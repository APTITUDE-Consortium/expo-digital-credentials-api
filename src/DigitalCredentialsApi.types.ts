
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

  /**
   * Legacy selection info derived from selectedEntryId. Prefer `selection` when available.
   */
  selectedEntry?: {
    /**
     * The credential id as provided to the register credentials method
     */
    credentialId: string

    /**
     * The index of the provider/request that was selected
     */
    providerIndex: number
  }

  /**
   * Detailed selection info (supports multiple credential selections).
   */
  selection?: {
    /**
     * Index of the request/provider that was selected.
     */
    requestIdx: number

    creds: Array<{
      /**
       * Credential entry id chosen by the matcher/provider.
       */
      entryId: string

      /**
       * DCQL credential id, if provided by the matcher.
       */
      dcqlId?: string

      /**
       * Selected claim paths (DCQL), if provided by the matcher.
       */
      matchedClaimPaths?: Array<Array<string | number | null>>
    }>
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
    /**
     * Protocol identifier for the create request.
     */
    protocol: string

    /**
     * Protocol-specific payload (raw JSON).
     */
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
  /**
   * Serialized response to return to the requesting app.
   */
  response: string
}

export interface SendErrorResponseOptions {
  /**
   * Error message to return to the requesting app.
   */
  errorMessage: string
}

export interface SendCreateResponseOptions {
  /**
   * Serialized create response to return to the requesting app.
   */
  response: string

  /**
   * Optional credential type for the response.
   */
  type?: string

  /**
   * Optional entry id of the newly created credential.
   */
  newEntryId?: string
}

export interface SendCreateErrorResponseOptions {
  /**
   * Error message to return to the requesting app.
   */
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
  /**
   * Raw JSON request payload as a string.
   */
  request: string
}

export type DigitalCredentialsApiModuleEvents = {
  /**
   * Fired when a request is received (not currently emitted by the native module).
   */
  onRequest: (params: OnRequestEventPayload) => void
}
