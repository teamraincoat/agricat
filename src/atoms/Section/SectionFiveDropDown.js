import React from 'react';
import { View, StyleSheet } from 'react-native';
import { translations } from '../../provider/LocalizeProvider';
import { colors, styles } from '../../styles';
import { normalize, wp } from '../../styles/metrics';
import DropDown from '../DropDown';
import EText from '../EText';

const SectionFiveDropDown = ({
  label, control, dropDownData, field, reset, getValues,
}) => {
  const [openDropDown, setOpenDropDown] = React.useState(false);
  return (
    <View style={localStyles.dropDownContainer}>
    <EText style={[localStyles.labelText, localStyles.dropDownLabel]}>
      {translations[label]}
    </EText>
    <DropDown
      control={control}
      //   label={translations['Section.Section3.cornHarvestedAtHome']}
      placeholder={translations['Placeholder.selectItem']}
      openDropDown={openDropDown}
      setOpenDropDown={setOpenDropDown}
      dropDownItems={dropDownData}
      fieldName={field}
      resetValue={reset}
      medium
      formData={getValues()}
    />
  </View>
  );
};
const localStyles = StyleSheet.create({
  dropDownContainer: {
    ...styles.rowSpaceBetween,
    marginHorizontal: wp(5),
  },
  dropDownLabel: {
    ...styles.h3,
    fontSize: normalize(12),
    // marginLeft: wp(10),
    width: wp(45),
    // backgroundColor:'red',
    color: colors.black,
    textAlign: 'right',
  },
});

export default SectionFiveDropDown;
