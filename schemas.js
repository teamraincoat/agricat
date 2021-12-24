 const UserSchema = {
    name: 'User',
    properties: {
      _id: 'objectId',
      TBD: 'string?',
      address1: 'string',
      applicationTime: 'date?',
      coveredArea: 'string?',
      crop: 'string',
      cropCycle: 'string?',
      cropType: 'string?',
      dob: 'date',
      firstName: 'string',
      gender: 'string',
      geoJson: 'string?',
      lastName: 'string',
      locality: 'string?',
      mobilePhone: 'string',
      municipality: 'string',
      realm_id: 'string?',
      surName: 'string?',
    },
    primaryKey: '_id',
  };

export {UserSchema};
