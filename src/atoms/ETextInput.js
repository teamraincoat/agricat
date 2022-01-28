import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {colors, styles} from '../styles';
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
  const [toggleSecure, setToggleSecure] = useState(false);

  const renderLabel = () => {
    return (
      <View>
        {label ? (
          <Text style={{color: '#121212', marginHorizontal: 20,fontSize:16}}>{label}</Text>
        ) : null}
      </View>
    );
  };
  const renderToggle = () => {
    if (!secure) return null;

    return (
      <EButton
        style={localStyles.toggle}
        onPress={() => setToggleSecure(!toggleSecure)}>
       
          <Text>password icon</Text>
            {/*
           <Icon
             color={'#837484'}
             size={14 * 1.55}
             name={toggleSecure ? 'md-eye' : 'md-eye-off'}
           /> */}
        
      </EButton>
    );
  };

  const isSecure = toggleSecure ? false : secure;
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
          secureTextEntry={isSecure}
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
      {renderToggle()}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  input: {
    fontWeight: '500',
    color: '#121212',
    marginHorizontal: 20,
    borderRadius: 10,
    borderColor: '#000000',
    borderWidth: 2,
    marginVertical: 5,
    height: 50,
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  toggle: {
    position: 'absolute',
    alignItems: 'flex-end',
    width: 16 * 2,
    backgroundColor: 'transparent',
    height: 16 * 2,
    top: 16 * 1.2,
    right: 16 * 1.5,
  },
  error: {
    fontSize: 16 * 0.8,
    color: 'red',
    paddingTop: 5,
    paddingLeft: 20,
  },
});

export default ETextInput;
