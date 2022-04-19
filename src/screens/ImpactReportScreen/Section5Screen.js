import React from 'react';
import { ObjectId } from 'bson';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EText from '../../atoms/EText';
// import ETextInput from '../../atoms/ETextInput';
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
import { useReports } from '../../provider/ImpactReportProvider';
import getRealm from '../../database/realmConfig';

const Section5Screen = ({ navigation }) => {
  const {
    control,
    getValues,
    reset,
    // errors,
    enrollmentId,
  } = useReports();
  const submitReport = () => {
    const reportData = getValues();

    const payload = {
      _id: new ObjectId(enrollmentId),
      _annotations: {
        ir_liftingDate: reportData.liftingDate ?? '',
        ir_folioNumber: reportData.folioNumber ?? '',
        ir_sex: reportData.sex ?? '',
        ir_spokenLanguages: reportData?.spokenLanguages ?? '',
        ir_hectareArea: reportData.hectareArea ?? '',
        ir_respondToSurvey: reportData.respondToSurvey ?? '',
        ir_workOfExperience: reportData.workOfExperience ?? '',
        ir_workOnLand: reportData?.workOnLand.join(',') ?? '',
        ir_farmLand: reportData.farmLand ?? '',
        ir_largestPartLandCrop: reportData.largestPartLandCrop ?? '',
        ir_sameCrop: reportData.sameCrop ?? '',
        ir_maizeCultivation: JSON.stringify(reportData?.maizeCultivation) ?? '',
        ir_seeds: reportData.seeds ?? '',
        ir_machinery: reportData.machinery ?? '',
        ir_salaries: reportData.salaries ?? '',
        ir_fertilizers: reportData.fertilizers ?? '',
        ir_irrigation: reportData.irrigation ?? '',
        ir_otherCost: reportData.otherCost ?? '',
        ir_productionExpense: reportData.productionExpense ?? '',
        ir_cornHarvestedInKilo: reportData.cornHarvestedInKilo ?? '',
        ir_cornHarvestedAtHome: reportData.cornHarvestedAtHome ?? '',
        ir_cropLossYear: reportData.cropLossYear ?? '',
        ir_cropLossMonth: reportData.cropLossMonth ?? '',
        ir_lostHarvestAmount: reportData.lostHarvestAmount ?? '',
        ir_causedEvent: reportData?.causedEvent.join(',') ?? '',
        ir_makeupLoss: reportData?.makeupLoss.join(',') ?? '',
        ir_riskCauseLost: reportData?.selectRisk.join(',') ?? '',
        ir_riskHouseholdIncome: reportData.riskHouseholdIncome ?? '',
        ir_highestSchooling: reportData.highestSchooling ?? '',
        ir_noOfPeopleInHousehold: reportData.noOfPeopleInHousehold ?? '',
        ir_familyIncome: reportData.familyIncome ?? '',
        ir_provideMostFamilyIncome: reportData.provideMostFamilyIncome ?? '',
        ir_representIncome: reportData.representIncome ?? '',
        ir_governmentProgramsSupport: reportData?.governmentProgramsSupport.join(',') ?? '',
        ir_mentionedDrought: reportData.mentionedDrought ?? '',
        ir_mentionedRain: reportData.mentionedRain ?? '',
        ir_mentionedDroughtRain: reportData.mentionedDroughtRain ?? '',
        ir_dontRemember: reportData.dontRemember ?? '',
        ir_mentionedDroughtBetween: reportData.mentionedDroughtBetween ?? '',
        ir_mentionedRainBetween: reportData.mentionedRainBetween ?? '',
        ir_dontRememberCompensation: reportData.dontRememberCompensation ?? '',
        ir_mentionedSatellite: reportData.mentionedSatellite ?? '',
        ir_mentionedFieldEvaluation: reportData.mentionedFieldEvaluation ?? '',
        ir_mentionedOthers: reportData.mentionedOthers ?? '',
        ir_dontRememberDamageCrop: reportData.dontRememberDamageCrop ?? '',
        ir_mentionedPossible: reportData.mentionedPossible ?? '',
        ir_dontRememberReceivedPayment: reportData.dontRememberReceivedPayment ?? '',
        ir_receivePaymentFromInsurance: reportData?.receivePaymentFromInsurance.join(',') ?? '',
        ir_askInsuranceType: reportData.askInsuranceType ?? '',
        ir_agriculturalInsurance: reportData.agriculturalInsurance ?? '',
        ir_haveOtherInsurance: reportData.haveOtherInsurance ?? '',
        ir_payForOtherInsurance: reportData.PayForOtherInsurance ?? '',
        ir_howMuchPayForOtherInsurance: reportData.howMuchPayForOtherInsurance ?? '',
      },

    };
    getRealm()
      .then((projectRealm) => {
        projectRealm.write(() => {
          projectRealm.create('Enrollment', payload, 'modified');
        });
        // const userListUpdated = projectRealm.objects('Enrollment');
        // console.log('userListUpdated', JSON.stringify(userListUpdated));
        navigation.navigate('Complete', {});
      }).catch((error) => {
        console.log('error', error);
      });
  };
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
                  type={question.type}
                  label={question.label}
                  DropDownData={question?.dropDownList}
                  field={question.field}
                  multipleItems={question.multipleItems}
                  placeholder={question.placeholder}
                />
              </View>
            ))}
            <EButton
              title={translations['Complete.continue']}
              onClick={() => submitReport()}
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
