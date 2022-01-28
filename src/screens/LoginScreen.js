import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import { signIn} from '../database/realmConfig';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState({value: 'tj1@yopmail.com', error: ''});
  const [password, setPassword] = useState({value: '123456', error: ''});
  const [loading, setLoading] = useState(false)
  const onPressSignIn = async () => {
    try {
      await signIn(email.value, password.value,data=null, navigation);
    } catch (error) {
      Alert.alert(`Failed to sign in: ${error.message}`);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <EText style={styles.title}>Login</EText>
      <View>
        <ETextInput
          email
          defaultValue={email.value}
          onChangeText={text => setEmail({value: text, error: ''})}
          error={!!email.error}
          errorText={email.error}
          label={<Text>Email</Text>}
          autoCapitalize="none"
          placeholder="enter email"
          returnKeyType="next"
          blurOnSubmit={false}
          keyboardShouldPersistTaps
        />
      </View>
      <View>
        <ETextInput
          password
          secure
          defaultValue={password.value}
          error={!!email.error}
          errorText={email.error}
          onChangeText={text => setPassword({value: text, error: ''})}
          returnKeyType="done"
          placeholder="enter password"
          label={<Text>Password</Text>}
          onSubmitEditing={() => console.warn('submit')}
          keyboardShouldPersistTaps
        />
      </View>
      <View style={styles.linkContainer}>
        <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
          <EText style={styles.forgotText}>{'Forgot Password?'}</EText>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('SignUp')}>
          <EText style={styles.signupText}>{'Signup here'}</EText>
        </Pressable>
      </View>
      <EButton
        style={styles.button}
        onClick={() => onPressSignIn()}
        title="Sign In"
        loading={loading}
        textStyle={styles.buttonText}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECF0F3',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  forgotText: {
    textAlign: 'left',
    fontSize: 16,
  },
  signupText: {
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 25,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 12,
    height: 55,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
  },

  inputStyle: {
    borderColor: 'black',
    padding: 10,
    borderRadius: 2,
  },
});

export default LoginScreen;
