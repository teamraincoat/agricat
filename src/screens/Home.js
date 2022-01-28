import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  SafeAreaView,
  RefreshControl,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import ETextInput from '../atoms/ETextInput';
import ScanIcon from '../assets/icons/ScanIcon';
import {colors, styles} from '../styles';
import {setEnrollDataInStore} from '../redux/action/EnrollActions';
import {useLocal} from '../contex/index';
import EText from '../atoms/EText';
import {useUsers} from '../provider/UsersProvider';
import moment from 'moment';

import LottieView from 'lottie-react-native';
import LogoutIcon from '../assets/icons/LogoutIcon';
import MenuBarIcon from '../assets/icons/MenuBarIcon';
import {signOut} from '../database/realmConfig';
import BottomIndicator from '../assets/icons/BottomIndicator';
import TopIndicator from '../assets/icons/TopIndicator';
import PendingUserList from '../componets/PendingUserList';

const numColumns = 2;
const dataList = [
  {key: 'pending'},
  {key: 'completed'},

];
const Home = ({route, navigation}) => {
  //const {userInfo} = route.param;
  const [refresh, setRefresh] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const {translations} = useLocal();
  const {users: enrollData, addUserInfo} = useUsers();

  let userInfoData;
  if (route && route.params) {
    userInfoData = route.params.userInfo;
  }

  // useEffect(() => {
  //   if (enrollData && enrollData.length > 0) {
  //     onSearch();
  //   }
  // }, [searchWord]);


  const uploadUserInformation = userInfo => {
    addUserInfo(userInfo);
  };
  const onSearch = () => {
    const searchedData = enrollData.filter(
      item =>
        item?._id?.toLowerCase().includes(searchWord) ||
        item?.firstName?.toLowerCase().includes(searchWord) ||
        item?.lastName?.toLowerCase().includes(searchWord),
    );
    setFilteredData(searchedData);
  };

  let viewItemSeparator = () => {
    return <View style={localStyles.itemSeparator} />;
  };


  const _renderItem = ({item, index}) => {
    let {itemStyle, itemText, itemInvisible} = localStyles;
    if (item.empty === true) {
      return <View style={[itemStyle, itemInvisible]} />;
    }
    return (
      <View style={itemStyle}>
        <EText style={itemText}>{item.key}</EText>
        <EText style={{color: '#343434', fontSize: 15, margin: 8}}>
         24 entries
        </EText>
      </View>
    );
  };
  const formatData = (dataList, numColumns) => {
    const totalRows = Math.floor(dataList.length / numColumns);
    let totalLastRow = dataList.length - totalRows * numColumns;

    while (totalLastRow !== 0 && totalLastRow !== numColumns) {
      dataList.push({key: `blank-${totalLastRow}`, empty: true});
      totalLastRow++;
    }
    return dataList;
  };

  const _offlineRenderItem = ({item, index}) => {
   return <PendingUserList item={item} index={index} />;
  };

  return (
    <SafeAreaView style={styles.flex}>
      <View style={[styles.flex, styles.p15]}>
        <View style={localStyles.headerContainer}>
          <LottieView
            source={require('../assets/icons/syncRefresher.json')}
            autoPlay={false}
            style={{width: 40, height: 40}}
          />
          <Pressable onPress={() => signOut(navigation)}>
            <MenuBarIcon />
          </Pressable>
        </View>
        <ETextInput
          placeholder={translations['Home.search']}
          value={searchWord}
          onChangeText={word => setSearchWord(word.toLowerCase())}
          maxLength={50}
          style={[styles.p10, localStyles.searchInput]}
        />
        <View>

        <FlatList
          data={formatData(dataList, numColumns)}
          style={localStyles.container}
          renderItem={_renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={numColumns}
        />
        </View>
        <View style={{flex:1}}>

        <FlatList
          data={enrollData && enrollData.length > 0 ? enrollData : []}
          renderItem={_offlineRenderItem}
          keyExtractor={(item, index) => item._id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={setEnrollDataInStore}
            />
          }
        />
        </View>

      </View>
      <Pressable
        style={[styles.p10]}
        onPress={() => {
          if (userInfoData) {
            uploadUserInformation(userInfoData);
          }
        }}>
        <ScanIcon />
      </Pressable>
      <Pressable
        style={[styles.absolute, styles.p10, localStyles.scanIconButton]}
        onPress={() => navigation.navigate('Register')}>
        <ScanIcon />
      </Pressable>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  scanIconButton: {
    bottom: 30,
    right: 30,
    backgroundColor: colors.green,
    borderRadius: 5,
  },
  itemSeparator: {height: 20},
  item: {
    marginTop: 10,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius:10,
  },
  searchInput: {textAlignVertical: 'top'},
  imageContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imageStyle: {
    height: 80,
    width: 80,
    marginLeft: 0,
    marginRight: 10,
    borderRadius: 10,
  },
  container: {
    marginVertical: 10,
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 0,
  },
  itemStyle: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 20,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal:4,
  },
  itemText: {
    fontSize: 22,
    color: '#393939',
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },


  movieContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: "#ffffff",
    paddingHorizontal: 12 * 0.5,
    paddingVertical: 5,
    borderRadius: 10,

    marginVertical: 6,
  },
  mainContainer: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDetail:{
    flexDirection:'row',
    alignItems:'center',
  },
  movieImageContainer: {},
  movieImage: {
    height: 80,
    width: 80,
    margin:5,
    borderRadius: 10,
    marginRight: 10,
  },
  movieDetailContainer: {
    flexDirection:'column',
  },
  movieTitle: {
    color: colors.darkBlack,
    fontSize: 20,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  movieGenre: {
    color: colors.darkBlack,
    fontSize: 18,
  },
});

export default Home;
