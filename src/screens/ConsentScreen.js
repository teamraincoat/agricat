import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import {
  View, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import moment from 'moment';
import BackIcon from '../assets/icons/BackIcon';
import BackgroundImage from '../atoms/BackgroundImage';
import EButton from '../atoms/EButton';
import EText from '../atoms/EText';
import { colors, styles } from '../styles';
import { hp, normalize, wp } from '../styles/metrics';
import { translations } from '../provider/LocalizeProvider';

// eslint-disable-next-line react/prop-types
const ConsentScreen = ({ route, navigation }) => {
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
        {translations['Consent.description1']}
        </EText>
        <EText style={localStyles.description}>
        {translations['Consent.description2']}
        </EText>
        <EText style={localStyles.description}>
        {translations['Consent.termA']}
        </EText>
        <EText style={localStyles.description}>
        {translations['Consent.termB']}
        </EText>
        <EText style={localStyles.description}>
        {translations['Consent.term']}
        </EText>
        <EText style={localStyles.description}>
        {`${translations['Consent.acceptDate']} ${moment(new Date()).format('DD-MM-YYYY')}`}
        </EText>
        <View style={localStyles.confirmation}>
          <EText style={localStyles.subTitle}>{translations['Consent.subTitle']}</EText>
          <View style={localStyles.acceptPermission}>
            <EText
              maxLength={10}
              multiline={true}
              numberOfLines={2}
              style={localStyles.permissionText}>
            {translations['Consent.acceptTerm']}
            </EText>
            <CheckBox
              value={isSelected}

              style={{transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
              onValueChange={setSelection}
              tintColors={{ true: colors.darkCharcoal, false: colors.darkCharcoal }}
            />
          </View>
          <EButton
            title={translations['Consent.confirm']}
            disabled={!isSelected}
            onClick={ () => {
              navigation.navigate('Register', { campaignKey: route?.params?.campaignKey });
              setSelection(false);
            }}
            style={[localStyles.continueButton, !isSelected && { opacity: 0.5 }]}
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
