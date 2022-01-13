import React, {useState} from 'react';
import {View, SafeAreaView, Pressable, StyleSheet, Alert} from 'react-native';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import {app, forgotPassword} from '../database/realmConfig';
const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');

  const onPressReset = async () => {
    try {
      await forgotPassword(email);
    } catch (error) {
        console.log('Forgot password error', error);
      Alert.alert(`Failed to reset password: ${error.message}`);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <EText style={styles.title}>Forgot Password</EText>
      <View style={styles.inputContainer}>
        <ETextInput
          onChangeText={setEmail}
          value={email}
          placeholder="email"
          style={styles.inputStyle}
          autoCapitalize="none"
        />
      </View>

      <Pressable onPress={() => navigation.navigate('Login')}>
        <EText style={styles.loginText}>{'Login?'}</EText>
      </Pressable>

      <EButton
        style={styles.button}
        onClick={() => onPressReset()}
        title="Send link"
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

export default ForgotPassword;
