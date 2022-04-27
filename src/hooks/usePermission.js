import { PermissionsAndroid } from 'react-native';

const usePermission = () => {
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'AgriCat App Permisos de Cámara',
          message: 'AgriCat App necesita acceder la cámara',
          buttonNeutral: 'Pregúntame luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      return false;
    } catch (err) {
      console.warn(err);
    }
  };

  return { requestCameraPermission };
};

export default usePermission;
