/* eslint-disable no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import { app } from '../database/realmConfig';
import { LocalizeContext } from '../provider/LocalizeProvider';
import { colors, styles } from '../styles';
import { hp, normalize, wp } from '../styles/metrics';
import BackgroundImage from '../atoms/BackgroundImage';
import { saveStorageData } from '../utils/localStorage';
import Constants from '../constants/Constants';

DropDownPicker.setMode('BADGE');
const Image = require('../assets/Profile.png');

const SignupScreen = ({ navigation, route }) => {
  const { translations } = useContext(LocalizeContext);
  const [languageSelect, SetLanguageSelect] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [lList, setLList] = useState([]);
  const userCredential = route && route.params && route.params.userCredential;

  console.log('userCredential', userCredential);
  const Items = [
    { label: 'German', value: 'German' },
    { label: 'English', value: 'English' },
    { label: 'French', value: 'French' },
  ];

  const onPressSignUp = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        Alert.alert(translations['Message.passwordAreSame']);
        return;
      }
      setLoading(true);
      const userData = await app.currentUser.refreshCustomData();
      console.log('userData', userData);
      const mongo = app.currentUser.mongoClient('mongodb-atlas');
      const userList = mongo.db('mexico').collection('User');
      const newUserData = await userList.updateOne(
        { _id: userData && userData._id },
        {
          $set: {
            name: data.name,
            languagesList: [...data.languagesList],
            telephone: data.telephone,
            isFirstLogin: false,
          },
        },
      );
      setLoading(false);
      if (newUserData.modifiedCount === 1) {
        saveStorageData(Constants.STORAGE.IS_PENDING_REGISTRATION, false);
        navigation.navigate('Home');
      }
      // const resetPassword = await app.emailPasswordAuth.callResetPasswordFunction({ email, password });
    } catch (error) {
      setLoading(false);
      console.log('Sign up error', error);
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
  };

  const onPhoneNumberChange = (value, onChange) => {
    const x = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    value = !x[2] ? x[1] : `(${x[1]}) ${x[2]}${x[3] ? `-${x[3]}` : ''}`;
    onChange(value);
  };

  useEffect(() => {
    if (lList) {
      const signUpData = getValues();
      reset({ ...signUpData, languagesList: lList.length > 0 ? lList : [] });
    }
  }, [lList]);
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    defaultValues: {
      name: '',
      telephone: '',
      languagesList: [],
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[localStyles.signupData, localStyles.justifyBetween]}>
      <BackgroundImage src={Image}>
        <View style={localStyles.signupTextContainer}>
          <EText style={localStyles.title}>
            {translations['Profile.title']}
          </EText>
          <EText style={localStyles.subTitle}>
            {translations['Profile.subTitle']}
          </EText>
        </View>
        <View style={localStyles.signupForm}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ETextInput
                  placeholder={translations['Placeholder.name']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  {...register('name', {
                    required: translations['Message.nameRequired'],
                  })}
                  error={!!errors.name}
                  errorText={errors.name && errors.name.message}
                  label={<Text>{translations['Profile.name']}</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                />
              )}
              name="name"
            />

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ETextInput
                  phone
                  placeholder={translations['Placeholder.telephone']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onPhoneNumberChange(value, onChange)}
                  {...register('telephone', {
                    required: translations['Message.telephoneRequired'],
                  })}
                  error={!!errors.telephone}
                  errorText={errors.telephone && errors.telephone.message}
                  label={<Text>{translations['Profile.Telephone']}</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                />
              )}
              name="telephone"
            />
            <EText style={localStyles.labelStyle}>
              {translations['Profile.Language']}
            </EText>
            <DropDownPicker
              multiple={true}
              placeholder={translations['Placeholder.languageList']}
              open={languageSelect}
              value={[...lList]}
              items={Items}
              showTickIcon={true}
              showArrowIcon={true}
              showBadgeDot={true}
              setOpen={SetLanguageSelect}
              setValue={(value) => setLList(value)}
              zIndexInverse={7000}
              zIndex={1000}
              style={[
                localStyles.dropDownStyle,
                { ...styles.mt10 },
                {
                  borderColor: errors.languagesList
                    ? colors.error
                    : colors.transparent,
                },
              ]}
              disableBorderRadius={true}
              textStyle={{
                color: lList.length > 0 ? colors.black : colors.grey,
                ...styles.h3,
              }}
              dropDownContainerStyle={localStyles.dropDownContainerStyle}
              listMode="SCROLLVIEW"
            />
            {errors.languagesList && (
              <EText style={localStyles.errorText}>
                {translations['Field.required']}
              </EText>
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ETextInput
                  secure
                  placeholder={translations['Placeholder.password']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  {...register('password', {
                    required: translations['Message.passwordRequired'],
                  })}
                  error={!!errors.password}
                  errorText={errors.password && errors.password.message}
                  label={<Text>{translations['Profile.newPassword']}</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                  secureTextEntry
                />
              )}
              name="password"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ETextInput
                  secure
                  placeholder={translations['Placeholder.confirmPassword']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  {...register('confirmPassword', {
                    required: translations['Message.confirmPasswordRequired'],
                  })}
                  error={!!errors.confirmPassword}
                  errorText={
                    errors.confirmPassword && errors.confirmPassword.message
                  }
                  label={<Text>{translations['Profile.confirmPassword']}</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                  secureTextEntry
                />
              )}
              name="confirmPassword"
            />
            <View style={localStyles.textContainer}>
              <View style={localStyles.textWrapper}>
                <EText style={localStyles.subTitle}>
                  {translations['Profile.Term']}
                </EText>
              </View>
            </View>
            <EButton
              style={localStyles.button}
              onClick={handleSubmit(onPressSignUp)}
              title={translations['Profile.signUp']}
              loading={loading}
            />
          </ScrollView>
        </View>
      </BackgroundImage>
    </KeyboardAvoidingView>
  );
};

const localStyles = StyleSheet.create({
  container: {
    ...styles.flex,
    backgroundColor: colors.white,
  },
  textContainer: {
    ...styles.center,
  },
  textWrapper: {
    ...styles.center,
    ...styles.mh25,
  },
  title: {
    ...styles.h1,
    color: colors.black,
    ...styles.mv8,
  },
  subTitle: {
    color: colors.black,
    ...styles.h3,
    ...styles.mt2,
  },
  signupForm: {
    ...styles.flex,
  },
  signupData: {
    ...styles.flex,
    ...styles.rowSpaceBetween,
  },
  dropDownStyle: {
    ...styles.radius5,
    ...styles.mv10,
    ...styles.mh10,
    ...styles.selfCenter,
    ...styles.borderLight,
    width: wp(90),
  },
  dropDownContainerStyle: {
    ...styles.radius5,
    ...styles.selfCenter,
    ...styles.borderLight,
    width: wp(90),
  },
  labelStyle: {
    color: colors.black,
    ...styles.h2,
    ...styles.ml27,
    fontSize: normalize(12),
  },
  button: {
    ...styles.mt20,
    ...styles.mb50,
    bottom: 5,
  },
  errorText: {
    color: colors.error,
    marginLeft: 20,
  },
  signupTextContainer: {
    ...styles.center,
    marginTop: hp(38),
  },
  signupText: {
    color: colors.black,
    ...styles.h3,
    ...styles.mv8,
  },
});
export default SignupScreen;
