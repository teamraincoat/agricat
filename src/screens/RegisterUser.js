import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import ScanModal from './ScanModal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {colors, styles} from '../styles';
import {useForm, Controller} from 'react-hook-form';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import {connect} from 'react-redux';
import {useLocal} from '../contex/index';
import EText from '../atoms/EText';
import ActionSheetBox from '../atoms/ActionSheet';
import ImagePicker from 'react-native-image-crop-picker';
import ImagesContainer from '../atoms/ImagesContainer';
import {useUsers} from '../provider/UsersProvider';
import uuid from 'react-native-uuid';
import ImgToBase64 from 'react-native-image-base64';
import {hp, normalize, wp} from '../styles/metrics';
import CameraIcon from '../assets/icons/CameraIcon';
import CheckBox from '@react-native-community/checkbox';
import CloseIcon from '../assets/icons/CloseIcon';
const gender = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

const RegisterUser = ({navigation, enrollData}) => {
  const [dateState, setDateState] = useState(true);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const {translations} = useLocal();
  const sheetRef = useRef();

  const {
    control,
    getValues,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({
    defaultValues: {
      firstName: 'Tushali',
      lastName: 'G',
      surName: 'Jasoliya',
      dob: '',
      gender: '',
      mobilePhone: '9876543210',
      addressLine: 'Surat',
      locality: 'Mota Varachha',
      applicationTime: '',
      geoJson: '',
      coveredAreaHa: 'Varachha',
      crop: '',
      cropType: 'Insurer',
      cropCycle: 'Weekly',
      images: [],
      payoutMethod: 'Cash',
      payoutMethodId: '',
      adminArea: '',
      subLocality: 'Sudama Chowk',
      notes: '',
    },
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [qrInfo, setQrInfo] = React.useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const {submitAddUser} = useUsers();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    const values = getValues();
    if (dateState) {
      reset({...values, dob: date});
    } else {
      reset({...values, applicationTime: date});
    }
    hideDatePicker();
  };

  const showActionSheet = () => {
    sheetRef.current.show();
  };

  useEffect(() => {
    if (qrInfo) {
      const {
        firstName,
        lastName,
        surName,
        dob,
        _id,
        gender,
        mobilePhone,
        locality,
        sublocality,
        applicationTime,
        geoJson,
        coveredArea,
        crop,
        cropType,
        cropCycle,
        policyPublicId,
        policyActiveId,
      } = qrInfo;
      reset({
        firstName: firstName ? firstName : '',
        lastName: lastName ? lastName : '',
        surName: surName ? surName : '',
        dob: dob ? moment(dob).format('DD/MM/YYYY') : '',
        gender: gender ? gender : '',
        mobilePhone: mobilePhone ? mobilePhone : '',
        addressLine: `${locality ? locality : ''}${
          sublocality ? sublocality : ''
        }`,
        locality: locality ? locality : '',
        municipality: sublocality ? sublocality : '',
        applicationTime: applicationTime
          ? moment(applicationTime).format('DD/MM/YYYY')
          : '',
        policyPublicId: policyPublicId ? policyPublicId : '',
        policyActiveId: policyActiveId ? policyActiveId : '',
        geoJson: geoJson ? geoJson : '',
        coveredArea: coveredArea ? coveredArea : '',
        crop: crop ? crop : '',
        cropType: cropType ? cropType : '',
        cropCycle: cropCycle ? cropCycle : '',
      });
    }
  }, [qrInfo]);

  let register_user = data => {
    submitAddUser({
      firstName: data.firstName,
      lastName: data.lastName,
      surName: data.surName,
      gender: data.gender,
      mobilePhone: data.mobilePhone,
      addressLine: data.addressLine,
      dob: new Date(data.dob),
      locality: data.locality,
      payoutMethod: data.payoutMethod,
      geoJson: data.geoJson,
      crop: data.crop,
      cropType: data.cropType,
      cropCycle: data.cropCycle,
      applicationTime: data.applicationTime,
      images: data.images,
      _id: uuid.v4(),
      //static value for test purpose
      adminArea: 'Athvaline',
      adminAreaId: '123',
      subLocality: 'test',
      subLocalityId: '1',
      localityId: '1',
      cropId: '1',
      payoutMethodId: '2',
    });

    // Alert.alert(
    //   translations['Success'],
    //   translations['Registration.success'],
    //   [
    //     {
    //       text: 'Ok',
    //       onPress: () => navigation.navigate('Home'),
    //     },
    //   ],
    //   {cancelable: false},
    // );
  };

  const onHandleScan = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    const values = getValues();
    reset({...values, images: selectedFiles});
  }, [selectedFiles]);

  const formatImage = sourceUri => {
    return new Promise(function (resolve, reject) {
      ImgToBase64.getBase64String(sourceUri)
        .then(base64String => {
          resolve(base64String);
        })
        .catch(err => {
          console.log('image encode error', err);
          reject(err);
        });
    });
  };
  const onImageLibraryPress = async () => {
    ImagePicker.openPicker({
      cropping: false,
      multiple: true,
      maxFiles: 5,
    })
      .then(images => {
        if (images.didCancel) {
          console.log('User cancelled photo picker');
        } else if (images.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (images.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          let listOfImages = [];
          images.map(item => {
            let sourceUri = Platform.OS === 'ios' ? item.sourceURL : item.path;
            formatImage(sourceUri).then(response => {
              listOfImages.push({
                name:
                  Platform.OS === 'ios'
                    ? item.filename
                    : item.path.substring(item.path.lastIndexOf('/') + 1),
                size: item.size.toString(),
                uri: response,
                type: item.mime,
              });
              if (selectedFiles && selectedFiles.length > 0) {
                function getUniqueListBy(arr, key) {
                  return [
                    ...new Map(arr.map(item => [item[key], item])).values(),
                  ];
                }
                const finalFilesList = [...listOfImages, ...selectedFiles];
                const uniqueFilesList = getUniqueListBy(finalFilesList, 'name');
                setSelectedFiles(uniqueFilesList);
              } else {
                setSelectedFiles([...listOfImages]);
              }
            });
          });
        }
      })
      .catch(err => {
        console.log('error while choose image from Library===>', err);
      });
  };

  const onCameraPress = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then(image => {
        let selectedImage = [];
        formatImage(image.path).then(response => {
          selectedImage.push({
            name: image.path.substring(image.path.lastIndexOf('/') + 1),
            size: image.size.toString(),
            uri: response,
            type: image.mime,
          });
          setSelectedFiles(selectedFiles.concat(selectedImage));
        });
      })
      .catch(err => {
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
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.firstName']}
                    style={styles.p10}
                    onBlur={onBlur}
                    label={<EText>First Name</EText>}
                    onChangeText={value => onChange(value)}
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
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.lastName']}
                    style={styles.p10}
                    onBlur={onBlur}
                    label={<EText>Last Name</EText>}
                    onChangeText={value => onChange(value)}
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
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.surName']}
                    style={styles.p10}
                    onBlur={onBlur}
                    label={<EText>Sur Name</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                  />
                )}
                name="surName"
              />
              {errors.surName && (
                <EText>{translations['Field.required']}</EText>
              )}
              <EText style={localStyles.labelStyle}>Gender</EText>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {value, onChange}}) => {
                  return (
                    <DropDownPicker
                      placeholder={translations['Placeholder.gender']}
                      open={openDropDown}
                      value={value}
                      items={gender}
                      setOpen={setOpenDropDown}
                      setValue={onChange}
                      onChangeValue={value => {
                        onChange(value);
                      }}
                      style={[
                        localStyles.dropDownStyle,
                        {...styles.mt10},
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
                  );
                }}
                name="gender"
              />
              {errors.gender && <EText>{translations['Field.required']}</EText>}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.contactNo']}
                    style={styles.p10}
                    onBlur={onBlur}
                    keyboardType="numeric"
                    label={<EText>Contact Number</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    maxLength={10}
                  />
                )}
                name="mobilePhone"
              />
              {errors.mobilePhone && (
                <EText>{translations['Field.required']}</EText>
              )}
              <EText style={localStyles.labelStyle}>Date of Birth</EText>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {value}}) => (
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
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.address']}
                    maxLength={225}
                    onBlur={onBlur}
                    multiline={true}
                    numberOfLines={5}
                    label={<EText>Address</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    // style={[{textAlignVertical: 'top'}, styles.p10]}
                  />
                )}
                name="addressLine"
              />
              {errors.addressLine && (
                <EText>{translations['Field.required']}</EText>
              )}

              <Controller
                control={control}
                rules={{
                  required: false,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.locality']}
                    onBlur={onBlur}
                    label={<EText>Locality</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                    editable={false}
                  />
                )}
                name="locality"
              />

              <Controller
                control={control}
                rules={{
                  required: false,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.sublocality']}
                    onBlur={onBlur}
                    label={<EText>Sub Locality</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                    editable={false}
                  />
                )}
                name="subLocality"
              />

              <Controller
                control={control}
                rules={{
                  required: false,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.geojson']}
                    onBlur={onBlur}
                    label={<EText>Geo Json</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="geoJson"
              />

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.coveredCropArea']}
                    onBlur={onBlur}
                    label={<EText>Covered Crop Area</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                    keyboardType="numeric"
                  />
                )}
                name="coveredAreaHa"
              />
              {errors.coveredAreaHa && (
                <EText>{translations['Field.required']}</EText>
              )}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.payoutMethod']}
                    onBlur={onBlur}
                    label={<EText>Payout Method</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="payoutMethod"
              />
              {errors.payoutMethod && (
                <EText>{translations['Field.required']}</EText>
              )}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.coveredCrop']}
                    onBlur={onBlur}
                    label={<EText>Covered Crop</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="crop"
              />
              {errors.crop && <EText>{translations['Field.required']}</EText>}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.cropType']}
                    onBlur={onBlur}
                    label={<EText>Crop Type</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="cropType"
              />
              {errors.cropType && (
                <EText>{translations['Field.required']}</EText>
              )}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.enrollCoveredCrop']}
                    onBlur={onBlur}
                    label={<EText>Enroll Covered Crop</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="cropCycle"
              />
              {errors.cropCycle && (
                <EText>{translations['Field.required']}</EText>
              )}
              <EText style={localStyles.labelStyle}>application Date</EText>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {value}}) => (
                  <EButton
                    title={
                      value
                        ? moment(value).format('DD/MM/YYYY')
                        : translations['Placeholder.applicationDate']
                    }
                    onClick={() => {
                      setDateState(false);
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
                name="applicationTime"
              />
              {errors.applicationTime && (
                <EText>{translations['Field.required']}</EText>
              )}
              <Controller
                control={control}
                rules={{
                  required: false,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.cropType']}
                    onBlur={onBlur}
                    label={<EText>Addition Notes (optional)</EText>}
                    onChangeText={value => onChange(value)}
                    value={value}
                    maxLength={225}
                    multiline={true}
                    numberOfLines={5}
                    style={[
                      styles.p10,
                      {textAlignVertical: 'top', height: hp(12)},
                    ]}
                  />
                )}
                name="notes"
              />
              <EText style={localStyles.labelStyle}>add photo</EText>
              {console.log('selected fiel==>', selectedFiles)}

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
                  render={({field: {onChange, onBlur, value}}) => (
                    <EButton
                      title={translations['AddImage']}
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
                  tintColors={{true: colors.black, false: colors.black}}
                />
              </View>
              <EButton
                title={translations['Submit']}
                onClick={handleSubmit(register_user)}
                style={localStyles.submitButton}
              />
              {/* <EButton
                title={translations['Submit']}
                onClick={() => submitAddEditBook()}
              /> */}
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
    ...styles.mt15
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
    shadowColor: colors.transparent,
    backgroundColor: colors.white,
  },
  dropDownContainerStyle: {
    ...styles.radius5,
    ...styles.selfCenter,
    ...styles.borderLight,
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

const mapStateToProps = ({EnrollReducers}) => {
  const {enrollData} = EnrollReducers;
  return {
    enrollData,
  };
};

export default connect(mapStateToProps)(RegisterUser);
