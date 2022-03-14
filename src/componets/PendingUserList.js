/* eslint-disable no-underscore-dangle */
import moment from 'moment';
import React from 'react';
import {
  View, Pressable, StyleSheet,
} from 'react-native';

import VerifiedIcon from '../assets/icons/VerifiedIcon';
import EText from '../atoms/EText';

import { colors, styles } from '../styles';
import { normalize, wp } from '../styles/metrics';

export default function PendingUserList({ item }) {
  return (
    <View style={localStyles.movieContainer}>
      <View style={localStyles.mainContainer}>
        <View style={localStyles.userDetail}>
          <Pressable style={localStyles.enrolledDetailContainer}>
            <EText
              ellipsizeMode={'tail'}
              numberOfLines={1}
              style={localStyles.enrolledTitle}>
              {item._id.toString()}
            </EText>
            <EText
              ellipsizeMode={'tail'}
              numberOfLines={1}
              style={localStyles.enrolledId}>
              {moment(item.applicationTime).fromNow()}
            </EText>
          </Pressable>
        </View>

        <View >
          <Pressable>
            <VerifiedIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
const localStyles = StyleSheet.create({
  item: {
    marginTop: 10,
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 10,

  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  imageStyle: {
    height: 80,
    width: 80,
    marginLeft: 0,
    marginRight: 10,
    borderRadius: 10,
  },
  container: {
    marginVertical: 10,
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 0,

  },
  itemStyle: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 20,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 4,

  },
  itemText: {
    fontSize: 22,
    color: '#393939',
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },

  movieContainer: {
    width: wp(85),
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12 * 0.5,
    paddingVertical: 5,
    ...styles.ph10,
    ...styles.radius5,
    marginVertical: 6,
  },
  mainContainer: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 80,
    width: 80,
    margin: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  enrolledDetailContainer: {
    flexDirection: 'column',
  },
  enrolledTitle: {
    color: colors.black,
    ...styles.h2,
    fontSize: normalize(14),
    width: wp(65),
  },
  enrolledId: {
    color: colors.secondary,
    ...styles.mt2,
    ...styles.h3,
    fontSize: normalize(14),
    width: wp(65),
  },
});
