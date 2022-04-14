import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import DocumentIcon from '../assets/icons/DocumentIcon';
import EButton from '../atoms/EButton';
import EText from '../atoms/EText';
import {translations} from '../provider/LocalizeProvider';
import {colors, styles} from '../styles';

const ImpactReport = props => {
  return (
    <View style={localStyles.mainContainer}>
      <DocumentIcon />
      <EText style={localStyles.title}>{translations['Impact.title']}</EText>
      <EText style={localStyles.subTitle}>
        {translations['Impact.subTitle1']}
      </EText>
      <EText style={localStyles.subTitle}>
        {translations['Impact.subTitle2']}
      </EText>
      <EButton
        title={translations['Impact.continue']}
        onClick={() => console.log('click')}
        style={localStyles.button}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.lightGrey,
    ...styles.flex,
    ...styles.center,
  },
  title: {
    ...styles.h1,
    color: colors.black,
    ...styles.mv8,
    ...styles.mt30,
  },
  subTitle: {
    color: colors.black,
    ...styles.h3,
    ...styles.mt2,
  },
  button: {
    ...styles.mt30,
  },
});

export default ImpactReport;
