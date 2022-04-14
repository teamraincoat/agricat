import React, { useState, createContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LocalizedStrings from 'react-native-localization';
import * as RNLocalize from 'react-native-localize';

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
      // let localeCode = Constants.DEFAULT_LANGUAGE;
      // const supportedLocaleCodes = translations.getAvailableLanguages();
      // const phoneLocaleCodes = RNLocalize.getLocales().map(
      //   (locale) => locale.languageCode,
      // );
      // phoneLocaleCodes.some((code) => {
      //   if (supportedLocaleCodes.includes(code)) {
      //     localeCode = code;
      //     return true;
      //   }
      // });
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
