/* eslint-disable no-underscore-dangle */
import React, { useState } from 'react';
import {
  FlatList,
  View,
  SafeAreaView,
  RefreshControl,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';

import ScanIcon from '../assets/icons/ScanIcon';
import { colors, styles } from '../styles';
import { setEnrollDataInStore } from '../redux/action/EnrollActions';

import EText from '../atoms/EText';
import { useUsers } from '../provider/UsersProvider';

import MenuBarIcon from '../assets/icons/MenuBarIcon';
import { signOut } from '../database/realmConfig';

import PendingUserList from '../componets/PendingUserList';
import SyncIcon from '../assets/icons/SyncIcon';
import NoCompaign from '../componets/NoCompaign';
import UploadIcon from '../assets/icons/UploadIcon';
import { hp, normalize, wp } from '../styles/metrics';
import UploadDataModal from './modals/UploadDataModal';
import ScanModal from './ScanModal';
import { translations } from '../provider/LocalizeProvider';

const Home = ({ route, navigation }) => {
  const { campaignData } = route.params;
  // const {userInfo} = route.param;
  const [refresh, setRefresh] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isCompaign, setIsCompaign] = useState(true);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrInfo, setQrInfo] = React.useState('');
  //   const [isSynced, setIsSynced] = useState(false);
  const { users: enrollData } = useUsers();





  const onHandleScan = () => {
    setModalVisible(true);
  };
  // eslint-disable-next-line no-unused-vars

  const showUploadModal = () => {
    setUploadModalVisible(true);
  };

  const FarmerDataBlock = ({ title, value }) => {
    const {
      itemStyle, itemText, remainingPercentage,
    } = localStyles;
    return (
      <View style={itemStyle}>
        <EText style={remainingPercentage}>{value}</EText>
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
          {isCompaign ? (
            <Pressable onPress={showUploadModal}>
              <UploadIcon />
            </Pressable>
          ) : (
            <Pressable>
              <SyncIcon />
            </Pressable>
          )}

          <Pressable onPress={() => setIsMenuOpen(!isMenuOpen)}>
            <MenuBarIcon />
          </Pressable>
        </View>
        <TouchableWithoutFeedback onPress={checkMenuBar}>
          {isCompaign ? (
            <View style={{ flex: 1 }}>
              <View style={localStyles.compaignInfo}>
                <EText style={localStyles.title}>
                  {`${translations['Campaign.title']} - ${campaignData.name}`}
                </EText>
                <EText style={localStyles.subTitle}>
                  {translations.formatString(translations['Campaign.assign'], enrollData.length > 0 ? enrollData.length : 0)}
                </EText>
              </View>
              <View style={localStyles.container}>
                <FarmerDataBlock
                  title={`${translations['Campaign.completed']}`}
                  value={'11%'}
                />
                <FarmerDataBlock
                  title={`${translations['Campaign.rolledUp']}`}
                  value={enrollData.length > 0 ? enrollData.length : 0}
                />
              </View>
              <EText style={[localStyles.title, { ...styles.ml15 }]}>
                {translations['Campaign.locallyRolled']}
              </EText>

              {/* {isSynced ? (
                <EText style={[localStyles.subTitle, {...styles.ml15}]}>
                  Data Synced
                </EText>
              ) : isSynced !== true && */}

              {enrollData && enrollData.length > 0 ? (
                <View onStartShouldSetResponder={() => true} style={{ flex: 1 }}>
                  <FlatList
                    nestedScrollEnabled={true}
                    data={enrollData && enrollData.length > 0 ? enrollData.filter(enrollee => enrollee.status === 'Active') : []}
                    renderItem={_offlineRenderItem}
                    keyExtractor={(item) => item._id.toString()}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                      <RefreshControl
                        refreshing={refresh}
                        onRefresh={setEnrollDataInStore}
                      />
                    }
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
                  styles.p10,
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
          <Pressable style={localStyles.menuItemContainer}>
            <EText style={localStyles.menuTitle}>
              {translations['Menu.faq']}
            </EText>
          </Pressable>
          <Pressable
            onPress={() => signOut(navigation)}
            style={localStyles.menuItemContainer}>
            <EText style={localStyles.menuTitle}>
              {translations['Menu.logout']}
            </EText>
          </Pressable>
          <Pressable
            style={[localStyles.menuItemContainer, { borderBottomWidth: 0 }]}>
            <EText style={localStyles.menuTitle}>
              {translations['Menu.settings']}
            </EText>
          </Pressable>
        </View>
      )}
      <UploadDataModal
        visible={uploadModalVisible}
        closeModal={setUploadModalVisible}
      />
      <ScanModal
        visible={modalVisible}
        closeModal={setModalVisible}
        setQrInfo={setQrInfo}
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
    bottom: 0,
    right: 0,
    paddingRight: 0,
    backgroundColor: colors.green,
    borderRadius: 5,
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
