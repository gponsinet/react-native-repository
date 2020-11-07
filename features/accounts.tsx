import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { SafeAreaView, View, Modal, ScrollView, Text, Alert } from 'react-native';
import { List, Button, Flex, WhiteSpace, Icon } from '@ant-design/react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query'
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

function fetchGithubAccessToken(clientId, clientSecret, code) {
  return fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'same-origin',
    body: JSON.stringify({
      clientId,
      clientSecret,
      code
    }),
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json',
    }
  })
}

function useGithubAccount() {

  // Endpoint
  const clientId = Constants.appOwnership === 'expo' ? '120580e6ed86f9998e51' : '9a52d86e43e9dca8ab49'
  const discovery = {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    revocationEndpoint: `https://github.com/settings/connections/applications/${clientId}`,
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['repo'],
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        native: 'termina://accounts',
      }),
    },
    discovery
  );

  const ghOAuthQuery = {
    isLoading: response === null,
    status: response?.type || 'loading',
    error: response?.type === 'error' ? response?.params : null,
    data: response?.params,
  }

  const ghTokenQuery = useQuery('gh-token', fetchGithubAccessToken)

  const queries = [ghOAuthQuery, ghTokenQuery]
  return queries.every(_ => _.status === 'success')
    ? {
      isLoading: false,
      status: 'success',
      data: {
        type: 'github',
      }
    }
    : queries.find(_ => _.status === 'error') || {
      isLoading: true,
      status: 'loading',
      error: null,
      data: null
    }
}

const _AccountsContext = React.createContext([[], () => {}])

export function AccountsProvider({ children }) {
  // TODO: persistent state
  const [state, setState] = React.useState([])

  function addAccount(account) {
    setState([...state, account])
  }

  return (
    <_AccountsContext.Provider value={[state, addAccount]}>
    {children}
  </_AccountsContext.Provider>
)
}


export function useAccounts() {
  return React.useContext(_AccountsContext)
}

export function AccountsScreen() {
  // TODO: List all accounts
  const [accounts, addAccount] = useAccounts()

  const { isLoading, authenticate } = useGithubAccount()

  const navigation = useNavigation()

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      {accounts.length > 0
        ? (
          <Flex.Item>
            <List>
              {accounts.map(account => (
                <List.Item 
                  arrow='horizontal'
                  onPress={() => navigation.push('Repositories', { account })}
                  onClick={() => navigation.push('Repositories', { account })}
                >
                  <Icon name='github' size='lg' />
                  <List.Brief>
                    {account.type}
                  </List.Brief>
                </List.Item>
            ))}
          </List>
        </Flex.Item>
      ) : (
        null
      )
      }
      <Button
        type='primary'
        style={{ backgroundColor: '#24292e', borderColor: '#24292ef0', margin: 16 }}
        activeStyle={{ backgroundColor: '#24292ef0' }}
        icon='github'
        large='true'
        inline
        onPress={() => githubPromptAsync()}
        onClick={() => githubPromptAsync()}
      >
        Connect Github Account
      </Button>
    </SafeAreaView>
  )
}

const AccountsStack = createStackNavigator()
export function AccountsNavigator() {
  return (
    <AccountsStack.Navigator>
      <AccountsStack.Screen
        name="Accounts"
        component={AccountsScreen}
        options={{ headerTitle: 'Accounts' }}
      />
    </AccountsStack.Navigator>
  )
}
