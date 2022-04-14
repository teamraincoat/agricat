import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Pressable, ActivityIndicator,
} from 'react-native';
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
import { useUsers } from '../../provider/UsersProvider';

const UploadDataModal = (props) => {
  const { visible, closeModal, enrolledLocally } = props;
  // const [startSync, setStartSync] = useState(false);
  const [remainFarmer, setRemainFarmer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const { setUsers } = useUsers();
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
    setLoading(true);
    getRealm()
      .then((result) => {
        const { syncSession } = result;
        if (syncSession) {
          syncSession.resume();
          saveStorageData(Constants.STORAGE.ENROLL_USER_DATA, null);
          syncSession.addProgressNotification(
            'upload',
            'forCurrentlyOutstandingWork',
            (transferred, transferable) => {
              const Percentage = (100.0 * transferred) / transferable;
              setProgressPercentage(Percentage);
              if (transferred < transferable) {
                setLoading(true);
              } else if (transferred === transferable) {
                const syncUsers = result.objects('Enrollment');
                if (syncUsers.length > 0) {
                  const sortedUsers = syncUsers.sorted('applicationTime', true);
                  sortedUsers.addListener(() => {
                    setUsers([...sortedUsers]);
                  });
                  setLoading(false);
                  onCloseModal();
                }
              }
            },
          );
        }
      })
      .catch((error) => {
        console.error(error);
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
