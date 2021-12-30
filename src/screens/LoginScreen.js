import React, {useEffect, useState} from 'react';
import {View, Text,TextInput,StyleSheet, Button} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Constants from '../constants/Constants';
import { app } from '../database/realmConfig';
import { getStorageData, saveStorageData } from '../utils/localStorage';


const LoginScreen = ({navigation}) => {

  const onPressSignIn = async () => {
    const credentials = Realm.Credentials.anonymous();
    try {
      const newUser = await app.logIn(credentials);
      saveStorageData(Constants.STORAGE.USER_ID, newUser.id);
      navigation.navigate('Main');
    } catch (err) {
      console.error("Failed to log in", err.message);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text>Signup or Signin:</Text>
      <Button onPress={onPressSignIn} title="Sign In" />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    padding: 5,
  },
  inputStyle: {
    borderColor: "black",
    borderWidth: 1,
    padding: 10,
    borderRadius: 2,
  },
});

export default LoginScreen;
