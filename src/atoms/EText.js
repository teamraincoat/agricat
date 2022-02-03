import React from 'react';
import {Text, StyleSheet} from 'react-native';

const EText = props => {
  return <Text style={[localStyles.text, props.style]} {...props}>{props.children}</Text>;
};

const localStyles = StyleSheet.create({
  text: {
    // color: '#111825',
    // fontSize: 18,
    // textAlign: 'center',
  },
});

export default EText;
