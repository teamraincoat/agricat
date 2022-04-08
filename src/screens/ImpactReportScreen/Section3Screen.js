import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

const Section3Screen = ({ navigation }) => {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    defaultValues: {
      cornHarvestedInKilo: '',
      cornHarvestedAtHome: '',
    },
  });
  const [cornHarvestedAtHomeDropDown, setCornHarvestedAtHomeDropDown] = useState(false);
  const phoneOwnerItems = [
    { label: 'Propio', value: 'self' },
    { label: 'Vecinos/Familiares', value: 'friend-family' },
  ];

  const SectionThreeDropDown = [
    {
      fieldName: 'causedEvent',
      label: 'Section.Section3.causedEvent',
      dropDownData: [{ label: 'Si', value: 'yes' }],
    },
    {
      fieldName: 'makeupLoss',
      label: 'Section.Section3.makeupLoss',
      dropDownData: [{ label: 'Si', value: 'yes' }],
    },
    {
      fieldName: 'selectRisk',
      label: 'Section.Section3.cropLoss.selectRisk',
      dropDownData: [{ label: 'Si', value: 'yes' }],
    },
    {
      fieldName: 'riskHouseholdIncome',
      label: 'Section.Section3.cropLoss.riskHouseholdIncome',
      dropDownData: [{ label: 'Si', value: 'yes' }],
    },
  ];

  return (
    <SafeAreaView style={localStyles.mainContainer}>
      <SectionHeader
        title="Sección 3"
        isMain
        onBack={() => navigation.goBack()}
        description="Datos de identificacion del asegurado"
      />
      <View style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={[styles.flex, { width: wp(100) }]}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <SectionCard>
              <EText style={localStyles.sectionCardDescription}>
                {translations['Section.Section3.ThankyouMsg']}
              </EText>
            </SectionCard>
            <EText style={localStyles.labelText}>
              {' '}
              {translations['Section.Section3.cornHarvestedInKilo']}
            </EText>
            <Controller
              control={control}
              rules={{ required: translations['Field.required'] }}
              render={({ field: { onChange, onBlur, value } }) => (
                <ETextInput
                  // placeholder={translations['Placeholder.firstName']}
                  style={[styles.p10]}
                  onBlur={onBlur}
                  leftLabel
                  style={localStyles.smallInput}
                  label={'Kilos'}
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
              dropDownItems={phoneOwnerItems}
              fieldName="cornHarvestedAtHome"
              resetValue={reset}
              formData={getValues()}
            />
            <EText style={localStyles.labelText}>
              {' '}
              {translations['Section.Section3.cropLoss']}
            </EText>
            <Controller
              control={control}
              rules={{ required: translations['Field.required'] }}
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
                  error={!!errors.cornHarvestedInKilo}
                  errorText={
                    errors.cornHarvestedInKilo
                    && errors.cornHarvestedInKilo.message
                  }
                />
              )}
              name={'cornHarvestedInKilo'}
            />
            <View style={localStyles.monthDropDownContainer}>
              <EText style={[localStyles.labelText, localStyles.dropDownLabel]}>
                {' '}
                {translations['Section.Section3.Month']}
              </EText>
              <DropDown
                control={control}
                //   label={translations['Section.Section3.cornHarvestedAtHome']}
                placeholder={translations['Placeholder.selectItem']}
                openDropDown={cornHarvestedAtHomeDropDown}
                setOpenDropDown={setCornHarvestedAtHomeDropDown}
                dropDownItems={phoneOwnerItems}
                fieldName="cornHarvestedAtHome"
                resetValue={reset}
                medium
                formData={getValues()}
              />
            </View>

            <Controller
              control={control}
              rules={{ required: translations['Field.required'] }}
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
                  error={!!errors.cornHarvestedInKilo}
                  errorText={
                    errors.cornHarvestedInKilo
                    && errors.cornHarvestedInKilo.message
                  }
                />
              )}
              name={'cornHarvestedInKilo'}
            />

            {SectionThreeDropDown.map((item, index) => (
              <>
                <DropDown
                  control={control}
                  key={index}
                  label={translations[item.label]}
                  placeholder={translations['Placeholder.selectItem']}
                  openDropDown={cornHarvestedAtHomeDropDown}
                  setOpenDropDown={setCornHarvestedAtHomeDropDown}
                  dropDownItems={item.dropDownData}
                  fieldName={item.fieldName}
                  resetValue={reset}
                  formData={getValues()}
                />
              </>
            ))}
            <EButton
              title={translations['Complete.continue']}
              onClick={() => console.log('click')}
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
