import PouchDB from 'pouchdb-react-native';
import PouchAuth from 'pouchdb-authentication';
import Config from 'react-native-config';
import {INIT_DB} from '../redux/types';

const localDB = new PouchDB('enrollees');

export const initiateDB = async dispatch => {
  const remoteDB = new PouchDB(Config.API_URL, {
    skip_setup: true,
  });
  PouchDB.plugin(PouchAuth);

  const syncStates = [
    'change',
    'paused',
    'active',
    'denied',
    'complete',
    'error',
  ];

  remoteDB.login(Config.USER_NAME, Config.PASSWORD).then(async function () {
    localDB.replicate.from(remoteDB).on('complete', () => {
      dispatch({type: INIT_DB, payload: true});
    });

    const sync = localDB.sync(remoteDB, {
      live: true,
      retry: true,
    });
    syncStates.forEach(state => {
      sync.on(state, setCurrentState.bind(this, state)).then(() => {});
      function setCurrentState(state) {
        console.log('[Sync:' + state + ']');
      }
    });
  });
};

export default localDB;
