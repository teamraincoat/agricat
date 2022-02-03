// @flow
import { StyleSheet } from 'react-native';
import { colors } from './colors';

export default (StyleSheet.create({
  borderLight: {
    borderColor: colors.transparent,
    borderWidth: 2,
  },
  radius30: {
    borderRadius: 30,
  },
  radius5: {
    borderRadius: 5,
  },
  radius8: {
    borderRadius: 8,
  },
  radius15: {
    borderRadius: 15,
  },
  radiusTR10: {
    borderTopRightRadius: 10,
  },
  radiusTL10: {
    borderTopLeftRadius: 10,
  },
}));
