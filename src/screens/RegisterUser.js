/* eslint-disable no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import { Decimal128, ObjectId } from 'bson';

import { TextInputMask } from 'react-native-masked-text';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import { colors, styles } from '../styles';
import EText from '../atoms/EText';

import Constants from '../constants/Constants';

import ImagesContainer from '../atoms/ImagesContainer';
import { useUsers } from '../provider/UsersProvider';
import { LocalizeContext } from '../provider/LocalizeProvider';
import { hp, normalize, wp } from '../styles/metrics';
import CameraIcon from '../assets/icons/CameraIcon';
import CloseIcon from '../assets/icons/CloseIcon';
import CameraView from '../atoms/CameraView';
// import checkEnrollInfo from '../utils/curp';

const gender = [
  { label: 'Masculino', value: 'male' },
  { label: 'Femenino', value: 'female' },
];

const phoneOwnerItems = [
  { label: 'Propio', value: 'self' },
  { label: 'Vecinos/Familiares', value: 'friend-family' },
];

const marketingChannelItems = [
  { label: 'CADER', value: 'cader' },
  { label: 'Vecinos/Familiares', value: 'friends-family' },
  { label: 'Líderes o Comisarios ejidales', value: 'community-leaders' },
  { label: 'Folleto, manta, cartel, radio, etc.', value: 'trad-media' },
  { label: 'Otro', value: 'other' },
];

const enrollmentPresenceItems = [
  { label: 'Titular', value: 'self' },
  { label: 'Familiar del/la titular', value: 'family' },
];

const enrollmentLocationItems = [
  { label: 'CADER', value: 'cader' },
  { label: 'Ejido', value: 'common-land' },
  { label: 'Hogar del asegurado', value: 'home' },
  { label: 'Otro', value: 'other' },
];

const questionOneOptions = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
];
const questionTwoOptions = [
  { label: 'Huracán', value: 'hurricane' },
  { label: 'Sequía', value: 'drought' },
  { label: 'Mucha lluvia', value: 'excess-rain' },
  { label: 'Incendio', value: 'fire' },
  { label: 'Granizada', value: 'hail' },
  { label: 'Plagas', value: 'plague' },
  { label: 'Otros', value: 'other' },
];

const spokenLanguageItems = Constants.MX_INDIGENOUS_LANGUAGES.map(
  (lang) => ({ label: lang, value: lang.toLowerCase() }),
);
// Prepend Spanish
spokenLanguageItems.unshift({ label: 'Español', value: 'es' });

const RegisterUser = ({ route, navigation }) => {
  const { translations } = useContext(LocalizeContext);
  const [openGenderDropDown, setOpenGenderDropDown] = useState(false);
  const [openPhoneOwnerDropDown, setOpenPhoneOwnerDropDown] = useState(false);
  const [openMarketingChannelDropDown, setOpenMarketingChannelDropDown] = useState(false);
  const [openSpokenLangDropDown, setOpenSpokenLangDropDown] = useState(false);
  // This question represents `enrollmentPresence`
  const [openEnrollmentPresence, setOpenEnrollmentPresence] = useState(false);
  // This question represents `enrollmentLocation`
  const [openEnrollmentLocation, setOpenEnrollmentLocation] = useState(false);
  // This question represents `lossLevel`
  const [openQuestion1DropDown, setOpenQuestion1DropDown] = useState(false);
  // This question represents `lossType`
  const [openQuestion2DropDown, setOpenQuestion2DropDown] = useState(false);

  // const [isSelected, setSelection] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [qrInfo, setQrInfo] = React.useState('');

  const { submitAddUser, enrollDataById } = useUsers();
  const [loading, setLoading] = useState(false);
  const [spokenLanguageList, setSpokenLanguageList] = useState([]);
  const [lossTypeList, setLossTypeList] = useState([]);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      secondLastName: '',
      dob: '',
      gender: '',
      mobilePhone: '',
      mobilePhoneOwner: '',
      govId: '',
      applicationTime: '',
      coveredAreaHa: '',
      marketingChannel: '',
      images: [],
      notes: '',
      enrollmentPresence: '',
      enrollmentLocation: '',
      question1: '',
      question2: '',
    },
  });

  useEffect(() => {
    if (enrollDataById) {
      const {
        firstName,
        lastName,
        secondLastName,
        dob,
        gender,
        mobilePhone,
        mobilePhoneOwner,
        govId,
        applicationTime,
        coveredAreaHa,
        marketingChannel,
        spokenLanguages,
        notes,
        images,
        surveyEnabled,
        _annotations,
      } = enrollDataById;
      reset({
        firstName: firstName || '',
        lastName: lastName || '',
        secondLastName: secondLastName || '',
        dob: dob || '',
        gender: gender || '',
        mobilePhone: mobilePhone || '+52',
        mobilePhoneOwner: mobilePhoneOwner || '',
        govId: govId || '',
        coveredAreaHa: coveredAreaHa || '0',
        marketingChannel: marketingChannel || '',
        spokenLanguages: spokenLanguages || [],
        notes: notes || '',
        applicationTime: applicationTime
          ? moment(new Date(applicationTime)).format('DD/MM/YYYY')
          : '',
        images: images || [],
        enrollmentPresence: _annotations.presence ? _annotations.presence : '',
        enrollmentLocation: _annotations.location ? _annotations.location : '',
        question1: _annotations.lossLevel ? _annotations.lossLevel : '',
        question2: _annotations.lossType ? _annotations.lossType : '',
        surveyEnabled: surveyEnabled || false,
      });
      if (enrollDataById && enrollDataById.images
        && enrollDataById.images.length > 0 && selectedFiles && selectedFiles.length === 0) {
        setSelectedFiles([...enrollDataById.images]);
      }
    }
  }, [enrollDataById]);

  // eslint-disable-next-line camelcase
  const register_user = (data) => {
    let isModify = false;
    if (enrollDataById && enrollDataById._id) {
      isModify = true;
    }
    try {
      const payload = {
        firstName: data.firstName,
        lastName: data.lastName,
        secondLastName: data.secondLastName,
        gender: data.gender,
        dob: data.dob,
        mobilePhone: data.mobilePhone.replace(/\s/g, ''),
        mobilePhoneOwner: data.mobilePhoneOwner,
        coveredAreaHa: Decimal128.fromString(
          // If the covered area was already saved as
          // Decimal, then we check the EJSON or
          // use the plain text
          typeof data.coveredAreaHa === 'object' ? data.coveredAreaHa.$numberDecimal : data.coveredAreaHa,
        ),
        govId: data.govId,
        marketingChannel: data.marketingChannel,
        spokenLanguages: data.spokenLanguages,
        notes: data.notes,
        images: data.images,
        applicationTime: new Date(),
        surveyEnabled: data.surveyEnabled,
        _annotations: {
          presence: data.enrollmentPresence,
          location: data.enrollmentLocation,
          lossLevel: data.question1,
          lossType: data.question2.join(','),
        },
        _id: enrollDataById && enrollDataById._id ? enrollDataById._id : new ObjectId(),
      };

      // For enrollment `govId` verification:
      //
      // const farmerInfo = {
      //   firstName: data.firstName,
      //   lastName: data.lastName,
      //   dob: data.dob,
      //   gender: data.gender,
      // };
      // const isVerifiedData = checkEnrollInfo(farmerInfo);
      const isVerifiedData = true;
      if (isVerifiedData) {
        submitAddUser(payload, navigation, isModify, route?.params?.campaignKey, setLoading);
      } else {
        Alert.alert(
          'Error',
          'Por favor verifique los datos ingresados',
          [
            {
              text: 'OK',
            },
          ],
          { cancelable: false },
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkValidation = () => {
    const values = getValues();
    if (values.firstName === '' || values.lastName === '' || values.secondLastName === '' || values.gender === '' || values.dob === '' || values.mobilePhone === '' || values.govId === '' || values.coveredAreaHa === '' || values.question1 === '') {
      return false;
    }
    return true;
  };
  const onSubmit = () => {
    if (!checkValidation()) {
      Alert.alert(translations.Error, translations['Message.requireAlert']);
    } else {
      handleSubmit(register_user)();
    }
  };
  useEffect(() => {
    const values = getValues();
    reset({
      ...values,
      images: selectedFiles,
      spokenLanguages: spokenLanguageList.length > 0 ? spokenLanguageList : [],
      question2: lossTypeList.length > 0 ? lossTypeList : [],
    });
  }, [selectedFiles, spokenLanguageList, lossTypeList]);

  const onCameraPress = () => {
    setIsCameraVisible(true);
  };

  return (
    <SafeAreaView style={styles.flex}>
      <View style={[localStyles.mainContainer, styles.flex]}>
        <View style={localStyles.enrollTextContainer}>
          <View style={localStyles.headerContent}>
            <Pressable onPress={() => navigation.goBack()}>
              <CloseIcon />
            </Pressable>
            <EText style={localStyles.title}>{translations['Enroller.title']}</EText>
            <View></View>
          </View>
          <EText style={localStyles.subTitle}>
            {translations['Enroller.subTitle']}
          </EText>
        </View>
        <View style={styles.flex}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={[styles.flex, styles.justifyBetween]}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <EText style={localStyles.labelStyle}>{translations['Enroller.image']}</EText>
              {selectedFiles && selectedFiles.length > 0 ? (
                <ImagesContainer
                  selectedFileImages={selectedFiles}
                  setSelectedImages={setSelectedFiles}
                />
              ) : (
                <Controller
                  control={control}
                  rules={{ required: translations['Field.required'] }}
                  render={() => (
                    <EButton
                    title={translations['Enroller.imageButton']}
                      onClick={() => onCameraPress()}
                      style={localStyles.addImageButton}>
                      <Pressable>
                        <CameraIcon />
                      </Pressable>
                    </EButton>
                  )}
                  name="images"
                />
              )}
              {errors.images && <EText style={localStyles.errorText}>{translations['Field.required']}</EText>}
              <Controller
                control={control}
                rules={{ required: translations['Field.required'] }}
                render={({
                  field: {
                    onChange, onBlur, value,
                  },
                }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.firstName']}
                    style={[styles.p10]}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.firstName']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    error={!!errors.firstName}
                    errorText={errors.firstName && errors.firstName.message}
                  />
                )}
                name="firstName"
              />
              {/* {errors.firstName && (
                <EText>{translations['Field.required']}</EText>
              )} */}
              <Controller
                control={control}
                rules={{ required: translations['Field.required'] }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.lastName']}
                    style={[styles.p10]}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.lastName']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    error={!!errors.lastName}
                    errorText={errors.lastName && errors.lastName.message}
                  />
                )}
                name="lastName"
              />
              <Controller
                control={control}
                rules={{ required: translations['Field.required'] }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.surName']}
                    style={[styles.p10]}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.surName']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    error={!!errors.surName}
                    errorText={errors.surName && errors.surName.message}
                  />
                )}
                name="secondLastName"
              />
              <EText style={localStyles.labelStyle}>{translations['Enroller.gender']}</EText>
              <Controller
                control={control}
                rules={{ required: translations['Field.required'] }}
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    placeholder={translations['Placeholder.gender']}
                    open={openGenderDropDown}
                    value={value}
                    items={gender}
                    setOpen={setOpenGenderDropDown}
                    setValue={onChange}
                    onChangeValue={(value) => {
                      onChange(value);
                    }}
                    style={[
                      localStyles.dropDownStyle,
                      { ...styles.mt10 },
                      {
                        borderColor: errors.gender
                          ? colors.red
                          : colors.transparent,
                      },
                    ]}
                    disableBorderRadius={true}
                    textStyle={{
                      color: colors.black,
                      ...styles.h3,
                    }}
                    dropDownContainerStyle={
                      localStyles.dropDownContainerStyle
                    }
                    listMode="SCROLLVIEW"
                  />
                )}
                name="gender"
              />
              {errors.gender && <EText style={localStyles.errorText}>{translations['Field.required']}</EText>}

              <EText style={localStyles.labelStyle}>{translations['Enroller.dob']}</EText>
              <Controller
                control={control}
                rules={{
                  required: translations['Field.required'],
                  pattern: {
                    value: /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/,
                    message: 'Fecha inválida',
                  },
                }}

                render={({ field: { onChange, value } }) => (
                  <TextInputMask
                    type={'datetime'}
                    options={{
                      format: 'YYYY-MM-DD',
                    }}
                    placeholder={translations['Placeholder.birthDate']}
                    style={[localStyles.datePicker,
                      errors.dob && { borderColor: colors.red, borderWidth: 2 }]}
                    value={value}
                    onChangeText={(text) => onChange(text)}
                    />
                )}
                name="dob"
              />
              {errors.dob && <EText style={localStyles.errorText}>{errors.dob.message}</EText>}
              <EText style={localStyles.labelStyle}>{translations['Enroller.telephone']}</EText>
              <Controller
                control={control}
                rules={{ required: translations['Field.required'] }}
                render={({ field: { onChange, value } }) => (
                  <TextInputMask
                  type={'custom'}
                  options={{
                    mask: '+52 999 999 9999',
                  }}
                 placeholder={translations['Placeholder.contactNo']}
                 value={value}
                 keyboardType="number-pad"
                 onChangeText={(value) => onChange(value)}
                    style={[localStyles.inputStyle,
                      errors.mobilePhone && { borderColor: colors.red, borderWidth: 2 }]}
                />
                )}
                name="mobilePhone"
              />
              {errors.mobilePhone && <EText style={localStyles.errorText}>{translations['Field.required']}</EText>}
              <EText style={localStyles.labelStyle}>{translations['Enroller.telephoneOwner']}</EText>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    placeholder={translations['Placeholder.selectItem']}
                    open={openPhoneOwnerDropDown}
                    value={value}
                    items={phoneOwnerItems}
                    setOpen={setOpenPhoneOwnerDropDown}
                    setValue={onChange}
                    onChangeValue={(value) => {
                      onChange(value);
                    }}
                    style={[
                      localStyles.dropDownStyle,
                      { ...styles.mt10 },
                      {
                        borderColor: colors.transparent,
                      },
                    ]}
                    disableBorderRadius={true}
                    dropDownContainerStyle={
                      localStyles.dropDownContainerStyle
                    }
                    listMode="SCROLLVIEW"
                  />
                )}
                name="mobilePhoneOwner"
              />

              <Controller
                control={control}
                rules={{ required: translations['Field.required'] }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    onBlur={onBlur}
                    label={<EText>CURP</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    style={styles.p10}
                    error={!!errors.govId}
                    errorText={errors.govId && errors.govId.message}
                  />
                )}
                name="govId"
              />
              <Controller
                control={control}
                rules={{
                  required: false,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.coveredCropArea']}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.coveredCropArea']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={typeof value === 'object' ? value.$numberDecimal : value}
                    style={[styles.p10, localStyles.readOnly]}
                    keyboardType="numeric"
                    editable={false}
                  />
                )}
                name="coveredAreaHa"
              />
              <EText style={localStyles.labelStyle}>{translations['Enroller.marketingChannel']}</EText>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    placeholder={translations['Placeholder.selectItem']}
                    open={openMarketingChannelDropDown}
                    value={value}
                    items={marketingChannelItems}
                    setOpen={setOpenMarketingChannelDropDown}
                    setValue={onChange}
                    onChangeValue={(value) => {
                      onChange(value);
                    }}
                    style={[
                      localStyles.dropDownStyle,
                      { ...styles.mt10 },
                      {
                        borderColor: colors.transparent,
                      },
                    ]}
                    disableBorderRadius={true}
                    textStyle={{
                      color: colors.black,
                      ...styles.h3,
                    }}
                    dropDownContainerStyle={
                      localStyles.dropDownContainerStyle
                    }
                    listMode="SCROLLVIEW"
                  />
                )}
                name="marketingChannel"
              />

            <EText style={localStyles.labelStyle}>{translations['Enroller.spokenLanguage']}</EText>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    placeholder={translations['Placeholder.selectItem']}
                    open={openSpokenLangDropDown}
                    multiple={true}
                     value={[...spokenLanguageList]}
                    items={spokenLanguageItems}
                    setOpen={setOpenSpokenLangDropDown}
                    setValue={(value) => {
                      setSpokenLanguageList(value);
                      setOpenSpokenLangDropDown(!openSpokenLangDropDown);
                    }}

                    style={[
                      localStyles.dropDownStyle,
                      { ...styles.mt10 },
                      {
                        borderColor: colors.transparent,
                      },
                    ]}
                    disableBorderRadius={true}
                    textStyle={{
                      color: colors.black,
                      ...styles.h3,
                    }}
                    dropDownContainerStyle={
                      localStyles.dropDownContainerStyle
                    }
                    listMode="SCROLLVIEW"
                  />
                )}
                name="spokenLanguages"
              />

              <EText style={localStyles.labelStyle}>{translations['Enroller.presence']}</EText>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    placeholder={translations['Placeholder.selectItem']}
                    open={openEnrollmentPresence}
                    value={value}
                    items={enrollmentPresenceItems}
                    setOpen={setOpenEnrollmentPresence}
                    setValue={onChange}
                    onChangeValue={(value) => {
                      onChange(value);
                    }}
                    style={[
                      localStyles.dropDownStyle,
                      { ...styles.mt10 },
                      {
                        borderColor: colors.transparent,
                      },
                    ]}
                    disableBorderRadius={true}
                    dropDownContainerStyle={
                      localStyles.dropDownContainerStyle
                    }
                    listMode="SCROLLVIEW"
                  />
                )}
                name="enrollmentPresence"
              />

              <EText style={localStyles.labelStyle}>{translations['Enroller.location']}</EText>
              <Controller
                control={control}
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    placeholder={translations['Placeholder.selectItem']}
                    open={openEnrollmentLocation}
                    value={value}
                    items={enrollmentLocationItems}
                    setOpen={setOpenEnrollmentLocation}
                    setValue={onChange}
                    onChangeValue={(value) => {
                      onChange(value);
                    }}
                    style={[
                      localStyles.dropDownStyle,
                      { ...styles.mt10 },
                      {
                        borderColor: colors.transparent,
                      },
                    ]}
                    disableBorderRadius={true}
                    dropDownContainerStyle={
                      localStyles.dropDownContainerStyle
                    }
                    listMode="SCROLLVIEW"
                  />
                )}
                name="enrollmentLocation"
              />

              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.notes']}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.notes']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    maxLength={225}
                    multiline={true}
                    numberOfLines={5}
                    style={[
                      styles.p10,
                      { textAlignVertical: 'top', height: hp(12) },
                    ]}
                  />
                )}
                name="notes"
              />
            <View style={[localStyles.enrollTextContainer, styles.mb20]}>
            <EText style={localStyles.title}>{translations['Enroller.questions']}</EText>
            <EText style={localStyles.subTitle}>
              {translations['Enroller.questionInstruction']}
            </EText>
            </View>
            <EText style={localStyles.labelStyle}>{translations['Enroller.question1']}</EText>
              <Controller
                control={control}
                rules={{ required: translations['Field.required'] }}
                render={({ field: { value, onChange } }) => (
                  <DropDownPicker
                    placeholder={translations['Placeholder.selectItem']}
                    open={openQuestion1DropDown}
                    value={value}
                    items={questionOneOptions}
                    setOpen={setOpenQuestion1DropDown}
                    setValue={onChange}
                    onChangeValue={(value) => {
                      onChange(value);
                      const values = getValues();
                      reset({
                        ...values,
                        question1: value,
                      });
                    }}
                    style={[
                      localStyles.dropDownStyle,
                      { ...styles.mt10 },
                      {
                        borderColor: errors.question1 ? colors.red : colors.transparent,
                      },
                    ]}
                    disableBorderRadius={true}
                    dropDownContainerStyle={
                      localStyles.dropDownContainerStyle
                    }
                    listMode="SCROLLVIEW"
                  />
                )}
                name="question1"
              />
              {errors.question1 && <EText style={localStyles.errorText}>{translations['Field.required']}</EText>}
              <EText style={localStyles.labelStyle}>{translations['Enroller.question2']}</EText>
              <Controller
                control={control}
                rules={{
                  required: !(getValues().question1 === '0' || getValues().question1 === ''),
                }}
                render={() => (
                  <DropDownPicker
                    placeholder={translations['Placeholder.selectItem']}
                    open={openQuestion2DropDown}
                    items={questionTwoOptions}
                    setOpen={setOpenQuestion2DropDown}
                     multiple={true}
                     value={[...lossTypeList]}
                    setValue={(value) => {
                      setLossTypeList(value);
                      setOpenQuestion2DropDown(!openQuestion2DropDown);
                    }}
                    style={[
                      localStyles.dropDownStyle,
                      { ...styles.mt10 },
                      {
                        borderColor: errors.question2 ? colors.red : colors.transparent,
                      },
                    ]}
                    textStyle={{
                      color: colors.black,
                      ...styles.h3,
                    }}
                    disableBorderRadius={true}
                    dropDownContainerStyle={
                      localStyles.dropDownContainerStyle
                    }
                    listMode="SCROLLVIEW"
                  />
                )}
                name="question2"
              />
              {errors.question2 && <EText style={localStyles.errorText}>{translations['Field.required']}</EText>}

              <EButton
                title={translations['Enroller.complete']}
                onClick={onSubmit}
                loading={loading}
                style={styles.mb10}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
      {isCameraVisible && (
        <CameraView
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
          setIsCameraVisible={setIsCameraVisible}
        />
      )}
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.lightGrey,
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
  enrollTextContainer: {
    ...styles.center,
    ...styles.mt15,
  },
  headerContent: {
    ...styles.rowSpaceBetween,
    width: wp(85),
    // ...styles.alignStart,
  },
  headerContainer: {
    ...styles.rowSpaceBetween,
    ...styles.ph10,
  },
  headerButton: {
    width: '40%',
    marginHorizontal: 10,
  },
  dropDownStyle: {
    ...styles.radius5,
    ...styles.mv10,
    ...styles.mh10,
    ...styles.selfCenter,
    ...styles.borderLight,
    width: wp(90),
    height: hp(7),
  },
  labelStyle: {
    color: colors.black,
    ...styles.h2,
    ...styles.mh25,
    fontSize: normalize(12),
  },
  readOnly: {
    backgroundColor: colors.cream,
    color: colors.black,
  },
  datePicker: {
    ...styles.mv5,
    ...styles.pv10,
    ...styles.borderLight,
    ...styles.ph15,
    elevation: 0,
    width: wp(90),
    ...styles.selfCenter,
    backgroundColor: colors.white,
    color: 'black',
    ...styles.radius5,
    height: hp(7),
  },
  dropDownContainerStyle: {
    ...styles.radius5,
    ...styles.selfCenter,
    ...styles.borderLight,
    zIndex: 9999,
    elevation: 9999,
    width: wp(90),
  },
  addImageButton: {
    ...styles.mh20,
    ...styles.ph15,
    ...styles.selfStart,
    ...styles.rowSpaceBetween,
    ...styles.mv10,
    width: wp(50),
  },
  errorText: {
    color: colors.red,
    ...styles.mh20,
    ...styles.mv10,
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
    height: hp(7),
  },
});

export default RegisterUser;
