/* eslint-disable camelcase */
import { ObjectId } from 'bson';
import { Alert } from 'react-native';
import Realm from 'realm';
import {
  UserSchema,
  EnrollmentSchema,
  Enrollment_imagesSchema,
  CampaignSchema,
} from '../../schemas';
import Constants from '../constants/Constants';
import {
  removeStorageData,
  saveStorageData,
  getStorageData,
} from '../utils/localStorage';

export const app = new Realm.App({ id: Constants.REALM.APP_ID, timeout: 10000 });
const getRealm = async () => {
  const OpenRealmBehaviorConfiguration = {
    type: 'openImmediately',
  };
  const userData = await getStorageData(Constants.STORAGE.USER_DATA);
  // console.log('userData--->', userData);
  // const campaignData = await getStorageData(Constants.STORAGE.CAMPAIGN_DATA);
  // console.log('campaignData--->', campaignData);

  // User memberOf is an array but only allows one campaign partition at a time
  const partitionValue = userData && userData.memberOf && userData.memberOf[0];

  const configuration = {
    schema: [
      EnrollmentSchema,
      Enrollment_imagesSchema,
      UserSchema,
      CampaignSchema,
    ],

    sync: {
      partitionValue,
      user: app.currentUser,
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
      error(_session, error) {
        if (realm) {
          if (error.name === 'ClientReset') {
            const realmPath = realm.path;
            realm.close();
            console.error(`Error ${error.message}, need to reset ${realmPath}…`);
            // pass your realm app instance, and realm path to initiateClientReset()
            Realm.App.Sync.initiateClientReset(app, realmPath);
            console.log(`Creating backup from ${error.config.path}…`);
            // Move backup file to a known location for a restore
            // fs.renameSync(error.config.path, realmPath + "~");
            // Discard the reference to the realm instance
            realm = null;
          } else {
            console.log(`Received error ${error.message}`);
          }
        }
      },
    },
    error: (_session, error) => {
      if (error) {
        console.error(error.name, error.message);
      }
    },
  };

  const realm = await Realm.open(configuration);
  const { syncSession } = realm;
  // const isPendingEnrollment = await getStorageData(
  //   Constants.STORAGE.ENROLL_USER_DATA,
  // );
  //   if (isPendingEnrollment) {
  //     syncSession.pause();
  //   }
  syncSession.pause();

  syncSession.addProgressNotification(
    'upload',
    'reportIndefinitely',
    (transferred, transferable) => {
      const progressPercentage = (100.0 * transferred) / transferable;
      console.log(
        `Total Uploaded ,(${transferred})Byte / (${transferable})Byte  ${progressPercentage}%`,
      );
      if (progressPercentage === 100) {
        console.log('Transfer completed', progressPercentage);
        // saveStorageData(Constants.STORAGE.USER_DATA, null);
        // saveStorageData(Constants.STORAGE.USER_DATA_SYNCED, 'synced');
      }
      if (transferred < transferable) {
        // console.log('size less + show loader');
        // saveStorageData(Constants.STORAGE.USER_DATA_SYNCED, 'false');
      } else {
        // console.log('same size or greater');
      }
    },
  );

  syncSession.addProgressNotification(
    'download',
    'reportIndefinitely',
    (transferred, transferable) => {
      const progressPercentage = (100.0 * transferred) / transferable;
      console.log(
        `Total Download ,(${transferred})Byte / (${transferable})Byte  ${progressPercentage}%`,
      );
    },
  );

  return realm;
};

export const checkCampaignMatrix = async (campaignData) => {
  const partitionInfo = campaignData && campaignData._partition;
  if (partitionInfo) {
    const campaignId = partitionInfo.replace('campaign=', '');
    try {
      // eslint-disable-next-line no-undef
      const response = await fetch(`https://data.mongodb-api.com/app/${Constants.REALM.APP_ID}/endpoint/campaign/metrics?campaignId=${campaignId}`);
      const res = await response.json();
      if (res.metrics && res.metrics.finishedPercent) {
        return res.metrics.finishedPercent;
      }
    } catch (error) {
      console.log('error', error);
    }
  }
};

export const signIn = async (email, password, navigation, setLoading) => {
  try {
    const credential = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(credential);
    const userData = await newUser.refreshCustomData();
    const mongo = newUser.mongoClient('mongodb-atlas');
    const campaigns = mongo.db(Constants.REALM.DB_NAME).collection('Campaign');
    // console.log('<--------newUserData----->', newUserData);
    if (userData && userData.isFirstLogin) {
      saveStorageData(
        Constants.STORAGE.IS_PENDING_REGISTRATION,
        userData.isFirstLogin,
      );
    }
    // Get Campaign instance from partition value
    //     `campaign=<the object id>`
    const campaignData = await campaigns.findOne(
      {
        _id:
          userData
          && userData.memberOf
          && ObjectId(userData.memberOf[0].split('=')[1]),
      },
      {
        projection: {
          _id: 0,
          encryptionKey: 0,
          startTime: 0,
          endTime: 0,
        },
      },
    );
    const campaignMetrics = await checkCampaignMatrix(campaignData);

    saveStorageData(Constants.STORAGE.USER_ID, newUser.id);
    saveStorageData(Constants.STORAGE.USER_DATA, userData);
    saveStorageData(Constants.STORAGE.CAMPAIGN_DATA, campaignData);

    getRealm().then((result) => {
      const { syncSession } = result;
      syncSession.resume();
      syncSession.addProgressNotification(
        'download',
        'forCurrentlyOutstandingWork',
        (transferred, transferable) => {
          const progressPercentage = (100.0 * transferred) / transferable;
          if (progressPercentage === 100) {
            // console.log('<===userData userData====>>', userData);
            setLoading(false);
            if (userData && userData.isFirstLogin) {
              // console.log('<===navigation navigation====>>', navigation);
              navigation.navigate('Main', {
                screen: 'SignUp',
              });
            } else {
              navigation.navigate('Main', {
                screen: 'Home',
                params: {
                  userData,
                  campaignData,
                  campaignMetrics,
                },
              });
            }
          }
        },
      );
    });
    return newUser;
  } catch (error) {
    setLoading(false);
    if (error && error.code === 50) {
      Alert.alert('Error', 'Invalid email or password', [{ text: 'OK' }], {
        cancelable: false,
      });
    }
  }
};

export const signUp = async (email, password, route, setLoading) => {
  try {
    await app.emailPasswordAuth.registerUser({ email, password });
    route.navigate('SignUp', { userCredential: { email, password } });
  } catch (error) {
    if (error && error.code === 49) {
      await signIn(email, password, route, setLoading);
    }
  }
};

export const signOut = async (navigation) => {
  await app.allUsers[app.currentUser.id].logOut();
  removeStorageData(Constants.STORAGE.USER_ID);
  removeStorageData(Constants.STORAGE.USER_DATA);
  navigation.navigate('Auth');
};
export const forgotPassword = async (email) => {
  await app.emailPasswordAuth.sendResetPasswordEmail({ email });
};

export default getRealm;
