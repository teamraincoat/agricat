import React, { useState, createContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LocalizedStrings from 'react-native-localization';

import en from '../localization/en.json';
import es from '../localization/es.json';
import Constants from '../constants/Constants';

export const translations = new LocalizedStrings({ es, en });

export const LocalizeContext = createContext({
  translations,
  setAppLanguage: () => {},
  appLanguage: Constants.DEFAULT_LANGUAGE,
  initializeAppLanguage: () => {},
});

export const LocalizeProvider = ({ children }) => {
  const [appLanguage, setAppLanguage] = useState();

  const setLanguage = (language) => {
    translations.setLanguage(language);
    setAppLanguage(language);
    AsyncStorage.setItem(Constants.STORAGE.APP_LANGUAGE, language);
  };

  const initializeAppLanguage = async () => {
    const currentLanguage = await AsyncStorage.getItem(
      Constants.STORAGE.APP_LANGUAGE,
    );

    if (!currentLanguage) {
      setLanguage(Constants.DEFAULT_LANGUAGE);
    } else {
      setLanguage(currentLanguage);
    }
  };

  return (
    <LocalizeContext.Provider
      value={{
        translations,
        setAppLanguage: setLanguage,
        appLanguage,
        initializeAppLanguage,
      }}>
      {children}
    </LocalizeContext.Provider>
  );
};
