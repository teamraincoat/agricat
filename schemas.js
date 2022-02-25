export const CampaignSchema = {
  name: 'Campaign',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    description: 'string?',
    encryptionKey: 'string?',
    endTime: 'date',
    name: 'string',
    // organizer: 'Organizer',
    startTime: 'date',
    status: 'string',
  },
  primaryKey: '_id',
};

export const EnrollmentSchema = {
  name: 'Enrollment',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    addressLine: 'string?',
    adminArea: 'string',
    adminAreaId: 'string',
    applicationTime: 'date?',
    // campaign: 'Campaign',
    coveredAreaHa: 'decimal128?',
    crop: 'string',
    cropId: 'string?',
    cropType: 'string?',
    dob: 'date',
    firstName: 'string',
    gender: 'string',
    geoJson: 'string?',
    govId: 'string?',
    images: 'Enrollment_images[]',
    lastName: 'string',
    locality: 'string',
    localityId: 'string',
    marketingChannel: 'string?',
    mobilePhone: 'string?',
    mobilePhoneOwner: 'string?',
    notes: 'string?',
    payoutMethod: 'string?',
    payoutMethodId: 'string?',
    spokenLanguage: 'string?',
    status: 'string?',
    subLocality: 'string',
    subLocalityId: 'string',
    surName: 'string?',
  },
  primaryKey: '_id',
};

export const Enrollment_imagesSchema = {
  name: 'Enrollment_images',
  embedded: true,
  properties: {
    name: 'string?',
    size: 'string?',
    type: 'string?',
    uri: 'string?',
  },
};

export const InsurerSchema = {
  name: 'Insurer',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    adminOf: 'Location[]',
    name: 'string',
    status: 'string',
  },
  primaryKey: '_id',
};

export const LocationSchema = {
  name: 'Location',
  embedded: true,
  properties: {
    name: 'string?',
    partition: 'string?',
  },
};

export const OrganizerSchema = {
  name: 'Organizer',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    // insurer: 'Insurer',
    name: 'string',
    status: 'string',
  },
  primaryKey: '_id',
};

export const UserSchema = {
  name: 'User',
  properties: {
    _id: 'string',
    _partition: 'string',
    email: 'string',
    isFirstLogin: 'bool?',
    memberOf: 'string[]',
    mobilePhone: 'string?',
    name: 'string',
    spokenLanguage: 'string?',
  },
  primaryKey: '_id',
};
