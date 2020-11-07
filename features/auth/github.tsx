import React from 'react'
import { Alert, SafeAreaView, Text } from 'react-native'
import { Flex, Icon, ActivityIndicator, Button } from '@ant-design/react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { useNavigation } from '@react-navigation/native'
import Constants from 'expo-constants'
import { useQuery } from 'react-query'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'

function useGithubAuth() {
  // Endpoint
  const clientId = Constants.appOwnership === 'expo' ? '120580e6ed86f9998e51' : '9a52d86e43e9dca8ab49'
  const clientSecret = Constants.appOwnership === 'expo' ? 'fd9bcfb3bc0d7631c3f8793b515e450213f82485' : '8b4b00f4a266325837b6b23c09b3526b258e6eae'
  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: `https://github.com/settings/connections/applications/${clientId}`,
  }

  const [githubAuth, setGithubAuth] = React.useState({
    prompted: false,
    code: '',
    token: '',
    status: 'loading',
  })

  const [request, ghOAuthResp, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['repo'],
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: 'termina://auth/github',
      }),
    },
    discovery
  )

  React.useEffect(() => {
    (async function () {
      if (githubAuth.prompted === false) {
        await promptAsync()
        setGithubAuth({ ...githubAuth, prompted: true })
      }
    })()
  }, [promptAsync])

  React.useEffect(() => {
    switch (ghOAuthResp?.type) {
      case 'cancel':
        setGithubAuth({ ...githubAuth, status: 'cancel' })
        return
      case 'error':
        setGithubAuth({ ...githubAuth, status: 'error' })
        return
      case 'success':
        setGithubAuth({ ...githubAuth, status: 'loading', code: ghOAuthResp.params.code })
        return
      case 'loading':
      default:
        return
    }
  }, [ghOAuthResp])

  const ghTokenQuery = useQuery(['gh-token', githubAuth.code], () =>
    fetch(discovery.tokenEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        code: githubAuth.code
      }),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
  )

  console.warn('code', githubAuth.code)
  React.useEffect(() => {
    switch (ghTokenQuery?.status) {
      case 'error':
        setGithubAuth({ ...githubAuth, status: 'error' })
        return
      case 'success':
        setGithubAuth({ ...githubAuth, status: 'success', token: ghTokenQuery.data.access_token})
        return
      case 'loading':
      default:
        return
    }
  }, [ghTokenQuery])

  return githubAuth
}

export function GithubAuthButton() {
  const navigation = useNavigation()
  return (
    <Button
      type='primary'
      style={{ backgroundColor: '#24292e', borderColor: '#24292ef0', margin: 16 }}
      activeStyle={{ backgroundColor: '#24292ef0' }}
      icon='github'
      large='true'
      inline
      onPress={() => navigation.push('GithubAuth')}
      onClick={() => navigation.push('GithubAuth')}
    >
      Connect Github Account
    </Button>
  )
}

export function GithubAuthScreen () {
  const navigation = useNavigation()
  const { code, token, error } = useGithubAuth()
  React.useEffect(() => {
    if (error || (code && token)) {
      navigation.goBack()
      return
    }
  }, [code, token, error])
  return (
    <SafeAreaView style={{ backgroundColor: '#24292e', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size='large' style={{ margin: 16 }}/>
      <Text style={{color: 'white', textAlign: 'center', fontSize: 16, margin: 16 }}>
        Waiting OAuth {code == '' ? 'Code' : 'Token'}
      </Text>
    </SafeAreaView>
  )
}

const GithubAuthStack = createStackNavigator()
export function GithubAuthNavigator() {
  return (
    <GithubAuthStack.Navigator screenOptions={{
     headerShown: false
    }}>
      <GithubAuthStack.Screen name='GithubAuth' component={GithubAuthScreen} />
    </GithubAuthStack.Navigator>
  )
} 
