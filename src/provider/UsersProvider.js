import React, {useContext, useState, useEffect, useRef} from 'react';

import getRealm, {app} from '../database/realmConfig';
import {ObjectId} from 'bson';
import {getStorageData, saveStorageData} from '../utils/localStorage';
import Constants from '../constants/Constants';
import uuid from 'react-native-uuid';
import { EnrollmentSchema, Enrollment_imagesSchema } from '../../schemas';
const UsersContext = React.createContext(null);

const UsersProvider = ({children, projectPartition = {}}) => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState(null);
  const [storedUserData, setStoredUserData] = useState(null);
  const [userInfo, setUserInfo] = useState([]);
  const realmRef = useRef(null);
  const realmUserInfoRef = useRef(null);
  useEffect(() => {
    getStorageData(Constants.STORAGE.USER_ID)
      .then(result => {
        if (result) {
          setUserId(result);
        }
        getRealm(result)
          .then(projectRealm => {
            realmRef.current = projectRealm;
            const syncUsers = projectRealm.objects('Enrollment');
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
        //   getRealm(result)
        //   .then(projectRealm => {
        //     realmUserInfoRef.current = projectRealm;
        //     const syncUsers = projectRealm.objects('User');
        //     let sortedUsers = syncUsers.sorted('firstName');
        //     setUserInfo([...sortedUsers]);
        //     sortedUsers.addListener(() => {
        //       setUserInfo([...sortedUsers]);
        //     });
        //   })
        //   .catch(error => {
        //     console.log('error--->', error);
        //   });

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
      const projectRealmUserInfo = realmUserInfoRef.current;
      if (projectRealm) {
        projectRealm.close();
        realmRef.current = null;
        setUsers([]);
      }
        if (projectRealmUserInfo) {
            projectRealmUserInfo.close();
            realmUserInfoRef.current = null;
            setUserInfo([]);
            }
    };
  }, []);

  const submitAddUser = async UserInfo => {
    if (UserInfo.firstName) {
      try {
        const newUser = {
          ...UserInfo,
          _id: new ObjectId(),
          _partition: userId ? userId : app.currentUser.id,
          status: 'Active',
          campaign: new ObjectId(),
        };
        console.log('=====newUser Info=====>', newUser);
        if (storedUserData && storedUserData.length > 0) {
          saveStorageData(Constants.STORAGE.USER_DATA, [
            ...storedUserData,
            newUser,
          ]);
          setStoredUserData([...storedUserData, newUser]);
        } else {
          saveStorageData(Constants.STORAGE.USER_DATA, [newUser]);
          setStoredUserData([newUser]);
        }
        const realm = realmRef.current;
        realm.write(() => {
          realm.create('Enrollment', newUser);
        });
        const userListUpdated = await realm.objects('Enrollment');
        setUsers([...userListUpdated]);
      } catch (error) {
        console.log('submitAddUser error==>', error);
      }
    }
  };
  const addUserInfo = async UserInfo => {
    if (UserInfo.firstName) {
        try {
            const newUser = {
            ...UserInfo,
            _id: new ObjectId(),
            _partition: userId ? userId : app.currentUser.id,
            name: UserInfo.firstName + ' ' + UserInfo.lastName,
            password:'undefined',
            confirmPassword:'undefined',
            gender: 'undefined',
            firstName:'undefined',
            languagesList: 'undefined',
            lastName: 'undefined',
            phoneNumber: 'undefined',
            memberOf:[{name:'test',partition:'testPartition'}]
            };
            console.log('=====newUser Info==____===>', newUser);
            const realm = realmUserInfoRef.current;
            realm.write(() => {
            realm.create('User', newUser);
            });
            const userList = await realm.objects('User');
            console.log('userList==>', userList);
            setUserInfo([...userList]);

        } catch (error) {
            console.log('error=-=>', error);
        }
    }
  };

  let userData = {};
  if (users && users.length > 0) {
    userData = {
      submitAddUser,
      addUserInfo,
      users,
    };
  } else {
    userData = {
      submitAddUser,
      addUserInfo,
      users: storedUserData,
    };
  }
  return (
    <UsersContext.Provider value={userData}>{children}</UsersContext.Provider>
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
