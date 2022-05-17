import analytics from '@react-native-firebase/analytics';

// eslint-disable-next-line import/prefer-default-export
export const addAnalyticsLogs = (userId, key, event) => {
  analytics().setUserId(`${userId}`).then(() => {
    analytics().logEvent(key, event);
  });
};
