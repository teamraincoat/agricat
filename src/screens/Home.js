// Building Offline First App in React Native using PouchDB and CouchDB
// https://aboutreact.com/react-native-offline-app-using-pouchdb-couchdb/
// Screen to view all the user*/

import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Text,
  View,
  SafeAreaView,
  RefreshControl,
  Pressable,
  StyleSheet,
} from 'react-native';
import ETextInput from '../atoms/ETextInput';
import ScanIcon from '../assets/icons/ScanIcon';
import {colors, styles} from '../styles';
import {connect} from 'react-redux';
import {setEnrollDataInStore} from '../redux/action/EnrollActions';
import {useLocal} from '../contex/index';
import {useDispatch} from 'react-redux';
import {initDBAction} from '../redux/action/CommonActions';
import EText from '../atoms/EText';

const Home = props => {
  const {
    navigation,
    setEnrollDataInStore,
    initDBAction,
    enrollData,
    isDBInitiate,
  } = props;

  const [refresh, setRefresh] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const {translations} = useLocal();

  useEffect(() => {
    if (isDBInitiate) {
      setEnrollDataInStore();
    }
  }, [isDBInitiate]);
  useEffect(() => {
    if (!isDBInitiate) {
      initDBAction();
    }
  }, [isDBInitiate]);
  useEffect(() => {
    onSearch();
  }, [searchWord]);

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

  let listItemView = item => {
    return (
      <View key={item._id} style={localStyles.item}>
        <EText>{`${translations['Id']}: ${item._id}`}</EText>
        <EText>{`${translations['FirstName']}: ${item.firstName}`}</EText>
        <EText>{`${translations['LastName']}: ${item.lastName}`}</EText>
        <EText>{`${translations['SurName']}: ${item.surName}`}</EText>
        <EText>{`${translations['Gender']}: ${item.gender}`}</EText>
        <EText> {`${translations['MobilePhone']}: ${item.mobilePhone}`}</EText>
        <EText>{`${translations['Dob']}: ${item.dob}`}</EText>
        <EText>{`${translations['Locality']}: ${item.locality}`}</EText>
        <EText>{`${translations['Sublocality']}: ${item.sublocality}`}</EText>
        <EText>{`${translations['GeoJson']}: ${item.geoJson}`}</EText>
        <EText>{`${translations['CoveredArea']}: ${item.coveredArea}`}</EText>
        <EText>{`${translations['Crop']}: ${item.crop}`}</EText>
        <EText>{`${translations['CropType']}: ${item.cropType}`}</EText>
        <EText>{`${translations['CropCycle']}: ${item.cropCycle}`}</EText>
        <EText>
          {`${translations['ApplicationTime']}: ${item.applicationTime}`}
        </EText>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.flex}>
      <View style={[styles.flex, styles.p15]}>
        <ETextInput
          placeholder={translations['Home.search']}
          value={searchWord}
          onChangeText={word => setSearchWord(word.toLowerCase())}
          maxLength={50}
          style={[styles.p10, localStyles.searchInput]}
        />
        <FlatList
          data={!searchWord ? enrollData : filteredData}
          ItemSeparatorComponent={viewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => listItemView(item)}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={setEnrollDataInStore}
            />
          }
          style={styles.mt20}
        />
      </View>
      <Pressable
        style={[styles.absolute, styles.p10, localStyles.scanIconButton]}
        onPress={() => navigation.navigate('Register')}>
        <ScanIcon />
      </Pressable>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  scanIconButton: {
    bottom: 30,
    right: 30,
    backgroundColor: colors.green,
    borderRadius: 5,
  },
  itemSeparator: {height: 20},
  item: {
    backgroundColor: colors.white,
    padding: 16,
  },
  searchInput: {textAlignVertical: 'top'},
});

const mapStateToProps = ({EnrollReducers, CommonReducer}) => {
  const {enrollData} = EnrollReducers;
  const {isDBInitiate} = CommonReducer;
  return {
    enrollData,
    isDBInitiate,
  };
};

const mapDispatchToProps = {
  setEnrollDataInStore,
  initDBAction,
};

// export default Home;
export default connect(mapStateToProps, mapDispatchToProps)(Home);
