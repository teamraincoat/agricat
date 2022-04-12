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

import EButton from '../../atoms/EButton';
import {
  COMPENSATION_LIST,
  DAMAGE_CROP_EVALUATED_LIST,
  DO_NOT_RECEIVED_PAYMENT_LIST,
  SECTION_FIVE_QUESTIONS,
  WEATHER_EVENT_LIST,
} from '../../config/StaticData';
import SectionFiveDropDown from '../../atoms/Section/SectionFiveDropDown';
import MultiFieldDropDown from '../../atoms/Section/MultiFieldDropDown';

const Section5Screen = ({ navigation }) => {
  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm({
    defaultValues: {
      highestSchooling: '',
      noOfPeopleInHousehold: '',
    },
  });

  return (
    <SafeAreaView style={localStyles.mainContainer}>
      <SectionHeader
        title="Section.Section5.title"
        description="Section.Section5.description"
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
                title={'Section.Section5.ThankyouMsg'}
            />
            <EText style={localStyles.labelText}>
              {translations['Section.Section5.weatherEvent']}
            </EText>
            <EText style={localStyles.labelText}>
              {translations['Section.Section5.responseEvaluation']}
            </EText>
            {/* dropdown here */}
            {WEATHER_EVENT_LIST.map((item, index) => (
                <View key={index}>
            <SectionFiveDropDown

                label={item.label}
                dropDownData={item.dropDownData}
                control={control}
                reset={reset}
                getValues={getValues}
                field={item.fieldName}

            />
            </View>
            ))}
            <SectionCard
            grey
            title={'Section.Section5.Card.confirm'}
            description={'Section.Section5.Card.confirmInstruction'}
            />
            <EText style={localStyles.labelText}>
              {translations['Section.Section5.compensation']}
            </EText>
            <EText style={localStyles.labelText}>
              {translations['Section.Section5.responseEvaluation']}
            </EText>
            {COMPENSATION_LIST.map((item, index) => (
                <View key={index}>
            <SectionFiveDropDown

                label={item.label}
                dropDownData={item.dropDownData}
                control={control}
                reset={reset}
                getValues={getValues}
                field={item.fieldName}

            />
            </View>
            ))}
            {/* dropdown here */}
            <SectionCard
            grey
            title={'Section.Section5.Card.confirm'}
            description={'Section.Section5.card.receiveAmountInstruction'}
            />

            <EText style={localStyles.labelText}>
              {translations['Section.Section5.damageCropEvaluated']}
            </EText>
            <EText style={localStyles.labelText}>
              {translations['Section.Section5.responseEvaluation']}
            </EText>
            {DAMAGE_CROP_EVALUATED_LIST.map((item, index) => (
                <View key={index}>
            <SectionFiveDropDown
                label={item.label}
                dropDownData={item.dropDownData}
                control={control}
                reset={reset}
                getValues={getValues}
                field={item.fieldName}

            />
            </View>
            ))}
            <SectionCard
            grey
            title={'Section.Section5.Card.confirm'}
            description={'Section.Section5.card.damageCropEstimated'}
            />
            <EText style={localStyles.labelText}>
              {translations['Section.Section5.doNotReceivedPayment']}
            </EText>
            <EText style={localStyles.labelText}>
              {translations['Section.Section5.responseEvaluation']}
            </EText>
            {DO_NOT_RECEIVED_PAYMENT_LIST.map((item, index) => (
                <View key={index}>
            <SectionFiveDropDown

                label={item.label}
                dropDownData={item.dropDownData}
                control={control}
                reset={reset}
                getValues={getValues}
                field={item.fieldName}

            />
            </View>
            ))}
            {/* dropdown here */}
            {/* 4th */}
            <SectionCard
            grey
            title={'Section.Section5.Card.confirm'}
            description={'Section.Section5.card.cropPartialDamage'}
            />

            {SECTION_FIVE_QUESTIONS.map((question, index) => (
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
                  placeholder={question.placeholder}
                />
              </View>
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
    ...styles.mv5,
  },
  smallInput: {
    width: wp(40),
    marginRight: wp(15),
  },
  labelText: {
    ...styles.h2,
    ...styles.left,
    ...styles.mb10,
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

export default Section5Screen;
