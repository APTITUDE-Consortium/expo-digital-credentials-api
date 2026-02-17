import {
  type AptitudeConsortiumConfig,
  type DigitalCredentialsApiMatcher,
  type RegisterCredentialsOptions,
  isGetCredentialActivity,
  registerCredentials,
} from '@animo-id/expo-digital-credentials-api'
import { getEncodedAptitudeConsortiumConfigBase64 } from '../src/encodeCredentials'
import { decodeBase64 } from '../src/util'
import { useMemo } from 'react'
import { Button, SafeAreaView, ScrollView, Text, View } from 'react-native'

export default function App() {
  const isDcApi = useMemo(() => isGetCredentialActivity(), [])
  if (isDcApi) {
    console.log('Not rendering main application due to DC API')
    return null
  }

  const legacyCredentials: NonNullable<RegisterCredentialsOptions['credentials']> = [
    {
      id: '1',
      display: {
        title: 'Drivers License',
        subtitle: 'Issued by Utopia',
        claims: [
          {
            path: ['org.iso.18013.5.1', 'family_name'],
            displayName: 'Family Name',
          },
        ],
        iconDataUrl:
          'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCABLAGQDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAWAQEBAQAAAAAAAAAAAAAAAAAABgj/2gAMAwEAAhADEAAAAZzC6pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAEFAgL/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAEDAQE/AQL/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAECAQE/AQL/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAY/AgL/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAE/IQL/2gAMAwEAAgADAAAAEP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/8QAFBEBAAAAAAAAAAAAAAAAAAAAcP/aAAgBAwEBPxAC/8QAFBEBAAAAAAAAAAAAAAAAAAAAcP/aAAgBAgEBPxAC/8QAFBABAAAAAAAAAAAAAAAAAAAAcP/aAAgBAQABPxAC/9k=',
      },
      credential: {
        doctype: 'org.iso.18013.5.1.mDL',
        format: 'mso_mdoc',
        namespaces: {
          'org.iso.18013.5.1': {
            family_name: 'Glastra',
            given_name: 'Timo',
          },
        },
      },
    },
    {
      id: '2',
      display: {
        title: 'PID',
        subtitle: 'Issued by Utopia',
        claims: [
          {
            path: ['first_name'],
            displayName: 'First Name',
          },
          {
            path: ['address', 'city'],
            displayName: 'Resident City',
          },
        ],
        iconDataUrl:
          'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCABLAGQDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAWAQEBAQAAAAAAAAAAAAAAAAAABgj/2gAMAwEAAhADEAAAAZzC6pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAEFAgL/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAEDAQE/AQL/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAECAQE/AQL/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAY/AgL/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAE/IQL/2gAMAwEAAgADAAAAEP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/8QAFBEBAAAAAAAAAAAAAAAAAAAAcP/aAAgBAwEBPxAC/8QAFBEBAAAAAAAAAAAAAAAAAAAAcP/aAAgBAgEBPxAC/8QAFBABAAAAAAAAAAAAAAAAAAAAcP/aAAgBAQABPxAC/9k=',
      },
      credential: {
        vct: 'eu.europa.ec.eudi.pid.1',
        format: 'dc+sd-jwt',
        claims: {
          first_name: 'Timo',
          address: {
            city: 'Somewhere',
          },
        },
      },
    },
  ]

  const aptitudeConfig: AptitudeConsortiumConfig = {
    default_id_prefix: 'cred-',
    openid4vp: {
      enabled: true,
      allow_dcql: true,
      allow_transaction_data: true,
      allow_signed_requests: true,
      allow_response_mode_jwt: true,
    },
    openid4vci: {
      enabled: true,
      allow_credential_offer: true,
      allow_credential_offer_uri: true,
      allow_authorization_code: true,
      allow_pre_authorized_code: true,
      allow_tx_code: true,
      allow_authorization_details: true,
      allow_scope: true,
    },
    dcql: {
      credential_set_option_mode: 'first_satisfiable_only',
      optional_credential_sets_mode: 'prefer_present',
    },
    credentials: [
      {
        id: 'mdoc-1',
        format: 'mso_mdoc',
        title: 'Drivers License',
        subtitle: 'Issued by Utopia',
        icon:
          'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCABLAGQDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAWAQEBAQAAAAAAAAAAAAAAAAAABgj/2gAMAwEAAhADEAAAAZzC6pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAEFAgL/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAEDAQE/AQL/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAECAQE/AQL/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAY/AgL/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAE/IQL/2gAMAwEAAgADAAAAEP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/8QAFBEBAAAAAAAAAAAAAAAAAAAAcP/aAAgBAwEBPxAC/8QAFBEBAAAAAAAAAAAAAAAAAAAAcP/aAAgBAgEBPxAC/8QAFBABAAAAAAAAAAAAAAAAAAAAcP/aAAgBAQABPxAC/9k=',
        doctype: 'org.iso.18013.5.1.mDL',
        fields: [
          {
            path: ['org.iso.18013.5.1', 'family_name'],
            display_name: 'Family Name',
          },
          {
            path: ['org.iso.18013.5.1', 'given_name'],
            display_name: 'Given Name',
          },
        ],
        claims: {
          'org.iso.18013.5.1': {
            family_name: 'Glastra',
            given_name: 'Timo',
          },
        },
      },
      {
        id: 'pid-1',
        format: 'dc+sd-jwt',
        title: 'PID',
        subtitle: 'Issued by Utopia',
        icon:
          'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wgARCABLAGQDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAWAQEBAQAAAAAAAAAAAAAAAAAABgj/2gAMAwEAAhADEAAAAZzC6pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAEFAgL/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAEDAQE/AQL/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAECAQE/AQL/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAY/AgL/xAAUEAEAAAAAAAAAAAAAAAAAAABw/9oACAEBAAE/IQL/2gAMAwEAAgADAAAAEP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/8QAFBEBAAAAAAAAAAAAAAAAAAAAcP/aAAgBAwEBPxAC/8QAFBEBAAAAAAAAAAAAAAAAAAAAcP/aAAgBAgEBPxAC/8QAFBABAAAAAAAAAAAAAAAAAAAAcP/aAAgBAQABPxAC/9k=',
        vcts: ['eu.europa.ec.eudi.pid.1'],
        claims: {
          first_name: 'Timo',
          address: {
            city: 'Somewhere',
          },
        },
      },
    ],
  }

  const register = (matcher: DigitalCredentialsApiMatcher) => {
    const options: RegisterCredentialsOptions = {
      debug: true,
      matcher,
      credentials: matcher === 'aptitude-consortium' ? undefined : legacyCredentials,
      aptitudeConsortiumConfig: matcher === 'aptitude-consortium' ? aptitudeConfig : undefined,
    }
    if (matcher === 'aptitude-consortium' && options.aptitudeConsortiumConfig) {
      const encoded = getEncodedAptitudeConsortiumConfigBase64(options.aptitudeConsortiumConfig, {
        debug: options.debug,
      })
      const decoded = new TextDecoder().decode(decodeBase64(encoded))
      console.log('Aptitude matcher payload (base64)', encoded)
      console.log('Aptitude matcher payload (json)', decoded)
    }
    console.log('RegisterCredentials options', options)
    return registerCredentials(options)
      .then(() => console.log('success', matcher))
      .catch((error) => console.error('error', error))
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Group name="Register Credentials">
          <Button title="Ubique Matcher" onPress={() => register('ubique')} />
          <View style={{ height: 20 }} />
          <Button title="CMWallet Matcher" onPress={() => register('cmwallet')} />
          <View style={{ height: 20 }} />
          <Button title="Aptitude Consortium Matcher" onPress={() => register('aptitude-consortium')} />
        </Group>
      </ScrollView>
    </SafeAreaView>
  )
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  )
}

const styles = {
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
}
