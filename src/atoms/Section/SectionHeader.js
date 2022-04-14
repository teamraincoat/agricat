import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import BackIcon from '../../assets/icons/BackIcon';
import EText from '../EText';
import { colors, styles } from '../../styles';
import { wp } from '../../styles/metrics';
import { translations } from '../../provider/LocalizeProvider';

const SectionHeader = ({
  title, onBack, description, isMain,
}) => (
     <View style={localStyles.container}>
        <View style={localStyles.sectionBlock}>
            <View style={[localStyles.titleContainer, !isMain && {
              ...styles.selfCenter,
            }]}>
            {isMain && <Pressable onPress={onBack}>
            <BackIcon />
            </Pressable> }
        <EText style={[localStyles.title, !isMain && { marginRight: 0 }]}>{translations[title]}</EText>
         </View>
        <EText style={localStyles.description}>{translations[description]}</EText>
        </View>
     </View>
);

const localStyles = StyleSheet.create({
  container: {
    ...styles.mv8,
  },
  sectionBlock: {
    ...styles.justifyCenter,
    width: wp(90),
    ...styles.selfCenter,
  },
  titleContainer: {
    ...styles.rowSpaceBetween,
  },
  title: {
    ...styles.h1,
    color: colors.black,
    marginRight: wp(30),
  },
  description: {
    ...styles.h3,
    ...styles.mv10,
    ...styles.selfCenter,
    color: colors.black,
  },
});

export default SectionHeader;
