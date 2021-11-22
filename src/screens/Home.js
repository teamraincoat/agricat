// Building Offline First App in React Native using PouchDB and CouchDB
// https://aboutreact.com/react-native-offline-app-using-pouchdb-couchdb/
// Screen to view all the user*/

import React, {useState, useEffect} from 'react';
import {FlatList, Text, View, SafeAreaView} from 'react-native';
import db from '../config';

const Home = () => {
  let [flatListItems, setFlatListItems] = useState([]);

  useEffect(() => {
    db.allDocs({include_docs: true, descending: true})
      .then((results) => {
        let temp = results.rows.map((row) => row.doc);
        console.log('temp', temp);
        setFlatListItems(temp);
      })
      .catch((err) => alert('Unable to get data'));
  }, []);

  let listViewItemSeparator = () => {
    return <View style={{height: 20}} />;
  };

  let listItemView = (item) => {
    return (
      <View
        key={item._id}
        style={{
          backgroundColor: 'white',
          padding: 16,
        }}>
        <Text>Id: {item._id}</Text>
        <Text>Name: {item.name}</Text>
        <Text>Contact: {item.contact}</Text>
        <Text>Address: {item.address}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, padding: 16}}>
        <FlatList
          data={flatListItems}
          ItemSeparatorComponent={listViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => listItemView(item)}
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
