import AsyncStorage from '@react-native-community/async-storage';

export const saveStorageData = async (key, data) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.log('Save Fail: ', error);
  }
};

export const getStorageData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      return JSON.parse(value);
    } catch (error) {
      console.log('Get Fail: ', error);
    }
  };

  export const removeStorageData = async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log('Remove Fail: ', error);
    }
  };
