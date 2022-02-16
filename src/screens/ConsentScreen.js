import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import BackIcon from '../assets/icons/BackIcon';
import BackgroundImage from '../atoms/BackgroundImage';
import EButton from '../atoms/EButton';
import EText from '../atoms/EText';
import { colors, styles } from '../styles';
import { hp, normalize, wp } from '../styles/metrics';
import { translations } from '../provider/LocalizeProvider';

// eslint-disable-next-line react/prop-types
const ConsentScreen = ({ navigation }) => {
  const [isSelected, setSelection] = useState(false);
  return (
    // eslint-disable-next-line global-require
    <BackgroundImage src={require('../assets/Consent.png')}>
        <Pressable style={localStyles.backButtonContainer} onPress={() => navigation.goBack(null)} >
            <BackIcon />
        </Pressable>
        <View style={localStyles.termsContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <EText style={localStyles.title}>{translations['Consent.title']}</EText>
        <EText style={localStyles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </EText>
        <EText style={localStyles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </EText>
        <View style={localStyles.confirmation}>
          <EText style={localStyles.subTitle}>{translations['Consent.subTitle']}</EText>
          <View style={localStyles.acceptPermission}>
            <EText
              maxLength={10}
              multiline={true}
              numberOfLines={2}
              style={localStyles.permissionText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod.
            </EText>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              tintColors={{ true: colors.black, false: colors.black }}
            />
          </View>
          <EButton
            title={translations['Consent.confirm']}
            onClick={() => navigation.navigate('Register')}
            style={localStyles.continueButton}
          />
        </View>
      </ScrollView>
      </View>
    </BackgroundImage>
  );
};

const localStyles = StyleSheet.create({
  termsContainer: {
    ...styles.center,
    marginTop: hp(45),
    width: wp(90),
    ...styles.selfCenter,
  },
  backButtonContainer: {
    ...styles.pl20,
    ...styles.mt15,
  },
  title: {
    ...styles.h1,
    color: colors.black,
    ...styles.mv8,
    ...styles.textCenter,
  },
  description: {
    color: colors.black,
    ...styles.mv10,
    ...styles.h3,
  },
  confirmation: {
    width: wp(90),
    ...styles.ph5,
  },
  subTitle: {
    color: colors.black,
    ...styles.h2,
    fontSize: normalize(12),
    ...styles.mv8,
  },
  acceptPermission: {
    ...styles.rowSpaceBetween,
    ...styles.mt10,
  },
  permissionText: {
    color: colors.black,
    ...styles.h3,
    width: wp(80),
  },
  continueButton: {
    ...styles.mt20,
    marginBottom: hp(10),
  },
});

export default ConsentScreen;
