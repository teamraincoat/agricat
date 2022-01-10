import Realm from 'realm';
import {UserSchema, User_imagesSchema} from '../../schemas';

export const app = new Realm.App({id: 'enrollmenttest-acysm', timeout: 10000});
const getRealm = async (userId) => {
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
export default getRealm;
