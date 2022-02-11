import Realm from 'realm';
import {
    UserSchema,
    User_memberOfSchema,
    EnrollmentSchema,
    Enrollment_imagesSchema} from '../../schemas';
import Constants from '../constants/Constants';
import {removeStorageData, saveStorageData} from '../utils/localStorage';

export const app = new Realm.App({id: 'enrollmentappvi-dyzez', timeout: 10000});
const getRealm = async () => {
  const OpenRealmBehaviorConfiguration = {
    type: 'openImmediately',
  };
  const ID = "61f75159e8f1ed359e2bc224";
  // console.log('currentUser id in config==>',app.currentUser && app.currentUser.id);
  const configuration = {
    schema: [EnrollmentSchema,Enrollment_imagesSchema, UserSchema,User_memberOfSchema],
    sync: {
      user: app.currentUser,
      partitionValue: `campaign=${ID}`, //app.currentUser.id,
      newRealmFileBehavior: OpenRealmBehaviorConfiguration,
      existingRealmFileBehavior: OpenRealmBehaviorConfiguration,
    },
    error: (_session, error) => {
        (error) => {
          console.log(error.name, error.message);
        };
    },
  };

const realmConfiguration = await Realm.open(configuration);
const syncSession = realmConfiguration.syncSession;
// syncSession.pause();

syncSession.addProgressNotification(
  "upload",
  "reportIndefinitely",
  (transferred, transferable) => {

    let progressPercentage = 100.0 * transferred / transferable;
    console.log(`Total Uploaded ,(${transferred})Byte / \(${transferable})Byte  ${progressPercentage}%`)
    if(progressPercentage === 100){
        console.log('Transfer completed' , progressPercentage);
        saveStorageData(Constants.STORAGE.USER_DATA, null);
       // saveStorageData(Constants.STORAGE.USER_DATA_SYNCED, 'synced');
    }
    if(transferred < transferable ){
      //console.log('size less + show loader');
      //saveStorageData(Constants.STORAGE.USER_DATA_SYNCED, 'false');
    }
    else{
      console.log('same size or greater')
    }
  }
);

syncSession.addProgressNotification(
    'download',
    'reportIndefinitely',
    (transferred, transferable) => {
        let progressPercentage = 100.0 * transferred / transferable;
        console.log(`Total Download ,(${transferred})Byte / \(${transferable})Byte  ${progressPercentage}%`)
      }
  )

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
