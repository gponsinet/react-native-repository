import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { GithubAuthNavigator, GithubAuthButton } from './github'
import { Flex } from '@ant-design/react-native'

export function AuthScreen() {
  return (
    <Flex direction='row-reverse' justify='center'>
      <Flex.Item>
        <GithubAuthButton />
      </Flex.Item>
    </Flex>
  ) 
}

const AuthStack = createStackNavigator()
export function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name='Auth'
        component={AuthScreen}
      />
       <AuthStack.Screen
        name='GithubAuth'
        component= {GithubAuthNavigator}
        options={{ headerShown: false }}
      />
    </AuthStack.Navigator>
  )
}
