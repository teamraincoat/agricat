import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Alert,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import EText from '../atoms/EText';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {signIn, signUp} from '../database/realmConfig';
import {useForm, Controller} from 'react-hook-form';
import {translations} from '../provider/LocalizeProvider';
import DropDownPicker from 'react-native-dropdown-picker';
import {colors , styles} from '../styles';
import { hp, normalize, wp } from '../styles/metrics';
import BackgroundImage from '../atoms/BackgroundImage';

const genderList = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];
DropDownPicker.setMode("BADGE");
const SignupScreen = ({navigation}) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const [languageSelect, SetLanguageSelect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lList,setLList] = useState([])

  const Items = [
    {label: 'German', value: 'German'},
    {label: 'English', value: 'English'},
    {label: 'French', value: 'French'},
  ];


  const onPressSignUp = async data => {
    try {
      await signUp(data.email, data.password);
      signIn(data.email, data.password, data ,navigation);
    } catch (error) {
      console.log('Sign up error', error);
      Alert.alert(`Failed to sign up: ${error.message}`);
    }
  };

  useEffect(() => {
    if (lList) {
      const signUpData = getValues();
      reset({...signUpData, languagesList: lList.length > 0 ? lList : [],});
    }
  }, [lList]);
  const {
    control,
    getValues,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
    register,
  } = useForm({
    defaultValues: {
      firstName: 'Test First Name',
        lastName: 'Test Last Name',
      phoneNumber: '+85512345678',
      email: 'tj1@yopmail.com',
      password: '123456',
      confirmPassword: '123456',
      gender: '',
      languagesList: [],
    },
  });

  return (
      <BackgroundImage src={require('../assets/Profile.png')}>
    {/* <SafeAreaView style={styles.container}> */}

      <View style={localStyles.signupTextContainer}>
      <EText style={localStyles.title}>Perfil</EText>
      <EText style={localStyles.subTitle}>Completa su perfil para continuar.</EText>
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
              render={({field: {onChange, onBlur, value, ref}}) => (
                <ETextInput
                  placeholder={translations['Placeholder.firstName']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  {...register('firstName', {
                    required: 'First Name is required',
                  })}
                  error={!!errors.firstName}
                  errorText={errors.firstName && errors.firstName.message}
                  label={<Text>First Name</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                />
              )}
              name="firstName"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value, ref}}) => (
                <ETextInput
                  placeholder={translations['Placeholder.lastName']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  {...register('lastName', {
                    required: 'Last Name is required',
                  })}
                  error={!!errors.lastName}
                  errorText={errors.lastName && errors.lastName.message}
                  label={<Text>Last Name</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                />
              )}
              name="lastName"
            />

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value, ref}}) => (
                <ETextInput
                  phone
                  placeholder={translations['Placeholder.phoneNumber']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  {...register('phoneNumber', {
                    required: 'phoneNumber is required',
                  })}
                  error={!!errors.phoneNumber}
                  errorText={errors.phoneNumber && errors.phoneNumber.message}
                  label={<Text>Phone Number</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                />
              )}
              name="phoneNumber"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value, ref}}) => (
                <ETextInput
                  email
                  placeholder={translations['Placeholder.email']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  error={!!errors.email}
                  errorText={errors.email && errors.email.message}
                  label={<Text>Email</Text>}
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  keyboardShouldPersistTaps
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value:
                        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                />
              )}
              name="email"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value, ref}}) => (
                <ETextInput
                  secure
                  placeholder={translations['Placeholder.password']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  error={!!errors.password}
                  errorText={errors.password && errors.password.message}
                  label={<Text>Password</Text>}
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
              render={({field: {onChange, onBlur, value, ref}}) => {

                return(
                <ETextInput
                  secure
                  placeholder={translations['Placeholder.confirmPassword']}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={value => onChange(value)}
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
              )
            }}
              name="confirmPassword"
            />
            <EText style={localStyles.labelStyle}>Gender</EText>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {value, onChange, ref}}) => {
                return (
                  <DropDownPicker
                    placeholder={translations['Placeholder.gender']}
                    open={openDropDown}
                    value={value}
                    items={genderList}
                    setOpen={setOpenDropDown}
                    setValue={onChange}
                    onChangeValue={value => {
                      onChange(value);
                    }}
                    style={[
                      localStyles.dropDownStyle,
                      {...styles.mt10},
                      {borderColor: errors.gender ? colors.error : colors.transparent},
                    ]}
                    disableBorderRadius={true}
                    textStyle={{
                        color: !value ? colors.grey : colors.black,
                        ...styles.h3
                    }}
                    dropDownContainerStyle={localStyles.dropDownContainerStyle}
                    listMode="SCROLLVIEW"
                  />
                );
              }}
              name="gender"
            />
            {errors.gender && (
              <EText style={localStyles.errorText}>
                {translations['Field.required']}
              </EText>
            )}
            <EText style={localStyles.labelStyle}>Language</EText>
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
                      {...styles.mt10},
                      {borderColor: errors.languagesList ? colors.error : colors.transparent},
                    ]}
                    disableBorderRadius={true}
                    textStyle={{
                      color: lList.length > 0 ? colors.black : colors.grey,
                      ...styles.h3
                    }}
                    dropDownContainerStyle={localStyles.dropDownContainerStyle}
                    listMode="SCROLLVIEW"
                  />
            {errors.languagesList && (
              <EText style={localStyles.errorText}>
                {translations['Field.required']}
              </EText>
            )}
            {/* <Pressable
              style={localStyles.loginTextContainer}
              onPress={() => navigation.navigate('Login')}>
              <EText style={localStyles.loginText}>{'Login?'}</EText>
            </Pressable> */}
            <EButton
              style={localStyles.button}
              onClick={handleSubmit(onPressSignUp)}
              title="Sign up"
              loading={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    {/* </SafeAreaView> */}
    </BackgroundImage>
  );
};

// const localStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   title: {
//     fontSize: 30,
//     textAlign: 'center',
//     margin: 10,
//   },
//   loginTextContainer: {
//     width: '90%',
//     alignSelf: 'center',
//   },
//   loginText: {
//     marginTop: 10,
//     fontSize: 16,
//   },
//   linkContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginTop: 10,
//     paddingHorizontal: 10,
//   },
//   button: {
//     paddingVertical: 12,
//     height: 55,
//     borderRadius: 30,
//     marginBottom: '20%',
//   },
//   inputContainer: {
//     padding: 0,
//   },
//   inputStyle: {
//     borderColor: 'black',
//     padding: 10,
//     borderRadius: 2,
//   },
//   dropDownStyle: {
//     backgroundColor: 'transparent',
//     borderRadius: 10,
//     borderWidth: 2,
//     marginHorizontal: 10,
//     marginVertical: 10,
//     alignSelf: 'center',
//     width: '90%',
//   },
//   errorText: {
//     color: 'red',
//     marginLeft: 20,
//   },
// });
const localStyles = StyleSheet.create({
    container: {
      ...styles.flex,
      backgroundColor: colors.white,
    },
    title:{
        ...styles.h1,
        color: colors.black,
        ...styles.mv8,
    },
    subTitle:{
        color: colors.black,
        ...styles.h3,
        ...styles.mv8,
    },
    signupForm:{
        ...styles.flex,
    },
    signupData:{
        ...styles.flex,
        ...styles.rowSpaceBetween
    },
    dropDownStyle:{
    ...styles.radius5,
    ...styles.mv10,
    ...styles.mh10,
    ...styles.selfCenter,
    ...styles.borderLight,
    width: wp(90),
    },
    dropDownContainerStyle:{
       ...styles.radius5,
        ...styles.selfCenter,
        ...styles.borderLight,
        width: wp(90),
    },
    labelStyle:{
        color: colors.black,
        ...styles.h2,
        ...styles.ml27,
        fontSize: normalize(12),
        },
        button: {
            ...styles.mv20,
              },
    errorText: {
        color: colors.error,
        marginLeft: 20,
    },
    signupTextContainer:{
        ...styles.center,
        marginTop:hp(38),
    },
    signupText:{
        color: colors.black,
        ...styles.h3,
        ...styles.mv8,
    },

});
export default SignupScreen;
