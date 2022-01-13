import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Button,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Constants from '../constants/Constants';
import {app, signIn} from '../database/realmConfig';
import {getStorageData, saveStorageData} from '../utils/localStorage';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const onPressSignIn = async () => {
    try {
      await signIn(email, password,navigation);
    } catch (error) {
      Alert.alert(`Failed to sign in: ${error.message}`);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <EText style={styles.title}>Login</EText>
      <View style={styles.inputContainer}>
        <ETextInput
          onChangeText={setEmail}
          value={email}
          placeholder="email"
          style={styles.inputStyle}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputContainer}>
        <ETextInput
          onChangeText={text => setPassword(text)}
          value={password}
          placeholder="password"
          style={styles.inputStyle}
          secureTextEntry
        />
      </View>
      <View style={styles.linkContainer}>
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <EText style={styles.forgotText}>{'Forgot Password?'}</EText>
        </Pressable >

        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <EText style={styles.signupText}>{'Signup here'}</EText>
        </Pressable>
      </View>
      <EButton
        style={styles.button}
        onClick={() => onPressSignIn()}
        title="Sign In"
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  forgotText: {
    textAlign: 'left',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  button: {
    padding: 10,
    paddingVertical: 12,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    padding: 5,
  },
  inputStyle: {
    borderColor: 'black',
    padding: 10,
    borderRadius: 2,
  },
});

export default LoginScreen;
