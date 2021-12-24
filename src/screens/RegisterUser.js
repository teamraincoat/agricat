import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  StyleSheet,
  Platform,
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
import { ObjectId } from "bson";
const gender = [
  {label: 'Male', value: 'male'},
  {label: 'Female', value: 'female'},
  {label: 'Other', value: 'other'},
];

const RegisterUser = ({navigation, enrollData}) => {
  const [dateState, setDateState] = useState(true);
  const [openDropDown, setOpenDropDown] = useState(false);
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
      firstName: 'testF',
      lastName: 'TestL',
      surName: 'TestS',
      dateOfBirth: '',
      enrollId: '222',
      gender: '',
      contactNo: '855',
      address: '842,grihi',
      locality: 'ggreg',
      municipality: 'gergr',
      dateOfApplication: '',
      policyPublicId: 'ger',
      policyActiveId: 'geg',
      geoJson: 'feggg',
      coveredArea: '223',
      crop: '222',
      cropType: 'khkh',
      cropCycle: 'iiih',
      images: [],
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
      reset({...values, dateOfBirth: date});
    } else {
      reset({...values, dateOfApplication: date});
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
        dateOfBirth: dob ? moment(dob).format('DD/MM/YYYY') : '',
        enrollId: _id,
        gender: gender ? gender : '',
        contactNo: mobilePhone ? mobilePhone : '',
        address: `${locality ? locality : ''}${sublocality ? sublocality : ''}`,
        locality: locality ? locality : '',
        municipality: sublocality ? sublocality : '',
        dateOfApplication: applicationTime
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
      mobilePhone: data.contactNo,
      address1:data.address,
      dob: new Date(data.dateOfBirth),
      locality: data.locality,
      TBD: data.municipality,
      municipality: data.municipality,
      policyPublicId: data.policyPublicId,
      policyActiveId: data.policyActiveId,
      geoJson: data.geoJson,
      coveredArea: data.coveredArea,
      crop: data.crop,
      cropType: data.cropType,
      cropCycle: data.cropCycle,
      dateOfApplication: data.dateOfApplication,
      enrollId: 'rewrwerwer',
      _id: uuid.v4(),
    });

    Alert.alert(
      translations['Success'],
      translations['Registration.success'],
      [
        {
          text: 'Ok',
          onPress: () => navigation.navigate('Home'),
        },
      ],
      {cancelable: false},
    );
  };

  const onHandleScan = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    const values = getValues();
    reset({...values, images: selectedFiles});
  }, [selectedFiles]);

  const onImageLibraryPress = () => {
    ImagePicker.openPicker({
      cropping: false,
      multiple: true,
      maxFiles: 5,
    })
      .then(images => {
        const selectedImage = images.map(item => {
          return {
            name:
              Platform.OS === 'ios'
                ? item.filename
                : item.path.substring(item.path.lastIndexOf('/') + 1),
            size: item.size,
            uri: Platform.OS === 'ios' ? item.sourceURL : item.path,
            type: item.mime,
          };
        });
        const finalFilesList = [...selectedImage, ...selectedFiles].filter(
          (
            set => o =>
              set.has(o.name) ? false : set.add(o.name)
          )(new Set()),
        );
        setSelectedFiles(finalFilesList);
      })
      .catch(err => {
        if (err.code === 'E_PICKER_CANCELLED') {
          console.log('Picker Cancelled by user');
        } else {
          console.log('Error===>', JSON.stringify(err));
        }
      });
  };

  const onCameraPress = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
    }).then(image => {
      const selectedImage = [
        {
          name: image.path.substring(image.path.lastIndexOf('/') + 1),
          size: image.size,
          uri: image.path,
          type: image.mime,
        },
      ];
      setSelectedFiles(selectedFiles.concat(selectedImage));
    });
  };

  return (
    <SafeAreaView style={styles.flex}>
      <ActionSheetBox
        ActionRef={sheetRef}
        captureFromCamera={onCameraPress}
        onImageLibraryPress={onImageLibraryPress}
      />
      <View style={[localStyles.mainContainer, styles.flex, styles.p15]}>
        <View style={[styles.rowSpaceBetween, styles.mb20]}>
          <EButton
            title={translations['Back']}
            onClick={() => navigation.goBack(null)}
          />
          <EButton title={translations['Scan']} onClick={onHandleScan} />
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
                    onChangeText={value => onChange(value)}
                    value={value}
                  />
                )}
                name="surName"
              />
              {errors.surName && (
                <EText>{translations['Field.required']}</EText>
              )}
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
                        color: !value ? colors.grey : colors.black,
                        fontWeight: 'normal',
                      },
                    ]}
                  />
                )}
                name="dateOfBirth"
              />
              {errors.dateOfBirth && (
                <EText>{translations['Field.required']}</EText>
              )}

              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.enrollId']}
                    keyboardType="numeric"
                    style={styles.p10}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                  />
                )}
                name="enrollId"
              />
              {errors.enrollId && (
                <EText>{translations['Field.required']}</EText>
              )}

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
                      style={[localStyles.dropDownStyle, styles.mt10]}
                      disableBorderRadius={true}
                      textStyle={{
                        color: !value ? colors.grey : colors.black,
                      }}
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
                    onChangeText={value => onChange(value)}
                    value={value}
                    maxLength={10}
                  />
                )}
                name="contactNo"
              />
              {errors.contactNo && (
                <EText>{translations['Field.required']}</EText>
              )}
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
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={[{textAlignVertical: 'top'}, styles.p10]}
                  />
                )}
                name="address"
              />
              {errors.address && (
                <EText>{translations['Field.required']}</EText>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.locality']}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="locality"
              />
              {errors.locality && (
                <EText>{translations['Field.required']}</EText>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.municipality']}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="municipality"
              />
              {errors.municipality && (
                <EText>{translations['Field.required']}</EText>
              )}
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
                        color: !value ? colors.grey : colors.black,
                        fontWeight: 'normal',
                      },
                    ]}
                  />
                )}
                name="dateOfApplication"
              />
              {errors.dateOfApplication && (
                <EText>{translations['Field.required']}</EText>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.policyId']}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="policyPublicId"
              />
              {errors.policyPublicId && (
                <EText>{translations['Field.required']}</EText>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.policyActiveId']}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="policyActiveId"
              />
              {errors.policyActiveId && (
                <EText>{translations['Field.required']}</EText>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.enrolleeCoordinate']}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                  />
                )}
                name="geoJson"
              />
              {errors.geoJson && (
                <EText>{translations['Field.required']}</EText>
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <ETextInput
                    placeholder={translations['Placeholder.coveredCropArea']}
                    onBlur={onBlur}
                    onChangeText={value => onChange(value)}
                    value={value}
                    style={styles.p10}
                    keyboardType="numeric"
                  />
                )}
                name="coveredArea"
              />
              {errors.coveredArea && (
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
              <ImagesContainer
                selectedFileImages={selectedFiles}
                setSelectedImages={setSelectedFiles}
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <EButton
                    title={translations['AddImage']}
                    onClick={() => showActionSheet()}
                    style={localStyles.addImageButton}
                  />
                )}
                name="images"
              />
              {errors.images && <EText>{translations['Field.required']}</EText>}

              <EButton
                title={translations['Submit']}
                onClick={handleSubmit(register_user)}
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
    backgroundColor: colors.white,
  },
  dropDownStyle: {
    backgroundColor: colors.white,
    borderColor: colors.lightBlue,
    borderRadius: 0,
  },
  datePicker: {
    backgroundColor: colors.white,
    borderColor: colors.black,
    borderWidth: 1,
    borderColor: colors.lightBlue,
  },
  addImageButton: {
    backgroundColor: 'green',
  },
});

const mapStateToProps = ({EnrollReducers}) => {
  const {enrollData} = EnrollReducers;
  return {
    enrollData,
  };
};

export default connect(mapStateToProps)(RegisterUser);
