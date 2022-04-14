import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// eslint-disable-next-line import/no-named-as-default
import RootProvider from './src/contex';
import NavigationWrapper from './src/navigation/NavigationWrapper';

function App() {
  return (
    <RootProvider>
        <NavigationContainer>
          <NavigationWrapper />
        </NavigationContainer>
    </RootProvider>
  );
}

export default App;
