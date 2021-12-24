import React, {useState, useEffect} from 'react';
import {
  FlatList,
  View,
  SafeAreaView,
  RefreshControl,
  Pressable,
  StyleSheet,
} from 'react-native';
import ETextInput from '../atoms/ETextInput';
import ScanIcon from '../assets/icons/ScanIcon';
import {colors, styles} from '../styles';
import {setEnrollDataInStore} from '../redux/action/EnrollActions';
import {useLocal} from '../contex/index';
import EText from '../atoms/EText';
import {useUsers} from '../provider/UsersProvider';
import moment from 'moment';

const Home = props => {
  const {navigation} = props;

  const [refresh, setRefresh] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const {translations} = useLocal();
  const {users: enrollData} = useUsers();

  useEffect(() => {
    if (enrollData && enrollData.length > 0) {
      onSearch();
    }
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
        <EText>{`${translations['Dob']}: ${moment(item.dateOfBirth).format(
          'DD/MM/YYYY',
        )}`}</EText>
        <EText>{`${translations['Locality']}: ${item.locality}`}</EText>
        <EText>{`${translations['Sublocality']}: ${item.municipality}`}</EText>
        <EText>{`${translations['GeoJson']}: ${item.geoJson}`}</EText>
        <EText>{`${translations['CoveredArea']}: ${item.coveredArea}`}</EText>
        <EText>{`${translations['Crop']}: ${item.crop}`}</EText>
        <EText>{`${translations['CropType']}: ${item.cropType}`}</EText>
        <EText>{`${translations['CropCycle']}: ${item.cropCycle}`}</EText>
        <EText>
          {`${translations['ApplicationTime']}: ${moment(
            item.dateOfApplication,
          ).format('DD/MM/YYYY')}`}
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

export default Home;
