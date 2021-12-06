import {Platform, StyleSheet} from 'react-native'
import {colors} from './colors'

export default StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
  androidShadow: {
    borderColor: Platform.OS === 'android' ? '#000' : undefined,
    elevation: 5,
    shadowColor: '#000',
  },
  androidShadowMuted: {
    borderColor: Platform.OS === 'android' ? '#000' : undefined,
    elevation: 1,
    shadowColor: '#000',
  },
  hfull: {
    height: '100%',
  },
  imageFull: {
    height: '100%',
    width: '100%',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  shadow: {
    elevation: 8,
    shadowColor: colors.lightGrey,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.44,
    shadowRadius: 6.32,
  },
  wfull: {
    width: '100%',
  },
})
