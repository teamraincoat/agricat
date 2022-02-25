/* eslint-disable no-shadow */
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useForm, Controller } from 'react-hook-form';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import ImgToBase64 from 'react-native-image-base64';
import CheckBox from '@react-native-community/checkbox';
import { Decimal128, ObjectId, EJSON } from 'bson';

import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import ScanModal from './ScanModal';
import { colors, styles } from '../styles';
import EText from '../atoms/EText';

import ImagesContainer from '../atoms/ImagesContainer';
import { useUsers } from '../provider/UsersProvider';
import { translations } from '../provider/LocalizeProvider';
import { hp, normalize, wp } from '../styles/metrics';
import CameraIcon from '../assets/icons/CameraIcon';
import CloseIcon from '../assets/icons/CloseIcon';

const gender = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
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

const spokenLanguageItems = [
  { label: 'Zapoteco', value: 'zapoteco' },
  { label: 'Mixtepo', value: 'mixtepo' },
  { label: 'Mazateco', value: 'mazateco' },
  { label: 'Mixe', value: 'mixe' },
];

const RegisterUser = ({ route, navigation }) => {
  const [dateState, setDateState] = useState(true);
  const [openGenderDropDown, setOpenGenderDropDown] = useState(false);
  const [openPhoneOwnerDropDown, setOpenPhoneOwnerDropDown] = useState(false);
  const [openMarketingChannelDropDown, setOpenMarketingChannelDropDown] = useState(false);
  const [openSpokenLangDropDown, setOpenSpokenLangDropDown] = useState(false);
  
  const [isSelected, setSelection] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [qrInfo, setQrInfo] = React.useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { submitAddUser, enrollDataById } = useUsers();

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

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    const values = getValues();
    if (dateState) {
      reset({ ...values, dob: date });
    } else {
      reset({ ...values, applicationTime: date });
    }
    hideDatePicker();
  };

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
      } = enrollDataById;
      reset({
        firstName: firstName ? firstName : '',
        lastName: lastName ? lastName : '',
        surName: surName ? surName : '',
        dob: dob ? moment(new Date(dob)).format('DD/MM/YYYY') : '',
        gender: gender ? gender : '',
        mobilePhone: mobilePhone ? mobilePhone : '',
        mobilePhoneOwner: mobilePhoneOwner ? mobilePhoneOwner : '',
        govId: govId ? govId : '',
        coveredAreaHa: coveredAreaHa ? coveredAreaHa : '0',
        marketingChannel: marketingChannel ? marketingChannel : '',
        spokenLanguage: spokenLanguage ? spokenLanguage : '',
        notes: notes ? notes : '',
        applicationTime: applicationTime
          ? moment(new Date(applicationTime)).format('DD/MM/YYYY')
          : '',
      });
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
        dob: new Date(data.dob),
        mobilePhone: data.mobilePhone,
        mobilePhoneOwner: data.mobilePhoneOwner,
        coveredAreaHa: Decimal128.fromString(
          // If the covered area was already saved as
          // Decimal, then we check the EJSON or
          // use the plain text
          typeof data.coveredAreaHa === 'object' ? data.coveredAreaHa['$numberDecimal'] : data.coveredAreaHa
        ),
        govId: data.govId,
        marketingChannel: data.marketingChannel,
        spokenLanguage: data.spokenLanguage,
        notes: data.notes,
        images: data.images,
        applicationTime: new Date(),
        _id: enrollDataById && enrollDataById._id ? enrollDataById._id : new ObjectId(),
      };
      submitAddUser(payload, navigation, isModify, route.params.campaignKey);
    } catch(err) {
      console.error(err);
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
            <EText style={localStyles.title}>Enrolar</EText>
            <View></View>
          </View>
          <EText style={localStyles.subTitle}>
            Complete y verifique la informacion del agricultor.
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
                    style={styles.p10}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.firstName']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="firstName"
              />
              {errors.firstName && (
                <EText>{translations['Field.required']}</EText>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.lastName']}
                    style={styles.p10}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.lastName']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="lastName"
              />
              {errors.lastName && (
                <EText>{translations['Field.required']}</EText>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.surName']}
                    style={styles.p10}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.surName']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                  />
                )}
                name="surName"
              />
              {errors.surName && (
                <EText>{translations['Field.required']}</EText>
              )}

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
                          ? colors.error
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
              {errors.gender && <EText>{translations['Field.required']}</EText>}

              <EText style={localStyles.labelStyle}>{translations['Enroller.dob']}</EText>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { value } }) => (
                  <EButton
                    title={
                      value
                        ? moment(value).format('DD/MM/YYYY')
                        : translations['Placeholder.birthDate']
                    }
                    onClick={() => {
                      setDateState(true);
                      showDatePicker();
                    }}
                    style={localStyles.datePicker}
                    textStyle={[
                      styles.selfStart,
                      {
                        color: !value ? colors.grey : '#121212',
                        ...styles.h3,
                      },
                    ]}
                  />
                )}
                name="dob"
              />
              {errors.dob && <EText>{translations['Field.required']}</EText>}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.contactNo']}
                    style={styles.p10}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    label={<EText>{translations['Enroller.telephone']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={value}
                    maxLength={10}
                  />
                )}
                name="mobilePhone"
              />
              {errors.mobilePhone && (
                <EText>{translations['Field.required']}</EText>
              )}

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
                  />
                )}
                name="govId"
              />
              {errors.govId && (
                <EText>{translations['Field.required']}</EText>
              )}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <ETextInput
                    placeholder={translations['Placeholder.coveredCropArea']}
                    onBlur={onBlur}
                    label={<EText>{translations['Enroller.coveredCropArea']}</EText>}
                    onChangeText={(value) => onChange(value)}
                    value={typeof value === 'object' ? value['$numberDecimal'] : value}
                    style={styles.p10}
                    keyboardType="numeric"
                  />
                )}
                name="coveredAreaHa"
              />
              {errors.coveredAreaHa && (
                <EText>{translations['Field.required']}</EText>
              )}

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
                      console.log('HERE 2', value);
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
                onClick={handleSubmit(register_user)}
                style={localStyles.submitButton}
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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        maximumDate={new Date()}
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
  datePicker: {
    ...styles.mb10,
    ...styles.mh10,
    ...styles.mv8,
    ...styles.mh10,
    ...styles.borderLight,
    height: hp(7),
    zIndex: 999,
    shadowColor: colors.transparent,
    backgroundColor: colors.white,
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
});

const mapStateToProps = ({ EnrollReducers }) => {
  const { enrollData } = EnrollReducers;
  return {
    enrollData,
  };
};

export default connect(mapStateToProps)(RegisterUser);
