/* eslint-disable no-shadow */
import React, {
  useContext, useEffect, useState,
} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInputMask } from 'react-native-masked-text';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import { app, checkCampaignMatrix } from '../database/realmConfig';
import { LocalizeContext } from '../provider/LocalizeProvider';
import { colors, styles } from '../styles';
import { hp, normalize, wp } from '../styles/metrics';
import BackgroundImage from '../atoms/BackgroundImage';
import { saveStorageData } from '../utils/localStorage';
import Constants from '../constants/Constants';
import { checkUserInfo } from '../utils/curp';
import PrivacyPolicyModal from './modals/PrivacyPolicyModal';

DropDownPicker.setMode('BADGE');
const Image = require('../assets/Profile.png');

const SignupScreen = ({ navigation }) => {
  const { translations } = useContext(LocalizeContext);

  const [visibleLangDropDown, setVisibleLangDropDown] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [lList, setLList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [privacyData, setPrivacyData] = useState(null);
  // const userCredential = route && route.params && route.params.userCredential;

  const Items = Constants.MX_INDIGENOUS_LANGUAGES.map(
    (lang) => ({ label: lang, value: lang.toLowerCase() }),
  );

  const onPressSignUp = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        Alert.alert(translations['Message.passwordAreSame']);
        return;
      }
      setLoading(true);
      const userData = await app.currentUser.refreshCustomData();
      const mongo = app.currentUser.mongoClient('mongodb-atlas');
      const userList = mongo.db(Constants.REALM.DB_NAME).collection('User');
      const newUserData = await userList.updateOne(
        { _id: userData && userData._id },
        {
          $set: {
            name: data.name,
            languagesList: [...data.languagesList],
            mobilePhone: data.telephone.replace(/ /g, ''),
            isFirstLogin: false,
          },
        },
      );
      const resetParams = {
        email: userData.email,
        password: data.password,
      };
      await app.emailPasswordAuth.callResetPasswordFunction(
        resetParams,
      );
      const campaignMetrics = await checkCampaignMatrix(userData);

      setLoading(false);
      if (newUserData.modifiedCount === 1) {
        saveStorageData(Constants.STORAGE.IS_PENDING_REGISTRATION, false);
        navigation.navigate('Main', {
          screen: 'Home',
          params: {
            campaignMetrics,
          },
        });
      }
    } catch (error) {
      setLoading(false);
      console.error('Sign up error', error);
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
  };

  useEffect(() => {
    if (lList) {
      const signUpData = getValues();
      reset({ ...signUpData, languagesList: lList.length > 0 ? lList : [] });
    }
  }, [lList]);

  useEffect(() => {
    register('name', { required: translations['Message.nameRequired'] });
    register('telephone', { required: translations['Message.telephoneRequired'] });
    register('password', { required: translations['Message.passwordRequired'] });
    register('confirmPassword', { required: translations['Message.confirmPasswordRequired'] });
  }, []);
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
              render={({
                field: {
                  onChange, onBlur, value,
                },
              }) => (
                <ETextInput
                  placeholder={translations['Placeholder.name']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
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
            <EText style={localStyles.labelStyle}>
            {translations['Profile.Telephone']}
            </EText>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({
                field: {
                  onChange, value,
                },
              }) => (
                <TextInputMask
                  type={'custom'}
                  options={{
                    mask: '+52 999 999 9999',
                  }}
                  placeholder={translations['Placeholder.telephone']}
                 value={value}
                 onChangeText={(value) => onChange(value)}
                 returnKeyType="next"
                 style={[localStyles.inputStyle,
                   errors.telephone && { borderColor: colors.red, borderWidth: 1 }]}
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
              open={visibleLangDropDown}
              value={[...lList]}
              items={Items}
              showTickIcon={true}
              showArrowIcon={true}
              showBadgeDot={true}
              setOpen={setVisibleLangDropDown}
              setValue={(value) => {
                setLList(value);
                setVisibleLangDropDown(!visibleLangDropDown);
              }}
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
                // color: lList.length > 0 ? colors.black : colors.grey,
                color: colors.black,
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
              render={({
                field: {
                  onChange, onBlur, value,
                },
              }) => (
                <ETextInput
                  secure
                  placeholder={translations['Placeholder.password']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
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
              render={({
                field: {
                  onChange, onBlur, value,
                },
              }) => (
                <ETextInput
                  secure
                  placeholder={translations['Placeholder.confirmPassword']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={(value) => onChange(value)}
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
                <View style={localStyles.linkContainer}>
                <Pressable onPress={() => {
                  setPrivacyData('Term');
                  setModalVisible(!modalVisible);
                }}>
                <EText style={[localStyles.subTitle, localStyles.link]}>
                  {translations['Profile.TermLink']}
                </EText>
                </Pressable>
                <EText style={localStyles.subTitle}>
                  {translations['Profile.and']}
                </EText>
                <Pressable onPress={() => {
                  setPrivacyData('Privacy');
                  setModalVisible(!modalVisible);
                }}>
                <EText style={[localStyles.subTitle, localStyles.link]}>
                  {translations['Profile.PrivacyLink']}
                </EText>
                </Pressable>
                </View>
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
      <PrivacyPolicyModal
      visible={modalVisible}
      isFrom={privacyData}
      closeModal={setModalVisible}
      />
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
  inputStyle: {
    color: colors.black,
    ...styles.mv10,
    ...styles.ph10,
    ...styles.pv10,
    ...styles.borderLight,
    ...styles.ph15,
    elevation: 0,
    width: wp(90),
    ...styles.selfCenter,
    backgroundColor: colors.white,
    ...styles.radius5,
  },
  linkContainer: {
    ...styles.flexRow,
  },
  link: {
    color: colors.black,
    textDecorationLine: 'underline',
    marginHorizontal: 5,
  },
});
export default SignupScreen;
