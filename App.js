import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import RegisterUser from './src/screens/RegisterUser';
import appReducer from './src/redux/store';
import {Provider} from 'react-redux';
// import {PersistGate} from 'redux-persist/integration/react';
import {applyMiddleware, createStore} from 'redux';
import ReduxThunk from 'redux-thunk';
import RootProvider from './src/contex/index';

const reduxStore = createStore(appReducer, {}, applyMiddleware(ReduxThunk));

const Stack = createNativeStackNavigator();

function App() {
  return (
    <RootProvider>
      <Provider store={reduxStore}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Register" component={RegisterUser} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </RootProvider>
  );
}

export default App;
