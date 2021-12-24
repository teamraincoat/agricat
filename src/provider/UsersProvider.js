import React, {useContext, useState, useEffect, useRef} from 'react';

import getRealm, { app } from '../database/realmConfig';
import {ObjectId} from 'bson';
import { getStorageData } from '../utils/localStorage';
import Constants from '../constants/Constants';
const UsersContext = React.createContext(null);

 const UsersProvider = ({children, projectPartition = {}}) => {
 const [users, setUsers] = useState([]);
 const [userId, setUserId] = useState(null);

  useEffect(() => {
        getStorageData(Constants.STORAGE.USER_ID)
        .then(result => {
          if (result) {
              setUserId(result);
          } else {
            console.log('No Result found')
          }
        })
        .catch((e) => {
          console.log('error localStorage',e)
        });

        return fetchUsersListCall();
  }, []);


  const fetchUsersListCall = () => {
    getRealm()
      .then(realm => {
        const usersList = realm.objects('User');
        setUsers(usersList);
        usersList.addListener(() => {
          setUsers([...usersList]);
        });
        return () => {
          const usersList = realm.objects('User');
          usersList.removeAllListeners();
          realm.close();
        };
      })
      .catch(error => {
        console.log(error, 'ERROR');
      });
  };


  const submitAddUser = async UserInfo => {
    if (UserInfo.firstName) {
      try {
          const newUser = {
              ...UserInfo,
            _id: new ObjectId(),
            realm_id: userId ? userId : app.currentUser.id// app.currentUser.id,
          };
                const realm = await getRealm();
                if (UserInfo.firstName) {
                  realm.write(() => {
                    realm.create('User', newUser);
                  });
                  const userListUpdated = realm.objects('User');
                  setUsers([...userListUpdated]);
                }

      } catch (error) {
        console.log('error==>', error);
      }
    }
  };



  return (
    <UsersContext.Provider
      value={{
        submitAddUser,
        users,
      }}>
      {children}
    </UsersContext.Provider>
  );
};

const useUsers = () => {
  const user = useContext(UsersContext);
  if (user == null) {
    throw new Error('useUsers() called outside of a UsersProvider?');
  }
  return user;
};

export {UsersProvider, useUsers};
