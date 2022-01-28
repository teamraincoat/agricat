const OrganizerSchema = {
  name: 'Organizer',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    insurer: 'Insurer',
    name: 'string',
    status: 'string',
  },
  primaryKey: '_id',
};

const UserSchema = {
  name: 'User',
  properties: {
    _id: 'string',
    _partition: 'string',
    email: 'string',
    memberOf: 'User_memberOf[]',
    name: 'string',
  },
  primaryKey: '_id',
};

const User_memberOfSchema = {
  name: 'User_memberOf',
  embedded: true,
  properties: {
    name: 'string?',
    partition: 'string?',
  },
};

const CampaignSchema = {
  name: 'Campaign',
  properties: {
    _id: 'objectId',
    _partition: 'string',
    description: 'string?',
    encryptionKey: 'string',
    endTime: 'string',
    name: 'string',
    organizer: 'Organizer',
    startTime: 'string',
    status: 'string',
  },
  primaryKey: '_id',
};

const EnrollmentSchema = {
    name: 'Enrollment',
    properties: {
    _id: 'objectId',
    _partition: 'string',
    addressLine: 'string?',
    adminArea: 'string',
    adminAreaId: 'string',
    applicationTime: 'date?',
    campaign: 'Campaign',
    coveredAreaHa: 'decimal128?',
    crop: 'string',
    cropId: 'string?',
    cropType: 'string?',
    dob: 'date',
    firstName: 'string',
    gender: 'string',
    geoJson: 'string?',
    images: 'Enrollment_images[]',
    lastName: 'string',
    locality: 'string',
    localityId: 'string',
    mobilePhone: 'string?',
    payoutMethod: 'string?',
    payoutMethodId: 'string?',
    status: 'string?',
    subLocality: 'string',
    subLocalityId: 'string',
    surName: 'string?',
  },
  primaryKey: '_id',
};;

const Enrollment_imagesSchema = {
    name: 'Enrollment_images',
    embedded: true,
    properties: {
      name: 'string?',
      size: 'string?',
      type: 'string?',
      uri: 'string?',
    },
};

const InsurerSchema = {
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

const LocationSchema = {
  name: 'Location',
  embedded: true,
  properties: {
    name: 'string?',
    partition: 'string?',
  },
};

export {
    OrganizerSchema,
    UserSchema,
    User_memberOfSchema,
    CampaignSchema,
    EnrollmentSchema,
    Enrollment_imagesSchema,
    InsurerSchema,
    LocationSchema,
};
