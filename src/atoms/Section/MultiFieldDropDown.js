import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';

import { translations } from '../../provider/LocalizeProvider';
import { styles } from '../../styles';
import DropDown from '../DropDown';
import ETextInput from '../ETextInput';

const MultiFieldDropDown = ({
  type,
  control,
  errors,
  reset,
  field,
  DropDownData,
  formData,
  label,
  placeholder,
  multipleItems,
}) => {
  const [openDropDown, setOpenDropDown] = useState(false);

  return (
    <View style={localStyles.container}>
      {type === 'text' || type === 'number' ? (
        <Controller
          control={control}
          rules={{ required: false }}
          render={({ field: { onChange, onBlur, value } }) => (
            <ETextInput
               placeholder={placeholder &&  translations[placeholder]}
              style={[styles.p10]}
              onBlur={onBlur}
              number={type === 'number'}
              label={translations[label]}
              onChangeText={(value) => onChange(value)}
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
          label={translations[label]}
          placeholder={translations['Placeholder.selectItem']}
          openDropDown={openDropDown}
          setOpenDropDown={setOpenDropDown}
          dropDownItems={DropDownData}
          fieldName={field}
          resetValue={reset}
          formData={formData}
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
