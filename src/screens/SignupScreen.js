/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import Realm from 'realm';
import { ObjectId } from 'bson';

import { useForm, Controller } from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import { app, signIn, signUp } from '../database/realmConfig';
import { translations } from '../provider/LocalizeProvider';
import { colors, styles } from '../styles';
import { hp, normalize, wp } from '../styles/metrics';
import BackgroundImage from '../atoms/BackgroundImage';

DropDownPicker.setMode('BADGE');
const SignupScreen = ({ navigation, route }) => {
  const [openDropDown, setOpenDropDown] = useState(false);
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
    console.log('data====>', data);
    const args = [];
    const { email } = userCredential;
    const { password } = data;
    try {
      if (data.password !== data.confirmPassword) {
        Alert.alert('Password and Confirm Password are not same');
        return;
      }
      // setLoading(true);
      const credential = Realm.Credentials.emailPassword(userCredential.email, userCredential.password);
      const newUser = await app.logIn(credential);
      const userData = await newUser.refreshCustomData();
      console.log('userData', userData);
      const mongo = newUser.mongoClient('mongodb-atlas');
      const userList = mongo.db('mexico').collection('User');

      const filter = {
        _id: userData && userData._id,
      };
      const newUserData = await userList.findOne(filter);
      console.log('<--------newUserData----->', newUserData);
      //  todo: newUserData is not getting data from User collection
      // after getting data from User collection, we need to update the data in User collection
     // const resetPassword = await app.emailPasswordAuth.callResetPasswordFunction({ email, password });

    } catch (error) {
      console.log('Sign up error', error);
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
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
    // eslint-disable-next-line global-require
    <BackgroundImage src={require('../assets/Profile.png')}>
      <View style={localStyles.signupTextContainer}>
        <EText style={localStyles.title}>Perfil</EText>
        <EText style={localStyles.subTitle}>
          Completa su perfil para continuar.
        </EText>
      </View>
      <View style={localStyles.signupForm}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={[localStyles.signupData, localStyles.justifyBetween]}>
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
                  placeholder={translations['Placeholder.Name']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  error={!!errors.name}
                  errorText={errors.name && errors.name.message}
                  label={<Text>Name</Text>}
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
                  placeholder={translations['Placeholder.Telephone']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
                  {...register('telephone', {
                    required: 'Telephone is required',
                  })}
                  error={!!errors.telephone}
                  errorText={errors.telephone && errors.telephone.message}
                  label={<Text>Telephone</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                />
              )}
              name="telephone"
            />
            <EText style={localStyles.labelStyle}>
              Language (besides Spanish)
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
                    required: 'Password is required',
                  })}
                  error={!!errors.password}
                  errorText={errors.password && errors.password.message}
                  label={<Text>New Password</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
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
                    required: 'ConfirmPassword is required',
                  })}
                  error={!!errors.confirmPassword}
                  errorText={
                    errors.confirmPassword && errors.confirmPassword.message
                  }
                  label={<Text>Confirm Password</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                />
              )}
              name="confirmPassword"
            />
            <View style={localStyles.textContainer}>
              <View style={localStyles.textWrapper}>
                <EText style={localStyles.subTitle}>
                  {'By continuing you are accepting the'}
                </EText>
                <EText style={localStyles.subTitle}>
                  {'Terms of Service and Privacy Policy.'}
                </EText>
              </View>
            </View>
            <EButton
              style={localStyles.button}
              onClick={handleSubmit(onPressSignUp)}
              title="Sign up"
              loading={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </BackgroundImage>
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
    ...styles.mb30,
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
