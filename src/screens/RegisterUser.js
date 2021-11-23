import React, {useEffect, useState} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import ETextInput from '../atoms/ETextInput';
import EButton from '../atoms/EButton';
import db from '../config';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
const RegisterUser = ({navigation}) => {
  let [userName, setUserName] = useState('');
  let [userContact, setUserContact] = useState('');
  let [userAddress, setUserAddress] = useState('');
  let [isScanOpen, setScannerStatus] = useState(false);

  let nextId = 1;

  useEffect(() => {
    db.allDocs({include_docs: true}).then((results) => {
      console.log("Local db result===>", results);
      nextId = results.total_rows + 1;
      console.log('nextId', nextId);
    });
  }, []);

  const onPressScanner = () => {
    setScannerStatus(!isScanOpen);
  }

  const onScanData = (e) => {
    setTimeout(() => {
      if(e){
        alert(JSON.stringify(e))
      }
      console.log("Scan data =>", e);
    }, 2000);
    
  }

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
          <View style={localStyles.scannerButtonContainer}>
          <TouchableOpacity style={localStyles.scannerButton} onPress={onPressScanner}>
          <Image source={require('../assets/scan.jpeg')} style={{height: 50, width: 50}} resizeMode="contain"></Image>
          </TouchableOpacity>
          </View>
        {isScanOpen && 
        <Modal isVisible={isScanOpen} style={{flex: 1, backgroundColor: 'black'}}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <TouchableOpacity onPress={onPressScanner} style={{marginTop: 50, marginLeft: 20, marginRight: 'auto', height: 30, width: 30}}>
            <Image source={require('../assets/close.png')} style={{height: 20, width: 20}} resizeMode="contain"></Image>
          </TouchableOpacity>
          <QRCodeScanner 
          onRead={onScanData}
          flashMode={RNCamera.Constants.FlashMode.off}
          showMarker
          >
          </QRCodeScanner>
        </View>
        </Modal>
        
        }
        </View>
    </View>
    
    </SafeAreaView>
  );
};

export default RegisterUser;

const localStyles = StyleSheet.create({
  scannerButtonContainer: {
    justifyContent: 'center',
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 'auto',
    height: 50,
    width: 50,
    //backgroundColor: 'black',
    borderRadius: 25,
  },
  scannerButton: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  }
});