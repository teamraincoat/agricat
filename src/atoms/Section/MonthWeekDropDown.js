import React, { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import { MONTH_LIST, WEEK_LIST } from '../../config/StaticData';
import DropDown from '../DropDown';

const MonthWeekDropDown = ({
  control,
  getValues,
  reset,
  fieldName,
  index,
  maizeCultivation,
}) => {
  const [openMonthDropDown, setOpenMonthDropDown] = useState(false);
  const [openWeekDropDown, setOpenWeekDropDown] = useState(false);
  const dropDownRef = React.useRef();
//   console.log('***field name--->', fieldName);
    // console.log('<----maizeCultivation--->', maizeCultivation);
    // name={`test[${index}].nestedArray[0].firstNested`}
    const singleField =  maizeCultivation[index].month; //getValues(`maizeCultivation[${index}].month`);
    // console.log('singleField', singleField);
  //   console.log('useFieldArray--fields--->', fields);
  return (
    <>
      <DropDown
        control={control}
        placeholder={'month'}
        openDropDown={openMonthDropDown}
        setOpenDropDown={setOpenMonthDropDown}
        dropDownItems={MONTH_LIST}
        fieldName={singleField}
        resetValue={reset}
        onSelectItem={(value) => {
          console.log('nnnnnnvalue++++++', value);
          console.log('nnnnnfieldName++++++', fieldName);
        //   const index = maizeCultivation.findIndex(
        //     (item) => item.field === fieldName.field,
        //   );
        //   console.log('index++++++', index);

        //   console.log('fields++++++', fields);
          console.log('hehe', Object.keys(maizeCultivation[index])[2]);
          const newFormData = { [`${maizeCultivation[index].month}`]: 'mj' };
          console.log('newFormData', newFormData);
          const formData = getValues();
        //   `test[${index}].nestedArray[0].firstNested`
          reset({
            ...formData,
            [`${maizeCultivation[index].month}`]: value.value,
          });
          setOpenMonthDropDown(!openMonthDropDown);
        }}
        formData={getValues()}
        small
      />
      <DropDown
        control={control}
        placeholder={'week'}
        openDropDown={openWeekDropDown}
        setOpenDropDown={setOpenWeekDropDown}
        dropDownItems={WEEK_LIST}
        fieldName={fieldName.week}
        resetValue={reset}
        onSelectItem={(value) => {
          const index = maizeCultivation.findIndex(
            (item) => item.field === fieldName.field,
          );
          console.log('index++++++', index);
          console.log('hehe', Object.keys(maizeCultivation[index])[2]);
          const newFormData = { [Object.keys(maizeCultivation[index])[2]]: 'mj' };
          const formData = getValues();

          reset({
            ...formData,
            [Object.keys(fieldName)[3]]: value.value,
          });
          setOpenWeekDropDown(!openWeekDropDown);
        }}
        small
        formData={getValues()}
      />
    </>
  );
};

const localStyles = StyleSheet.create({
  container: {},
});

export default MonthWeekDropDown;
