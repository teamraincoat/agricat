import React, { useState, useEffect, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import NetInfo from '@react-native-community/netinfo';

import crashlytics from '@react-native-firebase/crashlytics';
import { getStorageData } from '../utils/localStorage';
import Constants from '../constants/Constants';
import { UsersProvider } from '../provider/UsersProvider';
import Home from '../screens/Home';
import RegisterUser from '../screens/RegisterUser';
import ConsentScreen from '../screens/ConsentScreen';
import ImpactReport from '../screens/ImpactReport';
import CompleteScreen from '../screens/CompleteScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPassword from '../screens/ForgotPassword';
import { LocalizeContext } from '../provider/LocalizeProvider';
import Section12Screen from '../screens/ImpactReportScreen/Section12Screen';
import Section3Screen from '../screens/ImpactReportScreen/Section3Screen';
import Section4Screen from '../screens/ImpactReportScreen/Section4Screen';
import Section5Screen from '../screens/ImpactReportScreen/Section5Screen';
import { ImpactReportProvider } from '../provider/ImpactReportProvider';

const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const NavigationWrapper = () => {
  const [userId, setUserId] = useState(null);
  // const [campaignCompletionRate, setCampaignCompletionRate] = useState(null);
  const [deviceOffline, setDeviceOffline] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const { initializeAppLanguage } = useContext(LocalizeContext);
  useEffect(() => {
    let _userInfo;
    initializeAppLanguage();
    getStorageData(Constants.STORAGE.USER_DATA)
      .then((userInfo) => {
        _userInfo = userInfo;
        if (_userInfo) setUserId(_userInfo._id);
        return NetInfo.fetch();
      })
      .then((netState) => {
        if (netState.isConnected && netState.isInternetReachable && _userInfo) {
          return true;
        }
        setDeviceOffline(true);
      })
      .finally(() => {
        setInitializing(false);
        SplashScreen.hide();
      })
      .catch((e) => {
        console.error('LocalStorage', e);
        crashlytics().recordError(new Error(e.message));
      });
  }, [userId]);

  const ImpactReportNavigator = () => (
    <ImpactReportProvider>
      <MainStack.Navigator
        initialRouteName="Section12Screen"
        screenOptions={{ headerShown: false }}>
        <MainStack.Screen name="Section12Screen" component={Section12Screen} />
        <MainStack.Screen name="Section3Screen" component={Section3Screen} />
        <MainStack.Screen name="Section4Screen" component={Section4Screen} />
        <MainStack.Screen name="Section5Screen" component={Section5Screen} />
      </MainStack.Navigator>
    </ImpactReportProvider>
  );

  const MainStackNavigator = () => (
    <UsersProvider>
      <MainStack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
        <MainStack.Screen
          name="Home"
          initialParams={{
            deviceOffline,
          }}
          component={Home}
        />
        <MainStack.Screen name="Register" component={RegisterUser} />
        <MainStack.Screen name="Consent" component={ConsentScreen} />
        <MainStack.Screen name="ImpactReport" component={ImpactReport} />
        <MainStack.Screen name="Complete" component={CompleteScreen} />
        <MainStack.Screen name="SignUp" component={SignupScreen} />
        <MainStack.Screen name="Auth" component={AuthStackNavigator} />
        <MainStack.Screen
          name="ImpactReportScreens"
          component={ImpactReportNavigator}
        />
      </MainStack.Navigator>
    </UsersProvider>
  );
  const AuthStackNavigator = () => (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Main" component={MainStackNavigator} />
    </Stack.Navigator>
  );

  if (initializing) return null;

  if (userId) return <MainStackNavigator />;

  return <AuthStackNavigator />;
};

export default NavigationWrapper;
