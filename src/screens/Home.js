/* eslint-disable no-underscore-dangle */
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  View,
  SafeAreaView,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from 'react-native';
import moment from 'moment';
import VersionNumber from 'react-native-version-number';

import ScanIcon from '../assets/icons/ScanIcon';
import { colors, styles } from '../styles';

import EText from '../atoms/EText';
import { useUsers } from '../provider/UsersProvider';

import MenuBarIcon from '../assets/icons/MenuBarIcon';
import { signOut, exitCampaign } from '../database/realmConfig';

import PendingUserList from '../componets/PendingUserList';
import NoCompaign from '../componets/NoCompaign';
import UploadIcon from '../assets/icons/UploadIcon';
import { hp, normalize, wp } from '../styles/metrics';
import UploadDataModal from './modals/UploadDataModal';
import ScanModal from './ScanModal';
import { translations } from '../provider/LocalizeProvider';
import { getStorageData } from '../utils/localStorage';
import Constants from '../constants/Constants';
import usePermission from '../hooks/usePermission';

const Home = ({ route, navigation }) => {
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCampaignAssign, setIsCampaignAssign] = useState(false);
  const [campaignData, setCampaignData] = useState(null);
  const [enrolledLocally, setEnrolledLocally] = useState(null);
  const [avgEnrollTime, setAvgEnrollTime] = useState('0s');

  const { users: enrollData } = useUsers();
  const { requestCameraPermission } = usePermission();

  let campaignInfo;
  if (route && route.params && route.params.campaignData) {
    campaignInfo = route.params.campaignData;
  } else if (campaignData) {
    campaignInfo = campaignData;
  }

  useEffect(() => {
    checkUserData();
    checkCampaignData();
  }, []);

  useEffect(() => {
    if (enrollData && enrollData.length > 0) {
      const localEnrolled = enrollData.filter((enrollee) => enrollee.status === 'active');
      let accDiff = 0;
      localEnrolled.forEach((enrolled) => {
        const start = moment(enrolled.applicationStartTime);
        const end = moment(enrolled.applicationTime);
        const diff = end.diff(start);
        accDiff += diff;
      });
      const avgDuration = moment.duration(accDiff / localEnrolled.length);
      setAvgEnrollTime(Number.isNaN(+avgDuration) ? '0s' : `${avgDuration.asSeconds().toFixed(0)}s`);
      setEnrolledLocally(localEnrolled.length);
    } else {
      setEnrolledLocally(0);
    }
  }, [enrollData]);

  const checkUserData = async () => {
    const userData = await getStorageData(Constants.STORAGE.USER_DATA);
    if (userData && userData.memberOf && userData.memberOf.length > 0) {
      setIsCampaignAssign(true);
    } else {
      setIsCampaignAssign(false);
    }
  };
  const checkCampaignData = async () => {
    if (campaignData) {
      return campaignData;
    }
    const getCampaignData = await getStorageData(Constants.STORAGE.CAMPAIGN_DATA);
    if (getCampaignData) {
      setCampaignData(getCampaignData);
    }
  };
  const onHandleScan = async () => {
    const granted = await requestCameraPermission();
    if (granted) {
      setModalVisible(true);
    }
  };

  const showUploadModal = () => {
    setUploadModalVisible(true);
  };

  const FarmerDataBlock = ({ title, value }) => {
    const {
      itemStyle, itemText, remainingPercentage,
    } = localStyles;
    return (
      <View style={itemStyle}>
        {value === 'loading' ? <ActivityIndicator size="large" color={colors.primary} /> : <EText style={remainingPercentage}>{value}</EText> }
        <EText numberOfLines={2} style={itemText}>
          {title}
        </EText>
      </View>
    );
  };

  // eslint-disable-next-line no-underscore-dangle
  const _offlineRenderItem = ({ item, index }) => <PendingUserList item={item} index={index} />;
  const checkMenuBar = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  return (
    <SafeAreaView style={localStyles.mainContainer}>
      <View style={[styles.flex, styles.p15]}>
        <View style={localStyles.headerContainer}>
          {isCampaignAssign ? (
            <Pressable onPress={showUploadModal}>
              <UploadIcon />
            </Pressable>
          ) : (
            <Pressable style={localStyles.syncIconContainer}>
              <EText style={localStyles.syncText} />
            </Pressable>
          )}

          <Pressable onPress={() => setIsMenuOpen(!isMenuOpen)}>
            <MenuBarIcon />
          </Pressable>
        </View>
        <TouchableWithoutFeedback onPress={checkMenuBar}>
          {isCampaignAssign ? (
            <View style={{ flex: 1 }}>
              <View style={localStyles.compaignInfo}>
                <EText style={localStyles.title}>
                  {`${translations['Campaign.title']} - ${campaignInfo && campaignInfo.name}`}
                </EText>
                <EText style={localStyles.subTitle}>
                  {translations.formatString(translations['Campaign.assign'], enrollData.length > 0 ? enrollData.length : 0)}
                </EText>
              </View>
              <View style={localStyles.container}>
                <FarmerDataBlock
                  title={`${translations['Campaign.avgTime']}`}
                  value={avgEnrollTime}
                />
                <FarmerDataBlock
                  title={`${translations['Campaign.rolledUp']}`}
                  value={enrolledLocally}
                />
              </View>
              <EText style={[localStyles.title, { ...styles.ml15 }]}>
                {translations['Campaign.locallyRolled']}
              </EText>

              {enrollData && enrollData.filter((enrollee) => enrollee.status === 'active').length > 0 ? (
                <View onStartShouldSetResponder={() => true} style={{ flex: 1 }}>
                  <FlatList
                    nestedScrollEnabled={true}
                    data={enrollData && enrollData.length > 0 ? enrollData.filter((enrollee) => enrollee.status === 'active') : []}
                    renderItem={_offlineRenderItem}
                    keyExtractor={(item) => item._id.toString()}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              ) : (
                <EText style={[localStyles.subTitle, { ...styles.ml15 }]}>
                  {translations['Campaign.nodata']}
                </EText>
              )}

              <Pressable
                style={[
                  styles.absolute,
                  localStyles.scanIconButton,
                ]}
                onPress={onHandleScan}>
                <ScanIcon />
              </Pressable>
            </View>
          ) : (
            <NoCompaign />
          )}
        </TouchableWithoutFeedback>
      </View>

      {isMenuOpen && (
        <View style={localStyles.menuItems}>
          <Pressable
            onPress={() => {
              signOut(navigation);
            }}
            style={localStyles.menuItemContainer}>
            <EText style={localStyles.menuTitle}>
              {translations['Menu.logout']}
            </EText>
          </Pressable>
          {isCampaignAssign && (
            <Pressable
              onPress={() => {
                if (+enrolledLocally > 0) {
                  return Alert.alert('AVISO IMPORTANTE', 'Tiene que sincronizar sus enrolamientos antes de salir.');
                }
                exitCampaign(navigation);
              }}
              style={localStyles.menuItemContainer}>
              <EText style={localStyles.menuTitle}>
                {translations['Menu.exitCampaign']}
              </EText>
            </Pressable>
          )}
          <Pressable
            style={localStyles.menuItemContainer}>
            <EText style={localStyles.subTitle}>
                {`${translations['App.version']}: ${VersionNumber.appVersion} Build (${VersionNumber.buildVersion})`}
            </EText>
          </Pressable>
        </View>
      )}
      <UploadDataModal
        visible={uploadModalVisible}
        closeModal={setUploadModalVisible}
        enrolledLocally={enrolledLocally || 0}
      />
      <ScanModal
        visible={modalVisible}
        closeModal={setModalVisible}
        route={navigation}
      />
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    ...styles.flex,
    backgroundColor: colors.lightGrey,
  },
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  compaignInfo: {
    ...styles.itemsStart,
    ...styles.mt30,
    ...styles.ml15,
  },
  remainingPercentage: {
    ...styles.h1,
    color: colors.black,
    fontSize: normalize(36),
    lineHeight: 43,
  },
  title: {
    ...styles.h1,
    color: colors.black,
    ...styles.mv8,
    ...styles.left,
  },
  subTitle: {
    color: colors.black,
    ...styles.h3,
    ...styles.mv8,
    ...styles.left,
  },
  scanIconButton: {
    bottom: 10,
    right: 10,
    paddingRight: 0,
    backgroundColor: colors.primary,
    height: 88,
    width: 88,
    ...styles.center,
    borderRadius: 44,
    shadowColor: '#4e4f72',
    shadowOpacity: 0.5,
    shadowRadius: 44,
    shadowOffset: {
      height: 1,
      width: 1,
    },

    elevation: 44,
  },
  syncIconContainer: {
    ...styles.rowSpaceBetween,
  },
  syncText: {
    ...styles.h3,
    color: colors.black,
    ...styles.ml10,
  },
  itemSeparator: { height: 20 },
  item: {
    marginTop: 10,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,
  },

  container: {
    marginVertical: 10,
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 0,
    ...styles.rowSpaceAround,
  },
  itemStyle: {
    backgroundColor: '#FFFFFF',
    ...styles.center,
    ...styles.mh15,
    ...styles.mv10,
    ...styles.radius5,
    ...styles.ph15,
    width: wp(38),
    height: hp(18),
    color: colors.black,
  },
  itemText: {
    color: '#393939',
    ...styles.h4,
    ...styles.mt10,
  },
  menuItems: {
    ...styles.absolute,
    width: wp(55),
    top: hp(2),
    right: wp(4),
    ...styles.radius8,
    backgroundColor: colors.white,
    zIndex: 1,
  },
  menuItemContainer: {
    borderBottomColor: 'rgba(0, 0, 0, 0.1);',
    borderBottomWidth: 1,
    height: hp(7),
    ...styles.center,
    ...styles.itemsStart,
    ...styles.ph20,
  },
  menuTitle: {
    ...styles.h3,
    lineHeight: 20,
    fontSize: normalize(18),
    color: colors.black,
  },
});

export default Home;
