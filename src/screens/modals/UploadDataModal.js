import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Pressable, Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import NetInfo from '@react-native-community/netinfo';
import crashlytics from '@react-native-firebase/crashlytics';

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
import { addAnalyticsLogs } from '../../utils/firebase';

const UploadDataModal = (props) => {
  const { visible, closeModal, enrolledLocally } = props;
  const [remainFarmer, setRemainFarmer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);

  const onCloseModal = () => {
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
        console.error('error localStorage', e);
        crashlytics().recordError(e);
      });
  }, [visible]);

  const syncData = async () => {
    const netState = await NetInfo.fetch();
    if (
      !netState.isConnected || !netState.isInternetReachable
    ) {
      Alert.alert('NO HAY CONNECIÓN', 'Debe tener conección para sincronizar.');
      return;
    }
    setLoading(true);
    const userData = await getStorageData(Constants.STORAGE.USER_DATA);
    getRealm()
      .then((projectRealm) => {
        const { syncSession } = projectRealm;
        if (syncSession) {
          syncSession.resume();
          saveStorageData(Constants.STORAGE.ENROLL_USER_DATA, null);
          // Upload progress notifications
          syncSession.addProgressNotification(
            'upload',
            'forCurrentlyOutstandingWork',
            (transferred, transferable) => {
              addAnalyticsLogs(userData._id, 'uploadStatus', { upload_status: 'startUploading' });
              const Percentage = (100.0 * transferred) / transferable;
              setProgressPercentage(Percentage);
              if (transferred < transferable) {
                setLoading(true);
              } else if (transferred === transferable) {
                addAnalyticsLogs(userData._id, 'uploadStatus', { upload_status: 'success' });
                setLoading(false);
                setProgressPercentage(0);
                onCloseModal();
              }
            },
          );
        }
      })
      .catch((error) => {
        console.error(error);
        crashlytics().recordError(new Error(error.message));
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
            {translations.formatString(translations['Sync.subTitle'], enrolledLocally || remainFarmer || 0)}
          </EText>
          <EButton
            title={translations['Sync.confirm']}
            onClick={() => syncData()}
            style={localStyles.syncButton}
            loading={loading}
            loadingText={`${progressPercentage.toFixed(2)}%`}
          />
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  loaderContainer: {
    ...styles.flex,
    ...styles.center,
  },
  loaderText: {
    ...styles.h1,
    ...styles.mt25,
  },
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
