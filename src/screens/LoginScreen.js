import React, { useContext, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

import {signIn, signOut} from '../database/realmConfig';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import BackgroundImage from '../atoms/BackgroundImage';
import { colors, styles } from '../styles';
import { hp } from '../styles/metrics';
import { LocalizeContext } from '../provider/LocalizeProvider';

const LoginScreen = ({navigation}) => {
  const {translations, initializeAppLanguage} = useContext(LocalizeContext);
  initializeAppLanguage('es');
  const [email, setEmail] = useState({ value: 'tushali024+realmappxi@gmail.com', error: '' });
  const [password, setPassword] = useState({ value: 'enrollmenttest011', error: '' });
  const [loading, setLoading] = useState(false);

  const onPressSignIn = async () => {
    try {
      setLoading(true);
      await signIn(email.value, password.value, null, navigation);
    } catch (error) {
      Alert.alert(`Failed to sign in: ${error.message}`);
    }
  };
  return (
      // eslint-disable-next-line global-require
      <BackgroundImage src={require('../assets/SplashBackground.png')}>
      <View style={localStyles.loginTextContainer}>

      <EText style={localStyles.title}>{translations['Login.title']}</EText>
      <EText style={localStyles.subTitle}>{translations['Login.subTitle']}</EText>
      </View>
      <View>
        <ETextInput
          email
          defaultValue={email.value}
          onChangeText={(text) => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          label={<EText>Email</EText>}
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
          secureTextEntry={true}
          defaultValue={password.value}
          error={!!email.error}
          errorText={email.error}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          returnKeyType="done"
          placeholder="enter password"
          label={<EText>Password</EText>}
          onSubmitEditing={() => console.warn('submit')}
          keyboardShouldPersistTaps
        />
      </View>
      <Pressable style={localStyles.signupTextContainer} onPress={() => navigation.navigate('SignUp')}>
          <EText style={localStyles.signupText}>{translations['Login.signUpText']}</EText>
        </Pressable>
      <EButton
        style={localStyles.button}
        onClick={() => onPressSignIn()}
        title="Log in"
        loading={loading}
        textStyle={localStyles.buttonText}
      />
    </BackgroundImage>
  );
};

const localStyles = StyleSheet.create({
  container: {
    ...styles.flex,
    backgroundColor: colors.white,
  },
  loginTextContainer: {
    ...styles.center,
    marginTop: hp(15),
  },
  title: {
    ...styles.h1,
    color: colors.black,
    ...styles.mv8,
  },
  subTitle: {
    color: colors.black,
    ...styles.h3,
    ...styles.mv8,
  },
  signupTextContainer: {
    ...styles.center,
  },
  signupText: {
    color: colors.black,
    ...styles.h3,
    ...styles.mv8,
  },
});

export default LoginScreen;
