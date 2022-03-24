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
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import ImgToBase64 from 'react-native-image-base64';
import CheckBox from '@react-native-community/checkbox';
import { Decimal128, ObjectId, EJSON } from 'bson';

import { TextInputMask } from 'react-native-masked-text';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import ScanModal from './ScanModal';
import { colors, styles } from '../styles';
import EText from '../atoms/EText';

import Constants from '../constants/Constants';

import ImagesContainer from '../atoms/ImagesContainer';
import { useUsers } from '../provider/UsersProvider';
import { LocalizeContext } from '../provider/LocalizeProvider';
import { hp, normalize, wp } from '../styles/metrics';
import CameraIcon from '../assets/icons/CameraIcon';
import CloseIcon from '../assets/icons/CloseIcon';
import checkEnrollInfo from '../utils/curp';

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

const spokenLanguageItems = Constants.MX_INDIGENOUS_LANGUAGES.map(
  (lang) => ({ label: lang, value: lang.toLowerCase() }),
);

const RegisterUser = ({ route, navigation }) => {
  const { translations } = useContext(LocalizeContext);
  const [openGenderDropDown, setOpenGenderDropDown] = useState(false);
  const [openPhoneOwnerDropDown, setOpenPhoneOwnerDropDown] = useState(false);
  const [openMarketingChannelDropDown, setOpenMarketingChannelDropDown] = useState(false);
  const [openSpokenLangDropDown, setOpenSpokenLangDropDown] = useState(false);

  const [isSelected, setSelection] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [qrInfo, setQrInfo] = React.useState('');

  const { submitAddUser, enrollDataById } = useUsers();
  const [loading, setLoading] = useState(false);

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      surName: '',
      dob: '',
      gender: '',
      mobilePhone: '',
      mobilePhoneOwner: '',
      govId: '',
      applicationTime: '',
      coveredAreaHa: '',
      marketingChannel: '',
      spokenLangauge: '',
      images: [],
      notes: '',
    },
  });

  useEffect(() => {
    if (enrollDataById) {
      console.log('enrollDataById***********', enrollDataById);
      const {
        firstName,
        lastName,
        surName,
        dob,
        gender,
        mobilePhone,
        mobilePhoneOwner,
        govId,
        applicationTime,
        coveredAreaHa,
        marketingChannel,
        spokenLanguage,
        notes,
        images,
      } = enrollDataById;
      reset({
        firstName: firstName || '',
        lastName: lastName || '',
        surName: surName || '',
        dob: dob ? moment(new Date(dob)).format('DD-MM-YYYY') : '',
        gender: gender || '',
        mobilePhone: mobilePhone || '',
        mobilePhoneOwner: mobilePhoneOwner || '',
        govId: govId || '',
        coveredAreaHa: coveredAreaHa || '0',
        marketingChannel: marketingChannel || '',
        spokenLanguage: spokenLanguage || '',
        notes: notes || '',
        applicationTime: applicationTime
          ? moment(new Date(applicationTime)).format('DD/MM/YYYY')
          : '',
        images: images || [],
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
        surName: data.surName,
        gender: data.gender,
        dob: moment(data.dob.replace(/-/g, '/'), 'DD-MM-YYYY'),
        mobilePhone: data.mobilePhone,
        mobilePhoneOwner: data.mobilePhoneOwner,
        coveredAreaHa: Decimal128.fromString(
          // If the covered area was already saved as
          // Decimal, then we check the EJSON or
          // use the plain text
          typeof data.coveredAreaHa === 'object' ? data.coveredAreaHa.$numberDecimal : data.coveredAreaHa,
        ),
        govId: data.govId,
        marketingChannel: data.marketingChannel,
        spokenLanguage: data.spokenLanguage,
        notes: data.notes,
        images: data.images,
        applicationTime: new Date(),
        _id: enrollDataById && enrollDataById._id ? enrollDataById._id : new ObjectId(),
      };

      const farmerInfo = {
        firstName: data.firstName,
        lastName: data.lastName,
        dob: data.dob,
        gender: data.gender,
      };

      const isVerifiedData = checkEnrollInfo(farmerInfo);
      if (isVerifiedData) {
        submitAddUser(payload, navigation, isModify, route?.params?.campaignKey, setLoading);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const checkValidation = () => {
    const values = getValues();
    if (values.firstName === '' || values.lastName === '' || values.surName === '' || values.gender === '' || values.dob === '' || values.mobilePhone === '' || values.govId === '' || values.coveredAreaHa === '') {
      return false;
    }
    return true;
  };
  const onSubmit = () => {
    handleSubmit(register_user)();
    if (!checkValidation()) {
      Alert.alert(translations.Error, translations['Message.requireAlert']);
    }
  };
  useEffect(() => {
    const values = getValues();
    reset({ ...values, images: selectedFiles });
  }, [selectedFiles]);

  const formatImage = (sourceUri) => new Promise((resolve, reject) => {
    ImgToBase64.getBase64String(sourceUri)
      .then((base64String) => {
        resolve(base64String);
      })
      .catch((err) => {
        console.log('image encode error', err);
        reject(err);
      });
  });

  const onCameraPress = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then((image) => {
        const selectedImage = [];
        formatImage(image.path).then((response) => {
          selectedImage.push({
            name: image.path.substring(image.path.lastIndexOf('/') + 1),
            size: image.size.toString(),
            uri: response,
            type: image.mime,
          });
          setSelectedFiles(selectedFiles.concat(selectedImage));
        });
      })
      .catch((err) => {
        console.log('error while choose image from Camera===>', err);
      });
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
              showsVerticalScrollIndicator={false}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.firstName']}
                    style={[styles.p10]}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.firstName']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    {...register('firstName', {
                      required: translations['Field.required'],
                    })}
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
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.lastName']}
                    style={[styles.p10]}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.lastName']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    {...register('lastName', {
                      required: translations['Field.required'],
                    })}
                    error={!!errors.lastName}
                    errorText={errors.lastName && errors.lastName.message}
                  />
                )}
                name="lastName"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.surName']}
                    style={[styles.p10]}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.surName']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    {...register('surName', {
                      required: translations['Field.required'],
                    })}
                    error={!!errors.surName}
                    errorText={errors.surName && errors.surName.message}
                  />
                )}
                name="surName"
              />
              <EText style={localStyles.labelStyle}>{translations['Enroller.gender']}</EText>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
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
                      color: !value ? colors.grey : colors.black,
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
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInputMask
                    type={'datetime'}
                    options={{
                      format: 'DD-MM-YYYY',
                    }}
                    placeholder={translations['Placeholder.birthDate']}
                    style={[localStyles.datePicker,
                      errors.dob && { borderColor: colors.red, borderWidth: 1 }]}
                      {...register('dob', {
                        required: translations['Field.required'],
                        pattern: {
                          value: /^([0-9]{2})-([0-9]{2})-([0-9]{4})$/,
                          message: 'invalid date',
                        },

                      })}
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
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInputMask
                  type={'custom'}
                  options={{
                    mask: '+52 999 999 9999',
                  }}
                 placeholder={translations['Placeholder.contactNo']}
                 value={value}
                 onChangeText={(value) => onChange(value)}
                 {...register('mobilePhone', {
                   required: translations['Field.required'],
                 })}
                    style={[localStyles.inputStyle,
                      errors.mobilePhone && { borderColor: colors.red, borderWidth: 1 }]}
                />
                )}
                name="mobilePhone"
              />
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
                    // textStyle={{
                    //   color: !value ? colors.grey : colors.black,
                    //   ...styles.h3,
                    // }}
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
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    onBlur={onBlur}
                    label={<EText>CURP</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    style={styles.p10}
                    {...register('govId', {
                      required: translations['Field.required'],
                    })}
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
                    // textStyle={{
                    //   color: !value ? colors.grey : colors.black,
                    //   ...styles.h3,
                    // }}
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
                    value={value}
                    items={spokenLanguageItems}
                    setOpen={setOpenSpokenLangDropDown}
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
                name="spokenLanguage"
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

              <EText style={localStyles.labelStyle}>{translations['Enroller.image']}</EText>
              {selectedFiles && selectedFiles.length > 0 ? (
                <ImagesContainer
                  selectedFileImages={selectedFiles}
                  setSelectedImages={setSelectedFiles}
                />
              ) : (
                <Controller
                  control={control}
                  rules={{
                    required: false,
                  }}
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
              {/* {errors.images && <EText>{translations['Field.required']}</EText>} */}

              <View style={localStyles.acceptPermission}>
                <EText
                  maxLength={10}
                  multiline={true}
                  numberOfLines={2}
                  style={localStyles.permissionText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod.
                </EText>
                <CheckBox
                  value={isSelected}
                  onValueChange={setSelection}
                  tintColors={{ true: colors.black, false: colors.black }}
                />
              </View>
              <EButton
                title={translations['Enroller.complete']}
                onClick={onSubmit}
                loading={loading}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
      <ScanModal
        visible={modalVisible}
        closeModal={setModalVisible}
        setQrInfo={setQrInfo}
      />
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
  },
  dropDownContainerStyle: {
    ...styles.radius5,
    ...styles.selfCenter,
    ...styles.borderLight,
    zIndex: 9999,
    width: wp(90),
  },
  addImageButton: {
    ...styles.mh20,
    ...styles.ph15,
    ...styles.selfStart,
    ...styles.rowSpaceBetween,
    width: wp(50),
  },
  acceptPermission: {
    width: wp(90),
    ...styles.rowSpaceBetween,
    ...styles.ph20,
    ...styles.mt10,
  },
  permissionText: {
    ...styles.h3,
    width: wp(80),
    color: colors.black,
  },
  disabledtext: {
    color: colors.greyDark,
  },
  submitButton: {
    ...styles.mv15,
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
  },
});

const mapStateToProps = ({ EnrollReducers }) => {
  const { enrollData } = EnrollReducers;
  return {
    enrollData,
  };
};

export default connect(mapStateToProps)(RegisterUser);
