import Realm from 'realm';
import {UserSchema, User_imagesSchema} from '../../schemas';
import Constants from '../constants/Constants';
import {saveStorageData} from '../utils/localStorage';

export const app = new Realm.App({id: 'enrollmenttest-acysm', timeout: 10000});
const getRealm = async userId => {
  const OpenRealmBehaviorConfiguration = {
    type: 'openImmediately',
  };
  const configuration = {
    schema: [UserSchema, User_imagesSchema],
    sync: {
      user: app.currentUser,
      partitionValue: app.currentUser ? app.currentUser.id : userId, //app.currentUser.id,
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
  };

  return Realm.open(configuration);
};

export const signIn = async (email, password, navigation) => {
  const creds = Realm.Credentials.emailPassword(email, password);
  const newUser = await app.logIn(creds);
  console.log('newUser======ID', newUser.id);
  saveStorageData(Constants.STORAGE.USER_ID, newUser.id);
  navigation.navigate('Main');
  return newUser;
};

export const signUp = async (email, password) => {
  await app.emailPasswordAuth.registerUser({email, password});
};
export const forgotPassword = async email => {
  await app.emailPasswordAuth.sendResetPasswordEmail({email});
};

export default getRealm;
