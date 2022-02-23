import React from 'react';
import { View, StyleSheet } from 'react-native';
import EText from '../atoms/EText';
import { colors, styles } from '../styles';
import { translations } from '../provider/LocalizeProvider';

const NoCompaign = () => (
    <View style={localStyles.container}>
      <View style={localStyles.textWrapper}>
        <EText style={localStyles.title}>
          {translations['NoCampaign.title']}
        </EText>
        <EText style={localStyles.subTitle}>
          {translations['NoCampaign.description1']}
        </EText>
        <EText style={localStyles.subTitle}>
          {translations['NoCampaign.description2']}
        </EText>
      </View>
    </View>
);

const localStyles = StyleSheet.create({
  container: {
    ...styles.flex,
    ...styles.center,
  },
  textWrapper: {
    ...styles.center,
  },
  title: {
    ...styles.h1,
    color: colors.black,
    ...styles.mv5,
  },
  subTitle: {
    color: colors.black,
    ...styles.h3,
    ...styles.mv5,
  },
});

export default NoCompaign;
