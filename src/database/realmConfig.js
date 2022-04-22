/* eslint-disable camelcase */
import { ObjectId } from 'bson';
import { Alert } from 'react-native';
import Realm from 'realm';
import NetInfo from '@react-native-community/netinfo';

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

  if (!userData || !userData.memberOf || !userData._partition) {
    return false;
  }
  // User memberOf is an array but only allows one campaign partition at a time
  const partitionValue = userData
  && userData.memberOf
  && userData.memberOf.length > 0
    ? userData.memberOf[0] : userData._partition;

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

  syncSession.pause();

  return realm;
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
    const campaignData = userData
    && userData.memberOf
    && userData.memberOf.length > 0 && await campaigns.findOne(
      {
        _id:
          userData
          && userData.memberOf
          && ObjectId(userData.memberOf[0]?.split('=')[1]),
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

    await saveStorageData(Constants.STORAGE.USER_ID, newUser.id);
    await saveStorageData(Constants.STORAGE.USER_DATA, userData);
    await saveStorageData(Constants.STORAGE.CAMPAIGN_DATA, campaignData);

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
                },
              });
            }
          }
        },
      );
    }).catch((error) => {
      console.error('error', error);
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

export const signOut = async (navigation) => {
  const netState = await NetInfo.fetch();
  if (
    netState.isConnected && netState.isInternetReachable
  ) {
    if (app && app.currentUser && app.currentUser.id) {
      await app.allUsers[app.currentUser.id].logOut();
    }
    removeStorageData(Constants.STORAGE.USER_ID);
    removeStorageData(Constants.STORAGE.USER_DATA);
    navigation.navigate('Auth');
  } else {
    Alert.alert('NO HAY CONNECIÓN', 'Debe tener conección de internet para cerrar la sesión.');
  }
};

const doExitCampaign = async (navigation) => {
  // Need to empty memberOf array
  // Then proceed with logout
  await app.currentUser.functions.exitCampaign({ query: { userId: app.currentUser.id } });
  await app.allUsers[app.currentUser.id].logOut();
  removeStorageData(Constants.STORAGE.USER_ID);
  removeStorageData(Constants.STORAGE.USER_DATA);
  navigation.navigate('Auth');
};

export const exitCampaign = async (navigation) => {
  Alert.alert(
    'AVISO IMPORTANTE',
    'Salir de la campaña es una acción irreversible ¿Está seguro/a que quiere salir?',
    [
      {
        text: 'Cancelar',
      },
      {
        text: 'Salir',
        onPress: async () => {
          const netState = await NetInfo.fetch();
          if (netState.isConnected && netState.isInternetReachable) {
            doExitCampaign(navigation);
          } else {
            Alert.alert('NO HAY CONNECIÓN', 'Debe tener conección de internet para salir.');
          }
        },
      },
    ],
    { cancelable: false },
  );
};

export const forgotPassword = async (email) => {
  await app.emailPasswordAuth.sendResetPasswordEmail({ email });
};

export default getRealm;
