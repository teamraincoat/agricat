import Realm from 'realm';
import {UserSchema, User_imagesSchema} from '../../schemas';

export const app = new Realm.App({id: 'enrollmenttest-acysm', timeout: 10000});
const getRealm = async (userId) => {
  const configuration = {
    schema: [UserSchema, User_imagesSchema],
    sync: {
      user: app.currentUser,
      partitionValue:  app.currentUser ? app.currentUser.id : userId,  //app.currentUser.id, // should be userId(Unique) so it can manage particular user related documents in DB by userId
    },
  };

  return Realm.open(configuration);
};
export default getRealm;
