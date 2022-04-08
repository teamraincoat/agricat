import React from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { translations } from '../provider/LocalizeProvider';
import { colors, styles } from '../styles';
import { hp, normalize, wp } from '../styles/metrics';
import EText from './EText';

const DropDown = ({
  control,
  label,
  placeholder,
  openDropDown,
  setOpenDropDown,
  dropDownItems,
  fieldName,
  resetValue,
  formData,
  small,
  medium,
  ...rest
}) => (
  <View style={localStyles.container}>
    {label && <EText style={localStyles.labelStyle}>{label}</EText>}
    <Controller
      control={control}
      render={({ field: { value, onChange } }) => (
        <DropDownPicker
          placeholder={placeholder || translations['Placeholder.selectItem']}
          open={openDropDown}
          value={value}
          items={dropDownItems}
          setOpen={setOpenDropDown}
          onSelectItem={(value) => {
            resetValue({
              ...formData,
              [fieldName]: value.value,
            });
          }}
          style={[
            localStyles.dropDownStyle,
            { ...styles.mt10 },
            {
              borderColor: colors.transparent,
            },
            small && localStyles.smallDropDownStyle,
            medium && localStyles.mediumDropDownStyle,
          ]}
          disableBorderRadius={true}
          dropDownContainerStyle={[localStyles.dropDownContainerStyle, small && localStyles.smallDropDownContainerStyle, medium && localStyles.mediumDropDownContainerStyle]}
          listMode="SCROLLVIEW"
            {...rest}
        />
      )}
      name={fieldName}
    />
  </View>
);

const localStyles = StyleSheet.create({
  labelStyle: {
    color: colors.black,
    ...styles.h2,
    ...styles.mh25,
    fontSize: normalize(12),
  },
  dropDownStyle: {
    ...styles.radius5,
    ...styles.mv10,
    ...styles.mh10,
    ...styles.selfCenter,
    ...styles.borderLight,
    width: wp(90),
    height: hp(7),
    zIndex: 99,

  },
  dropDownContainerStyle: {
    ...styles.radius5,
    ...styles.selfCenter,
    ...styles.borderLight,
    zIndex: 100,
    elevation: 50,
    width: wp(90),
  },
  smallDropDownContainerStyle: {
    width: wp(32),
  },
  smallDropDownStyle: {
    marginVertical: 0,
    marginHorizontal: 0,
    width: wp(32),
    marginTop: 0,
  },
  mediumDropDownContainerStyle: {
    width: wp(40),
  },
  mediumDropDownStyle: {
    width: wp(40),
    marginRight: wp(15),
  },
});

export default DropDown;
