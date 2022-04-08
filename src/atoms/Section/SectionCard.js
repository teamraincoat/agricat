import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, styles } from '../../styles';
import { wp } from '../../styles/metrics';

const SectionCard = (props) => (
     <View style={localStyles.container}>
        {props.children}
     </View>
);

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightBrown,
    ...styles.p10,
    ...styles.center,
    ...styles.selfCenter,
    ...styles.radius5,
    width: wp(90),
  },
});

export default SectionCard;
