/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import moment from 'moment';
import crashlytics from '@react-native-firebase/crashlytics';
import getRealm from '../database/realmConfig';
import { getStorageData, saveStorageData } from '../utils/localStorage';
import { decrypt, encrypt } from '../utils/crypto';
import Constants from '../constants/Constants';
import { addAnalyticsLogs } from '../utils/firebase';

const UsersContext = React.createContext(null);

const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [applicationStartTime, setApplicationStartTime] = useState(null);
  const [storedUserData, setStoredUserData] = useState(null);
  const [enrollDataById, setEnrollDataById] = useState(null);
  const realmRef = useRef(null);

  useEffect(() => {
    getRealm()
      .then((projectRealm) => {
        realmRef.current = projectRealm;
        const syncUsers = projectRealm.objects('Enrollment');
        // console.log('STATUS: Syncing Enrollments', syncUsers.length);
        const sortedUsers = syncUsers.sorted('applicationTime', true);
        sortedUsers.addListener(() => {
          setUsers([...sortedUsers]);
        });
      })
      .catch((error) => {
        console.error(error);
        crashlytics().recordError(new Error(error.message));
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

  const submitAddUser = async (UserInfo, navigation, isModify, campaignKey, setLoading) => {
    if (UserInfo.firstName) {
      try {
        setLoading(true);
        const userData = await getStorageData(Constants.STORAGE.USER_DATA);
        const newUser = {
          ...UserInfo,
          _partition: userData && userData.memberOf && userData.memberOf[0],
          _userId: userData && userData._id,
          applicationStartTime,
          applicationTime: moment(new Date()).toISOString(),
          status: 'active',
        };
        // getTimeDifference(applicationStartTime, newUser.applicationTime);
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

        cipherEnrollmentData(newUser, campaignKey, navigation, isModify, setLoading);
      } catch (error) {
        setLoading(false);
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
      const value = document[field];
      if (value && typeof value === 'string') {
        try {
          const decryptedField = await decrypt(value.split('|')[1], key, value.split('|')[0]);
          clonedDocument[field] = decryptedField;
        } catch (error) {
          clonedDocument[field] = '';
        }
      } else if (value && field === 'images') {
        const decryptImage = clonedDocument.images.map(async (image) => {
          const filteredImage = value.filter((img) => img.name === image.name);
          if (filteredImage.length > 0) {
            try {
              const decryptedImageUri = await decrypt(filteredImage[0].uri.split('|')[1], key, filteredImage[0].uri.split('|')[0]);
              image.uri = decryptedImageUri;
            } catch (error) {
              image.uri = '';
            }
            return image;
          }
        });
        const decryptedImages = await Promise.all(decryptImage);
        clonedDocument.images = decryptedImages;
      } else {
        clonedDocument[field] = '';
      }
    }, Promise.resolve());

    clonedDocument._id = _id;
    return clonedDocument;
  };

  const decipherEnrollmentData = (enrollment, key) => {
    decryptFields(['firstName', 'lastName', 'secondLastName', 'dob', 'govId', 'images'], enrollment, key)
      .then((decipheredEnrollment) => {
        // console.log('decipheredEnrollment==>', decipheredEnrollment);
        setEnrollDataById(decipheredEnrollment);
      })
      .catch((err) => {
        console.error(err);
        crashlytics().recordError(new Error(err));
      });
  };

  const encryptFields = async (fields, document, key) => {
    const { _id } = document;
    const clonedDocument = JSON.parse(JSON.stringify(document));
    await fields.reduce(async (previousPromise, field) => {
      await previousPromise;
      const value = document[field];
      if (value && typeof value === 'string') {
        try {
          const encryptedField = await encrypt(document[field], key);
          clonedDocument[field] = encryptedField;
        } catch (error) {
          clonedDocument[field] = '';
        }
      }
      if (field === 'images') {
        const imageEncrypt = clonedDocument.images.map(async (image) => {
          const filteredImage = value.filter((img) => img.name === image.name);
          if (filteredImage.length > 0) {
            try {
              const encryptedImageUri = await encrypt(filteredImage[0].uri, key);
              image.uri = encryptedImageUri;
            } catch (error) {
              image.uri = '';
            }
            return image;
          }
        });
        const encryptedImages = await Promise.all(imageEncrypt);
        clonedDocument.images = encryptedImages;
      }
    }, Promise.resolve());
    clonedDocument._id = _id;
    return clonedDocument;
  };

  const cipherEnrollmentData = (enrollment, key, navigation, isModify, setLoading) => {
    encryptFields(['firstName', 'lastName', 'secondLastName', 'dob', 'govId', 'images'], enrollment, key)
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
            addAnalyticsLogs(enrollment._userId, 'enrollmentDetail', { enrollment_status: 'success' });
            const { syncSession } = projectRealm;
            syncSession.pause();
            const userListUpdated = projectRealm.objects('Enrollment');
            const sortedUsers = userListUpdated.sorted('applicationTime', true);
            setUsers(sortedUsers);
            setLoading(false);

            const enrollmentData = {
              id: enrollment._id.toString(),
              folioNumber: enrollment._id.toString(),
              sex: enrollment.gender,
              hectareArea: enrollment.coveredAreaHa.toString(),
              spokenLanguages: enrollment.spokenLanguages.join(', '),
            };

            if (enrollment.surveyEnabled) {
              navigation.navigate('ImpactReport', {
                enrollmentData,
              });
            } else {
              navigation.navigate('Complete', {});
            }
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
            crashlytics().recordError(new Error(error));
          });
      })
      .catch((err) => {
        setLoading(false);
        addAnalyticsLogs(enrollment._userId, 'enrollmentDetail', { enrollment_status: 'failed' });
        console.error(err);
        crashlytics().recordError(new Error(err));
      });
  };

  const setEnrollData = (id, key) => {
    // console.log('setEnrollData--Key==>', key);
    if (users && users.length > 0) {
      // eslint-disable-next-line array-callback-return
      const filteredEnroll = users.filter((item) => {
        // eslint-disable-next-line
        // console.log('item.id==>', item._id);
        // eslint-disable-next-line eqeqeq
        if (item._id == id) {
          decipherEnrollmentData(item, key);
          return item;
        }
        return null;
      });
      return filteredEnroll;
    }
  };

  const userData = {
    submitAddUser,
    users,
    setUsers,
    enrollDataById,
    setEnrollData,
    setApplicationStartTime,
    setEnrollDataById,
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
