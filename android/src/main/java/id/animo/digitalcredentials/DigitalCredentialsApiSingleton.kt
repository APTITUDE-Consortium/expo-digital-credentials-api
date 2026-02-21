package id.animo.digitalcredentials

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.service.credentials.CredentialProviderService
import android.util.Log
import androidx.credentials.CreateCredentialRequest
import androidx.credentials.CreateCustomCredentialResponse
import androidx.credentials.DigitalCredential
import androidx.credentials.ExperimentalDigitalCredentialApi
import androidx.credentials.GetCredentialResponse
import androidx.credentials.GetDigitalCredentialOption
import androidx.credentials.exceptions.CreateCredentialUnknownException
import androidx.credentials.exceptions.GetCredentialUnknownException
import androidx.credentials.provider.CallingAppInfo
import androidx.credentials.provider.PendingIntentHandler
import androidx.credentials.provider.ProviderCreateCredentialRequest
import androidx.credentials.registry.provider.RegisterCreationOptionsRequest
import androidx.credentials.registry.provider.RegisterCredentialsRequest
import androidx.credentials.registry.provider.RegistryManager
import androidx.credentials.registry.provider.selectedEntryId
import expo.modules.core.interfaces.SingletonModule
import java.io.ByteArrayInputStream
import java.util.zip.GZIPInputStream
import org.json.JSONObject

private const val PROTOCOL_OPENID4VP = "openid4vp"
private const val ALLOWED_APPS_PREFS = "digital_credentials_api"
private const val ALLOWED_APPS_KEY = "allowed_apps_json"

@OptIn(ExperimentalDigitalCredentialApi::class)
object DigitalCredentialsApiSingleton : SingletonModule {
    override fun getName(): String {
        return "DigitalCredentialsApiSingleton"
    }

    suspend fun registerCredentialsRaw(
            context: Context,
            credentialBytes: ByteArray,
            matcherBytes: ByteArray,
            protocol: String = PROTOCOL_OPENID4VP,
            type: String = DigitalCredential.TYPE_DIGITAL_CREDENTIAL,
            registerCompatType: Boolean = true
    ) {
        Log.i("DigitalCredentialsApi", "registering credentials (raw)")

        val registryManager = RegistryManager.create(context)
        val matcherInstance = maybeDecompressGzip(matcherBytes)

        if (registerCompatType) {
            registryManager.registerCredentials(
                    request =
                            object :
                                    RegisterCredentialsRequest(
                                            "com.credman.IdentityCredential",
                                            protocol,
                                            credentialBytes,
                                            matcherInstance
                                    ) {}
            )
        }

        registryManager.registerCredentials(
                request =
                        object :
                                RegisterCredentialsRequest(
                                        type,
                                        protocol,
                                        credentialBytes,
                                        matcherInstance
                                ) {}
        )
    }

    suspend fun registerCreationOptionsRaw(
            context: Context,
            creationOptionsBytes: ByteArray,
            matcherBytes: ByteArray,
            type: String = DigitalCredential.TYPE_DIGITAL_CREDENTIAL,
            id: String = "openid4vci",
            intentAction: String = ""
    ) {
        Log.i("DigitalCredentialsApi", "registering creation options (raw)")

        val registryManager = RegistryManager.create(context)
        val matcherInstance = maybeDecompressGzip(matcherBytes)

        registryManager.registerCreationOptions(
                object :
                        RegisterCreationOptionsRequest(
                                creationOptions = creationOptionsBytes,
                                matcher = matcherInstance,
                                type = type,
                                id = id,
                                intentAction = intentAction
                        ) {}
        )
    }

    fun getResponseIntent(response: String): Intent {
        val resultData = Intent()
        PendingIntentHandler.setGetCredentialResponse(
                resultData,
                GetCredentialResponse(DigitalCredential(response))
        )

        return resultData
    }

    fun getErrorResponseIntent(errorMessage: String): Intent {
        val resultData = Intent()
        PendingIntentHandler.setGetCredentialException(
                resultData,
                GetCredentialUnknownException(errorMessage)
        )

        return resultData
    }

    fun getCreateResponseIntent(response: String, type: String?): Intent {
        val resultData = Intent()
        val responseType = if (type.isNullOrBlank()) DigitalCredential.TYPE_DIGITAL_CREDENTIAL else type

        val responseObj = CreateCustomCredentialResponse(
                type = responseType,
                data = Bundle().apply {
                    putString("androidx.credentials.BUNDLE_KEY_RESPONSE_JSON", response)
                }
        )

        PendingIntentHandler.setCreateCredentialResponse(resultData, responseObj)
        return resultData
    }

    fun getCreateErrorResponseIntent(errorMessage: String): Intent {
        val resultData = Intent()
        PendingIntentHandler.setCreateCredentialException(
                resultData,
                CreateCredentialUnknownException(errorMessage)
        )

        return resultData
    }

    fun getRequest(context: Context, intent: Intent): String? {
        val request = PendingIntentHandler.retrieveProviderGetCredentialRequest(intent)
        if (request == null) {
            Log.d("DigitalCredentialsApi", "intent is not a get credentials action")
            return null
        }

        val callingAppInfo = request.callingAppInfo
        val callingPackageName = callingAppInfo.packageName
        val callingOrigin = callingAppInfo.getOrigin(loadAllowedApps(context))

        if (request.credentialOptions.size != 1) {
            throw Error(
                    "Expected only one credentialOption in request, found ${request.credentialOptions.size}"
            )
        }

        val credentialOption = request.credentialOptions.get(0)
        if (credentialOption !is GetDigitalCredentialOption) {
            throw Error("Expected credentialOption to be instance of GetDigitalCredentialOption")
        }

        val requestJson = JSONObject(credentialOption.requestJson)

        val requestReturn = JSONObject()
        requestReturn.put("origin", callingOrigin)
        requestReturn.put("packageName", callingPackageName)
        requestReturn.put("request", requestJson)

        // The selectedEntry payload is defined by the matcher. The matchers we currently
        // support encode it as JSON with provider/credential details.
        val selectedEntryId = request.selectedEntryId
        if (!selectedEntryId.isNullOrBlank()) {
            val selectedEntry = JSONObject(selectedEntryId)
            requestReturn.put(
                    "selectedEntry",
                    JSONObject()
                            .put("providerIndex", selectedEntry.getInt("provider_idx"))
                            .put("credentialId", selectedEntry.getString("id"))
            )
        }

        return requestReturn.toString()
    }

    fun getCreateRequest(context: Context, intent: Intent): String? {
        val request = toCreateRequest(intent)
        if (request == null) {
            Log.d("DigitalCredentialsApi", "intent is not a create credential action")
            return null
        }

        val callingAppInfo = request.callingAppInfo
        val callingPackageName = callingAppInfo.packageName
        val callingOrigin = callingAppInfo.getOrigin(loadAllowedApps(context))

        val requestJsonString = request.callingRequest.credentialData.getString("androidx.credentials.BUNDLE_KEY_REQUEST_JSON")
        val requestJson = if (requestJsonString != null) JSONObject(requestJsonString) else null

        val requestReturn = JSONObject()
        requestReturn.put("origin", callingOrigin)
        requestReturn.put("packageName", callingPackageName)
        requestReturn.put("type", request.callingRequest.type)
        requestReturn.put("request", requestJson)

        return requestReturn.toString()
    }

    fun setAllowedApps(context: Context, allowedAppsJson: String?) {
        val prefs = context.getSharedPreferences(ALLOWED_APPS_PREFS, Context.MODE_PRIVATE)
        if (allowedAppsJson.isNullOrBlank()) {
            prefs.edit().remove(ALLOWED_APPS_KEY).apply()
        } else {
            prefs.edit().putString(ALLOWED_APPS_KEY, allowedAppsJson).apply()
        }
    }

    private fun toCreateRequest(intent: Intent): ProviderCreateCredentialRequest? {
        val tmpRequestInfo = CreateCredentialRequest.DisplayInfo("userId")
        return if (Build.VERSION.SDK_INT >= 34) {
            val request = intent.getParcelableExtra(
                    CredentialProviderService.EXTRA_CREATE_CREDENTIAL_REQUEST,
                    android.service.credentials.CreateCredentialRequest::class.java
            ) ?: return null
            try {
                ProviderCreateCredentialRequest(
                        callingRequest =
                                CreateCredentialRequest.createFrom(
                                        request.type,
                                        request.data.apply {
                                            putBundle(CreateCredentialRequest.DisplayInfo.BUNDLE_KEY_REQUEST_DISPLAY_INFO, tmpRequestInfo.toBundle())
                                        },
                                        request.data,
                                        requireSystemProvider = false,
                                        request.callingAppInfo.origin
                                ),
                        callingAppInfo =
                                CallingAppInfo.create(
                                        request.callingAppInfo.packageName,
                                        request.callingAppInfo.signingInfo,
                                        request.callingAppInfo.origin
                                ),
                        biometricPromptResult = null
                )
            } catch (e: IllegalArgumentException) {
                null
            }
        } else {
            val requestBundle = intent.getBundleExtra(
                    "android.service.credentials.extra.CREATE_CREDENTIAL_REQUEST"
            ) ?: return null
            val requestDataBundle = requestBundle.getBundle(
                    "androidx.credentials.provider.extra.CREATE_REQUEST_CREDENTIAL_DATA"
            ) ?: Bundle()
            requestDataBundle.putBundle(
                    CreateCredentialRequest.DisplayInfo.BUNDLE_KEY_REQUEST_DISPLAY_INFO,
                    tmpRequestInfo.toBundle()
            )
            requestBundle.putBundle(
                    "androidx.credentials.provider.extra.CREATE_REQUEST_CREDENTIAL_DATA",
                    requestDataBundle
            )
            try {
                ProviderCreateCredentialRequest.fromBundle(requestBundle)
            } catch (e: Exception) {
                null
            }
        }
    }

    /**
     * The allowed apps is required to pass to the getOrigin and is taken from
     * https://github.com/leecam/CMWallet for now This should be configurable in the future.
     */
    private fun loadAllowedApps(context: Context) =
            loadAllowedAppsOverride(context) ?: loadAsset(context, "allowedApps.json").decodeToString()

    private fun loadAllowedAppsOverride(context: Context): String? {
        val prefs = context.getSharedPreferences(ALLOWED_APPS_PREFS, Context.MODE_PRIVATE)
        return prefs.getString(ALLOWED_APPS_KEY, null)
    }

    private fun loadAsset(context: Context, fileName: String): ByteArray {
        val data = context.assets.open(fileName).use { it.readBytes() }
        return maybeDecompressGzip(data)
    }

    private fun maybeDecompressGzip(data: ByteArray): ByteArray {
        if (data.size < 2) return data
        if (data[0] != 0x1f.toByte() || data[1] != 0x8b.toByte()) return data
        return GZIPInputStream(ByteArrayInputStream(data)).use { it.readBytes() }
    }
}
