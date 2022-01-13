import React, { useState } from 'react';
import {View, StyleSheet, Pressable, Alert} from 'react-native';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signIn, signUp } from '../database/realmConfig';
const SignupScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log('email', email);
    console.log('password', password);
  const onPressSignUp = async () => {
      console.log("Press sign up");
    try {
      await signUp(email, password);
      console.log('Sign up success');
      signIn(email, password, navigation);
    //   navigation.navigate('Main');
    } catch (error) {
        console.log('Sign up error', error);
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <EText style={styles.title}>SignUp</EText>
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
      <Pressable onPress={() => navigation.navigate('Login')}>
        <EText style={styles.loginText}>{'Login?'}</EText>
      </Pressable>
      <EButton
        style={styles.button}
        onClick={onPressSignUp}
        title="Sign up"
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
  loginText: {
    textAlign: 'left',
    paddingHorizontal: 5,
    marginTop: 10,
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

export default SignupScreen;
