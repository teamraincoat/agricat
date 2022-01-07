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
      images: 'User_images[]',
    },
    primaryKey: '_id',
  };

 const User_imagesSchema = {
    name: 'User_images',
    embedded: true,
    properties: {
      name: 'string?',
      size: 'string?',
      type: 'string?',
      uri: 'string?',
    },
  };

export {UserSchema , User_imagesSchema};
