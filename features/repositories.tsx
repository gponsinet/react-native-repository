import * as React from 'react'
import { List } from '@ant-design/react-native'
import { createStackNavigator } from '@react-navigation/stack'

const _RepositoriesContext = React.createContext([[], () => {}])

export function RepositoriesProvider({ children }) {
  const [state, setState] = React.useState([])

  function addRepository(repository) {
    setState([...state, repository])
  }

  return (
    <_RepositoriesContext.Provider value={[state, addRepository]}>
      {children}
    </_RepositoriesContext.Provider>
  )
}

export function useRepositories() {
  return React.useContext(_RepositoriesContext)
}

export function RepositoriesScreen() {
  const [repositories] = useRepositories()
  
  return (
    <List>
      repositories.map({name, url, icon} => {
        <List.Item thumb='icon' arrow='horizontal'>
          {name}
          <List.Brief>
            {url}
          </List.Brief>
        </List.Item>
      })
    </List>
  )
}

const RepositoriesStack = createStackNavigator()
export function RepositoriesNavigator() {
  return (
    <RepositoriesStack.Navigator>
      <RepositoriesStack.Screen
        name='Repositories'
        component={RepositoriesScreen}
        options={{ headerTitle: 'Repositories' }}
      />
    </RepositoriesStack.Navigator>
  )
}
