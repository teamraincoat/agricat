import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { View, StyleSheet } from 'react-native';
import DropDown from '../../atoms/DropDown';
import EText from '../../atoms/EText';
import ETextInput from '../../atoms/ETextInput';
import MonthWeekDropDown from '../../atoms/Section/MonthWeekDropDown';
import SectionCard from '../../atoms/Section/SectionCard';
import SectionHeader from '../../atoms/Section/SectionHeader';
import { MONTH_LIST, TOTAL_COST_LIST, WEEK_LIST } from '../../config/StaticData';
import { translations } from '../../provider/LocalizeProvider';
import { colors, styles } from '../../styles';
import { normalize, wp } from '../../styles/metrics';

const SectionTwo = ({
  control,
  getValues,
  reset,
  errors,
  MaizeCultivationList,
  maizeCultivation,
}) => {
  const [workOnLandDropDown, setWorkOnLandDropDown] = useState(false);
  const [openCropDropDown, setOpenCropDropDown] = useState(false);
  const [openCropTypeDropDown, setOpenCropTypeDropDown] = useState(false);

  return (
    <>
      <SectionHeader
        title="Sección 2"
        description="Datos de identificacion del asegurado"
      />
      <SectionCard>
        <EText style={localStyles.sectionCardDescription}>
          {translations['Section.Section2.ThankyouMsg']}
        </EText>
      </SectionCard>
      <Controller
        control={control}
        rules={{ required: translations['Field.required'] }}
        render={({ field: { onChange, onBlur, value } }) => (
          <ETextInput
            //   placeholder={translations[`Enroller.${field.name}`]}
            style={[styles.p10]}
            onBlur={onBlur}
            label={translations['Section.Section2.workOfExperience']}
            onChangeText={(value) => onChange(value)}
            value={value}
            error={!!errors.workOfExperience}
            errorText={
              errors.workOfExperience && errors.workOfExperience.message
            }
          />
        )}
        name={'workOfExperience'}
      />
      <DropDown
        control={control}
        label={translations['Section.Section2.workOnLand']}
        placeholder={translations['Placeholder.selectItem']}
        openDropDown={workOnLandDropDown}
        setOpenDropDown={setWorkOnLandDropDown}
        dropDownItems={MONTH_LIST}
        fieldName="workOnLand"
        resetValue={reset}
        formData={getValues()}
      />
      <Controller
        control={control}
        rules={{ required: translations['Field.required'] }}
        render={({ field: { onChange, onBlur, value } }) => (
          <ETextInput
            //   placeholder={translations[`Enroller.${field.name}`]}
            style={[styles.p10]}
            onBlur={onBlur}
            label={translations['Section.Section2.farmLand']}
            onChangeText={(value) => onChange(value)}
            value={value}
            error={!!errors.farmLand}
            errorText={errors.farmLand && errors.farmLand.message}
          />
        )}
        name={'farmLand'}
      />
      <DropDown
        control={control}
        label={translations['Section.Section2.crop']}
        placeholder={translations['Placeholder.selectItem']}
        openDropDown={openCropDropDown}
        setOpenDropDown={setOpenCropDropDown}
        dropDownItems={MONTH_LIST}
        fieldName="crop"
        resetValue={reset}
        formData={getValues()}
      />
      <DropDown
        control={control}
        label={translations['Section.Section2.sameCrop']}
        placeholder={translations['Placeholder.selectItem']}
        openDropDown={openCropTypeDropDown}
        setOpenDropDown={setOpenCropTypeDropDown}
        dropDownItems={MONTH_LIST}
        fieldName="sameCrop"
        resetValue={reset}
        formData={getValues()}
      />
      <EText style={localStyles.description}>
        {translations['Section.Section2.springSummerMaize']}
      </EText>
      <View style={[localStyles.tableContainer, { ...styles.mv10 }]}>
        <View style={localStyles.emptyView} />
        <View style={localStyles.tableHeaderContainer}>
          <EText style={localStyles.tableHeader}>{'Mes'}</EText>
          <EText style={localStyles.tableHeader}>{'Semana'}</EText>
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
                getValues={getValues}
                reset={reset}
                maizeCultivation={maizeCultivation}
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
        <>
          <Controller
            control={control}
            key={index}
            rules={{ required: translations['Field.required'] }}
            render={({ field: { onChange, onBlur, value } }) => (
              <ETextInput
                placeholder={translations['Placeholder.firstName']}
                style={[styles.p10]}
                onBlur={onBlur}
                leftLabel
                // label={translations['Enroller.firstName']}
                label={item.label}
                onChangeText={(value) => onChange(value)}
                value={value}
                error={errors.item && !!errors.item.label}
                errorText={
                  errors.item && errors.item.label && errors.item.label.message
                }
              />
            )}
            name={item.label}
          />
        </>
      ))}
      <DropDown
        control={control}
        label={translations['Section.Section2.productionExpense']}
        placeholder={translations['Placeholder.selectItem']}
        openDropDown={workOnLandDropDown}
        setOpenDropDown={setWorkOnLandDropDown}
        dropDownItems={MONTH_LIST}
        fieldName="workOnLand"
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
