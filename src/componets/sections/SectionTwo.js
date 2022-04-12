import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import DropDown from '../../atoms/DropDown';
import EText from '../../atoms/EText';
import ETextInput from '../../atoms/ETextInput';
import MonthWeekDropDown from '../../atoms/Section/MonthWeekDropDown';
import MultiFieldDropDown from '../../atoms/Section/MultiFieldDropDown';
import SectionCard from '../../atoms/Section/SectionCard';
import SectionHeader from '../../atoms/Section/SectionHeader';
import {
  MONTH_LIST, PRODUCT_EXPENSE_LIST, SECTION_TWO_QUESTIONS, TOTAL_COST_LIST, WEEK_LIST,
} from '../../config/StaticData';
import { translations } from '../../provider/LocalizeProvider';
import { colors, styles } from '../../styles';
import { normalize, wp } from '../../styles/metrics';

const SectionTwo = ({
  control,
  getValues,
  reset,
  errors,
  MaizeCultivationList,
  registerField,
}) => {
  const [workOnLandDropDown, setWorkOnLandDropDown] = useState(false);
  const [openProductionExpense, setOpenProductionExpense] = useState(false);
  const [openCropTypeDropDown, setOpenCropTypeDropDown] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'maizeCultivation',
  });

  return (
    <>
      <SectionHeader
        title="Section.Section2.title"
        description="Section.Section2.description"
      />
      <SectionCard
      title={'Section.Section2.ThankyouMsg'}
      />
  {SECTION_TWO_QUESTIONS.map((question, index) => (
      <View key={index}>
      <MultiFieldDropDown
        control={control}
        type={question.type}
        errors={errors}
        label={question.label}
        DropDownData={question?.dropDownList}
        field={question.field}
        reset={reset}
        formData={getValues()}
        multipleItems={question.multipleItems}
        />
        </View>
  ))}
      <EText style={localStyles.description}>
        {translations['Section.Section2.springSummerMaize']}
      </EText>
      <View style={[localStyles.tableContainer, { ...styles.mv10 }]}>
        <View style={localStyles.emptyView} />
        <View style={localStyles.tableHeaderContainer}>
          <EText style={localStyles.tableHeader}>{translations['Section.Section3.Month']}</EText>
          <EText style={localStyles.tableHeader}>{translations['Section.Section3.Week']}</EText>
        </View>
      </View>
      <>
        {MaizeCultivationList.map((item, index) => (
          <View
            key={index}
            style={[localStyles.tableContainer, { ...styles.mt2 }]}>
            <EText style={localStyles.field}>{item.title}</EText>
            <View style={localStyles.dropDownContainer}>
              <MonthWeekDropDown
                control={control}
                register={registerField}
                getValues={getValues}
                reset={reset}
                index={index}
                maizeCultivation={fields}
                name={`${item.title}Month`}
                fieldName={item}
                errors={errors}
              />
            </View>
          </View>
        ))}
      </>
      <View style={localStyles.costContainer}>
        <EText style={[localStyles.description, { ...styles.mv15 }]}>
          {translations['Section.Section2.hectareOnItem']}
        </EText>
        <EText style={localStyles.description}>
          {translations['Section.Section2.totalCostPerCycle']}
        </EText>
      </View>
      {TOTAL_COST_LIST.map((item, index) => (
        <View key={index}>
          <Controller
            control={control}
            key={index}
            rules={{ required: false }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ETextInput
                style={[styles.p10]}
                onBlur={onBlur}
                placeholder={translations['Section.Section2.perHectareUnit']}
                leftLabel
                number
                label={item.label}
                onChangeText={(value) => onChange(value)}
                value={value}
                error={!!errors.field}
                errorText={
                  errors.field && errors.field.message
                }
              />
            )}
            name={item.field}
          />
        </View>
      ))}
      <DropDown
        control={control}
        label={translations['Section.Section2.productionExpense']}
        placeholder={translations['Placeholder.selectItem']}
        openDropDown={openProductionExpense}
        setOpenDropDown={setOpenProductionExpense}
        dropDownItems={PRODUCT_EXPENSE_LIST}
        fieldName="productionExpense"
        resetValue={reset}
        formData={getValues()}
      />
    </>
  );
};

const localStyles = StyleSheet.create({
  container: {},
  tableContainer: {
    ...styles.rowSpaceBetween,
    marginHorizontal: wp(5),
  },
  emptyView: {
    width: wp(10),
  },
  tableHeaderContainer: {
    ...styles.rowSpaceBetween,
    width: wp(60),
    paddingHorizontal: wp(8),
    paddingRight: wp(12),
  },
  tableHeader: {
    color: colors.black,
  },
  field: {
    ...styles.h4,
    width: wp(25),
    color: colors.black,
  },
  dropDownContainer: {
    width: wp(65),
    ...styles.rowSpaceBetween,
    ...styles.selfCenter,
    paddingHorizontal: wp(1),
  },
  sectionCardDescription: {
    color: colors.black,
    ...styles.h3,
  },
  description: {
    color: colors.black,
    ...styles.h2,
    fontSize: normalize(12),
    ...styles.left,
    marginLeft: wp(5),
  },
  costContainer: {
    width: wp(95),
    // ...styles.mh10,
    ...styles.selfCenter,
  },
});

export default SectionTwo;
