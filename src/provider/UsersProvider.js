import React, {useContext, useState, useEffect, useRef} from 'react';

import getRealm, {app} from '../database/realmConfig';
import {ObjectId} from 'bson';
import {saveStorageData} from '../utils/localStorage';
import Constants from '../constants/Constants';

const UsersContext = React.createContext(null);

const UsersProvider = ({children, projectPartition = {}}) => {
  const [users, setUsers] = useState([]);
  const [storedUserData, setStoredUserData] = useState(null);
  const realmRef = useRef(null);

  useEffect(() => {
    getRealm()
      .then(projectRealm => {
        realmRef.current = projectRealm;
        const syncUsers = projectRealm.objects('Enrollment');
        let sortedUsers = syncUsers.sorted('firstName');
        setUsers([...sortedUsers]);
        sortedUsers.addListener(() => {
          setUsers([...sortedUsers]);
        });
      })
      .catch(error => {
        console.log('error--->', error);
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

  const submitAddUser = async (UserInfo, navigation) => {
    if (UserInfo.firstName) {
      try {
          const ID = "61f75159e8f1ed359e2bc224";
        const newUser = {
          ...UserInfo,
          _id: new ObjectId(),
          _partition: `campaign=${ID}`, //userId ? userId : app.currentUser.id,
          status: 'Active',
        };
        if (storedUserData && storedUserData.length > 0) {
          saveStorageData(Constants.STORAGE.USER_DATA, [
            ...storedUserData,
            newUser._id,
          ]);
          setStoredUserData([...storedUserData, newUser._id]);
        } else {
          saveStorageData(Constants.STORAGE.USER_DATA, [newUser._id]);
          setStoredUserData([newUser._id]);
        }
        getRealm()
          .then(projectRealm => {
            projectRealm.write(() => {
              projectRealm.create('Enrollment', newUser);
            });
            const userListUpdated = projectRealm.objects('Enrollment');
            let sortedUsers = userListUpdated.sorted('firstName');
            setUsers([...sortedUsers]);
            navigation.navigate('Home');
          })
          .catch(error => {
            console.log('error--->>', error);
          });
      } catch (error) {
        console.log('submitAddUser error==>', error);
      }
    }
  };

  let userData = {
    submitAddUser,
    users,
  };

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
