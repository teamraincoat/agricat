/* eslint-disable no-nested-ternary */
import React from 'react';
import {
  View, Text, TextInput, StyleSheet,
} from 'react-native';
import { colors, styles } from '../styles';
import { hp, normalize, wp } from '../styles/metrics';

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
  leftLabel,
  ...props
}) => {
  const renderLabel = () => (
    <View>
      {label ? <Text style={[localStyles.labelStyle, leftLabel && localStyles.leftLabelStyle]}>{label}</Text> : null}
    </View>
  );

  const inputStyles = [localStyles.input, leftLabel && localStyles.leftLabelInput, error && { borderColor: 'red' }, style];
  const inputType = email
    ? 'email-address'
    : number
      ? 'numeric'
      : phone
        ? 'phone-pad'
        : 'default';

  return (
    <View style={[localStyles.container, styles.mt10, leftLabel && localStyles.leftLabelContainerStyle]}>
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
    height: hp(7),
    color: colors.black,
    backgroundColor: colors.white,
    ...styles.h3,
    ...styles.mh20,
    ...styles.borderLight,
    ...styles.radius5,
    ...styles.mv5,
    ...styles.pv10,
    ...styles.ph15,
  },
  leftLabelInput: {
    width: wp(60),
    ...styles.selfStart,
  },
  labelStyle: {
    color: colors.black,
    ...styles.mh25,
    ...styles.h2,
    fontSize: normalize(12),
  },
  leftLabelStyle: {
    color: colors.black,
    ...styles.h3,
    marginHorizontal: 0,
    width: wp(25),
    textAlign: 'right',
  },
  leftLabelContainerStyle: {
    ...styles.rowSpaceBetween,
    marginHorizontal: wp(5),
    marginTop: 0,
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
