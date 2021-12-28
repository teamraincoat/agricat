import React ,{useEffect, useState}from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import RegisterUser from './src/screens/RegisterUser';
import appReducer from './src/redux/store';
import {Provider} from 'react-redux';
import {applyMiddleware, createStore} from 'redux';
import ReduxThunk from 'redux-thunk';
import RootProvider from './src/contex/index';
import {UsersProvider} from './src/provider/UsersProvider';
import LoginScreen from './src/screens/LoginScreen';
import { getStorageData } from './src/utils/localStorage';
import Constants from './src/constants/Constants';

const reduxStore = createStore(appReducer, {}, applyMiddleware(ReduxThunk));

const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
function App() {
    const [userId, setUserId] = useState(null);
    useEffect(() => {
      getStorageData(Constants.STORAGE.USER_ID)
      .then(result => {
        if (result) {
            setUserId(result);
        } else {
          console.log('No Result found')
        }
      })
      .catch((e) => {
        console.log('error localStorage',e)
      });
  }, []);
  const MainStackNavigator = () => (
    <UsersProvider>
      <MainStack.Navigator screenOptions={{headerShown: false}}>
        <MainStack.Screen name="Home" component={Home} />
        <MainStack.Screen name="Register" component={RegisterUser} />
      </MainStack.Navigator>
    </UsersProvider>
  );
  return (
    <RootProvider>
        <Provider store={reduxStore}>
          <NavigationContainer>
            <Stack.Navigator
          initialRouteName={userId ? "Main" :"Login"}
              screenOptions={{headerShown: false}}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Main" component={MainStackNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
    </RootProvider>
  );
}

export default App;
