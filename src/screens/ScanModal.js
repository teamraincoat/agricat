import React, { useState } from 'react';
import {
  StyleSheet, TouchableOpacity, View,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Modal from 'react-native-modal';
import { Buffer } from 'buffer';
import { useRoute } from '@react-navigation/native';

import moment from 'moment';
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
  const { translations } = useLocal();
  const currentRoute = useRoute();
  const onSuccessScan = (e) => {
    try {
      const qrData = Buffer.from(e.data, 'base64').toString('utf-8').split('|');
      const applicationStartTime = moment(new Date()).toISOString();
      setApplicationStartTime(applicationStartTime);
      // const newQrData = e && e.data && (e.data).split('|');
      const enrollmentId = qrData[1];
      const campaignKey = qrData[0];
      setEnrollData(enrollmentId, campaignKey);
      route.navigate('Consent', { campaignKey });
      closeModal(false);
    } catch (err) {
      console.error('An error occurred', err);
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
  return (
    <>
      <Modal
        isVisible={visible}
        style={[localStyles.mainContainer, styles.selfCenter, styles.m0]}
        onRequestClose={onCloseModal}
        >
          <View style={{ zIndex: 1 }}>
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

        <QRCodeScanner
          cameraStyle={[localStyles.cameraStyle, styles.selfCenter]}
          onRead={onSuccessScan}
        />
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
    width: hp(100),
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
  },
});

export default ScanModal;
