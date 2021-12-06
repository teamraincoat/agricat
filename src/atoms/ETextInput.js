import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {colors, styles} from '../styles';

const ETextInput = props => {
  return (
    <View style={[localStyles.mainContainer, styles.mt10]}>
      <TextInput
        underlineColorAndroid="transparent"
        placeholder={props.placeholder}
        placeholderTextColor={colors.grey}
        keyboardType={props.keyboardType}
        onChangeText={props.onChangeText}
        returnKeyType={props.returnKeyType}
        numberOfLines={props.numberOfLines}
        multiline={props.multiline}
        onSubmitEditing={props.onSubmitEditing}
        style={props.style}
        blurOnSubmit={false}
        value={props.value}
        onTouchStart={props.onPress}
        maxLength={props.maxLength}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    borderColor: colors.lightBlue,
    borderWidth: 1,
  },
});

export default ETextInput;
