import AsyncStorage from '@react-native-community/async-storage';
import crashlytics from '@react-native-firebase/crashlytics';

export const saveStorageData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Save Fail: ', error);
    crashlytics().recordError(new Error(error));
  }
};

export const getStorageData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return JSON.parse(value);
  } catch (error) {
    console.error('Get Fail: ', error);
    crashlytics().recordError(new Error(error));
  }
};

export const removeStorageData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log('Remove Fail: ', error);
    crashlytics().recordError(new Error(error));
  }
};
