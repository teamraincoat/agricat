import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {colors, styles} from '../styles';
import { hp, normalize } from '../styles/metrics';
import EButton from './EButton';

const ETextInput = ({
  email,
  phone,
  password,
  number,
  secure,
  error,
  errorText,
  style,
  label,
  ...props
}) => {


  const renderLabel = () => {
    return (
      <View>
        {label ? (
          <Text style={localStyles.labelStyle}>{label}</Text>
        ) : null}
      </View>
    );
  };


  const inputStyles = [
    localStyles.input,
    error && {borderColor: 'red'},
    style,
  ];
  const inputType = email
    ? 'email-address'
    : number
    ? 'numeric'
    : phone
    ? 'phone-pad'
    : 'default';

  return (
    <View style={[localStyles.container, styles.mt10]}>
       {renderLabel()}
      <TextInput
          style={inputStyles}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={inputType}
          underlineColorAndroid="transparent"
          placeholderTextColor={colors.grey}
          blurOnSubmit={false}
          {...props}
      />
      {errorText ? <Text style={localStyles.error}>{errorText}</Text> : null}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    ...styles.mv5,
  },
  input: {
    color: colors.primary,
    height:hp(7),
    backgroundColor:colors.white,
    ...styles.h3,
    ...styles.mh20,
    ...styles.borderLight,
    ...styles.radius5,
    ...styles.mv5,
     ...styles.pv10,
     ...styles.ph15,
  },
  labelStyle:{
    color: colors.black,
    marginHorizontal: 20,
    ...styles.mh25,
    ...styles.h2,
    fontSize: normalize(12),
    },
  error: {
    color: colors.red,
    ...styles.mt5,
    ...styles.pl20,
    ...styles.pt10,
    ...styles.pl20,
  },
});

export default ETextInput;
