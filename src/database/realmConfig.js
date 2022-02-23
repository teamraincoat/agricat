/* eslint-disable camelcase */
import { ObjectId } from 'bson';
import Realm from 'realm';
import {
  UserSchema,
  User_memberOfSchema,
  EnrollmentSchema,
  Enrollment_imagesSchema,
  CampaignSchema,
} from '../../schemas';
import Constants from '../constants/Constants';
import {removeStorageData, saveStorageData, getStorageData} from '../utils/localStorage';

export const app = new Realm.App({ id: 'enrollmentappvi-dyzez', timeout: 10000 });
const getRealm = async () => {
  const OpenRealmBehaviorConfiguration = {
    type: 'openImmediately',
  };
  const userData = await getStorageData(Constants.STORAGE.USER_DATA);
  console.log('userData--->', userData);
  const campaignData = await getStorageData(Constants.STORAGE.CAMPAIGN_DATA);
  console.log('campaignData--->', campaignData);

  // User memberOf is an array but only allows one campaign partition at a time
  const partitionValue = userData && userData.memberOf && userData.memberOf[0];

  const configuration = {
    schema: [
      EnrollmentSchema,
      Enrollment_imagesSchema,
      UserSchema,
      User_memberOfSchema,
      CampaignSchema,
    ],

    sync: {
      partitionValue,
      user: app.currentUser,
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
    error: (_session, error) => {
      (error) => {
        console.log(error.name, error.message);
      };
    },
  };

  const realm = await Realm.open(configuration);
  const { syncSession } = realm;
  // syncSession.pause();

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
        console.log('same size or greater');
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

export const signIn = async (email, password, data, navigation) => {
  try {
    const credential = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(credential);
    const userData = await newUser.refreshCustomData();

    console.log('MARK I', userData);

    console.log('newUser======ID', newUser.id);

    const mongo = newUser.mongoClient("mongodb-atlas");
    const campaigns = mongo.db("mexico").collection("Campaign");

    // Get Campaign instance from partition value
    //     `campaign=<the object id>`
    const campaignData = await campaigns.findOne(
      { _id: userData && userData.memberOf && ObjectId(userData.memberOf[0].split("=")[1]) },
      { projection: { _id: 0, encryptionKey: 0, startTime: 0, endTime: 0 } },
    );

    saveStorageData(Constants.STORAGE.USER_ID, newUser.id);
    saveStorageData(Constants.STORAGE.USER_DATA, userData);
    saveStorageData(Constants.STORAGE.CAMPAIGN_DATA, campaignData);

    navigation.navigate('Main', {
      screen: "Home",
        params: {
          userData,
          campaignData,
        }
      }
    );
    return newUser;
  } catch (error) {
    console.log('SignIn Err', error);
  }
};

export const signUp = async (email, password) => {
  await app.emailPasswordAuth.registerUser({ email, password });
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
