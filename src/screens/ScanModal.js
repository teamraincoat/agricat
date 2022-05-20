import React, { useState } from 'react';
import {
  Alert,
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import Modal from 'react-native-modal';
import { Buffer } from 'buffer';
import { useRoute } from '@react-navigation/native';
import crashlytics from '@react-native-firebase/crashlytics';
import moment from 'moment';
import { CameraScreen } from 'react-native-camera-kit';
import { colors, styles } from '../styles';
import { useLocal } from '../contex/index';
import { hp, wp } from '../styles/metrics';
import EText from '../atoms/EText';
import EButton from '../atoms/EButton';
import ETextInput from '../atoms/ETextInput';
import BackIcon from '../assets/icons/BackIcon';

import { useUsers } from '../provider/UsersProvider';

const ScanModal = (props) => {
  const {
    visible, closeModal, route,
  } = props;
  const { setEnrollData, setApplicationStartTime } = useUsers();
  const [id, setId] = useState('');
  const [error, setError] = useState(false);
  const { translations } = useLocal();
  const currentRoute = useRoute();

  const onSuccessScan = (e) => {
    const qrCodeResult = e?.nativeEvent?.codeStringValue;
    try {
      const qrData = Buffer.from(qrCodeResult, 'base64').toString('utf-8').split('|');
      const applicationStartTime = moment(new Date()).toISOString();
      const enrollmentId = qrData[1];
      const campaignKey = qrData[0];
      const scanResult = setEnrollData(enrollmentId, campaignKey);
      if (scanResult && scanResult.length > 0) {
        setApplicationStartTime(applicationStartTime);
        route.navigate('Consent', { campaignKey });
        closeModal(false);
      } else {
        setError(true);
        Alert.alert(
          'Error',
          translations['ScanQr.error'],
          [
            {
              text: 'OK',
              onPress: () => setError(false),
            },
          ],
          { cancelable: false },
        );
      }
    } catch (err) {
      console.error('An error occurred', err);
      crashlytics().recordError(err);
    }
  };

  const onCloseModal = () => {
    if (currentRoute && currentRoute.name !== 'Home') {
      route.navigate('Home');
      closeModal(false);
    } else {
      closeModal(false);
    }
  };

  const failedQrCode = () => null;

  return (
    <>
      <Modal
        isVisible={visible}
        style={[localStyles.mainContainer, styles.selfCenter, styles.m0]}
        onRequestClose={onCloseModal}
        >
          <View style={{ zIndex: 1, ...styles.absolute, top: 0 }}>
            <View
            style={[
              styles.rowSpaceBetween,
              styles.selfStart,
              styles.mt25,
              styles.mb15,
              localStyles.headerContainer,
            ]}>
            <TouchableOpacity onPress={onCloseModal}>
              <BackIcon />
            </TouchableOpacity>
            <EText
              style={[
                localStyles.centerText,
                styles.selfCenter,
                styles.pb0,
                styles.h3,
                { color: colors.black },
              ]}>
              {translations['ScanQr.title']}
            </EText>
            <View />
          </View>
          <ETextInput
            defaultValue={id}
            onChangeText={(text) => setId(text)}
            autoCapitalize="none"
            placeholder={translations['ScanQr.manualInputPlaceholder']}
            returnKeyType="done"
            blurOnSubmit={false}
            style={localStyles.input}
            placeholderTextColor={colors.grey}
            // keyboardShouldPersistTaps
          />
        </View>
        {visible && (
          <CameraScreen
            style={localStyles.cameraStyle}
            onReadCode={error ? failedQrCode : onSuccessScan}
            scanBarcode={true}
            frameColor={colors.white}
            showFrame={true}
            laserColor={colors.red}
          />
        )}
        <EButton
          title={translations['ScanQr.enterManually']}
          onClick={() => {
            if (id && id !== '') {
              closeModal(false);
              onSuccessScan({ data: id });
              route.navigate('Consent');
              setId('');
            }
          }}
          style={localStyles.scanButton}
        />
      </Modal>
    </>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.lightGrey,
  },
  headerContainer: { width: wp(90), alignSelf: 'center' },
  cameraStyle: {
    width: wp(100),
    height: hp(100),
  },
  input: {
    color: colors.black,
    width: wp(90),
    alignSelf: 'center',
  },
  centerText: {
    fontSize: 18,
    color: colors.grey,
  },
  textBold: {
    fontWeight: '500',
    color: colors.white,
  },
  scanButton: {
    ...styles.mv15,
    ...styles.absolute,
    bottom: 5,
  },
});

export default ScanModal;
