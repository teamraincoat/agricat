import React, {useContext, useState, useEffect, useRef} from 'react';
import {Buffer} from 'buffer';

import getRealm, {app} from '../database/realmConfig';
import {ObjectId} from 'bson';
import {saveStorageData} from '../utils/localStorage';
import {decrypt} from '../utils/crypto';
import Constants from '../constants/Constants';

const UsersContext = React.createContext(null);

const UsersProvider = ({children, projectPartition = {}}) => {
  const [users, setUsers] = useState([]);
  const [storedUserData, setStoredUserData] = useState(null);
  const [enrollDataById, setEnrollDataById] = useState(null);
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

  const submitAddUser = async (UserInfo, navigation, isModify) => {
    if (UserInfo.firstName) {
      try {
        const ID = '61f75159e8f1ed359e2bc224';
        const newUser = {
          ...UserInfo,
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
              if (isModify) {
                projectRealm.create('Enrollment', newUser, 'modified');
              } else {
                projectRealm.create('Enrollment', newUser);
              }
            });
            const userListUpdated = projectRealm.objects('Enrollment');
            let sortedUsers = userListUpdated.sorted('firstName');
            saveStorageData(Constants.STORAGE.USER_DATA_SYNCED, 'false');
            setUsers([...sortedUsers]);
            navigation.navigate('Home');
            setEnrollData(null);
          })
          .catch(error => {
            console.log('error--->>', error);
          });
      } catch (error) {
        console.log('submitAddUser error==>', error);
      }
    }
  };

  /**
   * Decrypt a series of fields in a document
   * @param {String[]} fields The fields we want to decrypt from the document
   * @param {*} document The document with encrypted fields
   * @param {String} key The encryption key
   * @returns The document with all decrypted fields
   */
  const decryptFields = async (fields, document, key) => {
    const clonedDocument = JSON.parse(JSON.stringify(document));

    // This is a way to ensure a series of Promises are resolved in serial order
    await fields.reduce(async (previousPromise, field) => {
      await previousPromise;
      const decryptedField =
        await decrypt(document[field].split('|')[1], key, document[field].split('|')[0]);
      clonedDocument[field] = decryptedField;
    }, Promise.resolve());

    return clonedDocument;
  };

  const decipherEnrollmentData = (enrollment, key) => {
    decryptFields(['firstName', 'lastName', 'surName'], enrollment, key)
      .then(decipheredEnrollment => {
        setEnrollDataById(decipheredEnrollment);
      })
      .catch(err => {
        console.error(err);
      });
  };

  const setEnrollData = (id, key) => {
    if (users && users.length > 0) {
      users.filter(item => {
        if (item._id == id) {
          decipherEnrollmentData(item, key);
        }
      });
    }
  };

  let userData = {
    submitAddUser,
    users,
    enrollDataById,
    setEnrollData,
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
