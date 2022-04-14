import moment from 'moment';
import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import DropDown from '../../atoms/DropDown';
import ETextInput from '../../atoms/ETextInput';
import { SECTION_ONE_FIELDS } from '../../config/StaticData';
import { translations } from '../../provider/LocalizeProvider';

const SectionOne = ({
  control,register, errors, reset, getValues, dropDownItems, enrollerData,
}) => {
  const [openDropDown, setOpenDropDown] = useState(false);

  return (
     <View style={styles.container}>
         {SECTION_ONE_FIELDS.map((field, index) => {
           let inputValue = '';
           switch (field.name) {
             case 'liftingDate':
               inputValue = moment(new Date()).format('DD-MM-YYYY');
               break;
             case 'folioNumber':
               inputValue = enrollerData.folioNumber;
               break;
             case 'sex':
               inputValue = enrollerData.sex;
               break;
             case 'hectareArea':
               inputValue = enrollerData.coveredAreaHa?.$numberDecimal;
               break;
             case 'speakingLanguage':
               inputValue = enrollerData.spokenLanguages.join(',');
               break;
             default:
               inputValue = '';
               break;
           }
           return (
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
                  value={inputValue}
                  error={!!errors.field}
                  errorText={errors.field && errors.field.message}
                />
              )}
              name={field.name}
            />
            </View>
           );
         })}

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
