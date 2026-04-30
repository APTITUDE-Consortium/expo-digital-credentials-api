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

## OpenID4VP Tutorial

The wrapper fills OpenID4VP defaults before encoding config. Omitted config works
out of the box with all currently supported OpenID4VP/DC API features enabled.

```ts
import { registerCredentials } from "@animo-id/expo-digital-credentials-api-aptitude-consortium";

await registerCredentials({
  aptitudeConsortiumConfig: { credentials },
});
```

Use explicit support lists only when you want to disable or narrow features.
Unsupported parts make that request branch produce no match. Unknown or malformed
request parts are ignored by the matcher instead of failing the whole request.

```ts
import { registerCredentials } from "@animo-id/expo-digital-credentials-api-aptitude-consortium";

const aptitudeConsortiumConfig = {
  openid4vp: {
    enabled: true,
    supported_request_protocols: [
      "openid4vp-v1-unsigned",
      "openid4vp-v1-signed",
      "openid4vp-v1-multisigned",
    ],
    supported_response_modes: ["dc_api", "dc_api.jwt"],
    supported_response_types: ["vp_token"],
    supported_query_methods: ["dcql_query"],
    supported_request_parameters: ["transaction_data"],
  },
  dcql: {
    credential_set_option_mode: "all_satisfiable",
    optional_credential_sets_mode: "prefer_present",
  },
  credentials,
};

await registerCredentials({ aptitudeConsortiumConfig });
```

Meaning:

- `supported_request_protocols`: request transport/parsing forms you accept.
- `supported_response_modes`: OpenID4VP response modes. Use spec values:
  `dc_api` and `dc_api.jwt`.
- `supported_response_types`: response types, currently usually `vp_token`.
- `supported_query_methods`: query syntaxes, currently `dcql_query`.
- `supported_request_parameters`: optional request parameters with matcher
  behavior, such as `transaction_data`.

Keep values out of a list to disable that feature without adding app-side
branching logic.

Helpers:

- `DEFAULT_APTITUDE_CONSORTIUM_CONFIG`: default matcher config.
- `DEFAULT_APTITUDE_CONSORTIUM_OPENID4VP_CONFIG`: default OpenID4VP support.
- `withDefaultAptitudeConsortiumConfig(config)`: fills omitted defaults.
- `encodeAptitudeConsortiumConfig(config)`: fills defaults, then encodes JSON.

## Config Reference

Full config shape:

```ts
import type { AptitudeConsortiumConfig } from "@animo-id/expo-digital-credentials-api-aptitude-consortium";

const aptitudeConsortiumConfig: AptitudeConsortiumConfig = {
  default_id_prefix: "cred-",
  log_level: "debug",
  openid4vp: {
    enabled: true,
    supported_request_protocols: [
      "openid4vp-v1-unsigned",
      "openid4vp-v1-signed",
      "openid4vp-v1-multisigned",
    ],
    supported_response_modes: ["dc_api", "dc_api.jwt"],
    supported_response_types: ["vp_token"],
    supported_query_methods: ["dcql_query"],
    supported_request_parameters: ["transaction_data"],
  },
  dcql: {
    credential_set_option_mode: "all_satisfiable",
    optional_credential_sets_mode: "prefer_present",
  },
  credentials: [
    {
      id: "pid-1",
      format: "dc+sd-jwt",
      title: "PID",
      subtitle: "Issued by Utopia",
      disclaimer: "Shown before sharing",
      warning: "Shown as warning text",
      icon: "iVBORw0KGgoAAAANSUhEUgAA...",
      vcts: ["urn:eudi:pid:1"],
      holder_binding: true,
      claims: {
        family_name: "Doe",
        given_name: "Jane",
      },
      fields: [
        {
          path: ["family_name"],
          display_name: "Family Name",
          display_value: "Doe",
        },
      ],
      transaction_data_types: [
        {
          type: "urn:eudi:sca:global:payment:1",
          subtype: "credit-transfer",
          claims: [
            {
              path: ["amount"],
              display: [
                {
                  locale: "en",
                  label: "Amount",
                  description: "Payment amount",
                },
              ],
            },
          ],
          ui_labels: [
            {
              key: "payee",
              values: [{ locale: "en", value: "Payee" }],
            },
          ],
        },
      ],
      metadata: { source: "wallet" },
      protocols: ["openid4vp"],
    },
    {
      id: "mdl-1",
      format: "mso_mdoc",
      title: "Mobile Driving Licence",
      doctype: "org.iso.18013.5.1.mDL",
      claims: {
        "org.iso.18013.5.1": {
          family_name: "Doe",
          given_name: "Jane",
        },
      },
      fields: [
        {
          path: ["org.iso.18013.5.1", "family_name"],
          display_name: "Family Name",
        },
      ],
    },
  ],
};
```

Top-level config:

- `default_id_prefix`: optional prefix for generated ids
- `openid4vp`: optional OpenID4VP support. Omitted fields use defaults.
- `dcql`: optional DCQL planning options.
- `log_level`: optional matcher log level: `error`, `warn`, `info`, `debug`, or `trace`.
- `credentials`: credential entries registered with Android Credential Manager.

OpenID4VP config:

- `enabled`: enables OpenID4VP matching. Defaults to `true` in the TypeScript wrapper.
- `supported_request_protocols`: accepted request forms. Defaults to unsigned, signed, and multisigned OpenID4VP 1.0.
- `supported_response_modes`: accepted response modes. Defaults to `dc_api` and `dc_api.jwt`.
- `supported_response_types`: accepted response types. Defaults to `vp_token`.
- `supported_query_methods`: accepted query methods. Defaults to `dcql_query`.
- `supported_request_parameters`: supported optional request parameters. Defaults to `transaction_data`.
- Omit a field to keep the default. Pass an empty list to disable that capability.

DCQL options:

- `credential_set_option_mode`: `all_satisfiable` returns every satisfiable option; `first_satisfiable_only` stops at the first satisfiable option.
- `optional_credential_sets_mode`: `prefer_present`, `prefer_absent`, or `always_present_if_satisfiable`.

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
- `claims`: credential claim values used for DCQL matching
- `protocols`: supported protocols
- `transaction_data_types`: transaction data descriptors

Display field:

- `path`: claim path, with strings, numbers, or `null` wildcards.
- `display_name`: label shown to the user.
- `display_value`: optional value override shown to the user.

Transaction data type:

- `type`: transaction data type URI.
- `subtype`: optional subtype.
- `claims`: claim display metadata for transaction data fields.
- `ui_labels`: localized labels for transaction data UI keys.

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
