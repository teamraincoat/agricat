import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import appReducer from './src/redux/store';
// eslint-disable-next-line import/no-named-as-default
import RootProvider from './src/contex';
import NavigationWrapper from './src/navigation/NavigationWrapper';

const reduxStore = createStore(appReducer, {}, applyMiddleware(ReduxThunk));

function App() {
  return (
    <RootProvider>
      <Provider store={reduxStore}>
        <NavigationContainer>
          <NavigationWrapper />
        </NavigationContainer>
      </Provider>
    </RootProvider>
  );
}

export default App;
