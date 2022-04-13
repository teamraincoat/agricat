import React, { useState } from 'react';
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
import { MONTH_LIST, SECTION_FOUR_QUESTIONS } from '../../config/StaticData';
import MultiFieldDropDown from '../../atoms/Section/MultiFieldDropDown';
import { useReports } from '../../provider/ImpactReportProvider';

const Section4Screen = ({ navigation }) => {
  const {
    control,
    getValues,
    reset,
    errors,
  } = useReports();
  const [highestSchoolingDropDown, setHighestSchoolingDropDown] = useState(false);

  return (
    <SafeAreaView style={localStyles.mainContainer}>
      <SectionHeader
        title="Section.Section4.title"
        description="Section.Section4.description"
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
            title={'Section.Section4.instruction'}
            />
            {SECTION_FOUR_QUESTIONS.map((question, index) => (
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
              onClick={() => navigation.navigate('Section5Screen')}
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

export default Section4Screen;
