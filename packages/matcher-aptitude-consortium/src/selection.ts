import type { DigitalCredentialsRequest, JsonObject } from '@animo-id/expo-digital-credentials-api'

/**
 * Aptitude Consortium matcher-specific metadata attached to selections.
 */
export type AptitudeSelectionMetadata = JsonObject & {
  /**
   * DCQL credential id for the selected query entry.
   */
  dcql_id: string
  /**
   * Credential id used by the matcher for the selected credential.
   */
  credential_id: string
  /**
   * Indices of transaction_data entries that this credential matched.
   */
  transaction_data_indices?: number[]
}

export type AptitudeEmptyEntryId = '__none__' | `__none__:${string}`

export type AptitudeSelectionCredential = Omit<
  NonNullable<NonNullable<DigitalCredentialsRequest['selection']>['creds']>[number],
  'metadata' | 'entryId'
> & {
  /**
   * Selected credential entry id. Empty slots use the `__none__` sentinel (optionally with a suffix).
   */
  entryId: string | AptitudeEmptyEntryId
  metadata?: AptitudeSelectionMetadata
}

export type DigitalCredentialsRequestWithAptitudeSelection = Omit<
  DigitalCredentialsRequest,
  'selection'
> & {
  selection?: Omit<NonNullable<DigitalCredentialsRequest['selection']>, 'creds'> & {
    creds: AptitudeSelectionCredential[]
  }
}

/**
 * Helper to access Aptitude Consortium matcher selection metadata with typing.
 */
export function getAptitudeSelection(
  request: DigitalCredentialsRequest
): DigitalCredentialsRequestWithAptitudeSelection['selection'] | undefined {
  if (!request.selection) return undefined

  const creds = request.selection.creds.map((cred) => {
    return { ...cred, metadata: cred.metadata as AptitudeSelectionMetadata | undefined }
  })

  return {
    ...request.selection,
    creds,
  }
}
