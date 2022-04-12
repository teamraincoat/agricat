import React, { useEffect, useState } from 'react';
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
  register,
//   maizeCultivation,
}) => {
  const [openMonthDropDown, setOpenMonthDropDown] = useState(false);
  const [openWeekDropDown, setOpenWeekDropDown] = useState(false);

  const maizeCultivation = getValues('maizeCultivation');
  const [newList, setNewList] = useState(maizeCultivation);
  const [isValueChanged, setIsValueChanged] = useState(false);

  useEffect(() => {
    if (newList) {
      const formData = getValues();
      console.log('formData@@@@', formData);
      reset({
        ...formData,
        maizeCultivation: [...newList],
      });
    //   setIsValueChanged(!isValueChanged);
    }
  }, [isValueChanged]);

  const latestForm = getValues();

  return (
    <>
      <DropDown
        control={control}
        placeholder={'month'}
        openDropDown={openMonthDropDown}
        setOpenDropDown={setOpenMonthDropDown}
        dropDownItems={MONTH_LIST}
        fieldName={Object.keys(newList[index])[2]}
        onSelectItem={(value) => {
          console.log('nnnnnnvalue++++++', value);
          console.log('nnnnnfieldName++++++', fieldName);
          setNewList((prevState) => {
            const new1List = [...prevState];
            // console.log('new1List', new1List[index]);
            new1List[index].month = value.value;
            return new1List;
          });
          setIsValueChanged(!isValueChanged);
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
        //  resetValue={reset}
        onSelectItem={(value) => {
          const index = maizeCultivation.findIndex(
            (item) => item.field === fieldName.field,
          );
          console.log('index++++++', index);
          console.log('hehe', Object.keys(maizeCultivation[index])[2]);
          const newFormData = { [Object.keys(maizeCultivation[index])[2]]: 'mj' };
          const formData = getValues();

          //   reset({
          //     ...formData,
          //     [Object.keys(fieldName)[3]]: value.value,
          //   });
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
