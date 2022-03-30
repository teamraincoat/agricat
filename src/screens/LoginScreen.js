import React, { useContext, useState } from 'react';
import {
  View, StyleSheet, Pressable, Linking,
} from 'react-native';

import { signIn } from '../database/realmConfig';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import BackgroundImage from '../atoms/BackgroundImage';
import { colors, styles } from '../styles';
import { hp } from '../styles/metrics';
import { LocalizeContext } from '../provider/LocalizeProvider';

const LoginScreen = ({ navigation }) => {
  const { translations } = useContext(LocalizeContext);
  // tushali024+realmappxi@gmail.com
  // enrollmenttest011
  const [email, setEmail] = useState({
    value: '',
    error: '',
  });
  const [password, setPassword] = useState({
    value: '',
    error: '',
  });
  const [loading, setLoading] = useState(false);

  const validateEmail = (emailAddress) => emailAddress.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

  const checkValidation = () => {
    if (email.value === '') {
      setEmail({ ...email, error: translations['Message.emailRequired'] });
      return false;
    }
    if (!validateEmail(email.value)) {
      setEmail({ ...email, error: translations['Message.emailInvalid'] });
      return false;
    }
    if (password.value === '') {
      setPassword({ ...password, error: translations['Message.passwordRequired'] });
      return false;
    }
    if (password.value.length < 6) {
      setPassword({ ...password, error: translations['Message.passwordLength'] });
      return false;
    }
    return true;
  };
  const onPressSignIn = async () => {
    try {
      if (checkValidation()) {
        setLoading(true);
        await signIn(email.value, password.value, navigation, setLoading);
      }
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    // eslint-disable-next-line global-require
    <BackgroundImage src={require('../assets/SplashBackground.png')}>
      <View style={localStyles.loginTextContainer}>
        <EText style={localStyles.title}>{translations['Login.title']}</EText>
        <EText style={localStyles.subTitle}>
          {translations['Login.subTitle']}
        </EText>
      </View>
      <View>
        <ETextInput
          email
          defaultValue={email.value}
          onChangeText={(text) => setEmail({ value: text, error: '' })}
          error={!!email.error}
          errorText={email.error}
          label={<EText>{translations['Login.email']}</EText>}
          autoCapitalize="none"
          placeholder={translations['Placeholder.email']}
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
          error={!!password.error}
          errorText={password.error}
          onChangeText={(text) => setPassword({ value: text, error: '' })}
          returnKeyType="done"
          placeholder={translations['Placeholder.password']}
          label={<EText>{translations['Login.password']}</EText>}
          onSubmitEditing={() => console.warn('submit')}
          keyboardShouldPersistTaps
        />
      </View>
      <Pressable
        style={localStyles.signupTextContainer}
        onPress={() => Linking.openURL('https://www.google.com/')}>
        <EText style={localStyles.signupText}>
          {translations['Login.signUpText']}
        </EText>
      </Pressable>
      <EButton
        style={localStyles.button}
        onClick={() => onPressSignIn()}
        title={translations['Login.title']}
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
