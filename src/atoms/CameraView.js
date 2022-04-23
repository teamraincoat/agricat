/* eslint-disable global-require */
import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { CameraScreen, CameraType } from 'react-native-camera-kit';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { hp, wp } from '../styles/metrics';

const CameraView = ({ setIsCameraVisible, selectedFiles, setSelectedFiles }) => {
  const onBottomButtonPressed = async (event) => {
    const captureImage = event.captureImages[0]?.uri;
    if (event?.type === 'left') {
      setIsCameraVisible(false);
      return;
    }
    handleCaptureImage(captureImage);
    setIsCameraVisible(false);
  };

  const handleCaptureImage = async (captureImage) => {
    const selectedImage = [];
    try {
      const imageData = await ReactNativeBlobUtil.fs.stat(captureImage);
      const filePrefix = 'file://';
      const re = /(?:\.([^.]+))?$/;
      const ext = re.exec(imageData)[1];
      const imagePath = filePrefix.concat(imageData.path);
      console.log('imagePath--->>', imagePath);
      console.log('imageData>>', imageData);
      const realURI = Platform.select({
        android: imagePath,
        // ios: decodeURI(res.uri),
      });
      const base64Image = await ReactNativeBlobUtil.fs.readFile(
        realURI,
        'base64',
      );
      selectedImage.push({
        name: imageData.filename,
        uri: base64Image,
        size: imageData.size,
        type: ext,
      });
      setSelectedFiles(selectedFiles.concat(selectedImage));
    } catch {
      Alert.alert('Error leyendo la imagen.');
    }
  };

  return (
    <View style={localStyles.container}>
      <CameraScreen
        actions={{ rightButtonText: 'Done', leftButtonText: 'Cancelar' }}
        onBottomButtonPressed={onBottomButtonPressed}
        cameraType={CameraType.Back}
        focusMode="on"
        zoomMode="off"
        captureButtonImage={require('../assets/capture.png')}
        // captureButtonImageStyle={{ width: 50, height: 50 }}
        hideControls={false}
        showCapturedImageCount={false}
        saveToCameraRoll={false}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    height: hp(100),
    width: wp(100),
  },
});

export default CameraView;
