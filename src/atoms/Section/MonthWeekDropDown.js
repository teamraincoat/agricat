import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
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
  const [isValueChanged, setIsValueChanged] = useState(false);
  const maizeCultivation = getValues('maizeCultivation');
  const [newMaizeCultivation, setNewMaizeCultivation] = useState(maizeCultivation);
  const [defaultMonth, setDefaultMonth] = useState('');
  const [defaultWeek, setDefaultWeek] = useState('');

  useEffect(() => {
    const formData = getValues();
    reset({
      ...formData,
      maizeCultivation: [...newMaizeCultivation],
    });
  }, [isValueChanged]);


  return (
    <>
      <DropDown
        control={control}
        placeholder={'mes'}
        openDropDown={openMonthDropDown}
        setOpenDropDown={setOpenMonthDropDown}
        dropDownItems={MONTH_LIST}
        fieldName={Object.keys(newMaizeCultivation[index])[2]}
        defaultValue={defaultMonth}
        onSelectItem={(value) => {
          setNewMaizeCultivation((prevState) => {
            const copyMaizeCultivation = [...prevState];
            copyMaizeCultivation[index].month = value.value;
            return copyMaizeCultivation;
          });
          setDefaultMonth(value.value);
          setIsValueChanged(!isValueChanged);
          setOpenMonthDropDown(!openMonthDropDown);
        }}
        formData={getValues()}
        small
      />
      <DropDown
        control={control}
        placeholder={'semana'}
        openDropDown={openWeekDropDown}
        setOpenDropDown={setOpenWeekDropDown}
        dropDownItems={WEEK_LIST}
        defaultValue={defaultWeek}
        fieldName={Object.keys(newMaizeCultivation[index])[3]}
        //  resetValue={reset}
        onSelectItem={(value) => {
          setNewMaizeCultivation((prevState) => {
            const copyMaizeCultivation = [...prevState];
            copyMaizeCultivation[index].week = value.value;
            return copyMaizeCultivation;
          });
          setDefaultWeek(value.value);
          setIsValueChanged(!isValueChanged);
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
