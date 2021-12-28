import React, {useContext, useState, useEffect, useRef} from 'react';

import getRealm, {app} from '../database/realmConfig';
import {ObjectId} from 'bson';
import {getStorageData, saveStorageData} from '../utils/localStorage';
import Constants from '../constants/Constants';
const UsersContext = React.createContext(null);

const UsersProvider = ({children, projectPartition = {}}) => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [storedUserData, setStoredUserData] = useState(null);

  const realmRef = useRef(null);
  useEffect(() => {
    getStorageData(Constants.STORAGE.USER_ID)
      .then(result => {
        if (result) {
          setUserId(result);
          getRealm(result)
          .then(projectRealm => {
            realmRef.current = projectRealm;
            const syncUsers = projectRealm.objects('User');
            let sortedUsers = syncUsers.sorted('firstName');
            setUsers([...sortedUsers]);
            if (storedUserData) {
              saveStorageData(Constants.STORAGE.USER_DATA, [
                ...storedUserData,
                ...sortedUsers,
              ]);
            } else {
              saveStorageData(Constants.STORAGE.USER_DATA, [...sortedUsers]);
            }
            sortedUsers.addListener(() => {
              setUsers([...sortedUsers]);
              if (storedUserData) {
                saveStorageData(Constants.STORAGE.USER_DATA, [
                  ...storedUserData,
                  ...sortedUsers,
                ]);
              } else {
                saveStorageData(Constants.STORAGE.USER_DATA, [...sortedUsers]);
              }
            });
          })
          .catch(error => {
            console.log('error---', error);
          });
        } else {
          console.log('No Result found');
        }
      })
      .catch(e => {
        console.log('error localStorage', e);
      });

    getStorageData(Constants.STORAGE.USER_DATA)
      .then(result => {
        if (result) {
          setStoredUserData(result);
        } else {
          console.log('No Result found');
        }
      })
      .catch(e => {
        console.log('error localStorage', e);
      });

    return () => {
      const projectRealm = realmRef.current;
      if (projectRealm) {
        projectRealm.close();
        realmRef.current = null;
        setUsers([]);
      }
    };
  }, []);

  const submitAddUser = async UserInfo => {
    if (UserInfo.firstName) {
      try {
        const newUser = {
          ...UserInfo,
          _id: new ObjectId(),
          realm_id: userId ? userId : app.currentUser.id,
        };
        saveStorageData(Constants.STORAGE.USER_DATA, [
          ...storedUserData,
          newUser,
        ]);
        setStoredUserData([...storedUserData, newUser]);
        const realm = realmRef.current;
        realm.write(() => {
          realm.create('User', newUser);
        });
        const userListUpdated = realm.objects('User');
        setUsers([...userListUpdated]);
      } catch (error) {
        console.log('error==>', error);
      }
    }
  };
  let userData = {};
  if (users && users.length > 0) {
    userData = {
      submitAddUser,
      users,
    };
  } else {
    userData = {
      submitAddUser,
      users: storedUserData,
    };
  }
  return <UsersContext.Provider value={userData}>{children}</UsersContext.Provider>;
};

const useUsers = () => {
  const user = useContext(UsersContext);
  if (user == null) {
    throw new Error('useUsers() called outside of a UsersProvider?');
  }
  return user;
};

export {UsersProvider, useUsers};
