import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { useReports } from '../../provider/ImpactReportProvider';

import { translations } from '../../provider/LocalizeProvider';
import { styles, colors } from '../../styles';
import DropDown from '../DropDown';
import ETextInput from '../ETextInput';

const MultiFieldDropDown = ({
  type,
  field,
  DropDownData,
  label,
  placeholder,
  multipleItems,
}) => {
  const [openDropDown, setOpenDropDown] = useState(false);
  const {
    control,
    getValues,
    reset,
    errors,
  } = useReports();

  return (
    <View style={localStyles.container}>
      {type === 'text' || type === 'number' ? (
        <Controller
          control={control}
          rules={{ required: false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ETextInput
              placeholder={placeholder && translations[placeholder]}
              style={[styles.p10, { color: colors.black }]}
              onBlur={onBlur}
              number={type === 'number'}
              label={translations[label] || ''}
              onChangeText={(_value) => onChange(_value)}
              value={value}
              error={!!errors.field}
              errorText={errors.field && errors.field.message}
            />
          )}
          name={field}
        />
      ) : (
        <DropDown
          control={control}
          label={translations[label] || ''}
          placeholder={translations['Placeholder.selectItem'] || ''}
          openDropDown={openDropDown}
          setOpenDropDown={setOpenDropDown}
          dropDownItems={DropDownData}
          fieldName={field}
          resetValue={reset}
          formData={getValues()}
          multipleItems={!!multipleItems}
        />
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {},
});

export default MultiFieldDropDown;
