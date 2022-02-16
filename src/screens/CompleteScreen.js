import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import DoneIcon from '../assets/icons/DoneIcon';
import EButton from '../atoms/EButton';
import EText from '../atoms/EText';
import {translations} from '../provider/LocalizeProvider';
import {colors, styles} from '../styles';

const CompleteScreen = props => {
  return (
    <View style={localStyles.mainContainer}>
      <DoneIcon />
      <EText style={localStyles.title}>{translations['Complete.title']}</EText>
      <EText style={localStyles.subTitle}>
        {translations['Complete.subTitle1']}
      </EText>
      <EText style={localStyles.subTitle}>
        {translations['Complete.subTitle2']}
      </EText>
      <EButton
        title={translations['Complete.continue']}
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

export default CompleteScreen;
