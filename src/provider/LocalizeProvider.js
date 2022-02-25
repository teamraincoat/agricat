import React, { useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LocalizedStrings from 'react-native-localization';
import * as RNLocalize from 'react-native-localize';

import en from '../localization/en.json';
import es from '../localization/es.json';
import Constants from '../constants/Constants';

export const translations = new LocalizedStrings({ en, es });

export const LocalizeContext = React.createContext({
  translations,
  setAppLanguage: () => {},
  appLanguage: Constants.DEFAULT_LANGUAGE,
  initializeAppLanguage: () => {},
}); // to prevent lint error
export const LocalizeProvider = ({ children }) => {
  const [appLanguage, setAppLanguage] = useState(Constants.STORAGE.DEFAULT_LANGUAGE);

  const setLanguage = (language) => {
    translations.setLanguage(language);
    setAppLanguage(language);
    AsyncStorage.setItem(Constants.STORAGE.APP_LANGUAGE, language);
  };

  const initializeAppLanguage = async (lang) => {
    const currentLanguage = lang || await AsyncStorage.getItem(
      Constants.STORAGE.APP_LANGUAGE,
    );

    console.log('currentLna', currentLanguage);
    if (currentLanguage) {
      setLanguage(currentLanguage);
    } else {
      let localeCode = Constants.DEFAULT_LANGUAGE;
      const supportedLocaleCodes = translations.getAvailableLanguages();
      console.log('supportedLocaleCodes', supportedLocaleCodes);
      const phoneLocaleCodes = RNLocalize.getLocales().map(
        (locale) => locale.languageCode,
      );
      // eslint-disable-next-line array-callback-return
      phoneLocaleCodes.some((code) => {
        console.log('code', code);
        if (supportedLocaleCodes.includes(code)) {
          localeCode = code;
          return true;
        }
      });
      setLanguage(localeCode);
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
