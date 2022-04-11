import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import DropDown from '../../atoms/DropDown';
import ETextInput from '../../atoms/ETextInput';
import { SECTION_ONE_FIELDS } from '../../config/StaticData';
import { translations } from '../../provider/LocalizeProvider';

const SectionOne = ({
  control, errors, reset, getValues, dropDownItems,
}) => {
  const [openDropDown, setOpenDropDown] = useState(false);

  return (
     <View style={styles.container}>
         {SECTION_ONE_FIELDS.map((field, index) => (
            <View key={index}>
            <Controller
              control={control}
              key={index}
              rules={{ required: translations['Field.required'] }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ETextInput
                  placeholder={translations[`Enroller.${field.name}`]}
                  style={[styles.p10]}
                  onBlur={onBlur}
                  disabled
                  label={translations[`${field.label}`]}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  error={!!errors.field}
                  errorText={errors.field && errors.field.message}
                />
              )}
              name={field.name}
            />
            </View>
         ))}

        <DropDown
              control={control}
              label={translations['Section.Section1.respondSurvey']}
              placeholder={translations['Placeholder.selectItem']}
              openDropDown={openDropDown}
              setOpenDropDown={setOpenDropDown}
              dropDownItems={dropDownItems}
              fieldName="respondToSurvey"
              resetValue={reset}
              formData={getValues()}
            />
     </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default SectionOne;
