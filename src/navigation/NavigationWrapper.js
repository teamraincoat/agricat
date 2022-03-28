import React, { useState, useEffect, useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
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
import { checkCampaignMatrix } from '../database/realmConfig';

const Stack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const NavigationWrapper = () => {
  const [userId, setUserId] = useState(null);
  const [campaignCompletionRate, setCampaignCompletionRate] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const { initializeAppLanguage } = useContext(LocalizeContext);
  useEffect(() => {
    initializeAppLanguage();
    getStorageData(Constants.STORAGE.USER_DATA)
      .then(async (userInfo) => {
        if (userInfo) {
          setUserId(userInfo._id);
          const completeRate = await checkCampaignMatrix(userInfo);
          if (completeRate) {
            setCampaignCompletionRate(completeRate);
            if (initializing) setInitializing(false);
            SplashScreen.hide();
          }
        } else {
          console.log('No User Data found');
          setInitializing(false);
          SplashScreen.hide();
        }
      })
      .catch((e) => {
        console.log('error localStorage', e);
      });
  }, [userId]);
  const MainStackNavigator = () => (
    <UsersProvider>
      <MainStack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}>
        <MainStack.Screen name="Home" initialParams={{ campaignMetrics: campaignCompletionRate }} component={Home} />
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

  if (userId && campaignCompletionRate) return <MainStackNavigator />;

  return <AuthStackNavigator />;
};

export default NavigationWrapper;
