import React from 'react';
import { View, StyleSheet } from 'react-native';
import DocumentIcon from '../assets/icons/DocumentIcon';
import EButton from '../atoms/EButton';
import EText from '../atoms/EText';
import { translations } from '../provider/LocalizeProvider';
import { useUsers } from '../provider/UsersProvider';
import { colors, styles } from '../styles';

const ImpactReport = ({ route, navigation }) => {
  const { setEnrollDataById } = useUsers();
  const onComplete = () => {
    setEnrollDataById(null);
    navigation.navigate('ImpactReportScreens', {
      screen: 'Section12Screen',
      params: { enrollmentData: route.params?.enrollmentData ?? {} },
    });
  };
  return (
    <View style={localStyles.mainContainer}>
      <DocumentIcon />
      <EText style={localStyles.title}>{translations['Impact.title']}</EText>
      <EText style={localStyles.subTitle}>
        {translations['Impact.subTitle1']}
      </EText>
      <EText style={localStyles.subTitle}>
        {translations['Impact.subTitle2']}
      </EText>
      <EButton
        title={translations['Impact.continue']}
        onClick={() => onComplete()}
        style={localStyles.button}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.lightGrey,
    ...styles.flex,
    ...styles.center,
  },
  title: {
    ...styles.h1,
    color: colors.black,
    ...styles.mv8,
    ...styles.mt30,
  },
  subTitle: {
    color: colors.black,
    ...styles.h3,
    ...styles.mt2,
  },
  button: {
    ...styles.mt30,
  },
});

export default ImpactReport;
