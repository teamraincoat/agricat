import Realm from 'realm';
import {UserSchema} from '../../schemas';

export const app = new Realm.App({id: 'enrollmenttest-acysm', timeout: 10000});
const getRealm = async () => {
  const configuration = {
    schema: [UserSchema],
    path: 'myrealm',
    sync: {
      user: app.currentUser,
      partitionValue: app.currentUser.id,  //app.currentUser.id, // should be userId(Unique) so it can manage particular user related documents in DB by userId
    },
  };

  return Realm.open(configuration);
};
export default getRealm;
