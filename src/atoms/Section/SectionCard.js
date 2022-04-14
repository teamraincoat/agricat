import React from 'react';
import { View, StyleSheet } from 'react-native';
import { translations } from '../../provider/LocalizeProvider';
import { colors, styles } from '../../styles';
import { normalize, wp } from '../../styles/metrics';
import EText from '../EText';

const SectionCard = ({
  title, description, style, grey,
}) => (
  <View
    style={[
      localStyles.container,
      style,
      { backgroundColor: grey ? colors.lightGrey2 : colors.lightBrown },
    ]}>
    <EText style={localStyles.sectionCardTitle}>{translations[title]}</EText>
    {description && (
      <EText style={[localStyles.sectionCardTitle, localStyles.sectionCardDescription]}>
        {translations[description]}
      </EText>
    )}
  </View>
);

const localStyles = StyleSheet.create({
  container: {
    ...styles.p10,
    ...styles.center,
    ...styles.selfCenter,
    ...styles.radius5,
    ...styles.mb10,
    width: wp(90),
  },
  sectionCardTitle: {
    color: colors.black,
    ...styles.h3,
    fontSize: normalize(12),
    ...styles.textCenter,
    ...styles.mv5,
  },
  sectionCardDescription: {
    ...styles.mt15,
  },
});

export default SectionCard;
