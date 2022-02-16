import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, styles } from '../styles';
import { hp, wp } from '../styles/metrics';

const EButton = (props) => (
  <TouchableOpacity
    style={[
      localStyles.button,
      styles.mt15,
      styles.p10,
      styles.itemsCenter,
      props.style,
    ]}
    onPress={props.onClick}>
    {props.loading ? (
      <ActivityIndicator />
    ) : (
      <Text style={[localStyles.text, props.textStyle]}>{props.title}</Text>
    )}
    {props.children}
  </TouchableOpacity>
);

const localStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    color: colors.white,
    height: hp(7),
    width: wp(90),
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.84,
    elevation: 5,
    ...styles.center,
    ...styles.selfCenter,
    ...styles.radius8,
  },
  text: {
    color: colors.white,
    ...styles.h2,
  },
});

export default EButton;
