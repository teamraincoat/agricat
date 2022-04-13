import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EText from '../../atoms/EText';
import ETextInput from '../../atoms/ETextInput';
import SectionCard from '../../atoms/Section/SectionCard';
import SectionHeader from '../../atoms/Section/SectionHeader';
import { translations } from '../../provider/LocalizeProvider';
import { colors, styles } from '../../styles';
import { normalize, wp } from '../../styles/metrics';
import DropDown from '../../atoms/DropDown';
import EButton from '../../atoms/EButton';
import {
  CORN_HARVEST_CONSUMPTION_LIST,
  MONTH_LIST,
  SECTION_THREE_QUESTIONS,
} from '../../config/StaticData';
import MultiFieldDropDown from '../../atoms/Section/MultiFieldDropDown';
import { useReports } from '../../provider/ImpactReportProvider';

const Section3Screen = ({ navigation }) => {
  const {
    control,
    getValues,
    reset,
    errors,
  } = useReports();
  const [cornHarvestedAtHomeDropDown, setCornHarvestedAtHomeDropDown] = useState(false);
  const [cropLossMonthDropDown, setCropLossMonthDropDown] = useState(false);
  return (
    <SafeAreaView style={localStyles.mainContainer}>
      <SectionHeader
        title="Section.Section3.title"
        description="Section.Section3.description"
        isMain
        onBack={() => navigation.goBack()}
      />
      <View style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={[styles.flex, { width: wp(100) }]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <SectionCard
            title={'Section.Section3.ThankyouMsg'}
            />
            <EText style={localStyles.labelText}>
              {' '}
              {translations['Section.Section3.cornHarvestedInKilo']}
            </EText>
            <Controller
              control={control}
              rules={{ required: false }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ETextInput
                  // placeholder={translations['Placeholder.firstName']}
                  style={[styles.p10]}
                  onBlur={onBlur}
                  leftLabel
                  style={localStyles.smallInput}
                  label={'Kilos'}
                  number
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  error={!!errors.cornHarvestedInKilo}
                  errorText={
                    errors.cornHarvestedInKilo
                    && errors.cornHarvestedInKilo.message
                  }
                />
              )}
              name={'cornHarvestedInKilo'}
            />
            <DropDown
              control={control}
              label={translations['Section.Section3.cornHarvestedAtHome']}
              placeholder={translations['Placeholder.selectItem']}
              openDropDown={cornHarvestedAtHomeDropDown}
              setOpenDropDown={setCornHarvestedAtHomeDropDown}
              dropDownItems={CORN_HARVEST_CONSUMPTION_LIST}
              fieldName="cornHarvestedAtHome"
              resetValue={reset}
              formData={getValues()}
            />
            <EText style={localStyles.labelText}>
              {translations['Section.Section3.cropLoss']}
            </EText>
            <Controller
              control={control}
              rules={{ required: false }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ETextInput
                  // placeholder={translations['Placeholder.firstName']}
                  style={[styles.p10]}
                  onBlur={onBlur}
                  leftLabel
                  style={localStyles.smallInput}
                  label={translations['Section.Section3.Year']}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  number
                  error={!!errors.cropLossYear}
                  errorText={errors.cropLossYear && errors.cropLossYear.message}
                />
              )}
              name={'cropLossYear'}
            />
            <View style={localStyles.monthDropDownContainer}>
              <EText style={[localStyles.labelText, localStyles.dropDownLabel]}>
                {translations['Section.Section3.Month']}
              </EText>
              <DropDown
                control={control}
                //   label={translations['Section.Section3.cornHarvestedAtHome']}
                placeholder={translations['Placeholder.selectItem']}
                openDropDown={cropLossMonthDropDown}
                setOpenDropDown={setCropLossMonthDropDown}
                dropDownItems={MONTH_LIST}
                fieldName="cropLossMonth"
                resetValue={reset}
                medium
                formData={getValues()}
              />
            </View>

            <Controller
              control={control}
              rules={{ required: false }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ETextInput
                  // placeholder={translations['Section.Section3.lostHarvestAmount']}
                  style={[styles.p10]}
                  onBlur={onBlur}
                  leftLabel
                  style={localStyles.smallInput}
                  label={translations['Section.Section3.lostHarvestAmount']}
                  onChangeText={(value) => onChange(value)}
                  value={value}
                  number
                  error={!!errors.LostHarvestAmount}
                  errorText={
                    errors.LostHarvestAmount && errors.LostHarvestAmount.message
                  }
                />
              )}
              name={'LostHarvestAmount'}
            />

            {SECTION_THREE_QUESTIONS.map((question, index) => (
              <View key={index}>
                <MultiFieldDropDown
                  type={question.type}
                  label={question.label}
                  DropDownData={question?.dropDownList}
                  field={question.field}
                  multipleItems={question.multipleItems}
                />
              </View>
            ))}
            <EButton
              title={translations['Complete.continue']}
              onClick={() => navigation.navigate('Section4Screen')}
              style={localStyles.button}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.lightGrey,
    ...styles.flex,
  },
  sectionCardDescription: {
    color: colors.black,
    ...styles.h3,
    fontSize: normalize(12),
    ...styles.textCenter,
  },
  smallInput: {
    width: wp(40),
    marginRight: wp(15),
  },
  labelText: {
    ...styles.h2,
    ...styles.left,
    ...styles.mv8,
    fontSize: normalize(12),
    marginHorizontal: wp(6),
    color: colors.black,
  },
  monthDropDownContainer: {
    ...styles.rowSpaceBetween,
    marginHorizontal: wp(5),
  },
  dropDownLabel: {
    ...styles.h4,
    fontSize: normalize(14),
    marginLeft: wp(12),
    color: colors.black,
  },
  button: {
    ...styles.mv30,
  },
});

export default Section3Screen;
