// @flow
import { StyleSheet } from 'react-native';
import { normalize } from './metrics';
import fonts, { Fonts } from './fonts';


export default (StyleSheet.create({
  textCenter: {
    textAlign: 'center',
  },
  left: {
    textAlign: 'left',
  },
  h1: {
    fontFamily: Fonts.REGULAR,
    fontSize: normalize(24),
    lineHeight: 29,
    ...fonts.f700,
  },
  h2: {
    fontFamily: Fonts.REGULAR,
    fontSize: normalize(18),
    lineHeight: 20,
    ...fonts.f700,
  },
  h3: {
    fontFamily: Fonts.REGULAR,
    fontSize: normalize(14),
    lineHeight: 17,
    ...fonts.f400,
  },
  h4: {
    fontFamily: Fonts.REGULAR,
    fontSize: normalize(12),
    lineHeight: 14,
    ...fonts.f400,
  },
  regular: {
    fontFamily: Fonts.REGULAR,
    fontSize: normalize(16),
    lineHeight: 20,
  },
}));
