# @animo-id/expo-digital-credentials-api-aptitude-consortium

Aptitude Consortium matcher wrapper for verification.

## Minimal Usage

Minimal config example:

```ts
const config = {
  log_level: "debug",
  credentials: [
    {
      id: "pid-1",
      format: "dc+sd-jwt",
      title: "PID",
      subtitle: "Issued by Utopia",
      icon: "iVBORw0KGgoAAAANSUhEUgAA...", // base64 only
      vcts: ["urn:eudi:pid:1"],
      fields: [
        { path: ["family_name"], display_name: "Family Name" },
      ],
    },
  ],
};
```

```ts
import { registerCredentials } from "@animo-id/expo-digital-credentials-api-aptitude-consortium";

// Ensure icons are base64 strings (no data URL prefix) or number[] before encoding.
await registerCredentials({ aptitudeConsortiumConfig: config });
// Advanced: pass pre-encoded bytes
// await registerCredentials({ credentialsBytes });
```

## Config Features

Top-level config:

- `default_id_prefix`: optional prefix for generated ids
- `openid4vp`: OpenID4VP feature flags
- `dcql`: DCQL planning options
- `log_level`: matcher log level
- `credentials`: list of credential entries

`registerCredentials({ ... })` accepts:

- `aptitudeConsortiumConfig`: unencoded config
- `credentialsBytes`: optional pre-encoded bytes for advanced usage

Credential entry fields:

- `id`: optional credential id
- `format`: credential format identifier
- `title`: display title
- `subtitle`: optional subtitle
- `disclaimer`: optional disclaimer text
- `warning`: optional warning text
- `fields`: display fields (path + display name/value)
- `metadata`: optional matcher-specific metadata
- `icon`: base64 string (no data URL prefix) or number[]
- `vcts`: SD-JWT VCT list
- `doctype`: mDOC document type
- `holder_binding`: require holder binding
- `claims`: optional claims definition
- `protocols`: supported protocols
- `transaction_data_types`: transaction data descriptors

## Selection Metadata (Get Request)

When this matcher is used for OpenID4VP, the Android selection payload includes
matcher-specific metadata for each selected credential:

```ts
type AptitudeSelectionMetadata = {
  dcql_id: string
  credential_id: string
  transaction_data_indices?: number[]
  [key: string]: unknown
}
```

These values are available on `DigitalCredentialsRequest.selection.creds[].metadata`.

Empty selection entries use the `__none__` sentinel for `entryId` (optionally with a suffix).

Helper:

```ts
import {
  getAptitudeSelection,
  type AptitudeSelectionMetadata,
} from "@animo-id/expo-digital-credentials-api-aptitude-consortium";
import type { DigitalCredentialsRequest } from "@animo-id/expo-digital-credentials-api";

function handleRequest(request: DigitalCredentialsRequest) {
  const selection = getAptitudeSelection(request);
  const first = selection?.creds[0];
  const meta = first?.metadata;

  if (meta) {
    console.log(meta.dcql_id, meta.credential_id, meta.transaction_data_indices);
  }
}
```

## Handling Get Request (Paradym-Style Minimal Example)

The `request` prop is injected by the base library when the Android
`DigitalCredentialsApiActivity` launches. You register a component and receive
the parsed request object automatically.

Register the component early (e.g., `index.ts`):

```ts
import registerGetCredentialComponent from "@animo-id/expo-digital-credentials-api/register";
import { DcApiSharingScreen } from "./src/features/share/DcApiSharingScreen";

registerGetCredentialComponent(DcApiSharingScreen);
```

Consume the request and selection metadata in your screen:

```ts
import type { DigitalCredentialsRequest } from "@animo-id/expo-digital-credentials-api";
import { getAptitudeSelection } from "@animo-id/expo-digital-credentials-api-aptitude-consortium";

export function DcApiSharingScreen({ request }: { request: DigitalCredentialsRequest }) {
  const selection = getAptitudeSelection(request);
  const first = selection?.creds[0];
  const meta = first?.metadata;

  if (meta) {
    console.log(meta.dcql_id, meta.credential_id, meta.transaction_data_indices);
  }

  return null;
}
```

## Details

- `encodeAptitudeConsortiumConfig` encodes the JSON config to UTF‑8 bytes (advanced usage).
- The package does not normalize icons. If you have data URLs or Uint8Array icons, normalize them in your app.
- `registerCredentials` accepts raw bytes and loads the bundled matcher WASM.

## Types

See `src/schema.ts` for the full schema and field descriptions.
