import './platform';

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { DripsyProvider } from 'dripsy'
import { AccountsProvider } from './features/accounts'
import { RepositoriesProvider } from './features/repositories'

// import { IconFill, IconOutline } from "@ant-design/icons-react-native";
import * as Font from 'expo-font'
import { AppLoading } from 'expo'

const theme = {
  colors: {
    text: '#000',
    background: '#fff',
    primary: 'tomato',
  },
  fonts: {
    body: 'system-ui, sans-serif',
    heading: '"Avenir Next", sans-serif',
  },
  space: [10, 12, 14],
}

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    Font.loadAsync(
      'antoutline',
      // eslint-disable-next-line
      require('@ant-design/icons-react-native/fonts/antoutline.ttf')
    );
    
    Font.loadAsync(
      'antfill',
      // eslint-disable-next-line
      require('@ant-design/icons-react-native/fonts/antfill.ttf')
    )
  })

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
			<AccountsProvider>
        <RepositoriesProvider>
				  <SafeAreaProvider>
            <DripsyProvider theme={theme}>
      	      <Navigation colorScheme={colorScheme} />
      	      <StatusBar />
            </DripsyProvider>
      	  </SafeAreaProvider>
        </RepositoriesProvider>
			</AccountsProvider>
    )
  }
}
