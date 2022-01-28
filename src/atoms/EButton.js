import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ActivityIndicator} from 'react-native';
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
        {props.loading ? <ActivityIndicator /> :  <Text style={[localStyles.text, props.textStyle]}>{props.title}</Text>}
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  button: {
    backgroundColor: colors.darkBlack,
    color: colors.white,
    height: 50,
    width: '90%',
    alignSelf:'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default EButton;
