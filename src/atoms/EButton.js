import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {colors, styles} from '../styles';

const EButton = props => {
  return (
    <TouchableOpacity
      style={[
        localStyles.button,
        styles.mt15,
        styles.p10,
        styles.itemsCenter,
        props.style,
      ]}
      onPress={props.onClick}>
      <Text style={[localStyles.text, props.textStyle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.darkGreen,
    color: colors.white,
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default EButton;
