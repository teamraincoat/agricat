import { StyleSheet } from 'react-native';
import flex from './flex';
import margin from './margin';
import padding from './padding';
import general from './general';
import font from './fonts';
import text from './text';
import borders from './borders';

export * from './colors';

export const styles = StyleSheet.create({
  ...flex,
  ...margin,
  ...padding,
  ...general,
  ...font,
  ...text,
  ...borders,
});
