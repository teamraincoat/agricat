import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import Modal from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import CloseIcon from '../../assets/icons/CloseIcon';
import UploadIcon from '../../assets/icons/UploadIcon';
import UploadLargeIcon from '../../assets/icons/UploadLargeIcon';
import EButton from '../../atoms/EButton';
import EText from '../../atoms/EText';
import {colors, styles} from '../../styles';
import {hp, wp} from '../../styles/metrics';
import { translations } from '../../provider/LocalizeProvider';
const UploadDataModal = props => {
  const {visible, closeModal} = props;
  const onCloseModal = () => {
    closeModal(false);
  };
  return (
    //  <View style={localStyles.container}>

    <Modal
      isVisible={visible}
      //presentationStyle="pageSheet"
      transparent={false}
      onBackButtonPress={onCloseModal}
     backdropColor={colors.lightGrey}
    >
      <View style={localStyles.mainContainer}>
        <Pressable style={localStyles.iconContainer} onPress={onCloseModal}>
          <CloseIcon />
        </Pressable>
        <View style={localStyles.uploadDataContainer}>
          <UploadLargeIcon />

          <EText style={localStyles.title}>{translations['Sync.title']}</EText>
          <EText style={localStyles.subTitle}>
          {translations['Sync.subTitle']}
          </EText>
          <EButton
            title={translations['Sync.confirm']}
            onClick={() => console.log('sync')}
            style={localStyles.syncButton}
          />
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    // ...styles.flex,
    backgroundColor: colors.lightGrey,
    ...styles.flex,
  },
  iconContainer: {
    alignItems: 'flex-end',
    ...styles.mt25,
    ...styles.mr15,
  },
  uploadDataContainer: {
    ...styles.center,
    marginTop: hp(10),
  },
  title: {
    ...styles.h1,
    color: colors.black,
    ...styles.mv8,
    ...styles.mt30,
  },
  subTitle: {
    color: colors.black,
    ...styles.h3,
    ...styles.mv8,
  },
  syncButton: {
    ...styles.mt30,
  },
});

export default UploadDataModal;
