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
import {colors} from '../styles';

const genderList = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];
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
    <SafeAreaView style={styles.container}>
      <EText style={styles.title}>SignUp</EText>

      <View style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={[styles.flex, styles.justifyBetween]}>
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
                  label={<Text>LastName</Text>}
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
                      styles.dropDownStyle,
                      styles.mt10,
                      {borderColor: errors.gender ? 'red' : colors.darkBlack},
                    ]}
                    disableBorderRadius={true}
                    textStyle={{
                      color: !value ? colors.grey : colors.black,
                    }}
                    dropDownContainerStyle={{
                      width: '90%',
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}
                    listMode="SCROLLVIEW"
                  />
                );
              }}
              name="gender"
            />
            {errors.gender && (
              <EText style={styles.errorText}>
                {translations['Field.required']}
              </EText>
            )}
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
                      styles.dropDownStyle,
                      styles.mt10,
                      {borderColor: errors.languagesList ? 'red' : colors.darkBlack},
                    ]}
                    disableBorderRadius={true}
                    textStyle={{
                      color: lList.length > 1 ? colors.grey : colors.black,
                    }}
                    dropDownContainerStyle={{
                      width: '90%',
                      alignSelf: 'center',
                      borderRadius: 10,
                    }}
                    listMode="SCROLLVIEW"
                  />
            {errors.languagesList && (
              <EText style={styles.errorText}>
                {translations['Field.required']}
              </EText>
            )}
            <Pressable
              style={styles.loginTextContainer}
              onPress={() => navigation.navigate('Login')}>
              <EText style={styles.loginText}>{'Login?'}</EText>
            </Pressable>
            <EButton
              style={styles.button}
              onClick={handleSubmit(onPressSignUp)}
              title="Sign up"
              loading={loading}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
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
  loginTextContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  loginText: {
    marginTop: 10,
    fontSize: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  button: {
    paddingVertical: 12,
    height: 55,
    borderRadius: 30,
    marginBottom: '20%',
  },
  inputContainer: {
    padding: 0,
  },
  inputStyle: {
    borderColor: 'black',
    padding: 10,
    borderRadius: 2,
  },
  dropDownStyle: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 10,
    marginVertical: 10,
    alignSelf: 'center',
    width: '90%',
  },
  errorText: {
    color: 'red',
    marginLeft: 20,
  },
});
export default SignupScreen;
