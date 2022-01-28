import Realm from 'realm';
import {
    UserSchema,
    User_memberOfSchema,
    EnrollmentSchema,
    Enrollment_imagesSchema} from '../../schemas';
import Constants from '../constants/Constants';
import {removeStorageData, saveStorageData} from '../utils/localStorage';

export const app = new Realm.App({id: 'enrollmentmarkv-avthw', timeout: 10000});
const getRealm = async userId => {
  const OpenRealmBehaviorConfiguration = {
    type: 'openImmediately',
  };
  const configuration = {
    schema: [EnrollmentSchema,Enrollment_imagesSchema, UserSchema,User_memberOfSchema],
    sync: {
      user: app.currentUser,
      partitionValue: app.currentUser ? app.currentUser.id : userId, //app.currentUser.id,
       //newRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
    error: (_session, error) => {
        (error) => {
          console.log(error.name, error.message);
        };
    },
  };

const realmConfiguration = await Realm.open(configuration);
realmConfiguration.syncSession.addProgressNotification(
  "upload",
  "reportIndefinitely",
  (transferred, transferable) => {
    console.log(`${transferred} bytes has been transferred`);
    console.log(
      `There are ${transferable} total transferable bytes, including the ones that have already been transferred`
    );
    if(transferred < transferable ){
      console.log('size less + show loader');
    }
    else{
      console.log('same size or greater')
    }
  }
);

  return realmConfiguration;
};
export const signIn = async (email, password,data, navigation) => {
  try {
  const credential = Realm.Credentials.emailPassword(email, password);
  const newUser = await app.logIn(credential);
  console.log('newUser======ID', newUser.id);
  saveStorageData(Constants.STORAGE.USER_ID, newUser.id);
  navigation.navigate('Main',{
      screen:"Home",
        params:{
            userInfo:data
        }
  } );
  return newUser;
  } catch (error) {
    console.log('SignIn Err', error);
  }
};

export const signUp = async (email, password) => {
  await app.emailPasswordAuth.registerUser({email, password});
};

export const signOut = async (navigation) => {
  await app.allUsers[app.currentUser.id].logOut();
  removeStorageData(Constants.STORAGE.USER_ID);
  removeStorageData(Constants.STORAGE.USER_DATA);
  navigation.navigate('Auth');
};
export const forgotPassword = async email => {
  await app.emailPasswordAuth.sendResetPasswordEmail({email});
};

export default getRealm;
