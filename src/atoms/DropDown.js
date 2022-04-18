import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useReports } from '../provider/ImpactReportProvider';
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
  small,
  medium,
  multipleItems,
  defaultValue,
  ...rest
}) => {
  const [multipleItem, setMultipleItem] = useState([]);
  const { getValues } = useReports();
  useEffect(() => {
    if (multipleItems && multipleItem.length > 0) {
      const currentFormData = getValues();
      resetValue({ ...currentFormData, [fieldName]: multipleItem.length > 0 ? multipleItem : [] });
    }
  }, [multipleItems, multipleItem]);
  return (
  <View style={localStyles.container}>
    {label && <EText style={localStyles.labelStyle}>{label}</EText>}
    <Controller
      control={control}
      render={({ field: { value } }) => (
        <DropDownPicker
          multiple={!!multipleItems}
          placeholder={placeholder || translations['Placeholder.selectItem']}
          open={openDropDown}
          value={multipleItems ? [...multipleItem] : defaultValue || value}
          showArrowIcon={true}
          showBadgeDot={true}
          items={dropDownItems}
          showTickIcon={true}
          setOpen={setOpenDropDown}
          textStyle={{
            color: colors.black,
          }}
          onSelectItem={(_value) => {
            if (multipleItems) {
              setMultipleItem(() => {
                if (_value.length > 0) {
                  const itemArray = _value.map((item) => item.value);
                  return [...itemArray];
                }
                return [];
              });
              setOpenDropDown(!openDropDown);
            } else {
              const currentFormData = getValues();
              resetValue({
                ...currentFormData,
                [fieldName]: _value.value,
              });
            }
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
          dropDownContainerStyle={[
            localStyles.dropDownContainerStyle,
            small && localStyles.smallDropDownContainerStyle,
            medium && localStyles.mediumDropDownContainerStyle,
          ]}
          listMode="SCROLLVIEW"
            {...rest}
        />
      )}
      name={fieldName}
    />
  </View>
  );
};

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
    alignSelf: 'flex-start',
    marginLeft: wp(3),
  },
  mediumDropDownStyle: {
    width: wp(40),
    marginRight: wp(15),
  },
});

export default DropDown;
