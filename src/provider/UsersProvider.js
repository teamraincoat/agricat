/* eslint-disable no-underscore-dangle */
import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import {decode, encode} from 'base-64';
import getRealm from '../database/realmConfig';
import { getStorageData, saveStorageData } from '../utils/localStorage';
import { decrypt, encrypt } from '../utils/crypto';
import Constants from '../constants/Constants';
import { Buffer } from 'buffer';
const UsersContext = React.createContext(null);
const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [storedUserData, setStoredUserData] = useState(null);
  const [enrollDataById, setEnrollDataById] = useState(null);
  const realmRef = useRef(null);
  console.log('enrollDataById==>', enrollDataById);

  useEffect(() => {
    getRealm()
      .then((projectRealm) => {
        realmRef.current = projectRealm;
        const syncUsers = projectRealm.objects('Enrollment');
        // const sortedUsers = syncUsers.sorted('applicationTime');
        const sortedUsers = syncUsers.sorted('applicationTime').filter((enrollee) => enrollee.status === 'Active');

        setUsers([...sortedUsers].reverse());
      })
      // .then((enrolees) => {
      //   setUsers([...enrolees]);
      // })
      .catch((error) => {
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

  const submitAddUser = async (UserInfo, navigation, isModify, campaignKey) => {
    if (UserInfo.firstName) {
      try {
        const userData = await getStorageData(Constants.STORAGE.USER_DATA);
        const newUser = {
          ...UserInfo,
          _partition: userData && userData.memberOf && userData.memberOf[0],//`campaign=${ID}`, // userId ? userId : app.currentUser.id,
          status: 'Active',
        };
        if (storedUserData && storedUserData.length > 0) {
          saveStorageData(Constants.STORAGE.ENROLL_USER_DATA, [
            ...storedUserData,
            newUser._id,
          ]);
          setStoredUserData([...storedUserData, newUser._id]);
        } else {
          saveStorageData(Constants.STORAGE.ENROLL_USER_DATA, [newUser._id]);
          setStoredUserData([newUser._id]);
        }

        cipherEnrollmentData(newUser, campaignKey, navigation, isModify);
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
    const { _id } = document;
    const clonedDocument = JSON.parse(JSON.stringify(document));

    // This is a way to ensure a series of Promises are resolved in serial order
    await fields.reduce(async (previousPromise, field) => {
      await previousPromise;
      const decryptedField = await decrypt(document[field].split('|')[1], key, document[field].split('|')[0]);
      clonedDocument[field] = decryptedField;
    }, Promise.resolve());

    console.log('clonedDocument', clonedDocument, key);
    clonedDocument._id = _id;
    return clonedDocument;
  };

  const decipherEnrollmentData = (enrollment, key) => {
    decryptFields(['firstName', 'lastName', 'surName'], enrollment, key)
      .then((decipheredEnrollment) => {
        setEnrollDataById(decipheredEnrollment);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const encryptFields = async (fields, document, key) => {
    const { _id } = document;
    const clonedDocument = JSON.parse(JSON.stringify(document));
    await fields.reduce(async (previousPromise, field) => {
      await previousPromise;
      const encryptedField = await encrypt(document[field], key);
      clonedDocument[field] = encryptedField;
    }, Promise.resolve());
    clonedDocument._id = _id;
    return clonedDocument;
  };

  const cipherEnrollmentData = (enrollment, key, navigation, isModify) => {
    encryptFields(['firstName', 'lastName', 'surName'], enrollment, key)
      .then((cipheredEnrollment) => {
        getRealm()
          .then((projectRealm) => {
            projectRealm.write(() => {
              if (isModify) {
                projectRealm.create('Enrollment', cipheredEnrollment, 'modified');
              } else {
                projectRealm.create('Enrollment', cipheredEnrollment);
              }
            });
            const userListUpdated = projectRealm.objects('Enrollment');
            const sortedUsers = userListUpdated.sorted('firstName');
            setUsers([...sortedUsers]);
            return getStorageData(Constants.STORAGE.CAMPAIGN_DATA);
          })
          .then((campaignData) => {
            navigation.navigate('Home', { campaignData });
          })
          .catch((error) => {
            console.log('error--->>', error);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const setEnrollData = (id, key) => {
    if (users && users.length > 0) {
      // eslint-disable-next-line array-callback-return
      users.filter((item) => {
        // eslint-disable-next-line eqeqeq
        if (item._id == id) {
          decipherEnrollmentData(item, key);
        }
      });
    }
  };

  const userData = {
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

export { UsersProvider, useUsers };
