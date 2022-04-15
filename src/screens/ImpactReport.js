import React from 'react';
import { View, StyleSheet } from 'react-native';
import DocumentIcon from '../assets/icons/DocumentIcon';
import EButton from '../atoms/EButton';
import EText from '../atoms/EText';
import { translations } from '../provider/LocalizeProvider';
import { useUsers } from '../provider/UsersProvider';
import { colors, styles } from '../styles';
import ScanModal from './ScanModal';

const ImpactReport = ({ navigation }) => {
  const [modalVisible, setModalVisible] = React.useState(false);
  const { setEnrollDataById } = useUsers();
  const onComplete = () => {
    setEnrollDataById(null);
    setModalVisible(true);
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
      <ScanModal
        visible={modalVisible}
        closeModal={setModalVisible}
        route={navigation}
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
