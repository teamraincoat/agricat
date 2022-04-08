import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import SectionHeader from '../../atoms/Section/SectionHeader';
import { translations } from '../../provider/LocalizeProvider';
import { colors, styles } from '../../styles';
import { wp } from '../../styles/metrics';
import SectionOne from '../../componets/sections/SectionOne';
import SectionTwo from '../../componets/sections/SectionTwo';
import EButton from '../../atoms/EButton';

const Section12Screen = ({ navigation }) => {
  const phoneOwnerItems = [
    { label: 'Propio', value: 'self' },
    { label: 'Vecinos/Familiares', value: 'friend-family' },
  ];
  const SectionOneFields = [
    {
      name: 'field1',
      label: 'Section.Section1.liftDate',
      placeholder: 'Propietario del teléfono',
    },
    {
      name: 'field2',
      label: 'Section.Section1.FolioNumber',
      placeholder: 'Número de teléfono',
    },
    {
      name: 'field3',
      label: 'Section.Section1.sex',
      placeholder: 'Modelo de teléfono',
    },
    {
      name: 'field4',
      label: 'Section.Section1.languageSpeak',
      placeholder: 'Modelo de teléfono',
    },
    {
      name: 'field5',
      label: 'Section.Section1.hectareArea',
      placeholder: 'Modelo de teléfono',
    },
  ];

  const SELECTION = [
    {
      title: 'ground preparation',
      field: 'groundPreparation',
      month: '',
      week: '',
    },
    {
      title: 'Sowing',
      field: 'sowing',
      month: '',
      week: '',
    },
    {
      title: 'Germination',
      field: 'germination',
      month: '',
      week: '',
    },
    {
      title: 'Growth',
      field: 'growth',
      month: '',
      week: '',
    },
    {
      title: 'Maturation',
      field: 'maturation',
      month: '',
      week: '',
    },
    {
      title: 'Harvest',
      field: 'harvest',
      month: '',
      week: '',
    },
    {
      title: 'Sales harvest',
      field: 'salesHarvest',
      month: '',
      week: '',
    },
  ];

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    defaultValues: {
      firstName: '',
      mobilePhoneOwner: '',
      seeds: '',
      field1: '',
      field2: '',
      field3: '',
      maizeCultivation: [...SELECTION],
      workOfExperience: '',
    },
  });
  const maizeCultivationData = getValues('maizeCultivation');
  console.log('maizeCultivation--->', maizeCultivationData);

  const newForm = getValues();
  return (
    <SafeAreaView style={localStyles.mainContainer}>
      <SectionHeader
        title="Sección 1"
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
            <SectionOne
              control={control}
              errors={errors}
              fields={SectionOneFields}
              reset={reset}
              getValues={getValues}
              dropDownItems={phoneOwnerItems}
            />
            <SectionTwo
              control={control}
              errors={errors}
              maizeCultivation={maizeCultivationData}
              MaizeCultivationList={SELECTION}
              fields={SectionOneFields}
              reset={reset}
              getValues={getValues}
              dropDownItems={phoneOwnerItems}
            />
            <EButton
              title={translations['Complete.continue']}
              onClick={() => navigation.navigate('Section3Screen')}
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
  button: {
    ...styles.mv30,
  },
});

export default Section12Screen;
