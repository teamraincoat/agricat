import { PermissionsAndroid } from 'react-native';

const usePermission = () => {
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'AgriCat App Camera Permission',
          message:
            'AgriCat App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        return true;
      }
      console.log('Camera permission denied');
      return false;
    } catch (err) {
      console.warn(err);
    }
  };

  return { requestCameraPermission };
};

export default usePermission;
