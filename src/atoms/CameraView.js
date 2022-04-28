/* eslint-disable global-require */
import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  BackHandler,
} from 'react-native';
import { CameraScreen, CameraType } from 'react-native-camera-kit';
import ReactNativeBlobUtil from 'react-native-blob-util';
import ImageResizer from 'react-native-image-resizer';
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
      const ext = re.exec(imageData.filename)[1];
      const imagePath = filePrefix.concat(imageData.path);
      const compressedImage = await ImageResizer.createResizedImage(imagePath, 600, 600, 'JPEG', 80, 0);
      const realURI = Platform.select({
        android: compressedImage.path,
        // ios: decodeURI(res.uri),
      });
      const base64Image = await ReactNativeBlobUtil.fs.readFile(
        realURI,
        'base64',
      );
      selectedImage.push({
        name: imageData.filename,
        uri: base64Image,
        size: compressedImage.size.toString(),
        type: ext,
      });
      setSelectedFiles(selectedFiles.concat(selectedImage));
    } catch {
      Alert.alert('Error leyendo la imagen.');
    }
  };
  const backAction = () => {
    setIsCameraVisible(false);
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  return (
    <View style={localStyles.container}>
      <CameraScreen
        actions={{ leftButtonText: 'Cancelar' }}
        onBottomButtonPressed={onBottomButtonPressed}
        cameraType={CameraType.Back}
        focusMode="on"
        zoomMode="off"
        captureButtonImage={require('../assets/capture.png')}
        captureButtonImageStyle={localStyles.captureButtonImage}
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
  captureButtonImage: {
    width: 100,
    height: 100,
  },
});

export default CameraView;
