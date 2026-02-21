<p align="center">
  <picture>
   <source media="(prefers-color-scheme: light)" srcset="https://res.cloudinary.com/animo-solutions/image/upload/v1656578320/animo-logo-light-no-text_ok9auy.svg">
   <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/animo-solutions/image/upload/v1656578320/animo-logo-dark-no-text_fqqdq9.svg">
   <img alt="Animo Logo" height="200px" />
  </picture>
</p>

<h1 align="center" ><b>Expo - Digital Credentials API</b></h1>

<h4 align="center">Powered by &nbsp; 
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://res.cloudinary.com/animo-solutions/image/upload/v1656579715/animo-logo-light-text_cma2yo.svg">
    <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/animo-solutions/image/upload/v1656579715/animo-logo-dark-text_uccvqa.svg">
    <img alt="Animo Logo" height="12px" />
  </picture>
</h4><br>

<p align="center">
  <a href="https://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@animo-id/expo-digital-credentials-api">
    <img src="https://img.shields.io/npm/v/@animo-id/expo-digital-credentials-api" />
  </a>
  <a
    href="https://raw.githubusercontent.com/animo/expo-digital-credentials-api/main/LICENSE"
    ><img
      alt="License"
      src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"
  /></a>
</p>

<p align="center">
  <a href="#getting-started">Getting Started</a> 
  &nbsp;|&nbsp;
  <a href="#usage">Usage</a> 
  &nbsp;|&nbsp;
  <a href="#contributing">Contributing</a> 
  &nbsp;|&nbsp;
  <a href="#contributing">License</a> 
</p>

---

An [Expo Module](https://docs.expo.dev/modules/overview/) to automatically set up and configure [Digital Credentials API](https://digitalcredentials.dev) for Android in Expo apps.

- Matcher WASM binaries are shipped inside the matcher wrapper packages and loaded at runtime; the base package only accepts raw matcher bytes.
- During development when the activity is launched and the application is already running this results in render errors. In production these errors won't occur, but it does hinder the development experience. We're still looking for a solution.
- This library is tested with Expo 52 and React Native 0.76. It uses some hacks to use Kotlin 2.0.21, and is likely to break in non-default application setups. React Native 77 will use Kotlin 2 by default, and these hacks shouldn't be needed anymore.
- When using the CMWallet matcher, icons provided for credentials are not rendered.

> [!NOTE]  
> This library integrates with experimental Android APIs, as well as draft versions of several specifications. Expect all APIs to break in future releases.

<p align="center">
  <img style="margin: 5px;" src="./assets/request.png" width="200px">
  <img style="margin: 5px;" src="./assets/overlay.png" width="200px">
</p>

## Getting Started

Install the module using the following command.

```sh
# yarn
yarn add @animo-id/expo-digital-credentials-api

# npm
npm install @animo-id/expo-digital-credentials-api

# npm
pnpm install @animo-id/expo-digital-credentials-api
```

Then prebuild the application so the Expo Module wrapper can be added as native dependency (If you aren't making any manual modification to the Android directories you can add them to the gitignore of your project and generate them on demand):

```sh
# yarn
yarn expo prebuild

# npm
npx expo prebuild
```

That's it, you now have the Digital Credentials API configured for your Android project.

> [!WARNING]  
> You might need to set the Kotlin version of your project to 2.0.21. To do this, add the [`expo-build-properties`](https://docs.expo.dev/versions/latest/sdk/build-properties/) dependency to your project, and configure it with `android.kotlinVersion` set to `'2.0.21'`.
>
> ```json
> [
>   "expo-build-properties",
>   {
>     "android": {
>       "kotlinVersion": "2.0.21"
>     }
>   }
> ]
> ```

## Usage

The base package (`@animo-id/expo-digital-credentials-api`) exposes low-level APIs that accept raw bytes and matcher WASM bytes. For object-based configuration (including runtime loading of matcher WASM), use the matcher packages:

- `@animo-id/expo-digital-credentials-api-cmwallet`
- `@animo-id/expo-digital-credentials-api-cmwallet-issuance`
- `@animo-id/expo-digital-credentials-api-ubique`
- `@animo-id/expo-digital-credentials-api-aptitude-consortium`

If you call the base API directly, you must supply `matcherBytes` as a `Uint8Array`. The matcher packages expose `loadMatcherBytes()` helpers to load the bundled WASM at runtime.
Use `@animo-id/expo-digital-credentials-api-cmwallet` for verification and `@animo-id/expo-digital-credentials-api-cmwallet-issuance` for OpenID4VCI creation options.

If you use a custom Metro config, ensure `wasm` is included in `resolver.assetExts` so the bundled matcher assets are packaged correctly.

### Allowed Apps (Origin Verification)

The native module uses a JSON allowlist to map calling app signatures to verified origins. By default it uses the bundled `allowedApps.json`, but you can override it at runtime:

```ts
import { setAllowedApps } from "@animo-id/expo-digital-credentials-api";

setAllowedApps({
  allowedAppsJson: JSON.stringify({
    apps: [
      {
        type: "android",
        info: {
          package_name: "com.example.browser",
          signatures: [
            {
              build: "release",
              cert_fingerprint_sha256: "AA:BB:CC:...",
            },
          ],
        },
      },
    ],
  }),
});
```

Pass `null` or an empty string to clear the override and fall back to the bundled list.

### Registering Credentials

To make Android aware of the credentials available in your wallet, you need to register the credentials. Every time the credentials in your application changes, you should call this method again.

Choose the matcher package that fits your needs. Registering credentials for a matcher overrides the previous registration for that matcher. The supported matchers are:

- CMWallet matcher taken from https://github.com/digitalcredentialsdev/CMWallet. ([current version](https://github.com/digitalcredentialsdev/CMWallet/blob/f4aa9ebbeaf55fa3973b467701887464be3d4b51/app/src/main/assets/openid4vp.wasm))
  - Supports SD-JWT VC and mDOC
  - Supports signed requests
  - Does not support icons
  - Does not support showing claim values
- Ubique matcher taken from https://github.com/UbiqueInnovkation/oid4vp-wasm-matcher. ([current version](https://github.com/UbiqueInnovation/oid4vp-wasm-matcher/releases/tag/v0.1.0)).
  - Supports SD-JWT VC and mDOC
  - Supports signed requests
  - Supports icons
  - Supports showing claim values

```tsx
import { encodeCredentials, registerCredentials } from "@animo-id/expo-digital-credentials-api-cmwallet";

// Build credentialBytes from the matcher schema
const credentialBytes = encodeCredentials(credentials, { debug: true });
await registerCredentials({
  credentialBytes,
});
```

### Registering Creation Options (OpenID4VCI)

To allow OpenID4VCI issuance, register creation options with the CMWallet issuance matcher:

```tsx
import { encodeIssuanceCreationOptions, registerCreationOptions } from "@animo-id/expo-digital-credentials-api-cmwallet-issuance";

// Build creationOptions bytes from the matcher schema
const creationOptions = encodeIssuanceCreationOptions({
  display: {
    title: "My Wallet",
    subtitle: "Save your document",
    iconDataUrl: "data:image/png;base64,...",
  },
  issuerAllowlist: ["https://issuer.example"],
});
await registerCreationOptions({
  creationOptions,
});
```

### Request Payloads

#### Get Credential Request (JS)

```ts
type DigitalCredentialsRequest = {
  // Web origin (for browsers) or null if unavailable
  origin: string
  // Calling app package name (e.g., com.android.chrome)
  packageName: string
  // Raw request JSON from the system (either `providers` or `requests`)
  request:
    | {
        providers: Array<{
          protocol: "openid4vp" | "openid4vci"
          request: string
        }>
        requests?: never
      }
    | {
        requests: Array<{
          protocol: "openid4vp" | "openid4vci"
          data: string
        }>
        providers?: never
      }

  /**
   * Legacy selection info derived from selectedEntryId.
   * Prefer `selection` when present.
   */
  selectedEntry?: {
    providerIndex: number
    credentialId: string
  }

  /**
   * Detailed selection (supports multi‑credential selection).
   * Mirrors the CMWallet selection semantics.
   */
  selection?: {
    requestIdx: number
    creds: Array<{
      entryId: string
      dcqlId?: string
      matchedClaimPaths?: Array<Array<string | number | null>>
    }>
  }
}
```

Notes:
- `selection` is populated from `selectedCredentialSet` when available, and falls back to `selectedEntryId`.
- `matchedClaimPaths` are matcher-provided claim path pointers (DCQL), if present in metadata.

#### Create Credential Request (JS)

```ts
type DigitalCredentialsCreateRequest = {
  origin: string | null
  packageName: string
  type: string
  // Raw request JSON from the system, if provided
  request: object | null
}
```

### Matcher Registry Encodings

#### CMWallet / Ubique matcher registry

Binary layout:
- 4-byte little‑endian JSON offset
- concatenated icon bytes (may be empty)
- UTF‑8 JSON payload

JSON shape:
```ts
type MatcherRegistryJson = {
  // Only supported in the Ubique matcher
  debug?: boolean
  credentials: {
    mso_mdoc: Record<
      string,
      Array<{
        id: string
        title: string
        subtitle?: string
        icon?: { start: number; length: number } | null
        paths: Record<
          string,
          Record<string, { value?: string | number | boolean; display: string }>
        >
      }>
    >
    "dc+sd-jwt": Record<
      string,
      Array<{
        id: string
        title: string
        subtitle?: string
        icon?: { start: number; length: number } | null
        paths: Record<
          string,
          { value?: string | number | boolean; display: string } | MatcherRegistryJson["credentials"]["dc+sd-jwt"][string][number]["paths"]
        >
      }>
    >
  }
}
```

#### CMWallet Issuance (OpenID4VCI) creation options

Binary layout:
- 4-byte little‑endian JSON offset
- icon bytes (may be empty)
- UTF‑8 JSON payload

JSON shape:
```ts
type IssuanceCreationOptionsJson = {
  display: {
    title: string
    subtitle?: string
    icon?: { start: number; length: number } | null
  }
  capabilities?: Record<string, Record<string, never>>
}
```

#### Aptitude Consortium matcher

JSON payload (UTF‑8), no binary header:
```ts
type AptitudeConsortiumConfig = {
  default_id_prefix?: string
  openid4vp?: { /* ... */ }
  openid4vci?: { /* ... */ }
  dcql?: { /* ... */ }
  log_level?: "error" | "warn" | "info" | "debug" | "trace"
  credentials?: Array<{
    id?: string
    format: string
    title?: string
    subtitle?: string
    disclaimer?: string
    warning?: string
    fields?: Array<{ path: Array<string | number | null>; display_name: string; display_value?: string }>
    metadata?: unknown
    icon?: string | number[]
    vcts?: string[]
    doctype?: string
    holder_binding?: boolean
    claims?: unknown
    protocols?: string[]
    transaction_data_types?: Array<{
      type: string
      subtype?: string
      claims?: Array<{ path: Array<string | number | null>; display?: Array<{ locale: string; label: string; description?: string }> }>
      ui_labels?: Array<{ key: string; values?: Array<{ locale: string; value: string }> }>
      schema: unknown
    }>
  }>
}
```

Notes:
- `icon` must be a base64 string (no data URL prefix) or a `number[]`. If your source is a data URL or `Uint8Array`, normalize it in your app before encoding.

### Handling Credential Request

When the user has selected a credential from your application, the application will be launched with an intent to retrieve the credentials. A custom component will be used and rendered as an overlay.

<img src="./assets/overlay.png" width="200px">

#### Registering the component

You should register the component as early as possible, usually in your `index.ts` file. If you're using Expo Router, [follow these steps](https://docs.expo.dev/router/installation/#custom-entry-point-to-initialize-and-load) to setup a custom entry point.

The component will be rendered in a full screen window, but with a transparent background. This allows you to render an overlay rather than a full screen application. By default all screen content that you do not render something over, has an `onPress` handler and will abort the request. You can disable this by setting `cancelOnPressBackground` to `false`.

```tsx
import { registerRootComponent } from "expo";

import App from "./App";
import { MyCustomComponent } from "./MyCustomComponent";

// import the component registration method
// make sure to import this from the /register path
// so it doesn't load the native module yet, as that will prevent the app from correctly loading
import registerGetCredentialComponent, {
  registerCreateCredentialComponent,
} from "@animo-id/expo-digital-credentials-api/register";

// Registers the componetn to be used for sharing credentials
registerGetCredentialComponent(MyCustomComponent);
registerCreateCredentialComponent(MyCreateComponent);

// Default expo method call
registerRootComponent(App);
```

#### Handling the request

The request is passed to the registered component as `request` and has type `DigitalCredentialsRequest`.

```tsx
import {
  type DigitalCredentialsRequest,
  sendErrorResponse,
  sendResponse,
} from "@animo-id/expo-digital-credentials-api";
import { Button } from "react-native";
import { Text, View } from "react-native";

export function MyCustomComponent({
  request,
}: {
  request: DigitalCredentialsRequest;
}) {
  return (
    <View style={{ width: "100%" }}>
      <Button
        title="Send Response"
        onPress={() =>
          sendResponse({ response: JSON.stringify({ vp_token: "something" }) })
        }
      />
      <Button
        title="Send Error Response"
        onPress={() =>
          sendErrorResponse({ errorMessage: "Send error response" })
        }
      />
    </View>
  );
}
```

#### Handling Create Credential Request (OpenID4VCI)

The create-credential request is passed to the registered component as `request` with type `DigitalCredentialsCreateRequest`:

```tsx
import {
  type DigitalCredentialsCreateRequest,
  sendCreateErrorResponse,
  sendCreateResponse,
} from "@animo-id/expo-digital-credentials-api";

export function MyCreateComponent({
  request,
}: {
  request: DigitalCredentialsCreateRequest;
}) {
  return (
    <View style={{ width: "100%" }}>
      <Button
        title="Send Create Response"
        onPress={() =>
          sendCreateResponse({
            response: JSON.stringify({ protocol: "openid4vci", data: {} }),
          })
        }
      />
      <Button
        title="Send Create Error Response"
        onPress={() =>
          sendCreateErrorResponse({ errorMessage: "Send error response" })
        }
      />
    </View>
  );
}
```

#### Note on Expo Router

If you're using Expo Router, the root application is automatically loaded and executed, even if a custom activity is launched in React Native, and thus your main application logic will be executed (although not visible).

To prevent this from happening, you can create a small wrapper that returns `null` when the current activity is the get credential activity using the `isGetCredentialActivity` method. Make sure to only call this method once your app component is loaded, to prevent the app loading to get stuck.

```ts
import { isGetCredentialActivity } from "@animo-id/expo-digital-credentials-api";

export default function App() {
  const isDcApi = useMemo(() => isGetCredentialActivity(), []);
  if (isDcApi) return null;

  return <MainApp />;
}
```

## Contributing

Is there something you'd like to fix or add? Great, we love community contributions! To get involved, please follow our [contribution guidelines](https://github.com/animo/.github/blob/main/CONTRIBUTING.md).

## License

This repository is licensed under the [Apache 2.0](./LICENSE) license.
