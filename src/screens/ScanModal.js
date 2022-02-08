import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import Modal from 'react-native-modal';
import CloseIcon from '../assets/icons/CloseIcon';
import {colors, styles} from '../styles';
import {useLocal} from '../contex/index';
import {hp, wp} from '../styles/metrics';
import EText from '../atoms/EText';
import EButton from '../atoms/EButton';
import ETextInput from '../atoms/ETextInput';
import BackIcon from '../assets/icons/BackIcon';
import { translations } from '../provider/LocalizeProvider';
const ScanModal = props => {
  const {visible, closeModal, setQrInfo, route} = props;
  const [id, setId] = useState('');
  const {translations} = useLocal();
  const onSuccessScan = e => {
    try {
      setQrInfo(JSON.parse(e.data));
      closeModal(false);
    } catch (err) {
      console.error('An error occurred', err);
    }
  };

  const onCloseModal = () => {
    closeModal(false);
  };

  return (
    <>
      <Modal
        isVisible={visible}
        style={[localStyles.mainContainer, styles.selfCenter, styles.m0]}>
        <View
          style={[
            styles.rowSpaceBetween,
            styles.mt25,
            styles.ph20,
            styles.mb15,
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
            ]}>
            {translations['ScanQr.title']}

          </EText>
          <View />
        </View>
        <ETextInput
          defaultValue={id}
          onChangeText={text => setId({value: text, error: ''})}
          //label={<Text>ID</Text>}
          autoCapitalize="none"
          placeholder="enter id"
          returnKeyType="done"
          blurOnSubmit={false}
          keyboardShouldPersistTaps
        />
        <QRCodeScanner
          cameraStyle={[localStyles.cameraStyle, styles.selfCenter]}
          onRead={onSuccessScan}
        />
        <EButton
          title={translations['ScanQr.enterManually']}
          onClick={() => {
            closeModal(false);
            route.navigate('Consent');
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
  cameraStyle: {
    // width: 200,
    // height: 200,
    // borderRadius: 4,
    // borderWidth: 4,
    // width: wp(100),//
    height: hp(100),
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
