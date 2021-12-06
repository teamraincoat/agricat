import React, {useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LocalizedStrings from 'react-native-localization';
import * as RNLocalize from 'react-native-localize';
import en from '../localization/en.json';
import ru from '../localization/ru.json';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Constants from '../constants/Constants';

export const translations = new LocalizedStrings({en, ru});

export const LocalizeContext = React.createContext({}); //to prevent lint error
export const LocalizeProvider = ({children}) => {
  const [appLanguage, setAppLanguage] = useState('en');

  const setLanguage = language => {
    translations.setLanguage(language);
    setAppLanguage(language);
    AsyncStorage.setItem(Constants.STORAGE.APP_LANGUAGE, language);
  };

  const initializeAppLanguage = async () => {
    const currentLanguage = await AsyncStorage.getItem(
      Constants.STORAGE.APP_LANGUAGE,
    );

    if (currentLanguage) {
      setLanguage(currentLanguage);
    } else {
      let localeCode = Constants.DEFAULT_LANGUAGE;
      const supportedLocaleCodes = translations.getAvailableLanguages();
      const phoneLocaleCodes = RNLocalize.getLocales().map(
        locale => locale.languageCode,
      );
      phoneLocaleCodes.some(code => {
        if (supportedLocaleCodes.includes(code)) {
          localeCode = code;
          return true;
        }
      });
      setLanguage(localeCode);
    }
  };

  return (
    <SafeAreaProvider>
      <LocalizeContext.Provider
        value={{
          translations,
          setAppLanguage: setLanguage,
          appLanguage,
          initializeAppLanguage,
        }}>
        {children}
      </LocalizeContext.Provider>
    </SafeAreaProvider>
  );
};
