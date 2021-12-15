import React, {useContext, useState, useEffect, useRef} from 'react';
import Realm from 'realm';
import {User} from '../../schemas';

const UsersContext = React.createContext(null);

const UsersProvider = ({children, projectPartition = {}}) => {
  const [users, setUsers] = useState([]);

  const realmRef = useRef(null);

  useEffect(() => {
    const config = {
      schema: [User],
      path: 'myrealm',
    };
    // open a realm for this particular project
    Realm.open(config).then(projectRealm => {
      realmRef.current = projectRealm;

      const syncUsers = projectRealm.objects('User');
      let sortedUsers = syncUsers.sorted('firstName');
      setUsers([...sortedUsers]);
      sortedUsers.addListener(() => {
        setUsers([...sortedUsers]);
      });
    });

    return () => {
      // cleanup function
      const projectRealm = realmRef.current;
      if (projectRealm) {
        projectRealm.close();
        realmRef.current = null;
        setUsers([]);
      }
    };
  }, []);

  const createUser = UserInfo => {
    const projectRealm = realmRef.current;
    projectRealm.write(() => {
      projectRealm.create('User', {
        firstName: UserInfo.firstName,
        lastName: UserInfo.lastName,
        surName: UserInfo.surName,
        dateOfBirth: UserInfo.dateOfBirth,
        enrollId: UserInfo.enrollId,
        gender: UserInfo.gender,
        contactNo: UserInfo.contactNo,
        locality: UserInfo.locality,
        municipality: UserInfo.municipality,
        sublocality: UserInfo.sublocality,
        dateOfApplication: UserInfo.dateOfApplication,
        policyPublicId: UserInfo.policyPublicId,
        policyActiveId: UserInfo.policyActiveId,
        geoJson: UserInfo.geoJson,
        coveredArea: UserInfo.coveredArea,
        crop: UserInfo.crop,
        cropType: UserInfo.cropType,
        cropCycle: UserInfo.cropCycle,
        _id: UserInfo._id,
      });
    });
  };

  return (
    <UsersContext.Provider
      value={{
        createUser,
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
