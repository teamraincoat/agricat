import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Modal from 'react-native-modal';

import CloseIcon from '../../assets/icons/CloseIcon';

import UploadLargeIcon from '../../assets/icons/UploadLargeIcon';
import EButton from '../../atoms/EButton';
import EText from '../../atoms/EText';
import { colors, styles } from '../../styles';
import { hp } from '../../styles/metrics';
import { translations } from '../../provider/LocalizeProvider';
import { getStorageData, saveStorageData } from '../../utils/localStorage';
import Constants from '../../constants/Constants';
import getRealm from '../../database/realmConfig';
// import getRealm from '../../database/realmConfig';

const UploadDataModal = (props) => {
  const { visible, closeModal } = props;
  const [startSync, setStartSync] = useState(false);
  const [remainFarmer, setRemainFarmer] = useState(null);
  const onCloseModal = () => {
    // setStartSync(false);
    closeModal(false);
  };
  useEffect(() => {
    getStorageData(Constants.STORAGE.ENROLL_USER_DATA)
      .then((result) => {
        if (result) {
          setRemainFarmer(result.length);
        } else {
          setRemainFarmer(0);
        }
      })
      .catch((e) => {
        console.log('error localStorage', e);
      });
  }, [visible]);

  const syncData = async () => {
    getRealm()
      .then((result) => {
        const { syncSession } = result;
        if (syncSession) {
        saveStorageData(Constants.STORAGE.ENROLL_USER_DATA, null);
          syncSession.resume();
        }
      })
      .catch((error) => {
        console.log('error--->', error);
      });
  };
  return (
    <Modal
      isVisible={visible}
      transparent={false}
      onBackButtonPress={onCloseModal}
      backdropColor={colors.lightGrey}>
      <View style={localStyles.mainContainer}>
        <Pressable style={localStyles.iconContainer} onPress={onCloseModal}>
          <CloseIcon />
        </Pressable>
        <View style={localStyles.uploadDataContainer}>
          <UploadLargeIcon />

          <EText style={localStyles.title}>{translations['Sync.title']}</EText>
          <EText style={localStyles.subTitle}>
            {`You are going to synchronize ${remainFarmer} farmers.`}
          </EText>
          <EButton
            title={translations['Sync.confirm']}
            onClick={() => syncData()}
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
