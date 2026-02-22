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
- `openid4vci`: OpenID4VCI feature flags
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

## Details

- `encodeAptitudeConsortiumConfig` encodes the JSON config to UTF‑8 bytes (advanced usage).
- The package does not normalize icons. If you have data URLs or Uint8Array icons, normalize them in your app.
- `registerCredentials` accepts raw bytes and loads the bundled matcher WASM.

## Types

See `src/schema.ts` for the full schema and field descriptions.
