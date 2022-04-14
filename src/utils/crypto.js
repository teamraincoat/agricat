/**
 * Module to cipher and decipher sensitive information using the synced Enrollment
 * records to the device along with the Campaign cipher key in the `encryptionKey`.
 * Note:
 *    Values are encrypted from MongoDB Realm function
 *
 *    The value is provided in base64 encoded with two parts, separated by a "|". To
 *    decipher the values split the string by the pipe character, the first part will
 *    be the initialization vector and the second part is the encrypted value. After
 *    decphering the value we can show it in the input fields. Once we finish an Enrollment
 *    we have to encrypt the values back, using the Campaign `encryptionKey`.
 */

import { Buffer } from 'buffer';

import { randomBytes } from 'react-native-randombytes';

import { createDecipheriv, createCipheriv, createHash } from '../../lib/crypto';

const ALGORITHM = 'aes-256-cbc';

/**
 * Decrypt sensitive field using Campaign.encryptionKey
 * @param {String} encryptedMessage The base64 encoded encrypted message
 * @param {String} cipherKey The 32 char Campaign cipher key
 * @param {String} iv The base64 encoded initialization vector
 * @returns The plain text message
 *
 * @example
 * const decrypted =
 * await decrypt('<The Encrypted Message>',
 '<The Campaign Encryption Key>', '<The Initialization Vector>');
 *
 */

export const decrypt = async (encryptedMessage, cipherKey, iv) => {
  const decipher = createDecipheriv(ALGORITHM, cipherKey, Buffer.from(iv, 'base64'));
  decipher.setAutoPadding(false);

  let decrypted = decipher.update(Buffer.from(encryptedMessage, 'base64'), 'base64');
  decrypted += decipher.final();
  const plainMessage = decrypted.toString('utf8');

  // console.log('utils::crypto::decrypt', plainMessage);
  return plainMessage;
};

/**
 * Encrypt sensitive field using Campaign.encryptionKey
 * @param {String} message The plain text sensitive value
 * @param {String} cipherKey The aes Campaign cipher key
 * @returns The encrypted base64 value with prepended base64 encoded iv separated by `|`
 *
 * @example
 * const encrypted = await encrypt('some clear text data', '<The Campaign Encryption Key>');
 *
 */
export const encrypt = async (message, cipherKey) => {
  const iv = await (new Promise((resolve, reject) => {
    randomBytes(16, (err, bytes) => {
      // bytes is a Buffer object
      if (err) return reject(err);
      resolve(bytes);
    });
  }));
  const cipher = createCipheriv(ALGORITHM, cipherKey, iv);
  const encrypted = cipher.update(message, 'utf8', 'base64') + cipher.final('base64');

  const result = `${Buffer.from(iv).toString('base64')}|${encrypted}`;

  // console.log('utils::crypto::encrypted', result);
  return result;
};
