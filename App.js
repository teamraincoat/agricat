import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import Home from './src/screens/Home';
import RegisterUser from './src/screens/RegisterUser';
import appReducer from './src/redux/store';
// eslint-disable-next-line import/no-named-as-default
import RootProvider from './src/contex';
import { UsersProvider } from './src/provider/UsersProvider';
import LoginScreen from './src/screens/LoginScreen';
import { getStorageData } from './src/utils/localStorage';
import Constants from './src/constants/Constants';
import SignupScreen from './src/screens/SignupScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import ConsentScreen from './src/screens/ConsentScreen';
import ImpactReport from './src/screens/ImpactReport';
import CompleteScreen from './src/screens/CompleteScreen';

const reduxStore = createStore(appReducer, {}, applyMiddleware(ReduxThunk));

const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
function App() {
  const [userId, setUserId] = useState(null);
  const [initializing, setInitializing] = useState(true);
  useEffect(() => {
    getStorageData(Constants.STORAGE.USER_ID)
      .then((result) => {
        if (result) {
          setUserId(result);
          if (initializing) setInitializing(false);
        } else {
          console.log('No Result found');
          setInitializing(false);
        }
      })
      .catch((e) => {
        console.log('error localStorage', e);
      });
  }, [userId]);
  const MainStackNavigator = () => (
    <UsersProvider>
      <MainStack.Navigator initialRouteName='Auth' screenOptions={{ headerShown: false }}>
        <MainStack.Screen name="Home" component={Home} />
        <MainStack.Screen name="Register" component={RegisterUser} />
        <MainStack.Screen name="Consent" component={ConsentScreen} />
        <MainStack.Screen name="ImpactReport" component={ImpactReport} />
        <MainStack.Screen name="Complete" component={CompleteScreen} />
        <MainStack.Screen name="Auth" component={AuthStackNavigator} />
      </MainStack.Navigator>
    </UsersProvider>
  );
  const AuthStackNavigator = () => (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Main" component={MainStackNavigator} />
    </Stack.Navigator>
  );

  if (initializing) return null;
  return (
    <RootProvider>
      <Provider store={reduxStore}>
        <NavigationContainer>
            {userId ? <MainStackNavigator /> : <AuthStackNavigator />}
        </NavigationContainer>
      </Provider>
    </RootProvider>
  );
}

export default App;
