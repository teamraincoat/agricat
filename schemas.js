const User = {
  path: 'UserDatabase.realm',
  name: 'User',
  properties: {
    _id: 'string',
    firstName: 'string',
    lastName: 'string?',
    surName: 'string',
    dateOfBirth: 'date',
    enrollId: 'string',
    gender: 'string',
    contactNo: 'string',
    locality: 'string',
    municipality: 'string',
    sublocality: 'string',
    dateOfApplication: 'date?',
    policyPublicId: 'string',
    policyActiveId: 'string',
    geoJson: 'string',
    coveredArea: 'string',
    crop: 'string',
    cropType: 'string',
    cropCycle: 'string',
  },
  primaryKey: 'firstName',
};

export {User};
