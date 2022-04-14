import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Pressable, ActivityIndicator, ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';

import CloseIcon from '../../assets/icons/CloseIcon';

import EButton from '../../atoms/EButton';
import EText from '../../atoms/EText';
import { colors, styles } from '../../styles';
import { hp, wp } from '../../styles/metrics';
import { translations } from '../../provider/LocalizeProvider';


const PrivacyPolicyModal = (props) => {
  const { visible, closeModal, isFrom } = props;
  const onCloseModal = () => {
    closeModal(false);
  };
  return (
    <Modal
      isVisible={visible}
      transparent={false}
      onBackButtonPress={onCloseModal}
      backdropColor={colors.lightGrey}>
      <View style={localStyles.mainContainer}>
        <Pressable style={localStyles.iconContainer} onPress={onCloseModal}>
          <CloseIcon />
        </Pressable>
      <ScrollView showsVerticalScrollIndicator={false}>
        <EText style={localStyles.title}>{translations[`${isFrom}.title`]}</EText>
        <EText style={localStyles.description}>
        {translations[`${isFrom}.description1`]}
        </EText>
        <EText style={localStyles.description}>
        {translations[`${isFrom}.description2`]}
        </EText>
        <EText style={localStyles.description}>
        {translations[`${isFrom}.description3`]}
        </EText>
        <EText style={localStyles.description}>
        {translations[`${isFrom}.description4`]}
        </EText>
        <EText style={localStyles.description}>
        {translations[`${isFrom}.description5`]}
        </EText>
      </ScrollView>

        </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  mainContainer: {
    // ...styles.flex,
    backgroundColor: colors.lightGrey,
    ...styles.flex,
  },
  descriptionContainer: {
    ...styles.center,
    width: wp(90),
    ...styles.selfCenter,
  },
  description: {
    color: colors.black,
    ...styles.mv10,
    ...styles.h3,
  },
  iconContainer: {
    alignItems: 'flex-end',
    ...styles.mt25,
    ...styles.mr15,
  },
  title: {
    ...styles.h1,
    color: colors.black,
    ...styles.mv8,
    ...styles.mt15,
    ...styles.textCenter
  },
});

export default PrivacyPolicyModal;
