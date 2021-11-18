import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Text,
} from 'react-native';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import db from '../config';

const RegisterUser = ({navigation}) => {
  let [userName, setUserName] = useState('');
  let [userContact, setUserContact] = useState('');
  let [userAddress, setUserAddress] = useState('');
  let nextId = 1;

  useEffect(() => {
    db.allDocs({include_docs: true}).then((results) => {
      console.log("Local db result===>", results);
      nextId = results.total_rows + 1;
      console.log('nextId', nextId);
    });
  }, []);

  let register_user = () => {
    console.log(userName, userContact, userAddress);

    if (!userName) {
      alert('Please fill name');
      return;
    }
    if (!userContact) {
      alert('Please fill Contact Number');
      return;
    }
    if (!userAddress) {
      alert('Please fill Address');
      return;
    }

    db.post({
      name: userName,
      contact: userContact,
      address: userAddress,
    })
      .then((doc) => {
        console.log('doc', doc);
        if (!doc.ok) {
          alert('Registration Failed');
          return;
        }
        Alert.alert(
          'Success',
          'You are Registered Successfully',
          [
            {
              text: 'Ok',
              onPress: () => navigation.navigate('Home'),
            },
          ],
          {cancelable: false},
        );
      })
      .catch((error) => alert('Error Inserting -> ' + error));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'white', padding: 16}}>
        <View style={{flex: 1}}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView
              behavior="padding"
              style={{flex: 1, justifyContent: 'space-between'}}>
              <ETextInput
                placeholder="Enter Name"
                onChangeText={(userName) => setUserName(userName)}
                style={{padding: 10}}
              />
              <ETextInput
                placeholder="Enter Contact No"
                onChangeText={(userContact) => setUserContact(userContact)}
                maxLength={10}
                keyboardType="numeric"
                style={{padding: 10}}
              />
              <ETextInput
                placeholder="Enter Address"
                onChangeText={(userAddress) => setUserAddress(userAddress)}
                maxLength={225}
                numberOfLines={5}
                multiline={true}
                style={{textAlignVertical: 'top', padding: 10}}
              />
              <EButton title="Submit" onClick={register_user} />
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
    </View>
    </SafeAreaView>
  );
};

export default RegisterUser;
