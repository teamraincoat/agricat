import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import Modal from 'react-native-modal';
import CloseIcon from '../assets/icons/CloseIcon';
import {colors, styles} from '../styles';
import {useLocal} from '../contex/index';

const ScanModal = props => {
  const {visible, closeModal, setQrInfo} = props;
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
        <QRCodeScanner
          cameraStyle={[localStyles.cameraStyle, styles.selfCenter]}
          onRead={onSuccessScan}
          topContent={
            <View style={[styles.rowCenter, styles.p30]}>
              <Text
                style={[
                  localStyles.centerText,
                  styles.flex,
                  styles.selfCenter,
                  styles.pb0,
                ]}>
                {translations['ScanQrCode']}
              </Text>
              <TouchableOpacity onPress={onCloseModal}>
                <CloseIcon />
              </TouchableOpacity>
            </View>
          }
        />
      </Modal>
    </>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.black,
  },
  cameraStyle: {
    width: 200,
    height: 200,
    borderRadius: 4,
    borderWidth: 4,
  },
  centerText: {
    fontSize: 18,
    color: colors.grey,
  },
  textBold: {
    fontWeight: '500',
    color: colors.white,
  },
});

export default ScanModal;
