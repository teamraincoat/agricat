import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import SectionHeader from '../../atoms/Section/SectionHeader';
import { translations } from '../../provider/LocalizeProvider';
import { colors, styles } from '../../styles';
import { wp } from '../../styles/metrics';
import SectionOne from '../../componets/sections/SectionOne';
import SectionTwo from '../../componets/sections/SectionTwo';
import EButton from '../../atoms/EButton';
import { SPRING_SUMMER_CORN_CROP_LIST, RESPONDER_LIST } from '../../config/StaticData';
import { useReports } from '../../provider/ImpactReportProvider';
import moment from 'moment';

const Section12Screen = ({ navigation, route }) => {
  const {
    control,
    getValues,
    reset,
    register,
    errors,
    enrollerId,
    setEnrollerId,
  } = useReports();

  const enrollerData = route.params?.enrollerData ?? '';
  if (enrollerId === null && enrollerData.id !== '') {
    setEnrollerId(enrollerData.id);
  }
  useEffect(() => {
    if (enrollerData !== '') {
      const currentFields = getValues();
      const newFields = {
        ...currentFields,
        liftingDate: moment(new Date()).format('DD-MM-YYYY'),
        folioNumber: enrollerData.folioNumber,
        sex: enrollerData.sex,
        hectareArea: enrollerData.coveredAreaHa?.$numberDecimal,
        speakingLanguage: enrollerData.spokenLanguages.join(','),
      };
      reset(newFields);
    }
  }, [enrollerData]);
  return (
    <SafeAreaView style={localStyles.mainContainer}>
      <SectionHeader
        title="Section.Section1.title"
        description="Section.Section1.description"
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
            <SectionOne
              control={control}
              errors={errors}
              enrollerData={enrollerData}
              reset={reset}
              getValues={getValues}
              dropDownItems={RESPONDER_LIST}
            />
            <SectionTwo
              control={control}
              errors={errors}
              MaizeCultivationList={SPRING_SUMMER_CORN_CROP_LIST}
              reset={reset}
              registerField={register}
              getValues={getValues}
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
